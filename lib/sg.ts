module sg{
  window["sg"] = sg;
}

module sg.dom{
  var expAllowCreateTag = /\<([a-z][a-z0-9-]+?)\>/i;
  export function $(selector:string, attr:Object):Element | NodeListOf<Element> {
    if(!selector){
      console.error("selector is", selector);
      return null;
    }

    var m = selector.match(expAllowCreateTag);
    if(m){
      var tag = document.createElement(m[1]);
      if( typeof attr === "object" ){
        for(var o in attr) {
          if(o == "text"){
            tag.innerHTML = attr[o];
          }else{
            if( typeof attr[o] === "undefined" || attr[0] === null ){
              tag.removeAttribute(o);
            }else{
              tag.setAttribute(o, attr[o]);
            }
          }
        }
      }
      return tag;
    }else{
      if( selector.charAt(0) == "#" ) return document.querySelector(selector);
      return document.querySelectorAll(selector);
    }
  }

  interface JSObject {
    tag: HTMLScriptElement;
    path: string;
    state: string;
    callbacks: (()=>void)[];
    init();
    addCallback(f:()=>void);
    runCallbacks();
  }

  function getJsObj(path: string): JSObject{
    window["scriptList"] = window["scriptList"] || {};
    return window["scriptList"][path] || (window["scriptList"][path] = {
      tag: document.createElement("script"),
      path: path,
      state: "init",
      callbacks: [],
      init: function(){
        console.info("INIT", this.path);
        var self = this;
        this.tag.onload = function(){
          self.state = "complete";
          self.runCallbacks();
        };
        this.state = "loading";
        this.tag.src = this.path;
        document.head.appendChild(this.tag);
      },
      addCallback: function(f){
        this.callbacks.push(f);
      },
      runCallbacks: function(){
        this.callbacks.map(function(v,i,arr){
          if(v) v.call();
        });
      }
    });
  }

  export function addJs(filename:string|string[], callback:()=>void){
    var o:JSObject, self = this;
    if( typeof filename === "string" ){
      o = getJsObj(filename);
      o.addCallback(callback);
    }else if( filename && filename.length > 0 ){
      o = getJsObj(filename.shift());
      if( filename.length == 0 ){
        o.addCallback(callback);
      }else{
        o.addCallback(function(){
          self.addJs(filename, callback);
        });
      }
    }
    if(o){
      switch( o.state ){
        case "init": o.init(); break;
        case "complete": o.runCallbacks(); break;
      }
    }
  }

  export function getMatrix(element:HTMLElement):string[]{
    return element.style.transform.replace(/[^0-9\-.,]/g, '').split(',');
  }

  export function getTranslate(element:HTMLElement):string[]{
    return element.style.transform.replace("translate3d","").replace(/[^0-9\-.,]/g, '').split(',');
  }

  export function getLeft(element:HTMLElement): number{
    return parseFloat(element.style.left);
  }

  export function getGLeft(element:HTMLElement): number{
    var left = 0;
    while(element.tagName !== "BODY"){
      left += this.getLeft(element);
      element = element.parentNode as HTMLElement;
    }
    return left;
  }

  export function getTop(element:HTMLElement): number{
    return parseFloat(element.style.top);
  }

  export function getGTop(element:HTMLElement): number{
    var top = 0;
    while(element.tagName !== "BODY"){
      top += this.getTop(element);
      element = element.parentNode as HTMLElement;
    }
    return top;
  }

  export function getPosition(element:HTMLElement): {left:number, top:number}{
    return {left: this.getLeft(element), top: this.getTop(element)};
  }

  export function getGPosition(element:HTMLElement): {left:number, top:number}{
    var o = {left: 0, top: 0};
    while(element.tagName !== "BODY"){
      o.left += this.getLeft(element);
      o.top += this.getTop(element);
      element = element.parentNode as HTMLElement;
    }
    return o;
  }

  export function getX(element:HTMLElement): number{
  	var matrix = getTranslate(element);
  	//return parseFloat(element.style.left) + parseFloat(matrix[12] || matrix[4] || "0");
  	return parseFloat(element.style.left) + parseFloat(matrix[0] || "0");
  }

  export function getY (element:HTMLElement): number{
  	var matrix = getTranslate(element);
  	//return parseFloat(element.style.top) + parseFloat(matrix[13] || matrix[5] || "0");
    return parseFloat(element.style.top) + parseFloat(matrix[1] || "0");
  }

  export function getXY (element:HTMLElement): {x:number, y:number}{
  	var matrix = getTranslate(element);
  	//return {x:parseFloat(element.style.left) + parseFloat(matrix[12] || matrix[4] || "0"), y:parseFloat(element.style.top) + parseFloat(matrix[13] || matrix[5] || "0")};
    return {x:parseFloat(element.style.left) + parseFloat(matrix[0] || "0"), y:parseFloat(element.style.top) + parseFloat(matrix[1] || "0")};
  }
}



module sg.logic{
  //여러 답 판단이 필요한 답배열을 낱개로 풀어준다.
	//ex) ['a', 'b|c']
	//--> ['a', 'b']
	//--> ['a', 'c']
	export function getAnswerList(arr:string[]):string[][]{
		//console.log(arr);
		var list = [];
		var result = [];
		var j,k,i,len = 1;
		var cb=[];//각필드에 해당하는 여러답의 인덱스
		var ca=[];//각필드의 여러답 수
		//필드수가 되겠음

		var pcount = arr.length;

		for(i=0; i<pcount; i++){
			list[i] = arr[i].split("|");
			//각 입력필드에 해당하는 여러답의 수가 되겠음.
			ca[i] = list[i].length;
			//총 경우의 수
			len *= ca[i];//list[i].length;
		}
		//console.log("----list",JSON.stringify(list));
		//console.log("----len",len);
		var cbn, tarr=[], z;
		for(i=0; i<len; i++){
			var tarr = [];
			z = 0;
			for(j=0; j<pcount; j++){
				cb[j] = (typeof cb[j] === "undefined" || isNaN(cb[j])) ? 0 : cb[j];
				//console.log("list:", list[j], "cb:", cb[j], "ca:", ca[j]);
				//console.log("push",list[j][cb[j]%ca[j]]);
				//tarr.push(list[j][cb[j]%ca[j]]);
				tarr[z++] = list[j][cb[j]%ca[j]];
				//alert(cbn + " % " + cbn + " = " + (cbn%ca[j]))
				//alert(list[j][cbn%ca[j]]);
				//마지막 필드번째마다 인덱스를 증가
				if(j == pcount-1){
					//trace(cb, ca);
					//인덱스증가
					cb[j]++;
					//각 필드의 여러답수를 진수로 여기고 끝필드(끝배열)부터 증가해서, 올림값이 생기면 앞배열도 증가시킴

					//예를 들어 2개필드가 있고 각 필드에 각각 3가지,2가지 경우의 답이 있다고 가정하면
					//각각 3진수 2진수 수의 개념을 잡고, 끝배열(1의 자리라 생각하자)부터 1씩 증가시킨다
					//0 0
					//0 1
					//1 0
					//1 1
					//2 0
					//2 1

					for(k=j; k>0; k--){
						if(cb[k]>0 && cb[k]%ca[k] == 0){
							cb[k-1] = Math.floor(cb[k]/ca[k]);
						}
					}
				}
			}
			result[i] = tarr;
		}
		//alert(result);
		//console.log(JSON.stringify(arr));
		//console.log(result, JSON.stringify(result));
		for (let i = 0, li=list.length; i < li; i++) {
				delete list[i];
		}
		return result;//JSON.stringify(result);
	}
}



module sg.math{
  export function distance($x1:number, $y1:number, $x2:number, $y2:number):number{
    return Math.sqrt(Math.pow($x2-$x1,2) + Math.pow($y2-$y1,2));
  }

  export function pointToDegree($x1:number, $y1:number, $x2:number, $y2:number):number{
    return this.rad2deg(Math.atan2($y2-$y1, $x2-$x1));
  }

  export function degToRad($degree:number):number{
     return $degree*Math.PI/180;
  }

  export function radToDeg($radian:number):number{
     return $radian*180/Math.PI;
  }

  export function clampAngle($angle:number):number{
    if($angle >= 360) $angle -= 360;
    else if($angle < 0) $angle += 360;
    return $angle;
  }

  export function random($range1:number, $range2:number):number{
    return Math.random() * Math.abs($range1-$range2) + Math.min($range1, $range2);
  }

  export function range($min:number, $max:number, $number:number):number{
    //return Math.max(Math.min($number, $max), $min);
    return ($number < $min) ? $min : ($number > $max) ? $max : $number;
  }

  export function pointToRadian($x1:number, $y1:number, $x2:number, $y2:number):number{
    return this.deg2rad(Math.atan2($y2-$y1, $x2-$x1));
  }
}

module sg.aspen {
  export function getWidgetClassId(apx:APXScope, widgetId:string):string{
    return apx.screen.objects[widgetId].create.data.wgtID;
  }

  export function getWidgetClassIdForApd(apd:APDScope, widgetId:string):string{
    var obj = apd.getObjectByID(widgetId);
    if(obj.data){
      return obj.data.wgtTitle;
    }
    return null;
  }

  export function getStatesByObjectIDForApx(apx:APXScope, widgetId:string): LayersObject{
    return apx.screen.objects[widgetId].layout.layers;
  }

  export function getStatesByObjectIDForApd(apd:APDScope, widgetId:string): LayersObject{
    return apd.getScreenData().objects[widgetId].layout.layers;
  }

  export function getLayerIdByLayerTitle(layers:LayersObject, title:string):string{
    for(var i in layers){
      if( layers[i].title == title ){
        return layers[i].id;
      }
    }
  }

  export function getStateIdByLayerTitle(layers:LayersObject, title:string):string{
    for(var i in layers){
      if( layers[i].title == title ){
        return i;
      }
    }
  }

  export function getLayerTitleByLayerId(layers:LayersObject, layerId:string):string{
    for(var i in layers){
      if( layers[i].id == layerId ){
        return layers[i].title;
      }
    }
  }

  export function getStateIdByLayerId(layers:LayersObject, layerId:string):string{
    for(var i in layers){
      if( layers[i].id == layerId ){
        return i;
      }
    }
  }

  export function getLayerTitleByStateId(layers:LayersObject, stateId:string):string{
    return layers[stateId].title;
  }

  export function getLayerIdByStateId(layers:LayersObject, stateId:string):string{
    return layers[stateId].id;
  }

  /*

  export function getStateObjectByObjectIDForApx(apx:APXScope, widgetId:string): StatesObject{
    return apn.Project.getStateByObjectID(apx.project, apx.getPageID(), widgetId);
  }

  export function getStateObjectByObjectIDForApx(apx:APXScope, widgetId:string): StatesObject{
    return apn.Project.getStateByObjectID(apx.project, apx.getPageID(), widgetId);
  }
  */

  //export function getStateIdByLayerId()
}
