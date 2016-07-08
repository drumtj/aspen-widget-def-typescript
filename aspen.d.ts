////////////////////////////////////
///created date : 2016. 07. 06
///refer : APX_Widget_API_Reference_Core_20160705.pdf, APX_Widget_API_Reference_Advanced_20160705.pdf, APX_Widget_API_Reference_Optional_20160705.pdf
///defined by tj
////////////////////////////////////


// override
interface HTMLElement {
  $TAG(tagName: string, attr:{});
  $CSS(styleName: string, value: string);
  // 태그속성
  $A(attr:{});
}

/*
 * callback function override
 */
interface Tag extends HTMLElement {
//declare class Tag extends HTMLElement {
  /*
  Widget 에서 생성되지 않은 일반 Tag 에도 적용이 가능한 Input Event Interface 이다. 그냥 DOM Event 를
  사용해서 개발해도 되지만, Touch/Mouse 의 동시 실행을 고려하면 이 Interface 가 더 안정적이고 Click
  Event 의 처리도 빠르다. 또한 편집기에서 Set 된 'Visibility' 속성과 부합하게 동작하게 된다.
  BLUEGA Inc Page 6
  또한 Aspen Engine 의 Drag 기능을 사용할 수 있도록 Interface 를 제공하는데 이것은 개발 편의적 기능이다.

  Event 의 전파 방식은 DOM Event 와 원리가 비슷하다.
  ① Event 발생 Node 에 apxOnEvent()가 없으면, Parent Node 를 찾아서 올라가면서 apxOnEvent()를 가진
  Node 를 찾게 된다.
  ② apxOnEvent()가 호출되었을 때 해당 Event 에 대해서, false 가 Return 되면 (1)의 동작을 진행하게 된다.
  ③ true 가 Return 되면 (1)의 동작을 중지한다. 즉 DOM 의 Stop Propagation 과 같은 효과가 된다.
   */

  /**
   * Event 에 해당하는 기능을 실행함. 이때, 함수의 Return 이 true 이면, 해당 Event 에 대해서 편집기에서
   * 편집된 동작(Interaction)을 Override 하라는 뜻이며, false 이면 반대임
   * @param  {APXScope} apx
   * @param  {string}   event   Event – ‘click’, ‘longHold’, ‘flickLeft’, ‘flickRight’, ‘flickUp’, ‘flickDown’
   * @param  {number}   screenX
   * @param  {number}   screenY
   * @return {boolean}
   */
  apxOnEvent(apx: APXScope, event: string, screenX: number, screenY: number): boolean;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*
  tagDraggable()에 의해서 Drag 가능해진 Tag 에 대해서, Drag 동작 조건을 제어하기 위해서 다음과 같은
  Callback Interface 를 지원한다.
   */


   /**
    * Drag 가 시작될 때 호출이 되며, Return false 이면 Drag 가 시작되지 않음
    * @param  {APXScope} apx
    * @param  {number}   screenX
    * @param  {number}   screenY
    * @param  {Object}   originEvent
    * @param  {number}   localX
    * @param  {number}   localY
    * @return {boolean}
    */
   apxOnDragStart(apx: APXScope, screenX: number, screenY: number, originEvent: Object, localX: number, localY: number): boolean;

   /**
    * Drag 중에 호출됨. newX, newY 는 Drag 에 의해서 이동할 다음 위치이며, 이 위치로 가기를 원하지 않을
    * 경우, false 를 Return 하면 된다. (Drag 중에 인위적으로 Tag 위치를 옮기지 않고 이렇게 최종 발생한 Drag
    * Event 에 해당하는 분량에 대해서 좌표 이동 여부를 확인하는 것이 상대적으로 안전한 구현 방법이다) Drag
    * 직전, 현재의 Tag 의 좌표는 Tag 의 style.left, style.top 을 통해서 가져올 수 있음
    * @param  {APXScope} apx
    * @param  {number}   newX        Drag 에 의해서 이동할 다음 위치
    * @param  {number}   newY        Drag 에 의해서 이동할 다음 위치
    * @param  {number}   screenX
    * @param  {number}   screenY
    * @param  {Object}   originEvent
    * @param  {number}   localX
    * @param  {number}   localY
    * @return {boolean}
    */
   apxOnDrag(apx: APXScope, newX: number, newY: number, screenX: number, screenY: number, originEvent: Object, localX: number, localY: number): boolean;

   /**
    * Return false 이면 Drag 가 취소되고 원래의 자리로 돌아가고 true 이면 현재 자리에 위치함.
    * @param  {APXScope} apx
    * @return {undefined}
    */
   apxOnDragEnd(apx: APXScope): void;


   //Widget 의 Tag 에 Callback function 으로 구현하여 Widget 의 변화 상태를 수신하는 함수이다. (주로 exeOnLoad()에서 Tag 에 구현한다)
   /**
    * Widget 의 표시 크기가 변경이 되었을 때 변경 후에 호출된다.
    * @param  {APXScope} apx
    * @param  {Tag}      tag
    * @return {undefined}
    */
   tagOnPostResize(apx: APXScope, tag: Tag): void;

   /**
    * Widget 의 위치가 변경이 되었을 때 변경 후에 호출된다.
    * @param  {APXScope} apx
    * @param  {Tag}      tag
    * @return {undefined}
    */
   tagOnPostMove(apx: APXScope, tag: Tag): void;
}

interface EditorScope {
  getObjectByID(widgetId: string): IWidgetObject;
}

interface EditorOption {
  editLockRemove?       : boolean;
  editLockResize?       : boolean;
  editLockMove?         : boolean;
  editNoGroup?          : boolean;
  wgtsFocus?            : Array<any>;
}

interface IWidgetObject {
  data                  : IWidgetObejctData;
  id                    : string;
  canvas                : any;
  active                : boolean;
  layerIndex            : number;
  // base index 1
  layers                : IWidgetObject[];
  module                : string;
  position              : {x:number, y:number};
  positionSave          : {x:number, y:number};
  shape                 : {w:number, h:number, lw:number, type:number};
  shapeSave             : {w:number, h:number, lw:number, type:number, rotation:{cx:number, cy:number}};
  style                 : IWStyleMap;
  type                  : number;
  updated               : boolean;
}

interface IWidgetObejctData {
  properties            : any;
  styles                : any;
  wgtID                 : string;
  wgtTitle              : string;
}

interface IFile {

}

interface IWidgetEvent {
  wgtEvent:{value: string, title: string, param: {[eventName:string]: string}};
}

interface  IWidget {

  /**
   * Pointer 관련 EVENT를 사용할 수 없는 위젯임. IFRAME 등과 같은 경우임
   */
  APX_NO_POINTER_EV?    : boolean;

  /**
   * True이면 Resize 관련 ITR이 금지됨. 내부에 별도 TAG를 생성하여 구축된 위젯의 경우, Resize를 지원하지 않는 (또는 필요없는) 경우임
   * @type {boolean}
   */
  exeItrNoResize?       : boolean;
  /**
   * True이면 Zoom관련 ITR이 금지됨
   * @type {boolean}
   */
  exeItrNoZoom?         : boolean;
  /**
   * True이면 Position관련 ITR이 금지됨
   * @type {boolean}
   */
  exeItrNoMove?         : boolean;
  /**
   * mediaID를 Script로 Set/Get할 수 있는지 여부임
   * @type {boolean}
   */
  exeScriptMediaID?     : boolean;

  /**
   * True이면 State change Event를 발생시키므로 UI에서도 Event를 출력하라는 뜻임. Inherit됨
   * @type {boolean}
   */
  exeFireStateEvent?    : boolean;

  styleMap              : IWStyleMap;
  editor?               : IWEditor;
  properties?           : {
    state?      : string;
    attrs?      : any;
  };

  apxUI?                : IWApxUI[];
  parentClass           : IWidget;

  // 내가 가변으로 쓰기위해
  dynamic               : any;

  // ###
  //////////////////// 문서에 없고 파라미터 설명이 필요함

  createAsCanvasObject(prj:{}, position:{}, size:{}, styles?:{}, property?:{}): Object;
  onEdit(editor: EditorScope, widgetId: string, screenX: number, screenY: number): void;

  /**
   * 'Container 기반 Widget'의 경우에만 호출이 되며, Widget 이 Container 의 편집 영역에 Layout 등을 추가로 표시하기 원할 때 구현하는 함수이다.
   * @param {APDScope}                 apd
   * @param {string}                   widgetId
   * @param {CanvasRenderingContext2D} ctx      HTML5 Canvas Context 이다. 이것을 사용하여 필요한 내용을 Draw 한다. 이 Canvas 는
   *                                            Sandbox 방식으로 Isolate 된 것이 아니므로 ctxt.save(), ctxt.restore()를 사용하는 것이 Side effect 가능성을
   *                                            줄일 수 있다.
   * @param {number}                   x        Widget 의 표시 영역 좌표
   * @param {number}                   y        Widget 의 표시 영역 좌표
   * @param {number}                   w        Widget 의 표시 영역 크기
   * @param {number}                   h        Widget 의 표시 영역 크기
   * @param {boolean}                  editMode 현재 편집기(apd)가 편집 상태인지, 또는 미리보기/프린트 상태인지를 나타낸다.
   */
  edtOnPostDraw(apd: APDScope, widgetId: string, ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, editMode: boolean): void;
  exeCreateTag(g, f, c, e, d): void;
  exeRenderTag?         : () => void;
  exeSetState(apx: APXScope, tag: Tag, state: string): void;
  exeSetText?           : () => void;
  exeAssetLoad?         : () => void;
  exeOnScreenDrag(apx: APXScope, widgetId: string, start: boolean): void;
  edtOnBuildEvent(file: IFile, widgetId: string, pageID: string, event: IWidgetEvent): void;
  exeOnReceiveMessage(apx: APXScope, widgetId: string, value:any): void;

  /////////////////////

  /**
   * Widget 을 포함하는 화면이 실행 중지(Hide)되었다가 다시 실행이 재개(Show)될 때 호출됨. 따라서
   * Animation 이나 Media 를 가지는 Widget 은 중지 후 재개 동작을 실행해야 함 (exeOnLoad 직후에는 exeOnResume 은 오지 않는다)
   * - Page 가 실행될 때마다 File Context 의 정보를 읽어서 재실행하는 형태의 Widget 의 경우, 이 함수를 구현한다.
   * (이 경우 첫 번째 실행도 처리해야 하므로 exeOnStart()도 같이 구현하게 된다)
   * - Media 형 Widget 이나 Animation, Game 형의 Widget 의 경우, 실행이 중지되면 Widget 도 중지해야 하고
   *  실행이 재개(Resume)되면 Widget 도 다시 실행해야 하므로 이 함수를 구현하게 된다.
   * @param  {APXScope} apx
   * @param  {string}   widgetId
   * @return {undefined}
   */
  exeOnResume(apx: APXScope, widgetId: string): void;

  /**
   * Widget 을 포함하는 화면이 실행 중지(Hide)될 때 호출됨. 따라서 자체적인 Animation 이나 Media 를
   * 가지는 Widget 은 중지 동작을 실행해야 함 (APX 가 제공하는 기능은 자동으로 정지하므로 따로 구현할 필요가 없음)
   * @param  {APXScope} apx
   * @param  {string}   widgetId
   * @return {undefined}
   */
  exeOnPause(apx: APXScope, widgetId: string): void;

  /**
   * 프로그램 코드에서 Tick Timer 가 필요한 경우 이 함수를 생성하면 호출됨. Timer 는 가변 Tick 으로 현재 시간이 milliseconds 단위로 전송됨
   * @param  {APXScope} apx
   * @param  {string}   widgetId
   * @param  {number}   timeTick milliseconds
   * @return {undefined}
   */
  exeOnTick(apx: APXScope, widgetId: string, timeTick: number): void;

  /**
   * File Data 에 의한 Widget 의 생성이 완료된 직후에 호출됨. 따라서, APX Widget 은 여기에서 Widget의
   * 실행에 필요한 추가적인 생성 및 설정 작업을 하고 바로 실행을 시작하거나 exeOnStart()에서 실행할 수 있음.
   * @param  {APXScope} apx
   * @param  {string}   widgetId
   * @return {undefined}
   */
  exeOnLoad(apx: APXScope, widgetId: string): void;

  /**
   * 모든 Widget 의 생성 및 exeOnLoad()의 실행이 완료되고 호출되는 함수임. 이 함수에서는 모든 Widget이 exeOnLoad()에서 수행한 추가적 설정 정보를 안전하게 읽을 수 있음
   * - 모든 Widget 이 생성되고 나서 순서대로 exeOnLoad()가 호출이 되므로, exeOnLoad()안에서 다른
   *   Widget 의 File Data 에 의한 생성 정보는 파악할 수 있으나 각 Widget 이 exeOnLoad()에서 추가적으로
   *   생성한 정보를 조회하는 것을 보장하지 못한다. 따라서, 이러한 정보를 조회하기 위해서는 exeOnStart()에서 조회해야 한다.
   * - 예를 들어, 다른 Widget 이 exeOnLoad()에서 File Context 의 정보를 읽어 가공하여 실행하는 경우,
   *   이 가공된 정보를 읽기 위해서는 exeOnStart()에서 읽는 것이 그 시점을 보장한다.
   * - 또는 Media Widget 의 Media Listener 를 사용하는 경우, 예를 들어 Video Widget 들은 Media 의 Load를 exeOnStart()에서 실행한다.
   *   그 이유는 각 Widget 들이 Media Listener 를 빨라야 exeOnLoad()에서 등록하기 때문에, 모든 Widget 들이 Media 변동에 대한 Listen 를
   *   보장하기 위해서 exeOnStart()에서 Media 를 Loading 하게 된다.
   * - 특별한 생성 작업이 없는 Widget 의 경우, exeOnLoad() 대신 exeOnStart()만 사용하는 것이 더 안전한 구성이다.
   * @param  {APXScope} apx
   * @param  {string}   widgetId
   * @return {undefined}
   */
  exeOnStart(apx: APXScope, widgetId: string): void;

  /**
   * 편집기에서 Widget 을 설정할 때 호출되는 함수이다. 통상적으로 Popup Dialog 를 표시하고 사용자가
   * 설정값을 입력할 수 있도록 한다. 이 함수 안에서는 apd{} Domain 의 함수만 사용 가능하다
   * @type {(apd: APDScope, widgetId: string) => void}
   * @example
   * apxWgtSample.edtOnConfig = function(apd, objID)
   * {
   * 		var cfg = apd.wgtGetProperty(objID, 'cfg')||{}; // cfg{}라는 값을 사용하는 경우
   * 		var tagDlg;
   * 		function onOK()
   * 		{
   * 				// 입력화면에 입력된 값을 cfg{}에 저장함.
   * 				apd.wgtSetProperty(objID, 'cfg', cfg); // Widget data 에 저장함
   * 		}
   *		if (tagDlg = apd.dlgDoModal(600, 240, onOK))
   *		{
   *				// 입력화면을 구성함
   *		}
   * }
   * @param  {APDScope} apd
   * @param  {string}   widgetId
   * @return {undefined}
   */
  edtOnConfig(apd: APDScope, widgetId: string): void;

  /**
   * System 적으로 화면을 Refresh 해야할 경우가 발생했을 때 호출된다. 주로 새로운 Font 가 Loading 이 되었을 때
   * 호출이 되기 때문에, Font 를 기준으로 크기를 결정하는 Widget 등에서 구현해야 한다.
   * @param  {APXScope} apx
   * @param  {string}   widgetId
   * @return {undefined}
   */
  exeOnScreenRefresh(apx: APXScope, widgetId: string): void;

  /**
   * Interaction 또는 Scripting 에 의해서 Widget 의 표시 상태가 변할 때 호출된다. 'show'가 true 이면
   * 화면에 보이는 상태이고 false 이면 보이지 않는 상태이다.
   * @param  {APXScope} apx
   * @param  {string}   widgetId
   * @param  {boolean}  show     true 이면 화면에 보이는 상태이고 false 이면 보이지 않는 상태이다
   * @return {undefined}
   */
  exeOnShow(apx: APXScope, widgetId: string, show: boolean): void;


}



interface IWStyleMap {
  /**
   * 제목(Label)
   * @type {boolean}
   */
  title?                : boolean;
  /**
   * 표시 방식
   * @type {boolean}
   */
  visibility?           : boolean;
  /**
   * 테두리(또는 Line) 스타일(색상)
   * strokeStyle과 lineWidth값이 모두 의미있는 값을 가져야 테두리가 실재로 보인다
   * @type {boolean}
   */
  strokeStyle?          : boolean;
  /**
   * 테두리 두께
   * strokeStyle과 lineWidth값이 모두 의미있는 값을 가져야 테두리가 실재로 보인다
   * @type {boolean}
   */
  lineWidth?            : boolean;
  /**
   * 테두리 점선 스타일
   * @type {boolean}
   */
  lineDash?             : boolean;
  /**
   * 테두리 접합 형식
   * @type {boolean}
   */
  lineEnd?              : boolean;
  /**
   * 배경 스타일(색상)
   * @type {boolean}
   */
  fillStyle?            : boolean;
  /**
   * 투명도
   * @type {boolean}
   */
  alpha?                : boolean;
  /**
   * 회전
   * @type {boolean}
   */
  angle?                : boolean;
  /**
   * 드래그 - X 축
   * @type {boolean}
   */
  dragX?                : boolean;
  /**
   * 드래그 - Y 축
   * @type {boolean}
   */
  dragY?                : boolean;
  /**
   * 드래그 - Parent 안에서
   * @type {boolean}
   */
  dragInParent?         : boolean;
  /**
   * 드래그 - Parent 를 포함하면서
   * @type {boolean}
   */
  dragContainParent?    : boolean;
  /**
   * 글꼴
   * @type {boolean}
   */
  font?                 : boolean;
  /**
   * 글꼴 - 볼드
   * @type {boolean}
   */
  fontBold?             : boolean;
  /**
   * 글꼴 - 이탤릭
   * @type {boolean}
   */
  fontItalic?           : boolean;
  /**
   * 글꼴 크기
   * @type {boolean}
   */
  fontSize?             : boolean;
  /**
   * 글꼴 - 테두리 색상
   * @type {boolean}
   */
  fontStrokeStyle?      : boolean;
  /**
   * 글꼴 - 테두리 두께
   * @type {boolean}
   */
  fontStrokeWidth?      : boolean;
  /**
   * 글꼴 색상
   * @type {boolean}
   */
  fontStyle?            : boolean;
  /**
   * 글꼴 - 밑줄
   * @type {boolean}
   */
  fontUnderlined?       : boolean;
  /**
   * 자간 조정
   * @type {boolean}
   */
  lnSp?                 : boolean;
  /**
   * 행간 조정
   * @type {boolean}
   */
  ltrSp?                : boolean;
  /**
   * 문자열
   * @type {boolean}
   */
  text?                 : boolean;
  /**
   * 문자열 - 가로 정렬
   * @type {boolean}
   */
  textAlign?            : boolean;
  /**
   * 문자열 - 세로 정렬
   * @type {boolean}
   */
  textValign?           : boolean;
  /**
   * 문자열 - 줄바꿈 가능
   * @type {boolean}
   */
  textMultiLine?        : boolean;
  /**
   * 좌/하 모서리 반지름
   * @type {boolean}
   */
  borderRadiusBottomLeft? : boolean;
  /**
   * 우/하 모서리 반지름
   * @type {boolean}
   */
  borderRadiusBottomRight?: boolean;
  /**
   * 좌/상 모서리 반지름
   * @type {boolean}
   */
  borderRadiusTopLeft?  : boolean;
  /**
   * 우/상 모서리 반지름
   * @type {boolean}
   */
  borderRadiusTopRight? : boolean;

  textPadding?          : boolean;
  textWordWrap?         : boolean;
}

interface IWApxUI {
    /**
     * apxType|apxWidget   apxType 에 들어가는 값 or Sub-widget Module ID
     * @type {string}
     */
    apxType?            : string;
    /**
     *  string[]    : 선택 가능 apxParam 목록
     *  null        : Text Input
     *  undefined   : 사용안함
     *  @type {string[]}
     */
    apxParam?           : string[];
    /**
     * Param Title
     * @type {string}
     */
    paramTitle?         : string;
    /**
     * [ID,...], 이 apxType 의 선택이 가능한 Widget Module ID 목록. 값이 없으면 모든 Widget에 적용 가능을 뜻함. (apxWidget 을 사용하는 경우에는 당연히 무시됨)
     * @type {string[]}
     */
    wgtClass?           : string[];

    apxWidget?          : string;
}

interface IWEditor {
  states?               : any;
  color?                : string;
  placeHolder?          : string;
  icon?                 : string;
  iconThumb?            : string;
  properties?           : any;
  //현재 사용되지 않음
  runtimeProperties?    : any;
}

////////////////////////////////

interface APBase {


  /**
   * Media 의 실재 URL 을 알아냄. snapshot=true 이면 Video 의 경우 Snapshot Image 를 알아냄
   * @param  {string}  mediaID
   * @param  {boolean} [snapshot]
   * @return {string}  url
   */
  mediaURL(mediaID: string, snapshot?: boolean): string;

  /**
   * Widget 의 Local path 에 저장된 Widget 전용 이미지의 Path 를 알아냄
   * @param  {string} id
   * @param  {string} url
   * @return {string}
   */
  localMediaURL (id: string, url: string): string;

  /**
   * Widget Property 를 Read 함
   * @param  {string} widgetId
   * @param  {string} key
   * @return {any}          value
   */
  wgtGetProperty(widgetId: string, key: string): any;

  /**
   * Property 를 Set 함. Set 되는 동작은 해당 Page Domain 내에 있는 모든 Widget 에 통보가 되는 구조이며
   * 신호를 수신하기 위해서는 wgtListenProperty() 참조(value 가 Object Reference 여서 굳이 Set 을 호출할
   * 필요가 없는 경우에도, 통보할 필요가 있는 경우에는 호출을 해줘야 함)
   * @param  {string}  widgetId
   * @param  {string}  key
   * @param  {any}     value
   * @param  {boolean} dataOnly  Set 에 따른 Callback, Event 관련 동작을 실행하지 않고 값만 바꾸기를 원하는 경우임
   * @return {undefined}
   */
  wgtSetProperty(widgetId: string, key: string, value: any, dataOnly?: boolean): void;
}

/*
 * playAudio의 인자값으로 사용되는 옵션
 */
interface AudioPlayOption {
  /**
   * Loop 로 Play 함
   * @type {boolean}
   */
  loop                                      : boolean;
  /**
   * onDuration() 사용을 위해서 Loading 만 하는 경우임. Play 를 하지 않으므로 id 가 없으면 이 Option 은 무시됨
   * @type {boolean}
   */
  loadOnly                                  : boolean;
  /**
   * Page 가 활성 상태가 아니어도 Play 할 것인지 여부
   * @type {boolean}
   */
  allowBackground                           : boolean;
  /**
   * Play 종료 Event 수신
   * @type {undefined}
   */
  onEnd                                     : (widgetId: string) => void;
  /**
   * Duration 이 파악되면 Duration 을 수신함. Duration 은 Second 단위임. (소수 가능함)
   * @type {undefined}
   */
  onDuration                                : (widgetId: string) => void;
}

/*
exeOnLoad에 인자로 들어오는 객체
 */
interface APXScope extends APBase {

  width                                     : number;
  height                                    : number;
  screen                                    : APXScope_Screen;

  /**
   * widgetId에 해당하는 Widget을 주어진 조건으로 검색함.<br>
   * 조건은 다음과 같으며 모두 지정하면 합집합이 Return 됨.<br>
   * - childOfWidget: 해당 ID 의 Children, 즉 모든 하위 Depth 에서 검색<br>
   * - siblingOfWidget: 해당 ID 의 Sibling 을 검색. 동일 Depth 만 검색<br>
   * @param  {string} [widgetId]        위젯 ID
   * @param  {string} [childWidgetId]   자식위젯 ID
   * @param  {string} [siblingWidgetId] sibling위젯 ID
   * @return {string[]}                 위젯ID 합집합 배열
   */
  widgetsByClass(widgetId?: string, childWidgetId?: string, siblingWidgetId?: string): string[];

  /**
   * widgetsByClass()와 기본적으로 같으나 기본 검색 조건이 apxType 임
   * @param  {string} [apxType]         apxType
   * @param  {string} [childWidgetId]   자식위젯 ID
   * @param  {string} [siblingWidgetId] sibling위젯 ID
   * @return {string[]}                 위젯ID 합집합 배열
   */
  widgetsByType(apxType?: string, childWidgetId?: string, siblingWidgetId?: string): string[];

  /**
   * widgetsByClass()와 기본적으로 같으나 Property 의 존재 여부로 검색함. 즉 어떤 Property 를 가지는
   * Widget 을 찾기 위한 목적으로 사용함. (이 기능은 어떤 특정 동작을 가지는 Widget 을 찾는 목적으로 주로
   * 사용함. 그러한 Widget 에 wgtSetProperty()를 호출하여 특정 동작을 시킬 수 있는 구조로 구성하게 됨)
   * @param  {string} [widgetId]        위젯 ID
   * @param  {string} [childWidgetId]   자식위젯 ID
   * @param  {string} [siblingWidgetId] sibling위젯 ID
   * @return {any[]}                    합집합 배열
   */
  widgetsByProperty(widgetId?: string, childWidgetId?: string, siblingWidgetId?: string): any[];

  /**
   * Page Event 를 발생시킨다. 이 함수는 등록되지 않는 Event 에 대해서는 처리하지 않고 Warning Logo 을 출력한다.
   * @param  {string} event
   * @param {string|undefined} [param]
   * @param {string}           widgetId
   * @return {undefined}
   */
  fireEvent(event: string, param: string|undefined, widgetId: string): void;

  /**
   * 편집자를 위한 Log 을 출력함. 이것은 편집 데이터의 부족이나 불일치로 인하여 Widget 이 정상 동작하지
   * 못하는 경우를 알려주기 위한 것임. 따라서, 개발자를 위한 것이 아니므로 편집기 상에서 이해하기 쉬운 Message 로 출력해야 한다.
   * @param  {string} id
   * @param  {string} msg
   * @return {undefined}
   */
  log(widgetId: string, msg: string): void;

  /**
   * oId 에 해당하는 Widget 을 복제함. 이때 Parent 정보도 유지됨. 그러나 실행 후에 생성 개수가 결정이 되어
   * 실행 전에 미리 생성할 수 없는 형태의 경우, 표준 함수인 Node.cloneNode(true)를 사용해서 Tag 자체만
   * 복제해서 사용하는 것도 대안이 될 수 있다. 이 경우 Tag 를 대상으로 하는 API 와 Event 기능은 그대로 사용할 수 있다.
   * @param  {string} widgetId 복사대상 위젯ID
   * @return {string}
   */
  srcCloneWidget(widgetId: string): string;

  /**
   * Widget 의 Tag 를 Return 함
   * @param  {string}      widgetId
   * @return {Tag}
   */
  wgtTag(widgetId: string): Tag;

  /**
   * Tag의 WidgetID를 Return함
   * @param  {Tag} tag
   * @return {string} widgetID
   */
  wgtId(tag: Tag): string;

  /**
   * Widget 을 복제하고 그 ID 를 Return 함 (Scene widget복사는 지원안됨)
   * @param  {string} widgetId
   * @return {string}          복사된 위젯의 ID
   */
  wgtClone(widgetId: string): string;



  /**
   * Page Domain 에서 발생하는 key 에 해당하는 Property 의 수정 내역을 수신함.
   * @param  {string}   widgetId
   * @param  {string}   key
   * @param  {Function} callbackFunc function(widgetID:string, value:any){} (주의! 이 함수 안에서 다시 wgtSetProperty()를 호출하면 Infinite Loop 발생 가능성 있음)
   * @param  {boolean}  remove       true 이면 등록 삭제
   * @param  {boolean}  always       Widget 의 Page 가 Pause(실행 중지, Hide) 상태인 경우에도 수신하기 원하는 경우 이것을 true 로 지정한다.
   * @return {undefined}
   */
  wgtListenProperty(widgetId: string, key: string, callbackFunc: (widgetId: string, value: any)=>void, remove?: boolean, always?: boolean): void;

  /**
   * ‘state’와 ‘frame’로 Sprite 을 Set 하는 기능임. ‘frame’, ‘state’가 undefined 이면 현재 편집 order 값으로
   * 첫번째 frame 이나 state 가 표시됨. (state 는 Multiple State 를 가지는 경우에만 의미가 있음) 또한, Set 을
   * 하면 단연히 의미적으로 Animate 는 자동으로 중지됨. 따라서, 이 함수는 현재 실행되고 있는 spriteAnimate()를 중지하는 목적으로도 사용됨.
   * @param  {string} widgetId
   * @param  {string} state    Editor 에서 입력한 State Title
   * @param  {string} frame    Editor 에서 일련 번호로 표시되는 Title 값
   * @return {undefined}
   */
  wgtAniSet(widgetId: string, state?: string, frame?: string): void;

  /**
   * oId 에 해당하는 Widget 의 현재 Sprite State 를 알아냄. 즉 Widget 이 현재 어떤 State 에 있는지를
   * 파악하기 위한 것임. 주로 Widget 의 동작 상태를 파악하는데 활용함. (참고로 이 함수는 wgtAniSet()에
   * 대응하는 함수이지만 Frame 관련 기능은 필요가 없으므로 이름의 구성이 다름)
   * @param  {string} widgetId
   * @return {string}          Sprite Widget 이 아니거나 Error 상황이면 null
   */
  wgtAniGetState(widgetId: string): string;

  /**
   * oId 의 Widget 이 주어진 ‘state’, ‘frame’에 해당하는 상태를 가지고 있는지를 Check 함. 이것은, 편집된
   * Data 에 필요한 Sprite 상태가 편집이 되어 있는지 여부를 판단하여 프로그램 소스에서 Animation 실행 여부를 결정하기 위한 목적으로 사용됨
   * @param  {string} widgetId
   * @param  {string} state
   * @param  {string} frame
   * @return {number|boolean}          상태 변경이 가능하지 않으면 0. 가능하면 state 만 검사하는 경우, frame 개수가 Return 되므로 > 1 이면 Animation 이 가능한 상황이라는 것을 알 수 있음. frame 도 같이 검사하는 경우 frame 이 있으면 1
   */
  wgtAniCheck(widgetId: string, state?: string, frame?: string): number|boolean;

  /**
   * state 는 1 개 이상, 가변 개수로 지정 가능함. 값이 없으면 첫 번째 state 을 Animate 한다.
   * @param  {string} widgetId
   * @param  {number} type  1=Run, 2=Loop, 3=Run and loop the last state
   * @param  {string} state
   * @param  {string} ...rest  more state
   * @return {undefined}
   */
  wgtAnimate(widgetId: string, type: number, state: string, ...rest): void;

  /**
   * cntrId 는 현재 APX Widget 의 Id 이며 이 안에 포함된 wgtId 의 Widget 이 주어진 Condition 에 부합하는 Widget 과 Intersect 하고 있는지를 검사함.
   * @param  {string}    cntlId    현재 APX Widget 의 Id
   * @param  {string}    widgetId
   * @param  {CondType}  contType  대상 검색 조건, 1=Id of Object, 2=apxType, 3=Widget Module Class Id
   * @param  {string}    condValue
   * @return {IWidget[]}           null(없는 경우), Array of Objects(있는 경우)
   */
  wgtIntersectWith(cntlId: string, widgetId: string, contType: CondType, condValue: string): IWidget[];

  /**
   * File Domain 에서 발생하는 key 에 해당하는 Context 의 수정 Event 를 수신함.
   * @param  {string}   widgetId
   * @param  {string}   key
   * @param  {Function} callback        주의! 이 함수 안에서 다시 ctxSet()를 호출하면 Infinite Loop 발생 가능성 있음
   * @param  {boolean}  background      Page 가 Pause 된 상태에서도 수신할 것인지 여부
   * @param  {boolean}  remove          true 이면 등록 삭제
   * @return {undefined}
   */
  wgtListenContext(widgetId: string, key: string, callback: (value: any)=>void, background?: boolean, remove?: boolean): void;







  ///////////////////////////ctx prefix////////////////////////
  /*****************************************************************
   * APXScope의 ctx
   * File Domain(Page 내부가 아닌 전역)에 실행 데이터를 저장하는 기능을 제공함. 이것은 서로 다른 Page 에 있는
   * Widget 이 서로 정보를 주고 받거나 기능을 실행시키기 위한 목적으로 사용된다.
   *****************************************************************/

  /**
   * key 에 해당하는 Value 을 저장함. 이 함수에서 Listen 하고 있는 Widget 들에게 통보함 (value 가 Object
   * reference 여서 굳이 Set 을 호출할 필요가 없는 경우에도, 통보할 필요가 있는 경우에는 호출을 해줘야 함)
   * @param  {string} key
   * @param  {any}    value
   * @return {undefined}
   */
  ctxSet(key: string, value: any): void;

  /**
   * key 에 해당하는 Value 를 가져옴. 저장된 값이 없으면 undefined 임.
   * @param  {string} key
   * @return {any}
   */
  ctxGet(key: string): any;


  /********************************** optional ************************************/

  /**
   * MediaID 의 Audio 를 Play 함. (개발자가 자체적으로 구현해도 되지만 통상적으로 Audio API 는
   * 불안정한 면이 있으므로 API 로 제공함) 부가적으로 이 API 로 Play 한 Audio 는 Page 가 전환될 때 자동으로 Pause 됨
   * @param  {string}          mediaId
   * @param  {AudioPlayOption} opts
   * @return {undefined}
   */
  playAudio(mediaId: string, opts: AudioPlayOption): void;

  /**
   * MediaID 의 Audio 를 Play 함. (개발자가 자체적으로 구현해도 되지만 통상적으로 Audio API 는
   * 불안정한 면이 있으므로 API 로 제공함) 부가적으로 이 API 로 Play 한 Audio 는 Page 가 전환될 때 자동으로 Pause 됨
   * @param  {string}          widgetId ID 를 주면 Audio 를 Caching 해서 Replay 할 수 있음. 이 값이 없으면 매번 다시 Loading 하는
   *                           구조가 되지만 Memory 효율성은 좋아짐. (이 함수는 Page Domain 에 있으므로 Widget 간에 ID 가 충돌하지 않도록
   *                           Widget ID 등을 활용하여 ID 를 생성하는 것이 좋음)
   * @param  {string}          mediaId
   * @param  {AudioPlayOption} opts
   * @return {undefined}
   */
  playAudio(widgetId: string, mediaId: string, opts: AudioPlayOption): void;

  /**
   * MediaID 의 Audio 를 Stop 함
   * @param  {string} mediaId
   * @return {undefined}
   */
  stopAudio(mediaId: string): void;

  /**
   * MediaID 의 Audio 를 Pause 함
   * @param  {string} mediaId
   * @return {undefined}
   */
  pauseAudio(mediaId: string): void;

  /**
   * MediaID 의 Audio 를 Resume 함
   * @param  {string} mediaId
   * @return {undefined}
   */
  resumeAudio(mediaId: string): void;


  /********************************** advanced ************************************/


  /*************************************************
   * Media widget 를 제어하거나 연동하기 위한 API 이다.
   **************************************************/

  /**
   * Media 기능을 가진 Widget 을 제어함. Media 가 아닌 경우 false 가 Return 됨
   * @param  {string}      widgetId
   * @param  {string}      action   ‘play’, ‘stop’, ‘resume’, ‘pause
   * @return {boolean}
   */
  wgtControlMedia(widgetId: string, action: string): boolean;

  /**
   * mediaWidgetId 의 Widget 에서 발생하는 Media Event 를 수신함.
   * @param  {string}   widgetId
   * @param  {string}   mediaWidgetId
   * @param  {Function} callback
   * ----------------------------------------------------------------------------------------------
   * eventType         p1                         p2
   * ----------------------------------------------------------------------------------------------
   * trackStart        Total number of track      Current track(1-based)        On Track Start
   * trackEnd          Total number of track      Current track(1-based)        On Track End
   * trackPause        -                          -                             On Track Pause
   * trackResume       -                          -                             On Track Resume
   * listSet           Total number of track                                    On Play List Set
   * listStart                                                                  On Play List Start
   * infoDuration      Current time               Duration                      On Get Duration
   * infoPlayTime      Current time               Duration                      On Get Play Time
   * ----------------------------------------------------------------------------------------------
   * >>‘infoDuration’이 ‘infoPlayTime’보다 먼저 호출됨. 전체 Duration 을 먼저 표시하기 위한 목적임. Loading 오류 등이 발생하면 호출되지 않음
   * @param  {boolean}  remove           true 이면 등록 삭제
   * @return {undefined}
   */
  wgtListenMedia(widgetId: string, mediaWidgetId: string, callback: (eventType: string, p1: any, p2: any)=>void, remove?: boolean): void;

  /**
   * Media 의 Volume 을 지정하고 현재 값을 가져옴
   * @param  {string} widgetId
   * @param  {number} volume  0~1
   * @return {number}         0~1
   */
  wgtVolumeMedia(widgetId: string, volume?:number): number;




  ////////////////// utl prefix //////////////////

  /**
   * 'oId'의 Widget 에 'event'에 해당하는 Event 에 반응하도록 편집된 Interaction 을 그대로 실행함. 이것은 다음과 같은 경우에 유용하게 사용됨
   * - cloneNode()에 의해서 생성된 일반 Tag 들이 원본 Widget 의 Interaction 과 같은 동작을 하도록 하기 위함
   * - Widget 내부의 Child Widget 이 다른 Child Widget 의 Interaction 동작을 그대로 실행하기 위함. 이것은
   *   다수의 Widget 이 동일한 Interaction 동작을 가지게 될 가능성이 큰 경우 편집자가 반복하여
   *   Interaction 을 편집하지 않아도 되도록 하기 위한 목적임. (Interaction 에 대응하는 동작을 Widget
   *   Coding 에 포함시키면 Widget 의 활용도가 떨어지는 단점이 있기 때문임)
   * @param  {string} widgetId
   * @param  {string} event
   * @return {undefined}
   */
  utlRunInteractionOf(widgetId: string, eventType: string): void;



  /////////////////////////////////////////////
  ///Widget 으로 생성된 Tag 뿐만 아니라, 모든 Tag 에 수행 가능한 API 들이다. 따라서 주요 참조 패러미터는Tag 이다.
  /////////////////////////////////////////////

  /**
   * Tag 가 Drag 가능하고 Drag Event 를 수신할 수 있도록 함. dirX, dirY 는 각각 Drag 가능 방향
   * @param  {Tag} tag
   * @param  {boolean}     dirX x축 드래그 여부
   * @param  {boolean}     dirY y축 드래그 여부
   * @return {undefined}
   */
  tagDraggable(tag: Tag, dirX: boolean, dirY: boolean): void;

  /**
   * Transitional transform animation 기능을 제공함. (기능적으로는 CSS3 Transform 과 유사하므로 가능한
   * 경우 개발자가 CSS3 Transform 을 써도 무방함) 다음과 같은 정보를 통해서 Animation 을 정의하며 동시에 실행시킬 경우, 다수를 호출하면 된다.
   * Transform ID 가 Return 되며 tagTransformCancel()을 통해서 Cancel 하는 목적으로 사용할 수 있다.
   * @param  {Tag}     tag
   * @param  {TransformEffect} effect
   * @param  {Function}        onEnd
   * @param  {Function}        onAnimate
   * @return {string}          Transform ID, tagTransformCancel()을 통해서 Cancel 하는 목적으로 사용
   * @example
   * # 0,0 -> 500,500 좌표로 이동하고 onEnd 를 수신하는 예제
   * apx.tagTransform(tag, {timing:'ease-in', duration:600, style:{left:{from:0, to:500, unit:'px'}, top:{from:0, to:500, unit:'px'}}}, onEnd);
   * # Z 축으로 360 도 회전하는 예제 (자체 함수를 이용한 구현)
   * function onAnimate(value)
   * {
   * 		tag.style.transform = 'rotateZ('+(value*360)+'deg)';
   * }
   * apx.tagTransform(tag, {timing:'ease-in', duration:600}, undefined, onAnimate);
   */
  tagTransform(tag: Tag, effect: TransformEffect, onEnd?: (tag: Tag)=>void, onAnimate?: (value: any)=>void): void;

  /**
   * 현재 실행 중인 Transform 이면 End 상태로 즉시 종료함.
   * @param  {Tag} tag
   * @param  {string}      transformId tagTransform()으로 반환받은 id
   * @return {undefined}
   */
  tagTransformCancel(tag: Tag, transformId: string): void;

  /**
   * Tag 를 ‘tagOf’에 해당하는 Tag 위에 오도록 지정함 (이 함수의 동작은 일반적인 DOM Operation 으로 구현됨)
   * @param  {Tag} tag
   * @param  {Tag} tagOf
   * @return {undefined}
   */
  tagPutOn(tag: Tag, tagOf:Tag): void;

  /**
   * Tag 를 ‘tagOf’에 해당하는 Tag 밑에 오도록 지정함 (이 함수의 동작은 일반적인 DOM Operation 으로 구현됨)
   * @param  {Tag} tag
   * @param  {Tag} tagOf
   * @return {undefined}
   */
  tagPutUnder(tag: Tag, tagOf:Tag): void;

  /**
   * Tag 가 Pointer Event 를 받지 않고 아래로 Tag 로 통과시킬 것을 지정함. 즉 해당 Tag 가 Pointer Event 에 대해서 투명한 상태가 됨
   * @param  {Tag} tag
   * @param  {boolean}     pass
   * @return {undefined}
   */
  tagPassPointerEvent(tag: Tag, pass: boolean): void;

  /**
   * Tag 가 Pointer Event 를 받지 않으나 또한 아래로 통과시키지 않을 것을 지정함. 즉 Disabled 와 같은 상태가 됨
   * @param  {Tag} tag   [description]
   * @param  {boolean}     block [description]
   * @return {undefined}            [description]
   */
  tagBlockPointerEvent(tag: Tag, block: boolean): void;


}


interface APXScope_Screen {
  UI          : { order: number, title: string };
  module      : string;
  objects     : {};
}

/*
 * 현재 APXScope_WGT의 wgtIntersectWith함수에 인자로 사용됨
 */
declare enum CondType {
  OBJECT_ID = 1, APX_TYPE, WIDGET_MODULE_CLASS_ID
}


interface TransformEffect {
  /**
   * ‘linear’(default), ‘ease’, ‘ease-in’, ‘ease-out’, ‘ease-in-out’
   * @type {string}
   */
  timing?     : string;
  /**
   * Transform 을 원래로 되돌림. duration 의 1/2 시간에 Transform 을 수행하고 1/2 시간 동안에 복구함. (이때 timing 은 동일한 함수를 사용함)
   * @type {string}
   */
  roundUp?    : boolean;
  /**
   * msec
   * @type {number}
   */
  duration?   : number;
  /**
   * css style지정
   * 이 값이 없고 함수 패러미터에 onAnimate())가 있으면, 0~1 까지의 값이 timing 함수에 의해서 Interpolation 된 값이 onAnimate(value)로 호출됨
   * @example
   *   style:{left:{from:0, to:100, unit:'px'}};
   *   <style의 properties>
   *   - rotate: rotateZ()동작을 수행함. unit 은 내부적으로 'deg'로 고정되어 있음
   *   - resize: scale()동작을 수행함. Ex) 1->1.2.5. 방향은 CSS Transform-origin 을 통해서 수정 가능
   *   - 기타 모든 css properties
   *   [주의] rotate 와 resize 는 CSS Transform 을 사용하므로 이 값을 해제하기 위해서는 CSS Transform 을 수정하거나 ‘none’으로 지정해야 함
   * @type {Object}
   */
  style?      : Object;
}



/*
전역 apx
 */
interface APX {
  /**
   * 'Basic Widget'을 생성하기 위해서, 'Text rectangle' Widget 을 기반으로 생성하는 다음 함수를 사용한다.
   * @param  {IWidget} aw
   * @return {IWidget}
   */
  cloneBasicWidget ()                  : IWidget;

  /**
   * 'Container 기반 Widget' 을 생성한다.
   * @param  {IWidget} aw
   * @return {IWidget}
   */
  cloneContainerWidget ()    : IWidget;
}

/*
전역 apd
 */
interface APN {
  widgets                              : APNWidgets;//{[widgetPackageName:string]: IWidget};
  /**
   * 상속
   * @param  {IWidget} aw super class에 해당하는 IWidget객체
   * @return {IWidget}
   */
  inheritWidget(aw:IWidget)             : IWidget;
  Project                               : APNProject;
}

declare class APNWidgets extends Array<IWidget>{
  utils                                 : APNWidgetsUtils;
}

interface APNWidgetsUtils {
  editWidget(moduleObejct: IWidgetObject, editor: EditorScope, n: number, b: boolean, opt: EditorOption);
  // toScreenW(a,b);
  // toScreenH(b,a);
  // setAsOpened(a,b);
  // getBorderUnderlineWeight(a,b);
}

interface APNProject {
  getWidgetModule(IWidgetObejctData)   : IWidget;
  /*
  checkState(a,b);
  checkStateByObjectID(b,a,e,d);
  checkStateType(a);
  checkStateTypeByObjectID(b,a,d);
  createITR(b,g,h,e);
  createNew(b);
  dictateITR(q,f,e,v,z);
  evtCmtForSPT(c,b,d,a);
  findITRs(b,a,d,c);
  findParentOf(e,f,d,b);
  findSPT(b,a,d,c);
  getApxState(d,b,f);
  getDefaultColors(b);
  getEditablePageList(b);
  getExe(b);
  getExeList(b);
  getExeModule(prj,_noDefault);
  getExeModuleID(a,b);
  getExeStateByObjectID(d,a,f);
  getExeStateTitleByObjectID(c,a,e,d);
  getLayout(a);
  getPageTitle(b,a);
  getPageTitles(b,e,d);
  getPages(c,f,e);
  getScreenSize(a);
  getStateByObjectID(c,a,f);
  getStateLayerObjectID(c,a,f,e);
  getStateTitleByObjectID(b,a,e,d);
  getWidgetID(a);
  getWidgetModule(a);
  getWidgetTitleFromLibrary(c,g);
  isWidget(a);
  iterateAllITR(a,d);
  mediaReplaced(c);
  mediaResolve(b,e,d,a);
  publishListAsset(c,e);
  publishListFontFile(b,e,m,c);
  publishListWidget(b);
  resolveProperty(a,b,e);
  resolveStyle(a,c,f,b);
  resolveTiming(a,b);
  resolveTransit(b,a,c);
  setExe(a,b);
  setProperty(a,b,e);
  setScreenSize(b,a,c);
  setStyle(a,b,e);
  verifyITR(d,c,b,e);
  verifyWidgetModule(a);
  */
}

declare enum MediaType {
  Image = 1, Video, Audio
}

/*
edtOnConfig콜백의 인자로 들어오는 apd형태
 */
interface APDScope extends APBase {

  /**
   * apx.widgetsByClass()와 동일하지만 자동으로 ’childOfWidget’방식만 지원함
   * @param  {string} widgetId        위젯 ID
   * @param  {string} widgetModuleId
   * @return {string[]}               위젯ID 합집합 배열
   */
  wgtByClass(widgetId: string, widgetModuleId: string): string[];

  /**
   * apx.widgetsByType()와 동일하지만 자동으로 ’childOfWidget’방식만 지원함
   * @param  {string} widgetId        위젯 ID
   * @param  {string} apxType         apxType
   * @return {string[]}               위젯ID 합집합 배열
   */
  wgtByType(widgetId: string, apxType: string): string[];



  dlgDoModal(width: number, height: number, onOk: () => void): void;

  /**
   * Widget Configuration 을 위한 Modal Popup Dialog 를 생성함. Body 에 해당하는 DIV Tag 가 Return
   * 되므로 그 안에 필요한 화면을 DOM 방식으로 개발하면 된다. OK Button 이 선택될 경우에만 onOK() Callback 이 호출된다.
   * @param  {number} width
   * @param  {number} height
   * @param  {Function}      onOk
   * @param  {Function}      onCancel
   * @return {Tag} Body 에 해당하는 DIV Tag 가 Return
   */
  showDialog(width: number, height: number, onOk?: () => void, onCancel?: () => void): Tag;

  /**
   * Configuration Dialog 에서 Media 를 선택하기 위한 Picker 를 표시하고 선택이 되면 onPick()에 Media Id가 전달된다.
   * @param  {MediaType} mediaType 1=Image, 2=Video, 3=Audio
   * @param  {string}    mediaID   ID, 이미 선택된 값이 있으면 전달함
   * @param  {Function}    onPick    function(mediaId){}, 선택된 것이 없으면 null 이 Return 되므로 Boolean Check 를 하면 됨
   * @return {undefined}
   */
  pickMedia(mediaType: MediaType, mediaID?: string, onPick?: (mediaId: string) => void): void;

  /**
   * Configuration Dialog 에서 Color 를 선택하기 위한 Picker 를 표시하고 선택이 되면 onPick()에 Color 가전달된다.
   * Color 는 ‘#FFFFFF’, ‘rgb(255,255,255)’, ‘rgba(255,255,255,1)’ 형태가 사용됨
   * @param  {Tag} tagInput    Popup Picker 를 출력하기 위한 자리를 파악하기 위한 기준 Tag 이다. 이 Tag 의 좌측 하단에 표시가 된다
   * @param  {string}      curColor
   * @param  {string}      onPickColor function(color){}
   * @return {undefined}
   */
  pickColor(tagInput: Tag, curColor?: string, onPickColor?:(color: string) => void): void;

}

interface APD {
  /**
   * 위젯의 WidgetEvent에 이벤트 타입 정의
   * @param  {IWidgetEvent} event            edtOnBuildEvent의 인자로 넘어오는 값을 활용
   * @param  {string}}      typeDefineObject 이벤트 타입정의된 오브젝트
   * @return {undefined}
   * @example
   * apxWgtSample.edtOnBuildEvent = function(file, oId, pageId, evt){
   * 	apd.useWgtEvent(evt, {ready:'Ready', play:'Play'});
   * }
   */
  useWgtEvent(event: IWidgetEvent, typeDefineObject: {[eventName:string]:string}): void;
}


/*
전역
 */
declare var apn         : APN;
declare var apx         : APX;
declare var apd         : APD;
