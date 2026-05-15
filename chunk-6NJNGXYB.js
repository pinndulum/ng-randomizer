import{O as B,P as G,Q as b,U as W,a as x,ca as tt,d as U,f as k,ga as z,h as E,ha as et,k as H,l as Q,ma as nt,na as it}from"./chunk-6TRUQUDI.js";import{K as M,L as A,N as p,Qb as f,U as C,Y as F,da as N,jb as S,xa as m,ya as L,za as P}from"./chunk-Q7PC3G6F.js";import{a,d as v}from"./chunk-65MYOLBY.js";function ot(i,t,e){let n=Math.max(Math.abs(i-e.left),Math.abs(i-e.right)),s=Math.max(Math.abs(t-e.top),Math.abs(t-e.bottom));return Math.sqrt(n*n+s*s)}var l,D,V,T,Z,st,$,j,Y,rt,y,at,Tt,lt=v(()=>{"use strict";it();f();f();nt();tt();W();et();l=(function(i){return i[i.FADING_IN=0]="FADING_IN",i[i.VISIBLE=1]="VISIBLE",i[i.FADING_OUT=2]="FADING_OUT",i[i.HIDDEN=3]="HIDDEN",i})(l||{}),D=class{_renderer;element;config;_animationForciblyDisabledThroughCss;state=l.HIDDEN;constructor(t,e,n,s=!1){this._renderer=t,this.element=e,this.config=n,this._animationForciblyDisabledThroughCss=s}fadeOut(){this._renderer.fadeOutRipple(this)}},V=b({passive:!0,capture:!0}),T=class{_events=new Map;addHandler(t,e,n,s){let r=this._events.get(e);if(r){let d=r.get(n);d?d.add(s):r.set(n,new Set([s]))}else this._events.set(e,new Map([[n,new Set([s])]])),t.runOutsideAngular(()=>{document.addEventListener(e,this._delegateEventHandler,V)})}removeHandler(t,e,n){let s=this._events.get(t);if(!s)return;let r=s.get(e);r&&(r.delete(n),r.size===0&&s.delete(e),s.size===0&&(this._events.delete(t),document.removeEventListener(t,this._delegateEventHandler,V)))}_delegateEventHandler=t=>{let e=U(t);e&&this._events.get(t.type)?.forEach((n,s)=>{(s===e||s.contains(e))&&n.forEach(r=>r.handleEvent(t))})}},Z={enterDuration:225,exitDuration:150},st=800,$=b({passive:!0,capture:!0}),j=["mousedown","touchstart"],Y=["mouseup","mouseleave","touchend","touchcancel"],rt=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275cmp=m({type:i,selectors:[["ng-component"]],hostAttrs:["mat-ripple-style-loader",""],decls:0,vars:0,template:function(n,s){},styles:[`.mat-ripple {
  overflow: hidden;
  position: relative;
}
.mat-ripple:not(:empty) {
  transform: translateZ(0);
}

.mat-ripple.mat-ripple-unbounded {
  overflow: visible;
}

.mat-ripple-element {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: scale3d(0, 0, 0);
  background-color: var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent));
}
@media (forced-colors: active) {
  .mat-ripple-element {
    display: none;
  }
}
.cdk-drag-preview .mat-ripple-element, .cdk-drag-placeholder .mat-ripple-element {
  display: none;
}
`],encapsulation:2,changeDetection:0})}return i})(),y=class i{_target;_ngZone;_platform;_containerElement;_triggerElement=null;_isPointerDown=!1;_activeRipples=new Map;_mostRecentTransientRipple=null;_lastTouchStartEvent;_pointerUpEventsRegistered=!1;_containerRect=null;static _eventManager=new T;constructor(t,e,n,s,r){this._target=t,this._ngZone=e,this._platform=s,s.isBrowser&&(this._containerElement=E(n)),r&&r.get(k).load(rt)}fadeInRipple(t,e,n={}){let s=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),r=a(a({},Z),n.animation);n.centered&&(t=s.left+s.width/2,e=s.top+s.height/2);let d=n.radius||ot(t,e,s),q=t-s.left,J=e-s.top,u=r.enterDuration,o=document.createElement("div");o.classList.add("mat-ripple-element"),o.style.left=`${q-d}px`,o.style.top=`${J-d}px`,o.style.height=`${d*2}px`,o.style.width=`${d*2}px`,n.color!=null&&(o.style.backgroundColor=n.color),o.style.transitionDuration=`${u}ms`,this._containerElement.appendChild(o);let R=window.getComputedStyle(o),K=R.transitionProperty,I=R.transitionDuration,g=K==="none"||I==="0s"||I==="0s, 0s"||s.width===0&&s.height===0,c=new D(this,o,n,g);o.style.transform="scale3d(1, 1, 1)",c.state=l.FADING_IN,n.persistent||(this._mostRecentTransientRipple=c);let h=null;return!g&&(u||r.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let w=()=>{h&&(h.fallbackTimer=null),clearTimeout(O),this._finishRippleTransition(c)},_=()=>this._destroyRipple(c),O=setTimeout(_,u+100);o.addEventListener("transitionend",w),o.addEventListener("transitioncancel",_),h={onTransitionEnd:w,onTransitionCancel:_,fallbackTimer:O}}),this._activeRipples.set(c,h),(g||!u)&&this._finishRippleTransition(c),c}fadeOutRipple(t){if(t.state===l.FADING_OUT||t.state===l.HIDDEN)return;let e=t.element,n=a(a({},Z),t.config.animation);e.style.transitionDuration=`${n.exitDuration}ms`,e.style.opacity="0",t.state=l.FADING_OUT,(t._animationForciblyDisabledThroughCss||!n.exitDuration)&&this._finishRippleTransition(t)}fadeOutAll(){this._getActiveRipples().forEach(t=>t.fadeOut())}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(t=>{t.config.persistent||t.fadeOut()})}setupTriggerEvents(t){let e=E(t);!this._platform.isBrowser||!e||e===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=e,j.forEach(n=>{i._eventManager.addHandler(this._ngZone,n,e,this)}))}handleEvent(t){t.type==="mousedown"?this._onMousedown(t):t.type==="touchstart"?this._onTouchStart(t):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{Y.forEach(e=>{this._triggerElement.addEventListener(e,this,$)})}),this._pointerUpEventsRegistered=!0)}_finishRippleTransition(t){t.state===l.FADING_IN?this._startFadeOutTransition(t):t.state===l.FADING_OUT&&this._destroyRipple(t)}_startFadeOutTransition(t){let e=t===this._mostRecentTransientRipple,{persistent:n}=t.config;t.state=l.VISIBLE,!n&&(!e||!this._isPointerDown)&&t.fadeOut()}_destroyRipple(t){let e=this._activeRipples.get(t)??null;this._activeRipples.delete(t),this._activeRipples.size||(this._containerRect=null),t===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),t.state=l.HIDDEN,e!==null&&(t.element.removeEventListener("transitionend",e.onTransitionEnd),t.element.removeEventListener("transitioncancel",e.onTransitionCancel),e.fallbackTimer!==null&&clearTimeout(e.fallbackTimer)),t.element.remove()}_onMousedown(t){let e=B(t),n=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+st;!this._target.rippleDisabled&&!e&&!n&&(this._isPointerDown=!0,this.fadeInRipple(t.clientX,t.clientY,this._target.rippleConfig))}_onTouchStart(t){if(!this._target.rippleDisabled&&!G(t)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=!0;let e=t.changedTouches;if(e)for(let n=0;n<e.length;n++)this.fadeInRipple(e[n].clientX,e[n].clientY,this._target.rippleConfig)}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=!1,this._getActiveRipples().forEach(t=>{let e=t.state===l.VISIBLE||t.config.terminateOnPointerUp&&t.state===l.FADING_IN;!t.config.persistent&&e&&t.fadeOut()}))}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let t=this._triggerElement;t&&(j.forEach(e=>i._eventManager.removeHandler(e,t,this)),this._pointerUpEventsRegistered&&(Y.forEach(e=>t.removeEventListener(e,this,$)),this._pointerUpEventsRegistered=!1))}};at=new A("mat-ripple-global-options"),Tt=(()=>{class i{_elementRef=p(N);_animationsDisabled=z();color;unbounded=!1;centered=!1;radius=0;animation;get disabled(){return this._disabled}set disabled(e){e&&this.fadeOutAllNonPersistent(),this._disabled=e,this._setupTriggerEventsIfEnabled()}_disabled=!1;get trigger(){return this._trigger||this._elementRef.nativeElement}set trigger(e){this._trigger=e,this._setupTriggerEventsIfEnabled()}_trigger;_rippleRenderer;_globalOptions;_isInitialized=!1;constructor(){let e=p(F),n=p(x),s=p(at,{optional:!0}),r=p(C);this._globalOptions=s||{},this._rippleRenderer=new y(this,e,this._elementRef,n,r)}ngOnInit(){this._isInitialized=!0,this._setupTriggerEventsIfEnabled()}ngOnDestroy(){this._rippleRenderer._removeTriggerEvents()}fadeOutAll(){this._rippleRenderer.fadeOutAll()}fadeOutAllNonPersistent(){this._rippleRenderer.fadeOutAllNonPersistent()}get rippleConfig(){return{centered:this.centered,radius:this.radius,color:this.color,animation:a(a(a({},this._globalOptions.animation),this._animationsDisabled?{enterDuration:0,exitDuration:0}:{}),this.animation),terminateOnPointerUp:this._globalOptions.terminateOnPointerUp}}get rippleDisabled(){return this.disabled||!!this._globalOptions.disabled}_setupTriggerEventsIfEnabled(){!this.disabled&&this._isInitialized&&this._rippleRenderer.setupTriggerEvents(this.trigger)}launch(e,n=0,s){return typeof e=="number"?this._rippleRenderer.fadeInRipple(e,n,a(a({},this.rippleConfig),s)):this._rippleRenderer.fadeInRipple(0,0,a(a({},this.rippleConfig),e))}static \u0275fac=function(n){return new(n||i)};static \u0275dir=P({type:i,selectors:[["","mat-ripple",""],["","matRipple",""]],hostAttrs:[1,"mat-ripple"],hostVars:2,hostBindings:function(n,s){n&2&&S("mat-ripple-unbounded",s.unbounded)},inputs:{color:[0,"matRippleColor","color"],unbounded:[0,"matRippleUnbounded","unbounded"],centered:[0,"matRippleCentered","centered"],radius:[0,"matRippleRadius","radius"],animation:[0,"matRippleAnimation","animation"],disabled:[0,"matRippleDisabled","disabled"],trigger:[0,"matRippleTrigger","trigger"]},exportAs:["matRipple"]})}return i})()});var It,dt=v(()=>{"use strict";f();It=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275cmp=m({type:i,selectors:[["structural-styles"]],decls:0,vars:0,template:function(n,s){},styles:[`.mat-focus-indicator {
  position: relative;
}
.mat-focus-indicator::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  box-sizing: border-box;
  pointer-events: none;
  display: var(--mat-focus-indicator-display, none);
  border-width: var(--mat-focus-indicator-border-width, 3px);
  border-style: var(--mat-focus-indicator-border-style, solid);
  border-color: var(--mat-focus-indicator-border-color, transparent);
  border-radius: var(--mat-focus-indicator-border-radius, 4px);
}
.mat-focus-indicator:focus-visible::before {
  content: "";
}

@media (forced-colors: active) {
  html {
    --mat-focus-indicator-display: block;
  }
}
`],encapsulation:2,changeDetection:0})}return i})()});var Mt,ct=v(()=>{"use strict";Q();f();Mt=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=L({type:i});static \u0275inj=M({imports:[H]})}return i})()});export{Z as a,y as b,at as c,Tt as d,lt as e,It as f,dt as g,Mt as h,ct as i};
