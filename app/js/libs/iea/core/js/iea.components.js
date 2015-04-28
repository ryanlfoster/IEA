/*global define*/

define('views/accordion/_accordion',[],function() {

    'use strict';

    var Accordion = IEA.module('UI.accordion', function(module, app, IEA) {

        _.extend(module,{

            events: {
                'click a': '_handleClick'
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this.triggerMethod('beforeInit');
                this._super(arguments);
                this.triggerMethod('init');
            },

            /**
            @method render

            @return this
            **/
            render: function() {
                this.triggerMethod('beforeRender');
                this.$el.html(this.template(this.model.toJSON()));
                this.triggerMethod('render', this);

                if (this._isEnabled === false) {
                    this.enable();
                    this._isEnabled = true;
                }
                return this;
            },

            onMatchDesktop: function () {
                // fires on matching desktop
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                this.triggerMethod('beforeEnable');

                /*this.$el.find('.panel-heading').css({
                    'background-color': 'blue'
                });*/

                this.triggerMethod('enable');
            },

            _handleClick: function() {
                this.triggerMethod('click');
            }
        });

    });

    return Accordion;
});

/*global define*/

define('views/adaptive-image/_adaptive-image',[],function() {

    'use strict';

    var AdaptiveImage = IEA.module('UI.adaptive-image', function (module, app, iea) {

        _.extend(module, {

            events: {

            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
				this.triggerMethod('beforeInit');
                this._super(options);
				this.triggerMethod('init');
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
				this.triggerMethod('beforeRender');
                this.$el.html(this.template(this.model.toJSON().data));
				this.triggerMethod('render', this);
				
                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }

                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/
				this.triggerMethod('enable');
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
                // view cleanup code here, anything that needs to be temporarily paused when view is not currently displayed
            }

        });
    });

    return AdaptiveImage;
});

/*global define*/

define('views/breadcrumb/_breadcrumb',[],function() {

    'use strict';

    var Breadcrumb = IEA.module('UI.breadcrumb', function (module, app, iea) {

        _.extend(module, {

            events: {
                'click li>a': '_goToPageLink'
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this.triggerMethod('beforeInit',options);
                this._super(options);
                this.triggerMethod('init', options);
                this._isEnabled= false;
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
                this.triggerMethod('beforeRender', this);
                this.$el.html(this.template(this.model.toJSON().data));
                this.triggerMethod('render', this);

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled= true;
                }

                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/
                // Hook for handling load event
                this.triggerMethod('enable');
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
                // view cleanup code here, anything that needs to be temporarily paused when view is not currently displayed
            },

             /**
            navigates to another page on click

            @method _goToPageLink

            @return {null}
            **/
            _goToPageLink: function (evt) {
                this.triggerMethod('beforeLinkClick');
                window.location.href = $(evt.target).attr('href');
            }
        });
    });

    return Breadcrumb;
});

/**
 * BxSlider v4.1.1 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2013, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
(function(e){var t={};var n={mode:"horizontal",slideSelector:"",infiniteLoop:true,hideControlOnEnd:false,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:false,captions:false,ticker:false,tickerHover:false,adaptiveHeight:false,adaptiveHeightSpeed:500,video:false,useCSS:true,preloadImages:"visible",responsive:true,touchEnabled:true,swipeThreshold:50,oneToOneTouch:true,preventDefaultSwipeX:true,preventDefaultSwipeY:false,pager:true,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:true,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:false,startText:"Start",stopText:"Stop",autoControlsCombine:false,autoControlsSelector:null,auto:false,pause:4e3,autoStart:true,autoDirection:"next",autoHover:false,autoDelay:0,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,onSliderLoad:function(){},onSlideBefore:function(){},onSlideAfter:function(){},onSlideNext:function(){},onSlidePrev:function(){}};e.fn.bxSlider=function(r){if(this.length==0)return this;if(this.length>1){this.each(function(){e(this).bxSlider(r)});return this}var s={};var o=this;t.el=this;var u=e(window).width();var a=e(window).height();var f=function(){s.settings=e.extend({},n,r);s.settings.slideWidth=parseInt(s.settings.slideWidth);s.children=o.children(s.settings.slideSelector);if(s.children.length<s.settings.minSlides)s.settings.minSlides=s.children.length;if(s.children.length<s.settings.maxSlides)s.settings.maxSlides=s.children.length;if(s.settings.randomStart)s.settings.startSlide=Math.floor(Math.random()*s.children.length);s.active={index:s.settings.startSlide};s.carousel=s.settings.minSlides>1||s.settings.maxSlides>1;if(s.carousel)s.settings.preloadImages="all";s.minThreshold=s.settings.minSlides*s.settings.slideWidth+(s.settings.minSlides-1)*s.settings.slideMargin;s.maxThreshold=s.settings.maxSlides*s.settings.slideWidth+(s.settings.maxSlides-1)*s.settings.slideMargin;s.working=false;s.controls={};s.interval=null;s.animProp=s.settings.mode=="vertical"?"top":"left";s.usingCSS=s.settings.useCSS&&s.settings.mode!="fade"&&function(){var e=document.createElement("div");var t=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var n in t){if(e.style[t[n]]!==undefined){s.cssPrefix=t[n].replace("Perspective","").toLowerCase();s.animProp="-"+s.cssPrefix+"-transform";return true}}return false}();if(s.settings.mode=="vertical")s.settings.maxSlides=s.settings.minSlides;o.data("origStyle",o.attr("style"));o.children(s.settings.slideSelector).each(function(){e(this).data("origStyle",e(this).attr("style"))});l()};var l=function(){o.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>');s.viewport=o.parent();s.loader=e('<div class="bx-loading" />');s.viewport.prepend(s.loader);o.css({width:s.settings.mode=="horizontal"?s.children.length*100+215+"%":"auto",position:"relative"});if(s.usingCSS&&s.settings.easing){o.css("-"+s.cssPrefix+"-transition-timing-function",s.settings.easing)}else if(!s.settings.easing){s.settings.easing="swing"}var t=m();s.viewport.css({width:"100%",overflow:"hidden",position:"relative"});s.viewport.parent().css({maxWidth:d()});if(!s.settings.pager){s.viewport.parent().css({margin:"0 auto 0px"})}s.children.css({"float":s.settings.mode=="horizontal"?"left":"none",listStyle:"none",position:"relative"});s.children.css("width",v());if(s.settings.mode=="horizontal"&&s.settings.slideMargin>0)s.children.css("marginRight",s.settings.slideMargin);if(s.settings.mode=="vertical"&&s.settings.slideMargin>0)s.children.css("marginBottom",s.settings.slideMargin);if(s.settings.mode=="fade"){s.children.css({position:"absolute",zIndex:0,display:"none"});s.children.eq(s.settings.startSlide).css({zIndex:50,display:"block"})}s.controls.el=e('<div class="bx-controls" />');if(s.settings.captions)N();s.active.last=s.settings.startSlide==g()-1;if(s.settings.video)o.fitVids();var n=s.children.eq(s.settings.startSlide);if(s.settings.preloadImages=="all")n=s.children;if(!s.settings.ticker){if(s.settings.pager)S();if(s.settings.controls)x();if(s.settings.auto&&s.settings.autoControls)T();if(s.settings.controls||s.settings.autoControls||s.settings.pager)s.viewport.after(s.controls.el)}else{s.settings.pager=false}c(n,h)};var c=function(t,n){var r=t.find("img, iframe").length;if(r==0){n();return}var i=0;t.find("img, iframe").each(function(){e(this).one("load",function(){if(++i==r)n()}).each(function(){if(this.complete)e(this).load()})})};var h=function(){if(s.settings.infiniteLoop&&s.settings.mode!="fade"&&!s.settings.ticker){var t=s.settings.mode=="vertical"?s.settings.minSlides:s.settings.maxSlides;var n=s.children.slice(0,t).clone().addClass("bx-clone");var r=s.children.slice(-t).clone().addClass("bx-clone");o.append(n).prepend(r)}s.loader.remove();b();if(s.settings.mode=="vertical")s.settings.adaptiveHeight=true;s.viewport.height(p());o.redrawSlider();s.settings.onSliderLoad(s.active.index);s.initialized=true;if(s.settings.responsive)e(window).bind("resize",U);if(s.settings.auto&&s.settings.autoStart)H();if(s.settings.ticker)B();if(s.settings.pager)M(s.settings.startSlide);if(s.settings.controls)P();if(s.settings.touchEnabled&&!s.settings.ticker)F()};var p=function(){var t=0;var n=e();if(s.settings.mode!="vertical"&&!s.settings.adaptiveHeight){n=s.children}else{if(!s.carousel){n=s.children.eq(s.active.index)}else{var r=s.settings.moveSlides==1?s.active.index:s.active.index*y();n=s.children.eq(r);for(i=1;i<=s.settings.maxSlides-1;i++){if(r+i>=s.children.length){n=n.add(s.children.eq(i-1))}else{n=n.add(s.children.eq(r+i))}}}}if(s.settings.mode=="vertical"){n.each(function(n){t+=e(this).outerHeight()});if(s.settings.slideMargin>0){t+=s.settings.slideMargin*(s.settings.minSlides-1)}}else{t=Math.max.apply(Math,n.map(function(){return e(this).outerHeight(false)}).get())}return t};var d=function(){var e="100%";if(s.settings.slideWidth>0){if(s.settings.mode=="horizontal"){e=s.settings.maxSlides*s.settings.slideWidth+(s.settings.maxSlides-1)*s.settings.slideMargin}else{e=s.settings.slideWidth}}return e};var v=function(){var e=s.settings.slideWidth;var t=s.viewport.width();if(s.settings.slideWidth==0||s.settings.slideWidth>t&&!s.carousel||s.settings.mode=="vertical"){e=t}else if(s.settings.maxSlides>1&&s.settings.mode=="horizontal"){if(t>s.maxThreshold){}else if(t<s.minThreshold){e=(t-s.settings.slideMargin*(s.settings.minSlides-1))/s.settings.minSlides}}return e};var m=function(){var e=1;if(s.settings.mode=="horizontal"&&s.settings.slideWidth>0){if(s.viewport.width()<s.minThreshold){e=s.settings.minSlides}else if(s.viewport.width()>s.maxThreshold){e=s.settings.maxSlides}else{var t=s.children.first().width();e=Math.floor(s.viewport.width()/t)}}else if(s.settings.mode=="vertical"){e=s.settings.minSlides}return e};var g=function(){var e=0;if(s.settings.moveSlides>0){if(s.settings.infiniteLoop){e=s.children.length/y()}else{var t=0;var n=0;while(t<s.children.length){++e;t=n+m();n+=s.settings.moveSlides<=m()?s.settings.moveSlides:m()}}}else{e=Math.ceil(s.children.length/m())}return e};var y=function(){if(s.settings.moveSlides>0&&s.settings.moveSlides<=m()){return s.settings.moveSlides}return m()};var b=function(){if(s.children.length>s.settings.maxSlides&&s.active.last&&!s.settings.infiniteLoop){if(s.settings.mode=="horizontal"){var e=s.children.last();var t=e.position();w(-(t.left-(s.viewport.width()-e.width())),"reset",0)}else if(s.settings.mode=="vertical"){var n=s.children.length-s.settings.minSlides;var t=s.children.eq(n).position();w(-t.top,"reset",0)}}else{var t=s.children.eq(s.active.index*y()).position();if(s.active.index==g()-1)s.active.last=true;if(t!=undefined){if(s.settings.mode=="horizontal")w(-t.left,"reset",0);else if(s.settings.mode=="vertical")w(-t.top,"reset",0)}}};var w=function(e,t,n,r){if(s.usingCSS){var i=s.settings.mode=="vertical"?"translate3d(0, "+e+"px, 0)":"translate3d("+e+"px, 0, 0)";o.css("-"+s.cssPrefix+"-transition-duration",n/1e3+"s");if(t=="slide"){o.css(s.animProp,i);o.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){o.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");_()})}else if(t=="reset"){o.css(s.animProp,i)}else if(t=="ticker"){o.css("-"+s.cssPrefix+"-transition-timing-function","linear");o.css(s.animProp,i);o.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){o.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");w(r["resetValue"],"reset",0);j()})}}else{var u={};u[s.animProp]=e;if(t=="slide"){o.animate(u,n,s.settings.easing,function(){_()})}else if(t=="reset"){o.css(s.animProp,e)}else if(t=="ticker"){o.animate(u,speed,"linear",function(){w(r["resetValue"],"reset",0);j()})}}};var E=function(){var t="";var n=g();for(var r=0;r<n;r++){var i="";if(s.settings.buildPager&&e.isFunction(s.settings.buildPager)){i=s.settings.buildPager(r);s.pagerEl.addClass("bx-custom-pager")}else{i=r+1;s.pagerEl.addClass("bx-default-pager")}t+='<div class="bx-pager-item"><a href="" data-slide-index="'+r+'" class="bx-pager-link">'+i+"</a></div>"}s.pagerEl.html(t)};var S=function(){if(!s.settings.pagerCustom){s.pagerEl=e('<div class="bx-pager" />');if(s.settings.pagerSelector){e(s.settings.pagerSelector).html(s.pagerEl)}else{s.controls.el.addClass("bx-has-pager").append(s.pagerEl)}E()}else{s.pagerEl=e(s.settings.pagerCustom)}s.pagerEl.delegate("a","click",O)};var x=function(){s.controls.next=e('<a class="bx-next" href="">'+s.settings.nextText+"</a>");s.controls.prev=e('<a class="bx-prev" href="">'+s.settings.prevText+"</a>");s.controls.next.bind("click",C);s.controls.prev.bind("click",k);if(s.settings.nextSelector){e(s.settings.nextSelector).bind("click",C)}if(s.settings.prevSelector){e(s.settings.prevSelector).bind("click",k)}if(!s.settings.nextSelector&&!s.settings.prevSelector){s.controls.directionEl=e('<div class="bx-controls-direction" />');s.controls.directionEl.append(s.controls.prev).append(s.controls.next);s.controls.el.addClass("bx-has-controls-direction").append(s.controls.directionEl)}};var T=function(){s.controls.start=e('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+s.settings.startText+"</a></div>");s.controls.stop=e('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+s.settings.stopText+"</a></div>");s.controls.autoEl=e('<div class="bx-controls-auto" />');s.controls.autoEl.delegate(".bx-start","click",L);s.controls.autoEl.delegate(".bx-stop","click",A);if(s.settings.autoControlsCombine){s.controls.autoEl.append(s.controls.start)}else{s.controls.autoEl.append(s.controls.start).append(s.controls.stop)}if(s.settings.autoControlsSelector){e(s.settings.autoControlsSelector).html(s.controls.autoEl)}else{s.controls.el.addClass("bx-has-controls-auto").append(s.controls.autoEl)}D(s.settings.autoStart?"stop":"start")};var N=function(){s.children.each(function(t){var n=e(this).find("img:first").attr("title");if(n!=undefined&&(""+n).length){e(this).append('<div class="bx-caption"><span>'+n+"</span></div>")}})};var C=function(e){if(s.settings.auto)o.stopAuto();o.goToNextSlide();e.preventDefault()};var k=function(e){if(s.settings.auto)o.stopAuto();o.goToPrevSlide();e.preventDefault()};var L=function(e){o.startAuto();e.preventDefault()};var A=function(e){o.stopAuto();e.preventDefault()};var O=function(t){if(s.settings.auto)o.stopAuto();var n=e(t.currentTarget);var r=parseInt(n.attr("data-slide-index"));if(r!=s.active.index)o.goToSlide(r);t.preventDefault()};var M=function(t){var n=s.children.length;if(s.settings.pagerType=="short"){if(s.settings.maxSlides>1){n=Math.ceil(s.children.length/s.settings.maxSlides)}s.pagerEl.html(t+1+s.settings.pagerShortSeparator+n);return}s.pagerEl.find("a").removeClass("active");s.pagerEl.each(function(n,r){e(r).find("a").eq(t).addClass("active")})};var _=function(){if(s.settings.infiniteLoop){var e="";if(s.active.index==0){e=s.children.eq(0).position()}else if(s.active.index==g()-1&&s.carousel){e=s.children.eq((g()-1)*y()).position()}else if(s.active.index==s.children.length-1){e=s.children.eq(s.children.length-1).position()}if(s.settings.mode=="horizontal"){w(-e.left,"reset",0);}else if(s.settings.mode=="vertical"){w(-e.top,"reset",0);}}s.working=false;s.settings.onSlideAfter(s.children.eq(s.active.index),s.oldIndex,s.active.index)};var D=function(e){if(s.settings.autoControlsCombine){s.controls.autoEl.html(s.controls[e])}else{s.controls.autoEl.find("a").removeClass("active");s.controls.autoEl.find("a:not(.bx-"+e+")").addClass("active")}};var P=function(){if(g()==1){s.controls.prev.addClass("disabled");s.controls.next.addClass("disabled")}else if(!s.settings.infiniteLoop&&s.settings.hideControlOnEnd){if(s.active.index==0){s.controls.prev.addClass("disabled");s.controls.next.removeClass("disabled")}else if(s.active.index==g()-1){s.controls.next.addClass("disabled");s.controls.prev.removeClass("disabled")}else{s.controls.prev.removeClass("disabled");s.controls.next.removeClass("disabled")}}};var H=function(){if(s.settings.autoDelay>0){var e=setTimeout(o.startAuto,s.settings.autoDelay)}else{o.startAuto()}if(s.settings.autoHover){o.hover(function(){if(s.interval){o.stopAuto(true);s.autoPaused=true}},function(){if(s.autoPaused){o.startAuto(true);s.autoPaused=null}})}};var B=function(){var t=0;if(s.settings.autoDirection=="next"){o.append(s.children.clone().addClass("bx-clone"))}else{o.prepend(s.children.clone().addClass("bx-clone"));var n=s.children.first().position();t=s.settings.mode=="horizontal"?-n.left:-n.top}w(t,"reset",0);s.settings.pager=false;s.settings.controls=false;s.settings.autoControls=false;if(s.settings.tickerHover&&!s.usingCSS){s.viewport.hover(function(){o.stop()},function(){var t=0;s.children.each(function(n){t+=s.settings.mode=="horizontal"?e(this).outerWidth(true):e(this).outerHeight(true)});var n=s.settings.speed/t;var r=s.settings.mode=="horizontal"?"left":"top";var i=n*(t-Math.abs(parseInt(o.css(r))));j(i)})}j()};var j=function(e){speed=e?e:s.settings.speed;var t={left:0,top:0};var n={left:0,top:0};if(s.settings.autoDirection=="next"){t=o.find(".bx-clone").first().position()}else{n=s.children.first().position()}var r=s.settings.mode=="horizontal"?-t.left:-t.top;var i=s.settings.mode=="horizontal"?-n.left:-n.top;var u={resetValue:i};w(r,"ticker",speed,u)};var F=function(){s.touch={start:{x:0,y:0},end:{x:0,y:0}};s.viewport.bind("touchstart",I)};var I=function(e){if(s.working){e.preventDefault()}else{s.touch.originalPos=o.position();var t=e.originalEvent;s.touch.start.x=t.changedTouches[0].pageX;s.touch.start.y=t.changedTouches[0].pageY;s.viewport.bind("touchmove",q);s.viewport.bind("touchend",R)}};var q=function(e){var t=e.originalEvent;var n=Math.abs(t.changedTouches[0].pageX-s.touch.start.x);var r=Math.abs(t.changedTouches[0].pageY-s.touch.start.y);if(n*3>r&&s.settings.preventDefaultSwipeX){e.preventDefault()}else if(r*3>n&&s.settings.preventDefaultSwipeY){e.preventDefault()}if(s.settings.mode!="fade"&&s.settings.oneToOneTouch){var i=0;if(s.settings.mode=="horizontal"){var o=t.changedTouches[0].pageX-s.touch.start.x;i=s.touch.originalPos.left+o}else{var o=t.changedTouches[0].pageY-s.touch.start.y;i=s.touch.originalPos.top+o}w(i,"reset",0)}};var R=function(e){s.viewport.unbind("touchmove",q);var t=e.originalEvent;var n=0;s.touch.end.x=t.changedTouches[0].pageX;s.touch.end.y=t.changedTouches[0].pageY;if(s.settings.mode=="fade"){var r=Math.abs(s.touch.start.x-s.touch.end.x);if(r>=s.settings.swipeThreshold){s.touch.start.x>s.touch.end.x?o.goToNextSlide():o.goToPrevSlide();o.stopAuto()}}else{var r=0;if(s.settings.mode=="horizontal"){r=s.touch.end.x-s.touch.start.x;n=s.touch.originalPos.left}else{r=s.touch.end.y-s.touch.start.y;n=s.touch.originalPos.top}if(!s.settings.infiniteLoop&&(s.active.index==0&&r>0||s.active.last&&r<0)){w(n,"reset",200)}else{if(Math.abs(r)>=s.settings.swipeThreshold){r<0?o.goToNextSlide():o.goToPrevSlide();o.stopAuto()}else{w(n,"reset",200)}}}s.viewport.unbind("touchend",R)};var U=function(t){var n=e(window).width();var r=e(window).height();if(u!=n||a!=r){u=n;a=r;o.redrawSlider()}};o.goToSlide=function(t,n){if(s.working||s.active.index==t)return;s.working=true;s.oldIndex=s.active.index;if(t<0){s.active.index=g()-1}else if(t>=g()){s.active.index=0}else{s.active.index=t}s.settings.onSlideBefore(s.children.eq(s.active.index),s.oldIndex,s.active.index);if(n=="next"){s.settings.onSlideNext(s.children.eq(s.active.index),s.oldIndex,s.active.index)}else if(n=="prev"){s.settings.onSlidePrev(s.children.eq(s.active.index),s.oldIndex,s.active.index)}s.active.last=s.active.index>=g()-1;if(s.settings.pager)M(s.active.index);if(s.settings.controls)P();if(s.settings.mode=="fade"){if(s.settings.adaptiveHeight&&s.viewport.height()!=p()){s.viewport.animate({height:p()},s.settings.adaptiveHeightSpeed)}s.children.filter(":visible").fadeOut(s.settings.speed).css({zIndex:0});s.children.eq(s.active.index).css("zIndex",51).fadeIn(s.settings.speed,function(){e(this).css("zIndex",50);_()})}else{if(s.settings.adaptiveHeight&&s.viewport.height()!=p()){s.viewport.animate({height:p()},s.settings.adaptiveHeightSpeed)}var r=0;var i={left:0,top:0};if(!s.settings.infiniteLoop&&s.carousel&&s.active.last){if(s.settings.mode=="horizontal"){var u=s.children.eq(s.children.length-1);i=u.position();r=s.viewport.width()-u.outerWidth()}else{var a=s.children.length-s.settings.minSlides;i=s.children.eq(a).position()}}else if(s.carousel&&s.active.last&&n=="prev"){var f=s.settings.moveSlides==1?s.settings.maxSlides-y():(g()-1)*y()-(s.children.length-s.settings.maxSlides);var u=o.children(".bx-clone").eq(f);i=u.position()}else if(n=="next"&&s.active.index==0){i=o.find("> .bx-clone").eq(s.settings.maxSlides).position();s.active.last=false}else if(t>=0){var l=t*y();i=s.children.eq(l).position()}if("undefined"!==typeof i){var c=s.settings.mode=="horizontal"?-(i.left-r):-i.top;w(c,"slide",s.settings.speed)}}};o.goToNextSlide=function(){if(!s.settings.infiniteLoop&&s.active.last)return;var e=parseInt(s.active.index)+1;o.goToSlide(e,"next")};o.goToPrevSlide=function(){if(!s.settings.infiniteLoop&&s.active.index==0)return;var e=parseInt(s.active.index)-1;o.goToSlide(e,"prev")};o.startAuto=function(e){if(s.interval)return;s.interval=setInterval(function(){s.settings.autoDirection=="next"?o.goToNextSlide():o.goToPrevSlide()},s.settings.pause);if(s.settings.autoControls&&e!=true)D("stop")};o.stopAuto=function(e){if(!s.interval)return;clearInterval(s.interval);s.interval=null;if(s.settings.autoControls&&e!=true)D("start")};o.getCurrentSlide=function(){return s.active.index};o.getSlideCount=function(){return s.children.length};o.redrawSlider=function(){s.children.add(o.find(".bx-clone")).outerWidth(v());s.viewport.css("height",p());if(!s.settings.ticker)b();if(s.active.last)s.active.index=g()-1;if(s.active.index>=g())s.active.last=true;if(s.settings.pager&&!s.settings.pagerCustom){E();M(s.active.index)}};o.destroySlider=function(){if(!s.initialized)return;s.initialized=false;e(".bx-clone",this).remove();s.children.each(function(){e(this).data("origStyle")!=undefined?e(this).attr("style",e(this).data("origStyle")):e(this).removeAttr("style")});e(this).data("origStyle")!=undefined?this.attr("style",e(this).data("origStyle")):e(this).removeAttr("style");e(this).unwrap().unwrap();if(s.controls.el)s.controls.el.remove();if(s.controls.next)s.controls.next.remove();if(s.controls.prev)s.controls.prev.remove();if(s.pagerEl)s.pagerEl.remove();e(".bx-caption",this).remove();if(s.controls.autoEl)s.controls.autoEl.remove();clearInterval(s.interval);if(s.settings.responsive)e(window).unbind("resize",U)};o.reloadSlider=function(e){if(e!=undefined)r=e;o.destroySlider();f()};f();return this}})(jQuery);
define("bxSlider", function(){});

/*
Usage Example

//creating new instance of slider
var  slider = IEA.slider(element, config) // default configuration
or
var  slider = IEA.slider(elemnt, {auto: true}) // initialization with congiruation

// start the carousel
slider.enable();

//public methods
slider.disable();
slider.distroy();
slider.reload(); // just reload with set config
slider.reload({auto: false}); // reload the carousel with new configuration
slider.getCurrentSlide();
slider.getSlideCount();
slider.play();
slider.pause()

//Events
slider:load
slide:before
slide:after
slide:next
slide:prev
*/


define('slider',['underscore',
    'iea',
    'bxSlider'
], function(_,
    iea,
    BXSlider) {
    'use strict';

    IEA.service('slider', function(service, app, iea) {

        /**
         * Slider class
         * @method Slider
         * @param {} options
         * @return ThisExpression
         */
        var Slider = function(options) {
            this.pluginName = 'bxSlider';
            this.isLoaded = false;
            return this;
        };

        // extend abstract Slider into iea Slider to give it more power.
        _.extend(Slider.prototype, {

            /**
             * slider intialize function
             * @method initialize
             * @param {jquery|string} el
             * @param {object} options
             * @return ThisExpression
             */
            initialize: function(el, options) {
                var self = this,
                    defaultSetting = {
                        // carousel settings
                        mode: 'horizontal',
                        speed: 500,
                        slideMargin: 0,
                        startSlide: 0,
                        randomStart: false,
                        slideSelector: '',
                        infiniteLoop: true,
                        hideControlOnEnd: false,
                        easing: 'easeInOutQuint',
                        captions: false,
                        ticker: false,
                        tickerHover: false,
                        adaptiveHeight: false,
                        adaptiveHeightSpeed: 500,
                        video: false,
                        responsive: true,
                        useCSS: true,
                        preloadImages: 'visible',
                        touchEnabled: true,
                        swipeThreshold: 50,
                        oneToOneTouch: true,
                        preventDefaultSwipeX: true,
                        preventDefaultSwipeY: false,

                        // pager settings
                        pager: true,
                        pagerType: 'full',
                        pagerShortSeparator: '/',
                        pagerSelector: '',
                        pagerCustom: null,
                        buildPager: null,

                        // control settings
                        controls: true,
                        nextText: '<i class="icon-arrow-right"></i>',
                        prevText: '<i class="icon-arrow-left"></i>',
                        /*nextSelector: null,
                        prevSelector: null,*/
                        autoControls: false,
                        startText: 'Start',
                        stopText: 'Stop',
                        autoControlsCombine: false,
                        autoControlsSelector: null,

                        auto: true,
                        pause: 4000,
                        autoStart: true,
                        autoDirection: 'next',
                        autoHover: false,
                        autoDelay: 0,
                        minSlides: 1,
                        maxSlides: 1,
                        moveSlides: 0,
                        slideWidth: 0,

                        //Callbacks

                        onSliderLoad: function(currentIndex) {
                            if(!self.isLoaded) {
                                self.triggerMethod('slider:load', currentIndex);
                                self.isLoaded = true;
                            }
                        },
                        onSlideBefore: function($slideElement, oldIndex, newIndex) {
                            self.triggerMethod('slide:before', $slideElement, oldIndex, newIndex);
                        },
                        onSlideAfter: function($slideElement, oldIndex, newIndex) {
                            self.triggerMethod('slide:after', $slideElement, oldIndex, newIndex);
                        },
                        onSlideNext: function($slideElement, oldIndex, newIndex) {
                            self.triggerMethod('slide:next', $slideElement, oldIndex, newIndex);
                        },
                        onSlidePrev: function($slideElement, oldIndex, newIndex) {
                            self.triggerMethod('slide:prev', $slideElement, oldIndex, newIndex);
                        },

                        // custom options
                        thumbnails: true

                    };

                this.options = _.extend(defaultSetting, options);
                this.$el = (el.jquery) ? el : $(el);

                this.pluginMethods = {
                    destroy: 'destroySlider',
                    reload: 'reloadSlider',
                    slideCount: 'getSlideCount',
                    currentSlide: 'getCurrentSlide',
                    goToSlide: 'goToSlide',
                    goToNextSlide: 'goToNextSlide',
                    goToPrevSlide: 'goToPrevSlide',
                    startAuto: 'startAuto',
                    stopAuto: 'stopAuto',
                    redraw: 'redrawSlider'
                };

                return this;
            },

            /**
             * Slider enable
             * @method enable
             * @param {object} options
             * @return ThisExpression
             */
            enable: function(options) {
                if (typeof options === 'object') {
                    this.options = _.extend(this.options, options);
                }

                /*if(this.options.thumbnails) {
                    this.options.pagerCustom = this._createImagePager();
                }*/

                this.instance = this.$el[this.pluginName](this.options);
                this.isSliderEnabled = true;

                //this._registerpluginMethods();
                // /_.extend(this, this.instance);

                return this;
            },

            /**
             * disable slider
             * @method disable
             * @return
             */
            disable: function() {
                this.pause();
            },

            /**
             * destroy slider
             * @method destroy
             * @return
             */
            destroy: function() {
                var self = this;
                if (_.isFunction(this.instance[this.pluginMethods.destroy])) {
                    setTimeout(function() {
                        self.instance[self.pluginMethods.destroy]();
                    }, 100);

                    return true;
                }
            },

            /**
             * reload slider
             * @method reload
             * @return
             */
            reload: function(options) {
                if (typeof options === 'object') {
                    this.options = _.extend(this.options, options);
                }

                if (_.isFunction(this.instance[this.pluginMethods.reload])) {
                    return this.instance[this.pluginMethods.reload](this.options);
                }
            },

            /**
             * get the current slider slide
             * @method getCurrentSlide
             * @return
             */
            getCurrentSlide: function() {
                if (_.isFunction(this.instance[this.pluginMethods.currentSlide])) {
                    return this.instance[this.pluginMethods.currentSlide]();
                }
            },

            /**
             * get slider slide count
             * @method getSlideCount
             * @return
             */
            getSlideCount: function() {
                if (_.isFunction(this.instance[this.pluginMethods.slideCount])) {
                    return this.instance[this.pluginMethods.slideCount]();
                }
            },

            /**
             * go to slide based on index
             * @method goToSlide
             * @return
             */
            goToSlide: function(index) {
                if (_.isFunction(this.instance[this.pluginMethods.goToSlide])) {
                    return this.instance[this.pluginMethods.goToSlide](index);
                }
            },

            /**
             * get correct slide index
             * @method currentSlide
             * @return
             */
            currentSlide: function() {
                if (_.isFunction(this.instance[this.pluginMethods.currentSlide])) {
                    return this.instance[this.pluginMethods.currentSlide]();
                }
            },

            /**
             * play slider
             * @method play
             * @return
             */
            play: function() {
                if (_.isFunction(this.instance[this.pluginMethods.startAuto])) {
                    return this.instance[this.pluginMethods.startAuto]();
                }
            },

            /**
             * pause slider
             * @method pause
             * @return
             */
            pause: function() {
                if (_.isFunction(this.instance[this.pluginMethods.stopAuto])) {
                    return this.instance[this.pluginMethods.stopAuto]();
                }
            },

            /**
             * create pager for slider
             * @method _createImagePager
             * @return
             */
            _createImagePager: function() {

            },

            /**
             * register all the plugin methods into the IEA.slider service
             * @method _registerpluginMethods
             * @return
             */
            _registerpluginMethods: function() {

                for (var method in this.pluginMethods) {
                    _.extend(this, this.instance[method]);
                }
            },

            /**
             * redraw slider
             * @method _redraw
             * @return
             */
            redraw: function() {
                if (_.isFunction(this.instance[this.pluginMethods.redraw])) {
                    return this.instance[this.pluginMethods.redraw]();
                }
            }

        });

        return Slider;
    });
});

(function(c,a){var b={catchMethods:{methodreturn:[],count:0},init:function(g){var f,h,e;if(!g.originalEvent.origin.match(/vimeo/g)){return}if(!g.originalEvent.hasOwnProperty("data")){return}e=c.type(g.originalEvent.data)==="string"?c.parseJSON(g.originalEvent.data):g.originalEvent.data;if(!e){return}f=this.setPlayerID(e);h=this.setVimeoAPIurl(f);if(e.hasOwnProperty("event")){this.handleEvent(e,f,h)}if(e.hasOwnProperty("method")){this.handleMethod(e,f,h)}},setPlayerID:function(e){if(e.hasOwnProperty("player_id")){if(c("#"+e.player_id).length){return c("#"+e.player_id)}else{return c("iframe[src*="+e.player_id+"]")}}else{return c("iframe[src*='vimeo']").eq(0)}},setVimeoAPIurl:function(e){if(e.attr("src").substr(0,4)!=="http"){return a.location.protocol!=="https"?"http:"+e.attr("src").split("?")[0]:"https:"+e.attr("src").split("?")[0]}else{return e.attr("src").split("?")[0]}},handleMethod:function(g,e,f){this.catchMethods.methodreturn.push(g.value)},handleEvent:function(j,f,h){switch(j.event.toLowerCase()){case"ready":for(var k in c._data(f[0],"events")){if(k.match(/loadProgress|playProgress|play|pause|finish|seek|cuechange/)){f[0].contentWindow.postMessage(JSON.stringify({method:"addEventListener",value:k}),h)}}if(f.data("vimeoAPICall")){var e=f.data("vimeoAPICall");for(var g=0;g<e.length;g++){f[0].contentWindow.postMessage(JSON.stringify(e[g].message),e[g].api)}f.removeData("vimeoAPICall")}f.data("vimeoReady",true);f.triggerHandler("ready");break;case"seek":f.triggerHandler("seek",[j.data]);break;case"loadProgress":f.triggerHandler("loadProgress",[j.data]);break;case"playProgress":f.triggerHandler("playProgress",[j.data]);break;case"pause":f.triggerHandler("pause");break;case"finish":f.triggerHandler("finish");break;case"play":f.triggerHandler("play");break;case"cuechange":f.triggerHandler("cuechange");break}}};c(a).on("message",function(d){b.init(d)});c.vimeo=function(f,e,d){var i={},h=b.catchMethods.methodreturn.length;if(typeof e==="string"){i.method=e}if(typeof d!==undefined&&typeof d!=="function"){i.value=d}if(f.prop("tagName").toLowerCase()==="iframe"&&i.hasOwnProperty("method")){if(f.data("vimeoReady")){f[0].contentWindow.postMessage(JSON.stringify(i),b.setVimeoAPIurl(f))}else{var g=f.data("vimeoAPICall")?f.data("vimeoAPICall"):[];g.push({message:i,api:b.setVimeoAPIurl(f)});f.data("vimeoAPICall",g)}}if((e.toString().substr(0,3)==="get"||e.toString()==="paused")&&typeof d==="function"){(function(m,l,k){var j=a.setInterval(function(){if(b.catchMethods.methodreturn.length!=m){a.clearInterval(j);l(b.catchMethods.methodreturn[k])}},10)})(h,d,b.catchMethods.count);b.catchMethods.count++}return f};c.fn.vimeo=function(e,d){return c.vimeo(this,e,d)}})(jQuery,window);
define("vimeoAPI", function(){});

/**
 * jquery.brightcove-video v1.1.0 (Oct 2013)
 * Helps you create custom dynamic solutions that work with the Brightcove Video platform
 * Copyright © 2013 Carmine Olivo (carmineolivo@gmail.com)
 * Released under the (http://co.mit-license.org/) MIT license
 *
 * @requires
 * BrightcoveExperiences (http://admin.brightcove.com/js/BrightcoveExperiences.js)
 * jQuery (http://jquery.com/download/)
 *
 * @note On the Global tab of the player settings editor, under Web
 *       Settings, select Enable ActionScript/JavaScript APIs to enable
 *       the player for JavaScripting
 */
(function( $ ) {
'use strict';
var

    /**
     *
     */
    brightcoveVideo = {

        /**
         *
         */
        init: function( options, createExperiences, debug ) {
            var $that = this;

            if ( typeof brightcove === 'undefined' ) {
                $
                    .ajax({
                            url: 'http://admin.brightcove.com/js/BrightcoveExperiences.js',
                            dataType: 'script',
                            cache: true
                        })
                    .done(function(script, textStatus) {
                            brightcoveVideo.init.call( $that, options, createExperiences, debug );
                        })
                    .fail(function(jqxhr, settings, exception) {
                            if ( debug ) {
                                $.error( 'Failed to load BrightcoveExperiences. (http://admin.brightcove.com/js/BrightcoveExperiences.js)' );
                            }
                        })
                ;
                return this;
            }

            if ( typeof brightcove.JBVData === 'undefined' ) {
                brightcove.JBVData = {
                    onTemplateLoad: { },
                    onTemplateReady: { },
                    onTemplateError: { },
                    countPlayers: 0
                };
            }

            this.each( function() {
                var $container = $( this ),
                    data = $container.data( 'brightcoveVideo' ),
                    usrTemplateLoadHandler,
                    usrTemplateReadyHandler,
                    usrTemplateErrorHandler,
                    playerObject,
                    params;

                // if the player hasn't been initialized yet
                if ( ! data ) {
                    params = $.extend( {
                            /*
                            autoStart: null,
                            bgcolor: null,
                            dynamicStreaming: null,
                            experienceID: null,
                            height: null,
                            playerID: null,
                            playerKey: null,
                            secureConnections: null,
                            templateErrorHandler: null,
                            templateLoadHandler: null,
                            templateReadyHandler: null,
                            url: null,
                            '@videoPlayer': null,
                            width: null,
                            */
                            templateErrorHandler: null,
                            templateLoadHandler: null,
                            templateReadyHandler: null,
                            includeAPI: true,
                            showNoContentMessage: true,
                            isUI: true,
                            isVid: true,
                            wmode: 'transparent'
                        }, options );

                    brightcove.JBVData.onTemplateLoad[ 'player' + brightcove.JBVData.countPlayers ] = function( experienceID ) {
                        data.experienceID = experienceID;
                        data.player = brightcove.api.getExperience( experienceID );
                        if ( data.player ) {
                            data.isSmartPlayer = true;
                        } else {
                            data.player = brightcove.getExperience( experienceID );
                            data.isSmartPlayer = false;
                        }
                        data.videoPlayer = data.player.getModule( brightcove.api.modules.APIModules.VIDEO_PLAYER );
                        data.experience = data.player.getModule( brightcove.api.modules.APIModules.EXPERIENCE );

                        $container.data( 'brightcoveVideo', data );

                        if ( usrTemplateLoadHandler ) {
                            usrTemplateLoadHandler.call( data.container, experienceID );
                        }
                    };

                    brightcove.JBVData.onTemplateReady[ 'player' + brightcove.JBVData.countPlayers ] = function( event ) {
                        if ( usrTemplateReadyHandler ) {
                            usrTemplateReadyHandler.call( data.container, event );
                        }
                    };

                    brightcove.JBVData.onTemplateError[ 'player' + brightcove.JBVData.countPlayers ] = function( event ) {
                        if ( usrTemplateErrorHandler ) {
                            usrTemplateErrorHandler.call( data.container, event );
                        } else if ( debug && console && console.log ) {
                            var err = event.type + ': ' + event.errorType + ' (' + event.code + ') ' + event.info;
                            console.log( err );
                        }
                    };

                    usrTemplateLoadHandler = params.templateLoadHandler;
                    usrTemplateReadyHandler = params.templateReadyHandler;
                    usrTemplateErrorHandler = params.templateErrorHandler;
                    params.templateLoadHandler = 'brightcove.JBVData.onTemplateLoad.player' + brightcove.JBVData.countPlayers;
                    params.templateReadyHandler = 'brightcove.JBVData.onTemplateReady.player' + brightcove.JBVData.countPlayers;
                    params.templateErrorHandler = 'brightcove.JBVData.onTemplateError.player' + brightcove.JBVData.countPlayers;

                    playerObject = createPlayerObject( params );

                    data = {
                        index: brightcove.JBVData.countPlayers++,
                        container: this,
                        playerObject: playerObject,
                        target: $container
                    };
                    $container.data( 'brightcoveVideo', data );

                    $container.html( playerObject );
                }
            } );

            if ( createExperiences != false ) {
                brightcoveVideo.createExperiences( );
            }

            return this;
        },

        /**
         *
         */
        destroy: function() {

            return this.each( function() {
                var $this = $( this ),
                    data = $this.data( 'brightcoveVideo' ),
                    $experience = $( '#' + data.experienceID ),
                    isSmartPlayer = data.isSmartPlayer,
                    experience = data.experience,
                    target = data.target;

                // Namespacing FTW :)
                $( window ).unbind( '.brightcoveVideo' );
                $this.removeData( 'brightcoveVideo' );
                isSmartPlayer || experience.unload( );
                $experience.remove( );
                target.empty( );
            } );

        },

        /**
         *
         */
        createExperiences: function( ) {

            brightcove.createExperiences( );

            return this;
        },

        /**
         * Invokes the callback function with a boolean as to whether the video currently
         * displayed in the video window is playing. If a linear ad is currently playing,
         * this returns the state of the ad.
         *
         * @param {function} callback The callback function to invoke with the player state.
         */
        getIsPlaying: function( callback ) {
            return this.each( function() {
                var data = $( this ).data( 'brightcoveVideo' );
                if ( data.isSmartPlayer ) {
                    data.videoPlayer.getIsPlaying( callback );
                } else {
                    callback.call( this, data.videoPlayer.isPlaying() );
                }
            } );
        },

        /**
         *
         */
        getType: function( callback ) {
            return this.each( function() {
                var data = $( this ).data( 'brightcoveVideo' );
                callback.call( this, data.player.type );
            } );
        },

        /**
         * @param {string} event_name BEGIN, CHANGE, COMPLETE, ERROR, PLAY, PROGRESS, SEEK_NOTIFY, STOP
         */
        onMediaEvent: function( event_name, handler, priority ) {
            return this.each( function() {
                var data = $( this ).data( 'brightcoveVideo' ),
                    events = data.isSmartPlayer ? brightcove.api.events.MediaEvent : BCMediaEvent;

                data.videoPlayer
                    .addEventListener( events[event_name], handler, priority );
            } );
        },

        /**
         * @param {string} event_name TEMPLATE_READY
         */
        onExperienceEvent: function( event_name, handler, priority ) {
            return this.each( function() {
                var data = $( this ).data( 'brightcoveVideo' ),
                    events = data.isSmartPlayer ? brightcove.api.events.ExperienceEvent : BCExperienceEvent;

                data.experience
                    .addEventListener( events[event_name], handler, priority );
            } );
        },

        /**
         * @param {string} event_name CUE
         */
        onCuePointEvent: function( event_name, handler, priority ) {
            return this.each( function() {
                var data = $( this ).data( 'brightcoveVideo' ),
                    events = data.isSmartPlayer ? brightcove.api.events.CuePointEvent : BCCuePointEvent;

                data.videoPlayer
                    .addEventListener( events[event_name], handler, priority );
            } );
        },

        /**
         * Returns a transparent HTML element that is positioned directly on top of the video element.
         */
        overlay: function( html ) {
            var overlays = [ ];

            this.each( function() {
                var $this = $( this ),
                    data = $this.data( 'brightcoveVideo' ),
                    $experience, position, $overlay;

                if ( ! data.overlay ) {
                    $experience = $( '#' + data.experienceID );
                    position = $experience.position( );

                    $overlay = $( '<div />' )
                        .css({
                            position: 'absolute',
                            top: position.top,
                            left: position.left,
                            height: $experience.css( 'height' ),
                            width: $experience.css( 'width' ),
                            margin: $experience.css( 'margin' ),
                            padding: $experience.css( 'padding' ),
                            border: $experience.css( 'border' ),
                            borderColor: 'transparent'
                        })
                        .append( html )
                        .appendTo( $this );

                    data.overlay = $overlay.get( )[ 0 ];
                } else if ( html ) {
                    $( data.overlay ).html( html );
                }

                overlays.push( data.overlay );
            } );

            return this.pushStack( overlays );
        },

        /**
         * Pauses or resumes playback of the current video in the video window.
         *
         * @param {boolean} pause (Passing a true value will pauses the video playback. Passing false will resume playback.)
         */
        pause: function( pause ) {
            return this.each( function() {
                $( this ).data( 'brightcoveVideo' ).videoPlayer
                    .pause( pause );
            } );
        },

        /**
         *
         */
        play: function( ) {
            return this.each( function() {
                $( this ).data( 'brightcoveVideo' ).videoPlayer
                    .play( );
            } );
        },

        /**
         * Seeks to a specified time position in the video.
         *
         * @param {number} time The time in seconds to seek to
         */
        seek: function( time ) {
            return this.each( function() {
                $( this ).data( 'brightcoveVideo' ).videoPlayer
                    .seek( time );
            } );
        },

        /**
         * Sets the pixel dimensions for the experience.
         *
         * @param {number} pixel width to set the experience to
         * @param {number} pixel height to set the experience to
         */
        setSize: function( width, height ) {
            return this.each( function() {
                $( this ).data( 'brightcoveVideo' ).experience
                    .setSize( width, height );
            } );
        }
    },

    /**
     *
     */
    createPlayerObject = function( params ) {
        var $player = $( '<object />' )
                .attr( 'class', 'BrightcoveExperience' );

        if ( params.experienceID !== null ) {
            $player.attr( 'id', params.experienceID );
        }

        $.each( params, function( n, v ) {
            if ( v !== null ) {
                $( '<param />' ).prop({ name: n, value: v }).appendTo( $player );
            }
        });

        return $player;
    };

    $.fn.brightcoveVideo = function( method ) {
        if ( brightcoveVideo[method] ) {
            return brightcoveVideo[ method ].apply( this, Array.prototype.slice.call(arguments, 1) );
        } else if ( typeof method === 'object' || ! method ) {
            return brightcoveVideo.init.apply( this, arguments );
        } else {
            $.error( 'Method ' + method + ' does not exists on jQuery.brightcoveVideo' );
        }
    };

})( jQuery );

define("brightcoveVideo", function(){});

/*

The vedio service is facade for three types of videos Youtube, Brightcove and Viemo
Usage Example

//creating new instance of video
var video = IEA.video(container, config)

//public methods
video.getVideoContainer()
video.getPlayer()
video.play()
video.pause()
video.stop()
video.destroy()
video.restart()
video.seek()
video.resize()

//Events

*/
define('video',[
    'iea',
    'vimeoAPI',
    'brightcoveVideo'

], function(
    IEA,
    VimeoAPI,
    BrightcoveVideo

) {
    'use strict';

    IEA.service('video', function(service, app, iea) {

        // Storing all the video data
        IEA.videoData = (IEA.videoData) ? IEA.videoData : {};

        /**
         * Video class
         * @method Video
         * @param {object} options
         * @return ThisExpression
         */
        var Video = function() {
            return this;
        };

        _.extend(Video.prototype, {

            container: null,
            player: null,
            type: null,
            triggerMethod: IEA.triggerMethod,

            /**
             * Initialization of the service
             * @method initialize
             * @param {} options
             * @param container
             * @return ThisExpression
             */
            initialize: function(container, options) {
                var self = this,
                    defaultSettings = {
                        'autoplay': true,
                        'autohide': true,
                        'controls': false,
                        'loopPlayback': true,
                        'showRelated': true,
                        'allowFullScreen': false,
                        'theme': '',
                        'wmode': 'transparent',
                        'videoId': ''
                    };

                this.options = _.extend(defaultSettings, options);

                this.container = container;

                this.type = this.options.viewType;
                this.type = String(this.type).toLowerCase();

                this.swfControls = false;
                this._configureVideo();
                return this;
            },

            /**
             * This method will return video container
             * @method getVideoContainer
             * @param container
             * @return
             */
            getVideoContainer: function(container) {
                var $wrapper = $('<div class="video-container"></div>');

                if(!container.children().hasClass('video-container')) {
                    container.html($wrapper);
                    return $('.video-container', container);
                } else {
                    return $('.video-container', container);
                }
            },

            /**
             * This method will return player
             * @method player
             * @return MemberExpression
             */
            getPlayer: function() {
                return this.player;
            },

            /**
             * Play the video
             * @method play
             * @return
             */
            play: function() {
                switch (this.type) {
                case 'youtube':
                    if (IEA.videoData[this.options.randomNumber] !== 'undefined' && typeof IEA.videoData[this.options.randomNumber].playerObj.playVideo === 'function') {
                        //this.player.playVideo();
                        IEA.videoData[this.options.randomNumber].playerObj.playVideo();
                    }
                    break;
                case 'vimeo':
                    if (this.isPlayerReady) {
                        this.player.vimeo('play');
                    }

                    //this.player.vimeo('play');
                    break;
                case 'brightcove':

                    if (this.isPlayerReady) {
                        this.$videoNode.brightcoveVideo('play');
                    }
                    break;
                case 'html5':
                    if(this.isPlayerReady) {
                        if(this.swfControls) {
                            this.html5Player.playMedia();
                        } else {
                            this.html5Player.play();
                        }
                    }
                    break;
                }
                this.triggerMethod('video:play', this);
            },

            /**
             * Pause the vedio
             * @method pause
             * @return
             */
            pause: function() {
                switch (this.type) {
                case 'youtube':
                    if (IEA.videoData[this.options.randomNumber] !== 'undefined' && typeof IEA.videoData[this.options.randomNumber].playerObj.pauseVideo === 'function') {
                        //this.player.pauseVideo();
                        IEA.videoData[this.options.randomNumber].playerObj.pauseVideo();
                    }
                    break;
                case 'vimeo':
                    if (this.isPlayerReady) {
                        this.player.vimeo('pause');
                    }
                    break;
                case 'brightcove':
                    if (this.isPlayerReady) {
                        this.$videoNode.brightcoveVideo('pause');
                    }
                    break;
                case 'html5':
                    if(this.isPlayerReady) {
                        if(this.swfControls) {
                            this.html5Player.pauseMedia();
                        } else {
                            this.html5Player.pause();
                        }
                    }
                    break;
                }
                this.triggerMethod('video:pause', this);
            },

            /**
             * Stop the vedio
             * @method stop
             * @return
             */
            stop: function() {
                switch (this.type) {

                case 'youtube':
                    if (IEA.videoData[this.options.randomNumber] !== 'undefined' && typeof IEA.videoData[this.options.randomNumber].playerObj.stopVideo === 'function') {
                        //this.player.stopVideo();
                        IEA.videoData[this.options.randomNumber].playerObj.stopVideo();
                    }
                    break;

                case 'vimeo':
                    if (this.isPlayerReady) {
                        this.player.vimeo('unload');
                    }
                    break;

                case 'brightcove':
                    if (this.isPlayerReady) {
                        this.$videoNode.brightcoveVideo('pause');
                        this.$videoNode.brightcoveVideo('seek', 0);
                    }
                    break;
                case 'html5':
                    if(this.isPlayerReady) {
                        if(this.swfControls) {
                            this.html5Player.stopMedia();
                        } else {
                            this.html5Player.pause();
                            this.html5Player.currentTime = 0;
                        }
                    }
                    break;

                }
                this.triggerMethod('video:stop', this);
            },

            /**
             * Destroy the video's container
             * @method destory
             * @return
             */
            destroy: function() {
                if(this.container) {
                    this.container.html('');
                }
                this.triggerMethod('video:destroy', this);
            },

            /**
             * Restarts the video
             * @method restart
             * @return
             */
            restart: function() {
                this.seek(0);
                this.play();
                this.triggerMethod('video:restart', this);
            },

            /**
             * Resizes the container size
             * @method resize
             * @return
             */
            resize: function(width, height) {
                if(width && height) {
                    if(this.type === 'brightcove') {
                        this.$videoNode.brightcoveVideo('setSize', width, height);
                    } else {
                        $(this.container).css({width: width, height: height});
                    }
                }
                this.triggerMethod('video:resize', this);
            },

            /**
             * Description
             * @method seek
             * @return
             */
            seek: function(seconds) {

                switch (this.type) {
                case 'youtube':
                    if (IEA.videoData[this.options.randomNumber] !== 'undefined' && typeof IEA.videoData[this.options.randomNumber].playerObj.seekTo === 'function') {
                        IEA.videoData[this.options.randomNumber].playerObj.seekTo(seconds);
                    }
                    break;
                case 'vimeo':
                    if (this.isPlayerReady) {
                        this.player.vimeo('seekTo', seconds);
                    }
                    break;
                case 'brightcove':
                    if (this.isPlayerReady) {
                        this.$videoNode.brightcoveVideo('seek', seconds);
                    }
                    break;
                case 'html5':
                    if (this.isPlayerReady) {
                        if(this.swfControls) {
                            this.html5Player.setCurrentTime(seconds);
                        } else {
                            this.html5Player.currentTime = seconds;
                        }
                    }
                    break;
                }
                this.triggerMethod('video:seek', this);
            },

            toggleMute: function() {
                switch (this.type) {
                    case 'html5':
                        if(!this.swfControls) {
                            if (this.html5Player.muted) {
                                this.html5Player.muted = false;
                                this.triggerMethod('video:unmuted', this);
                            } else {
                                this.html5Player.muted = true;
                                this.triggerMethod('video:muted', this);
                            }
                        }
                        break;
                }
            },

            /**
             * ----------------------------------------------------------------------------- *\
             * private Methods
             * \* -----------------------------------------------------------------------------*/

             /**
             * This method is used to configure vidoes
             * @method _configureVideo
             * @return
             */
            _configureVideo: function() {
                var videoType = this.type,
                    self = this,
                    container = this.container;

                switch(videoType) {
                    case 'youtube':
                        IEA.videoData[this.options.randomNumber] = {};
                        IEA.videoData[this.options.randomNumber].playerObj = {options: this.options, container: container};
                        IEA.videoData[this.options.randomNumber].handler = this;
                        this._loadYoutubeVideo();
                        break;

                    case 'brightcove':

                        this.options = _.extend(this.options, {
                            'playerID': app.getValue('brightcovePlayerId'),
                            'playerKey': app.getValue('brightcovePlayerKey')
                        });
                        this._loadBrightcoveVideo();
                        break;

                    case 'vimeo':

                        this._loadVimeoVideo();
                        break;

                    case 'html5':

                        this._loadHtml5Video();
                        break;

                    default:
                }
            },

            /**
             * Description
             * @method _loadYoutubeVideo
             * @return
             */
            _loadYoutubeVideo: function() {
                var self = this;
                if (typeof(YT) === 'undefined' || typeof(YT.Player) === 'undefined') {
                    window.onYouTubePlayerAPIReady = function () {
                        var video = null,
                            key;

                        for(key in IEA.videoData) {
                            video = IEA.videoData[key].playerObj;
                            self._onYtAPIReady.apply(self, [video.options.randomNumber, video.container]);
                        }
                        //IEA.videoData = {};
                    };

                    $.getScript('//www.youtube.com/iframe_api');
                } else {
                    this._onYtAPIReady.apply(this, [this.options.randomNumber, this.container]);
                }

            },

            /**
             * Description
             * @return
             * @method _loadBrightcoveVideo
             * @return
             */
            _loadBrightcoveVideo: function() {
                var config = this.options,
                    $videoNode = this.getVideoContainer(this.container),
                    self = this;

                this.$videoNode = $videoNode;

                $videoNode.brightcoveVideo({
                    'playerID': config.playerID,
                    '@videoPlayer': config.videoId,
                    'autoStart': config.autoplay,

                    'templateReadyHandler': function(evt) {
                        self._onTemplateReady(evt);
                    },
                    templateErrorHandler: function(evt) {
                        self.triggerMethod('brightcove:error', evt);
                    }
                });
            },

            /**
             * Description
             * @return
             * @method _loadHtml5Video
             * @return
             */
            _loadHtml5Video: function() {
                var config = this.options,
                    $videoNode = this.getVideoContainer(this.container),
                    tagName = 'video';

                config.randomNumber = (config.randomNumber) ? config.randomNumber : Math.floor((Math.random() * 100) + 1);

                // check for html5 player
                if(document.createElement(tagName).canPlayType) {
                    this._initHtml5Player(tagName, config);
                } else {
                    // fall back option - flv player
                    this._initFlashPlayer(config);
                }
            },

            /**
             * Description
             * @method _initHtml5Player
             * @return
             */
            _initHtml5Player: function(tagName, config) {
                var videoElement = document.createElement(tagName),
                    $videoNode = this.getVideoContainer(this.container),
                    id = 'videoplayer_' + config.randomNumber,
                    sourceElements = [],
                    videoConfig = {
                        'id': id,
                        'poster':   (config.thumbnailUrl) ? config.thumbnailUrl : (config.fallbackUrl) ? config.fallbackUrl : '',
                        'preload':  'auto',
                    };


                if(typeof config.autoplay !== 'undefined' && config.autoplay) {
                    videoConfig.autoplay = '';
                }

                if(typeof config.showControls !== 'undefined' && config.showControls) {
                    videoConfig.controls = '';
                }

                if(typeof config.loopPlayback !== 'undefined' && config.loopPlayback) {
                    videoConfig.loop = '';
                }

                if(typeof config.audio !== 'undefined' && !config.audio) {
                    videoConfig.muted = '';
                }

                for(var key in videoConfig) {
                    videoElement.setAttribute(key, videoConfig[key]);
                }

                sourceElements.push({src: config.videoFormats.mp4Video, type: 'video/mp4',  codecs: 'avc1.42E01E,mp4a.40.2'});
                sourceElements.push({src: config.videoFormats.oggVideo, type: 'video/ogg',  codecs: 'theora,vorbis'});

                for(var i in sourceElements) {
                    var sourceElement = document.createElement('source');

                    for(var attr in sourceElements[i]) {
                        sourceElement.setAttribute(attr, sourceElements[i][attr]);
                    }

                    videoElement.appendChild(sourceElement);
                }

                $videoNode.append(videoElement);
                this.html5Player = videoElement;
                this.isPlayerReady = true;

                this.triggerMethod('video:loaded', this);

            },

            /**
             * Description
             * @method _initFlashPlayer
             * @return
             */
            _initFlashPlayer: function(config) {
                //randomNumber
                var videoElement = document.createElement('div'),
                    $videoNode = this.getVideoContainer(this.container),
                    src = app.getValue('flashPlayer'),
                    id = 'swfplayer_' + config.randomNumber,
                    playerVars = [
                        'id=' + id,
                        'isvideo=' + true,
                        'autoplay=' + config.autoplay,
                        'preload=' + 'none',
                        'startvolume=' + (config.audio ? '0.8' : '0'),
                        'timerrate=' + '250',
                        'pseudostreamstart=' + 'start',
                        'controls=' + config.showControls,
                        'file=' + config.videoFormats.flvVideo
                    ];
                this.swfControls = true;
                $videoNode.append(videoElement);
                videoElement.outerHTML = '<object type="application/x-shockwave-flash" id="' + id + '" data="' + src + '"' +
                'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab">' +
                '<param name="movie" value="' + src + '" />' +
                '<param name="src" value="' + src + '" />' +
                '<param name="flashvars" value="' + playerVars.join('&amp;') + '" />' +
                '<param name="quality" value="high" />' +
                '<param name="bgcolor" value="#000000" />' +
                '<param name="wmode" value="transparent" />' +
                '<param name="allowScriptAccess" value="always" />' +
                '<param name="allowFullScreen" value="true" />' +
                '<param name="scale" value="default" />' +
                '<img class="video-fallback-image" src="' + config.fallbackUrl + '" alt="' + config.fallbackAlt + '">' +
                '</object>';

                this.html5Player = document.getElementById(id);
                this.isPlayerReady = true;
            },

            /**
             * Description
             * @method _loadVimeoVideo
             * @return
             */
            _loadVimeoVideo: function() {
                var config = this.options,
                    $videoNode = this.getVideoContainer(this.container),
                    self = this,
                    playerSource = '//player.vimeo.com/video/' + config.videoId + '?api=1&player_id=vimeoplayer_' + config.videoId + '&autoplay=' + config.autoplay + '&showcontrols=' + config.showControls + '&loop='+ config.loopPlayback +'&showrelated=' + config.showRelated,
                    vimeoObject = $('<iframe></iframe>').attr({
                        'src': playerSource,
                        'id': 'vimeoplayer_' + config.videoId,
                        'frameborder': 0,
                        'webkitAllowFullScreen': config.allowFullScreen,
                        'mozallowfullscreen': config.allowFullScreen,
                        'allowFullScreen': config.allowFullScreen
                    });

                $videoNode.html(vimeoObject);

                //Listen for messages from the player
                $(window).on('message onmessage', function(evt) {
                    var origin = evt.originalEvent.origin,
                        isVimeo = origin.indexOf('vimeo');
                    if(isVimeo !== -1) {
                        self._onMessageRecievedVimeo(evt, vimeoObject, playerSource);
                    }
                });
                this.triggerMethod('video:loaded', this);
            },

             /**
             * Description
             * @method _onTemplateReady
             * @returnab saile
             */
            _onTemplateReady: function(evt) {
                var self = this;

                this.player = $(this);
                this.isPlayerReady = true;

                this.triggerMethod('brightcove:templateReadyHandler', this.player, evt);

                this.$videoNode.brightcoveVideo('onMediaEvent', 'PLAY', function(evt) {
                    self.triggerMethod('brightcove:play', evt, self.player);
                });
                this.triggerMethod('video:loaded', this);

                this.$videoNode.brightcoveVideo('onMediaEvent', 'STOP', function(evt) {
                    var videoPlayer = self.$videoNode.data('brightcoveVideo').videoPlayer,
                        totalduration, currentPosition;

                    if(self.options.loopPlayback) {
                        videoPlayer.getVideoDuration(true, function(duration) {
                            totalduration = duration;
                            videoPlayer.getVideoPosition(true, function(position) {
                                currentPosition = position;

                                // logic for loop in control goes here because COMPLETE event is called only once
                                if(currentPosition === '00:00' || currentPosition === totalduration) {
                                    self.restart();
                                    self.triggerMethod('brightcove:complete', evt, self.player);
                                }
                            });
                        });
                    }
                });
                this.triggerMethod('video:loaded', this);
            },

            /**
             * Description
             * @method _onTemplateLoad
             * @return
             */
            _onTemplateLoad: function() {
                // body...
            },

            /**
             * Description
             * @method _onYtAPIReady
             * @return
             */
            _onYtAPIReady: function(playerId, container) {
                var self = this;

                if (playerId) {
                    this._loadYoutubeVideoView.apply(this, [playerId, container]);
                } else {
                    _.each(IEA.videoData, function(value, key) {
                        self._loadYoutubeVideoView.apply(self, [key, container]);
                    });
                }
            },

            /**
             * Description
             * @method _loadYoutubeVideoView
             * @return
             */
            _loadYoutubeVideoView: function(key, container) {

                var self = this,
                    videoNode = this.getVideoContainer(container),
                    config = IEA.videoData[key].playerObj.options,
                    player;

                videoNode.html($('<div>').attr('id', key));

                // setTimeout( function() {
                this.player = new YT.Player(key, {
                    videoId: config.videoId,
                    events: {
                        'onReady': function(evt) {
                            IEA.videoData[config.randomNumber].handler.triggerMethod('youtube:onReady', evt, key);
                            IEA.videoData[config.randomNumber].handler.isPlayerReady = true;
                            // IEA.videoData[config.randomNumber].playerObj = evt.target;

                            if(!config.audio) {
                                evt.target.mute();
                            }
                            else {
                                evt.target.unMute();
                            }
                        },

                        'onStateChange': function(evt) {
                            self.triggerMethod('youtube:onStateChange', evt, key);

                            switch (evt.data) {
                            case -1:
                                self.triggerMethod('youtube:unstarted', evt, key);
                                break;
                            case 0:
                                if(config.loopPlayback) {
                                    IEA.videoData[config.randomNumber].handler.restart();
                                }
                                self.triggerMethod('youtube:ended', evt, key);
                                break;
                            case 1:
                                self.triggerMethod('youtube:playing', evt, key);
                                break;
                            case 2:
                                self.triggerMethod('youtube:paused', evt, key);
                                break;
                            case 3:
                                self.triggerMethod('youtube:buffering', evt, key);
                                break;
                            case 5:
                                self.triggerMethod('youtube:videocued', evt, key);
                                break;
                            }
                        },
                        'onError': function(error) {
                            self.triggerMethod('youtube:onError', error);
                        }
                    },
                    playerVars: {
                        'autoplay': config.autoplay,
                        'autohide': config.autohide,
                        'controls': config.showControls ? 1 : 0,
                        'loop': config.loopPlayback ? 1 : 0,
                        'rel': config.showRelated,
                        'fs': false,
                        'theme': config.theme,
                        'wmode': config.wmode,
                    }
                });
                // }, 1000);
                IEA.videoData[config.randomNumber].handler.on('youtube:onReady', function(evt) {
                    IEA.videoData[config.randomNumber].handler.player = evt.target;
                    IEA.videoData[config.randomNumber].handler.isPlayerReady = true;
                    IEA.videoData[config.randomNumber].playerObj = evt.target;
                });
                this.triggerMethod('video:loaded',this);
            },

            /**
             * Description
             * @method _onVideoReady
             * @return
             */
            _onVimeoReady: function() {
                // body...
            },

            /**
             * Description
             * @method _onMessageRecievedVimeo
             * @return
             */
            _onMessageRecievedVimeo: function(evt, vimeoObject, playerSource) {

                var data = evt.originalEvent.data,
                    self = this;

                if(data) {
                    data = JSON.parse(data);
                    switch (data.event) {
                    case 'ready':
                        this.triggerMethod('vimeo:ready', evt, vimeoObject, playerSource);
                        this._post('addEventListener', 'pause', vimeoObject, playerSource);
                        this._post('addEventListener', 'finish', vimeoObject, playerSource);
                        this._post('addEventListener', 'playProgress', vimeoObject, playerSource);
                        if(!this.options.audio) {
                            this._post('setVolume', '0', vimeoObject, playerSource);
                        }
                        else {
                            this._post('setVolume', '1', vimeoObject, playerSource);
                        }

                        this.isPlayerReady = true;
                        this.player = vimeoObject;
                        break;
                    case 'playProgress':
                        this.triggerMethod('vimeo:playProgress', data.event);
                        break;
                    case 'pause':
                        this.triggerMethod('vimeo:pause', data.event);
                        break;
                    case 'finish':
                        this.triggerMethod('vimeo:finish', data.event);
                        break;
                    }

                    this.on('vimeo:ready', function(evt, id) {
                        self.isPlayerReady = true;
                        self.player = id;
                    });
                }

                this.triggerMethod('video:loaded', this);
            },

            /**
             * Description
             * @method _post
             * @return
             */
            _post: function (action, value, player, url) {
                if (url.indexOf('vimeo')) {
                    var data = {
                            method: action
                        },
                        winURL = window.location.protocol + url;

                    if (value) {
                        data.value = value;
                    }

                    if(player[0].contentWindow && player[0].contentWindow.postMessage) {
                        player[0].contentWindow.postMessage(data, winURL);
                    }
                }
            }
        });

        return Video;
    });
});

/*! Magnific Popup - v0.9.9 - 2013-11-15
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2013 Dmitry Semenov; */
(function(e){var t,n,i,o,r,a,s,l="Close",c="BeforeClose",d="AfterClose",u="BeforeAppend",p="MarkupParse",f="Open",m="Change",g="mfp",v="."+g,h="mfp-ready",C="mfp-removing",y="mfp-prevent-close",w=function(){},b=!!window.jQuery,I=e(window),x=function(e,n){t.ev.on(g+e+v,n)},k=function(t,n,i,o){var r=document.createElement("div");return r.className="mfp-"+t,i&&(r.innerHTML=i),o?n&&n.appendChild(r):(r=e(r),n&&r.appendTo(n)),r},T=function(n,i){t.ev.triggerHandler(g+n,i),t.st.callbacks&&(n=n.charAt(0).toLowerCase()+n.slice(1),t.st.callbacks[n]&&t.st.callbacks[n].apply(t,e.isArray(i)?i:[i]))},E=function(n){return n===s&&t.currTemplate.closeBtn||(t.currTemplate.closeBtn=e(t.st.closeMarkup.replace("%title%",t.st.tClose)),s=n),t.currTemplate.closeBtn},_=function(){e.magnificPopup.instance||(t=new w,t.init(),e.magnificPopup.instance=t)},S=function(){var e=document.createElement("p").style,t=["ms","O","Moz","Webkit"];if(void 0!==e.transition)return!0;for(;t.length;)if(t.pop()+"Transition"in e)return!0;return!1};w.prototype={constructor:w,init:function(){var n=navigator.appVersion;t.isIE7=-1!==n.indexOf("MSIE 7."),t.isIE8=-1!==n.indexOf("MSIE 8."),t.isLowIE=t.isIE7||t.isIE8,t.isAndroid=/android/gi.test(n),t.isIOS=/iphone|ipad|ipod/gi.test(n),t.supportsTransition=S(),t.probablyMobile=t.isAndroid||t.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),i=e(document.body),o=e(document),t.popupsCache={}},open:function(n){var i;if(n.isObj===!1){t.items=n.items.toArray(),t.index=0;var r,s=n.items;for(i=0;s.length>i;i++)if(r=s[i],r.parsed&&(r=r.el[0]),r===n.el[0]){t.index=i;break}}else t.items=e.isArray(n.items)?n.items:[n.items],t.index=n.index||0;if(t.isOpen)return t.updateItemHTML(),void 0;t.types=[],a="",t.ev=n.mainEl&&n.mainEl.length?n.mainEl.eq(0):o,n.key?(t.popupsCache[n.key]||(t.popupsCache[n.key]={}),t.currTemplate=t.popupsCache[n.key]):t.currTemplate={},t.st=e.extend(!0,{},e.magnificPopup.defaults,n),t.fixedContentPos="auto"===t.st.fixedContentPos?!t.probablyMobile:t.st.fixedContentPos,t.st.modal&&(t.st.closeOnContentClick=!1,t.st.closeOnBgClick=!1,t.st.showCloseBtn=!1,t.st.enableEscapeKey=!1),t.bgOverlay||(t.bgOverlay=k("bg").on("click"+v,function(){t.close()}),t.wrap=k("wrap").attr("tabindex",-1).on("click"+v,function(e){t._checkIfClose(e.target)&&t.close()}),t.container=k("container",t.wrap)),t.contentContainer=k("content"),t.st.preloader&&(t.preloader=k("preloader",t.container,t.st.tLoading));var l=e.magnificPopup.modules;for(i=0;l.length>i;i++){var c=l[i];c=c.charAt(0).toUpperCase()+c.slice(1),t["init"+c].call(t)}T("BeforeOpen"),t.st.showCloseBtn&&(t.st.closeBtnInside?(x(p,function(e,t,n,i){n.close_replaceWith=E(i.type)}),a+=" mfp-close-btn-in"):t.wrap.append(E())),t.st.alignTop&&(a+=" mfp-align-top"),t.fixedContentPos?t.wrap.css({overflow:t.st.overflowY,overflowX:"hidden",overflowY:t.st.overflowY}):t.wrap.css({top:I.scrollTop(),position:"absolute"}),(t.st.fixedBgPos===!1||"auto"===t.st.fixedBgPos&&!t.fixedContentPos)&&t.bgOverlay.css({height:o.height(),position:"absolute"}),t.st.enableEscapeKey&&o.on("keyup"+v,function(e){27===e.keyCode&&t.close()}),I.on("resize"+v,function(){t.updateSize()}),t.st.closeOnContentClick||(a+=" mfp-auto-cursor"),a&&t.wrap.addClass(a);var d=t.wH=I.height(),u={};if(t.fixedContentPos&&t._hasScrollBar(d)){var m=t._getScrollbarSize();m&&(u.marginRight=m)}t.fixedContentPos&&(t.isIE7?e("body, html").css("overflow","hidden"):u.overflow="hidden");var g=t.st.mainClass;return t.isIE7&&(g+=" mfp-ie7"),g&&t._addClassToMFP(g),t.updateItemHTML(),T("BuildControls"),e("html").css(u),t.bgOverlay.add(t.wrap).prependTo(document.body),t._lastFocusedEl=document.activeElement,setTimeout(function(){t.content?(t._addClassToMFP(h),t._setFocus()):t.bgOverlay.addClass(h),o.on("focusin"+v,t._onFocusIn)},16),t.isOpen=!0,t.updateSize(d),T(f),n},close:function(){t.isOpen&&(T(c),t.isOpen=!1,t.st.removalDelay&&!t.isLowIE&&t.supportsTransition?(t._addClassToMFP(C),setTimeout(function(){t._close()},t.st.removalDelay)):t._close())},_close:function(){T(l);var n=C+" "+h+" ";if(t.bgOverlay.detach(),t.wrap.detach(),t.container.empty(),t.st.mainClass&&(n+=t.st.mainClass+" "),t._removeClassFromMFP(n),t.fixedContentPos){var i={marginRight:""};t.isIE7?e("body, html").css("overflow",""):i.overflow="",e("html").css(i)}o.off("keyup"+v+" focusin"+v),t.ev.off(v),t.wrap.attr("class","mfp-wrap").removeAttr("style"),t.bgOverlay.attr("class","mfp-bg"),t.container.attr("class","mfp-container"),!t.st.showCloseBtn||t.st.closeBtnInside&&t.currTemplate[t.currItem.type]!==!0||t.currTemplate.closeBtn&&t.currTemplate.closeBtn.detach(),t._lastFocusedEl&&e(t._lastFocusedEl).focus(),t.currItem=null,t.content=null,t.currTemplate=null,t.prevHeight=0,T(d)},updateSize:function(e){if(t.isIOS){var n=document.documentElement.clientWidth/window.innerWidth,i=window.innerHeight*n;t.wrap.css("height",i),t.wH=i}else t.wH=e||I.height();t.fixedContentPos||t.wrap.css("height",t.wH),T("Resize")},updateItemHTML:function(){var n=t.items[t.index];t.contentContainer.detach(),t.content&&t.content.detach(),n.parsed||(n=t.parseEl(t.index));var i=n.type;if(T("BeforeChange",[t.currItem?t.currItem.type:"",i]),t.currItem=n,!t.currTemplate[i]){var o=t.st[i]?t.st[i].markup:!1;T("FirstMarkupParse",o),t.currTemplate[i]=o?e(o):!0}r&&r!==n.type&&t.container.removeClass("mfp-"+r+"-holder");var a=t["get"+i.charAt(0).toUpperCase()+i.slice(1)](n,t.currTemplate[i]);t.appendContent(a,i),n.preloaded=!0,T(m,n),r=n.type,t.container.prepend(t.contentContainer),T("AfterChange")},appendContent:function(e,n){t.content=e,e?t.st.showCloseBtn&&t.st.closeBtnInside&&t.currTemplate[n]===!0?t.content.find(".mfp-close").length||t.content.append(E()):t.content=e:t.content="",T(u),t.container.addClass("mfp-"+n+"-holder"),t.contentContainer.append(t.content)},parseEl:function(n){var i=t.items[n],o=i.type;if(i=i.tagName?{el:e(i)}:{data:i,src:i.src},i.el){for(var r=t.types,a=0;r.length>a;a++)if(i.el.hasClass("mfp-"+r[a])){o=r[a];break}i.src=i.el.attr("data-mfp-src"),i.src||(i.src=i.el.attr("href"))}return i.type=o||t.st.type||"inline",i.index=n,i.parsed=!0,t.items[n]=i,T("ElementParse",i),t.items[n]},addGroup:function(e,n){var i=function(i){i.mfpEl=this,t._openClick(i,e,n)};n||(n={});var o="click.magnificPopup";n.mainEl=e,n.items?(n.isObj=!0,e.off(o).on(o,i)):(n.isObj=!1,n.delegate?e.off(o).on(o,n.delegate,i):(n.items=e,e.off(o).on(o,i)))},_openClick:function(n,i,o){var r=void 0!==o.midClick?o.midClick:e.magnificPopup.defaults.midClick;if(r||2!==n.which&&!n.ctrlKey&&!n.metaKey){var a=void 0!==o.disableOn?o.disableOn:e.magnificPopup.defaults.disableOn;if(a)if(e.isFunction(a)){if(!a.call(t))return!0}else if(a>I.width())return!0;n.type&&(n.preventDefault(),t.isOpen&&n.stopPropagation()),o.el=e(n.mfpEl),o.delegate&&(o.items=i.find(o.delegate)),t.open(o)}},updateStatus:function(e,i){if(t.preloader){n!==e&&t.container.removeClass("mfp-s-"+n),i||"loading"!==e||(i=t.st.tLoading);var o={status:e,text:i};T("UpdateStatus",o),e=o.status,i=o.text,t.preloader.html(i),t.preloader.find("a").on("click",function(e){e.stopImmediatePropagation()}),t.container.addClass("mfp-s-"+e),n=e}},_checkIfClose:function(n){if(!e(n).hasClass(y)){var i=t.st.closeOnContentClick,o=t.st.closeOnBgClick;if(i&&o)return!0;if(!t.content||e(n).hasClass("mfp-close")||t.preloader&&n===t.preloader[0])return!0;if(n===t.content[0]||e.contains(t.content[0],n)){if(i)return!0}else if(o&&e.contains(document,n))return!0;return!1}},_addClassToMFP:function(e){t.bgOverlay.addClass(e),t.wrap.addClass(e)},_removeClassFromMFP:function(e){this.bgOverlay.removeClass(e),t.wrap.removeClass(e)},_hasScrollBar:function(e){return(t.isIE7?o.height():document.body.scrollHeight)>(e||I.height())},_setFocus:function(){(t.st.focus?t.content.find(t.st.focus).eq(0):t.wrap).focus()},_onFocusIn:function(n){return n.target===t.wrap[0]||e.contains(t.wrap[0],n.target)?void 0:(t._setFocus(),!1)},_parseMarkup:function(t,n,i){var o;i.data&&(n=e.extend(i.data,n)),T(p,[t,n,i]),e.each(n,function(e,n){if(void 0===n||n===!1)return!0;if(o=e.split("_"),o.length>1){var i=t.find(v+"-"+o[0]);if(i.length>0){var r=o[1];"replaceWith"===r?i[0]!==n[0]&&i.replaceWith(n):"img"===r?i.is("img")?i.attr("src",n):i.replaceWith('<img src="'+n+'" class="'+i.attr("class")+'" />'):i.attr(o[1],n)}}else t.find(v+"-"+e).html(n)})},_getScrollbarSize:function(){if(void 0===t.scrollbarSize){var e=document.createElement("div");e.id="mfp-sbm",e.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(e),t.scrollbarSize=e.offsetWidth-e.clientWidth,document.body.removeChild(e)}return t.scrollbarSize}},e.magnificPopup={instance:null,proto:w.prototype,modules:[],open:function(t,n){return _(),t=t?e.extend(!0,{},t):{},t.isObj=!0,t.index=n||0,this.instance.open(t)},close:function(){return e.magnificPopup.instance&&e.magnificPopup.instance.close()},registerModule:function(t,n){n.options&&(e.magnificPopup.defaults[t]=n.options),e.extend(this.proto,n.proto),this.modules.push(t)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&times;</button>',tClose:"Close (Esc)",tLoading:"Loading..."}},e.fn.magnificPopup=function(n){_();var i=e(this);if("string"==typeof n)if("open"===n){var o,r=b?i.data("magnificPopup"):i[0].magnificPopup,a=parseInt(arguments[1],10)||0;r.items?o=r.items[a]:(o=i,r.delegate&&(o=o.find(r.delegate)),o=o.eq(a)),t._openClick({mfpEl:o},i,r)}else t.isOpen&&t[n].apply(t,Array.prototype.slice.call(arguments,1));else n=e.extend(!0,{},n),b?i.data("magnificPopup",n):i[0].magnificPopup=n,t.addGroup(i,n);return i};var P,O,z,M="inline",B=function(){z&&(O.after(z.addClass(P)).detach(),z=null)};e.magnificPopup.registerModule(M,{options:{hiddenClass:"hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){t.types.push(M),x(l+"."+M,function(){B()})},getInline:function(n,i){if(B(),n.src){var o=t.st.inline,r=e(n.src);if(r.length){var a=r[0].parentNode;a&&a.tagName&&(O||(P=o.hiddenClass,O=k(P),P="mfp-"+P),z=r.after(O).detach().removeClass(P)),t.updateStatus("ready")}else t.updateStatus("error",o.tNotFound),r=e("<div>");return n.inlineElement=r,r}return t.updateStatus("ready"),t._parseMarkup(i,{},n),i}}});var F,H="ajax",L=function(){F&&i.removeClass(F)},A=function(){L(),t.req&&t.req.abort()};e.magnificPopup.registerModule(H,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){t.types.push(H),F=t.st.ajax.cursor,x(l+"."+H,A),x("BeforeChange."+H,A)},getAjax:function(n){F&&i.addClass(F),t.updateStatus("loading");var o=e.extend({url:n.src,success:function(i,o,r){var a={data:i,xhr:r};T("ParseAjax",a),t.appendContent(e(a.data),H),n.finished=!0,L(),t._setFocus(),setTimeout(function(){t.wrap.addClass(h)},16),t.updateStatus("ready"),T("AjaxContentAdded")},error:function(){L(),n.finished=n.loadError=!0,t.updateStatus("error",t.st.ajax.tError.replace("%url%",n.src))}},t.st.ajax.settings);return t.req=e.ajax(o),""}}});var j,N=function(n){if(n.data&&void 0!==n.data.title)return n.data.title;var i=t.st.image.titleSrc;if(i){if(e.isFunction(i))return i.call(t,n);if(n.el)return n.el.attr(i)||""}return""};e.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var e=t.st.image,n=".image";t.types.push("image"),x(f+n,function(){"image"===t.currItem.type&&e.cursor&&i.addClass(e.cursor)}),x(l+n,function(){e.cursor&&i.removeClass(e.cursor),I.off("resize"+v)}),x("Resize"+n,t.resizeImage),t.isLowIE&&x("AfterChange",t.resizeImage)},resizeImage:function(){var e=t.currItem;if(e&&e.img&&t.st.image.verticalFit){var n=0;t.isLowIE&&(n=parseInt(e.img.css("padding-top"),10)+parseInt(e.img.css("padding-bottom"),10)),e.img.css("max-height",t.wH-n)}},_onImageHasSize:function(e){e.img&&(e.hasSize=!0,j&&clearInterval(j),e.isCheckingImgSize=!1,T("ImageHasSize",e),e.imgHidden&&(t.content&&t.content.removeClass("mfp-loading"),e.imgHidden=!1))},findImageSize:function(e){var n=0,i=e.img[0],o=function(r){j&&clearInterval(j),j=setInterval(function(){return i.naturalWidth>0?(t._onImageHasSize(e),void 0):(n>200&&clearInterval(j),n++,3===n?o(10):40===n?o(50):100===n&&o(500),void 0)},r)};o(1)},getImage:function(n,i){var o=0,r=function(){n&&(n.img[0].complete?(n.img.off(".mfploader"),n===t.currItem&&(t._onImageHasSize(n),t.updateStatus("ready")),n.hasSize=!0,n.loaded=!0,T("ImageLoadComplete")):(o++,200>o?setTimeout(r,100):a()))},a=function(){n&&(n.img.off(".mfploader"),n===t.currItem&&(t._onImageHasSize(n),t.updateStatus("error",s.tError.replace("%url%",n.src))),n.hasSize=!0,n.loaded=!0,n.loadError=!0)},s=t.st.image,l=i.find(".mfp-img");if(l.length){var c=document.createElement("img");c.className="mfp-img",n.img=e(c).on("load.mfploader",r).on("error.mfploader",a),c.src=n.src,l.is("img")&&(n.img=n.img.clone()),n.img[0].naturalWidth>0&&(n.hasSize=!0)}return t._parseMarkup(i,{title:N(n),img_replaceWith:n.img},n),t.resizeImage(),n.hasSize?(j&&clearInterval(j),n.loadError?(i.addClass("mfp-loading"),t.updateStatus("error",s.tError.replace("%url%",n.src))):(i.removeClass("mfp-loading"),t.updateStatus("ready")),i):(t.updateStatus("loading"),n.loading=!0,n.hasSize||(n.imgHidden=!0,i.addClass("mfp-loading"),t.findImageSize(n)),i)}}});var W,R=function(){return void 0===W&&(W=void 0!==document.createElement("p").style.MozTransform),W};e.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(e){return e.is("img")?e:e.find("img")}},proto:{initZoom:function(){var e,n=t.st.zoom,i=".zoom";if(n.enabled&&t.supportsTransition){var o,r,a=n.duration,s=function(e){var t=e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),i="all "+n.duration/1e3+"s "+n.easing,o={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},r="transition";return o["-webkit-"+r]=o["-moz-"+r]=o["-o-"+r]=o[r]=i,t.css(o),t},d=function(){t.content.css("visibility","visible")};x("BuildControls"+i,function(){if(t._allowZoom()){if(clearTimeout(o),t.content.css("visibility","hidden"),e=t._getItemToZoom(),!e)return d(),void 0;r=s(e),r.css(t._getOffset()),t.wrap.append(r),o=setTimeout(function(){r.css(t._getOffset(!0)),o=setTimeout(function(){d(),setTimeout(function(){r.remove(),e=r=null,T("ZoomAnimationEnded")},16)},a)},16)}}),x(c+i,function(){if(t._allowZoom()){if(clearTimeout(o),t.st.removalDelay=a,!e){if(e=t._getItemToZoom(),!e)return;r=s(e)}r.css(t._getOffset(!0)),t.wrap.append(r),t.content.css("visibility","hidden"),setTimeout(function(){r.css(t._getOffset())},16)}}),x(l+i,function(){t._allowZoom()&&(d(),r&&r.remove(),e=null)})}},_allowZoom:function(){return"image"===t.currItem.type},_getItemToZoom:function(){return t.currItem.hasSize?t.currItem.img:!1},_getOffset:function(n){var i;i=n?t.currItem.img:t.st.zoom.opener(t.currItem.el||t.currItem);var o=i.offset(),r=parseInt(i.css("padding-top"),10),a=parseInt(i.css("padding-bottom"),10);o.top-=e(window).scrollTop()-r;var s={width:i.width(),height:(b?i.innerHeight():i[0].offsetHeight)-a-r};return R()?s["-moz-transform"]=s.transform="translate("+o.left+"px,"+o.top+"px)":(s.left=o.left,s.top=o.top),s}}});var Z="iframe",q="//about:blank",D=function(e){if(t.currTemplate[Z]){var n=t.currTemplate[Z].find("iframe");n.length&&(e||(n[0].src=q),t.isIE8&&n.css("display",e?"block":"none"))}};e.magnificPopup.registerModule(Z,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){t.types.push(Z),x("BeforeChange",function(e,t,n){t!==n&&(t===Z?D():n===Z&&D(!0))}),x(l+"."+Z,function(){D()})},getIframe:function(n,i){var o=n.src,r=t.st.iframe;e.each(r.patterns,function(){return o.indexOf(this.index)>-1?(this.id&&(o="string"==typeof this.id?o.substr(o.lastIndexOf(this.id)+this.id.length,o.length):this.id.call(this,o)),o=this.src.replace("%id%",o),!1):void 0});var a={};return r.srcAction&&(a[r.srcAction]=o),t._parseMarkup(i,a,n),t.updateStatus("ready"),i}}});var K=function(e){var n=t.items.length;return e>n-1?e-n:0>e?n+e:e},Y=function(e,t,n){return e.replace(/%curr%/gi,t+1).replace(/%total%/gi,n)};e.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var n=t.st.gallery,i=".mfp-gallery",r=Boolean(e.fn.mfpFastClick);return t.direction=!0,n&&n.enabled?(a+=" mfp-gallery",x(f+i,function(){n.navigateByImgClick&&t.wrap.on("click"+i,".mfp-img",function(){return t.items.length>1?(t.next(),!1):void 0}),o.on("keydown"+i,function(e){37===e.keyCode?t.prev():39===e.keyCode&&t.next()})}),x("UpdateStatus"+i,function(e,n){n.text&&(n.text=Y(n.text,t.currItem.index,t.items.length))}),x(p+i,function(e,i,o,r){var a=t.items.length;o.counter=a>1?Y(n.tCounter,r.index,a):""}),x("BuildControls"+i,function(){if(t.items.length>1&&n.arrows&&!t.arrowLeft){var i=n.arrowMarkup,o=t.arrowLeft=e(i.replace(/%title%/gi,n.tPrev).replace(/%dir%/gi,"left")).addClass(y),a=t.arrowRight=e(i.replace(/%title%/gi,n.tNext).replace(/%dir%/gi,"right")).addClass(y),s=r?"mfpFastClick":"click";o[s](function(){t.prev()}),a[s](function(){t.next()}),t.isIE7&&(k("b",o[0],!1,!0),k("a",o[0],!1,!0),k("b",a[0],!1,!0),k("a",a[0],!1,!0)),t.container.append(o.add(a))}}),x(m+i,function(){t._preloadTimeout&&clearTimeout(t._preloadTimeout),t._preloadTimeout=setTimeout(function(){t.preloadNearbyImages(),t._preloadTimeout=null},16)}),x(l+i,function(){o.off(i),t.wrap.off("click"+i),t.arrowLeft&&r&&t.arrowLeft.add(t.arrowRight).destroyMfpFastClick(),t.arrowRight=t.arrowLeft=null}),void 0):!1},next:function(){t.direction=!0,t.index=K(t.index+1),t.updateItemHTML()},prev:function(){t.direction=!1,t.index=K(t.index-1),t.updateItemHTML()},goTo:function(e){t.direction=e>=t.index,t.index=e,t.updateItemHTML()},preloadNearbyImages:function(){var e,n=t.st.gallery.preload,i=Math.min(n[0],t.items.length),o=Math.min(n[1],t.items.length);for(e=1;(t.direction?o:i)>=e;e++)t._preloadItem(t.index+e);for(e=1;(t.direction?i:o)>=e;e++)t._preloadItem(t.index-e)},_preloadItem:function(n){if(n=K(n),!t.items[n].preloaded){var i=t.items[n];i.parsed||(i=t.parseEl(n)),T("LazyLoad",i),"image"===i.type&&(i.img=e('<img class="mfp-img" />').on("load.mfploader",function(){i.hasSize=!0}).on("error.mfploader",function(){i.hasSize=!0,i.loadError=!0,T("LazyLoadError",i)}).attr("src",i.src)),i.preloaded=!0}}}});var U="retina";e.magnificPopup.registerModule(U,{options:{replaceSrc:function(e){return e.src.replace(/\.\w+$/,function(e){return"@2x"+e})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var e=t.st.retina,n=e.ratio;n=isNaN(n)?n():n,n>1&&(x("ImageHasSize."+U,function(e,t){t.img.css({"max-width":t.img[0].naturalWidth/n,width:"100%"})}),x("ElementParse."+U,function(t,i){i.src=e.replaceSrc(i,n)}))}}}}),function(){var t=1e3,n="ontouchstart"in window,i=function(){I.off("touchmove"+r+" touchend"+r)},o="mfpFastClick",r="."+o;e.fn.mfpFastClick=function(o){return e(this).each(function(){var a,s=e(this);if(n){var l,c,d,u,p,f;s.on("touchstart"+r,function(e){u=!1,f=1,p=e.originalEvent?e.originalEvent.touches[0]:e.touches[0],c=p.clientX,d=p.clientY,I.on("touchmove"+r,function(e){p=e.originalEvent?e.originalEvent.touches:e.touches,f=p.length,p=p[0],(Math.abs(p.clientX-c)>10||Math.abs(p.clientY-d)>10)&&(u=!0,i())}).on("touchend"+r,function(e){i(),u||f>1||(a=!0,e.preventDefault(),clearTimeout(l),l=setTimeout(function(){a=!1},t),o())})})}s.on("click"+r,function(){a||o()})})},e.fn.destroyMfpFastClick=function(){e(this).off("touchstart"+r+" click"+r),n&&I.off("touchmove"+r+" touchend"+r)}}(),_()})(window.jQuery||window.Zepto);
define("magnificPopup", function(){});

/*

Usage Example

// create new instance for popup
var popup = IEA.popup() // default configuraion
or
var popup = IEA.popup({type:inline}) // intialization with configuration

// open popup image
popup.open("http://path/to/image/jpg","image");

// open popup inline content
popup.open($('element'),'inline');

// open poup with IEA Model
var model = IEA.model([
      {
        src: 'path-to-image-1.jpg'
      },
      {
        src: 'http://vimeo.com/123123',
        type: 'iframe' // this overrides default type
      },
      {
        src: $('<div>Dynamically created element</div>'), // Dynamically created element
        type: 'inline'
      },
      {
        src: '<div>HTML string</div>',
        type: 'inline'
      },
      {
        src: '#my-popup', // CSS selector of an element on page that should be used as a popup
        type: 'inline'
      }
    ])
popup.open(model);

// close popup
popup.close();

//events
popup:open
popup:close
*/

define('popup',['underscore',
    'iea',
    'magnificPopup'
], function(_,
    iea,
    MagnificPopup) {
    'use strict';

    // get a new service method reference to Popup.
    IEA.service('popup', function(service, app, iea) {

        // new popup class defenition

        /**
         * Description
         * @method Popup
         * @return ThisExpression
         */
        var Popup = function() {
            return this;
        };

        // extend Popup defenition prototype
        _.extend(Popup.prototype, {

            /**
             * Description
             * @method initialize
             * @param {} options
             * @return ThisExpression
             */
            initialize: function(options) {

                var self = this,
                    defaults = {
                        type: 'inline',
                        mainClass: 'iea-popup',
                        closeOnBgClick: true,
                        closeBtnInside: true,
                        closeMarkup: '<button title="%title%" class="mfp-close"><i class="mfp-close-icn icon-close-light">&times;</i></button>',
                        showCloseBtn: true,
                        enableEscapeKey: true,
                        modal: false,
                        fixedContentPos: 'auto',
                        midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
                        ajax: {
                            settings: null, // Ajax settings object that will extend default one - http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings
                            // For example:
                            // settings: {cache:false, async:false}

                            cursor: 'mfp-ajax-cur', // CSS class that will be added to body during the loading (adds "progress" cursor)
                        },
                        iframe: {
                            markup: '<div class="mfp-iframe-scaler">'+
                                    '<button class="mfp-close"><i class="mfp-close-icn icon-close-light"></i></button>'+
                                    '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                                    '<div class="mfp-title">Some caption</div>'+
                                    '</div>'
                        },
                        // you may add other options here, e.g.:
                        preloader: true,

                        callbacks: {
                            beforeOpen: function () {
                                self.triggerMethod('popup:beforeOpen', self.instance);
                            },
                            open: function() {
                                // Attaching close button event
                                $('.mfp-close', self.instance.container).click(function() {
                                    self.close();
                                });
                                self.triggerMethod('popup:open', self.instance);
                            },
                            close: function() {
                                self.triggerMethod('popup:close', self.instance);
                            },
                            lazyLoad: function(item) {
                                self.triggerMethod('popup:lazyload', item, self.instance);
                            },
                            change: function (item) {
                                self.triggerMethod('popup:change', item, self.instance);
                            },
                            resize: function (item) {
                                self.triggerMethod('popup:resize', item, self.instance);
                            },
                            beforeClose: function (item) {
                                self.triggerMethod('popup:beforeClose', item, self.instance);
                            },
                            afterClose: function (item) {
                                self.triggerMethod('popup:afterClose', item, self.instance);
                            },
                            buildControls: function() {
                                // re-appends controls inside the main container
                                if(self.options.type === 'gallery') {
                                    this.contentContainer.append(this.arrowLeft.add(this.arrowRight));
                                }
                            },
                            markupParse: function(template, values, item) {
                                //values.title = item.el.attr('title');
                            }
                        }
                    };

                if(typeof options !== 'undefined' && typeof options.type !== 'undefined' && options.type === 'gallery') {
                    defaults = _.extend(defaults, {
                        gallery: {
                            enabled: true, // set to true to enable gallery
                            preload: [1, 2], // read about this option in next Lazy-loading section
                            navigateByImgClick: true,
                            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-prevent-close %dir%"><i class="icon-arrow-%dir% mfp-prevent-close"></i></button>', // markup of an arrow button
                            tPrev: 'Previous (Left arrow key)', // title for left button
                            tNext: 'Next (Right arrow key)', // title for right button
                            tCounter: '<span class="mfp-counter">%curr% of %total%</span>' // markup of counter
                        }
                    });
                }

                this.options = _.extend(defaults, options);
                this.instance = $.magnificPopup.instance;

                return this;
            },

            /**
             * Description
             * @method open
             * @param {} el
             * @param {} type
             * @param {} options
             * @return ThisExpression
             */
            open: function(el, type, options) {
                var index = 0;

                // close currently open popup
                if(typeof this.instance !== 'undefined' && this.instance.isOpen) {
                    $.magnificPopup.instance.close();
                }

                // setup configuration and open the popup
                if(typeof el !== 'undefined') {
                    if(!isNaN(parseInt(el))) {
                        index = el;
                    } else {
                        this._setPopupData(el, type, options);
                    }
                }

                $.magnificPopup.open(this.options, index);

                this.instance = $.magnificPopup.instance;

                return this;
            },

            /**
             * Description
             * @method next
             * @return
             */
            next: function () {
                this.instance = $.magnificPopup.instance;
                if(this.instance.isOpen) {
                    this.instance.next();
                }
            },

            /**
             * Description
             * @method prev
             * @return
             */
            prev: function () {
                this.instance = $.magnificPopup.instance;
                if(this.instance.isOpen) {
                    this.instance.prev();
                }
            },

            /**
             * Description
             * @method getCurrentItem
             * @return
             */
            getCurrentItem: function () {
                this.instance = $.magnificPopup.instance;
                if(this.instance.isOpen) {
                    return this.instance.currItem;
                }
            },

            /**
             * Description
             * @method getCurrentItemIndex
             * @return
             */
            getCurrentItemIndex: function () {
                this.instance = $.magnificPopup.instance;
                if(this.instance.isOpen) {
                    return this.instance.index;
                }
            },

            /**
             * Description
             * @method goTo
             * @param {} index
             * @return
             */
            goTo: function (index) {
                this.instance = $.magnificPopup.instance;
                if(!this.instance.isOpen) {
                    this.open(index);
                } else {
                    this.instance.goTo(index);
                }

            },

            /**
             * Description
             * @method close
             * @return ThisExpression
             */
            close: function() {
                this.instance = $.magnificPopup.instance;
                if(typeof this.instance !== 'undefined') {
                    this.instance.close();
                }

                return this;
            },


             /* ----------------------------------------------------------------------------- *\
                 Private Methods
             \* ----------------------------------------------------------------------------- */

             /**
             * description
             * @method _setPopupData
             * @param {} el
             * @param {} type
             * @param {} options
             * @return
             */
            _setPopupData: function(el, type, options) {

                if (typeof type === 'undefined') {
                    type = 'inline';
                }

                if (_.isArray(el)) {
                    _.extend(this.options, {
                        items: el,
                        gallery: {
                            enabled: true
                        }
                    });

                } else if (el instanceof IEA.Model || el instanceof IEA.Collection) {
                    _.extend(this.options, {
                        items: el.toJSON(),
                        gallery: {
                            enabled: true
                        }
                    });

                } else if (el instanceof IEA.View) {
                    _.extend(this.options, {
                        items: {
                            src: el.render().$el,
                            type: type
                        }
                    });
                } else if (type === 'inline') {
                    _.extend(this.options, {
                        items: {
                            src: el,
                            type: type
                        }
                    });
                } else if (type === 'image') {
                    _.extend(this.options, {
                        items: {
                            src: el,
                            type: type
                        }
                    });
                }

                this.options = _.extend(this.options, options);
            }
        });

        return Popup;
    });
});

/*global define*/

define('views/carousel/_carousel',[
    'slider',
    'video',
    'popup',
    'brightcoveVideo'
], function(
    Slider,
    Video,
    Popup,
    BrightcoveVideo) {

    'use strict';

    var Carousel = IEA.module('UI.carousel', function(module, app, iea) {

        _.extend(module, {
            slider: null,
            playerObj: {},
            isYoutubeVideoReadyforFirstTime: false,
            isVimeoVideoReadyforFirstTime: false,
            isBrightcoveVideoReadyforFirstTime: false,
            isVideoLoaded: false,
            isSliderLoaded: false,
            defaultSettings: {
                controls: true,
                auto: false,
                pager: false,
                infiniteLoop: false,
                autoControls: true,
                adaptiveHeight: false,
                video: false
            },
            events: {
                'click li': 'stopRotation'
            },

            videoInstances: {},

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

                /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this._super(options);
                this.triggerMethod('init');
            },

            /**
            @method render

            @return Carousel
            **/
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled = true;
                }
                this.triggerMethod('render');

                return this;

            },

            /**
            enable function for the component
            @method enable
            @return {null}
            **/
            enable: function() {
                var $carouselContainer = this.$el.find('.iea-carousel'),
                    config = this._carouselInitialization(this.model.get('data'));

                this.carouselId = this.model.get('data').randomNumber;

                this.slideCollection = new IEA.Collection(this.model.get('data').carousel.slides);

                this.$el.css('overflow', 'hidden');
                $carouselContainer.css('width', 99999+'px');
                this.$el.find('li').css('float', 'left');

                this.slider = IEA.slider($carouselContainer, config);

                if(this.slideCollection.length > 1 && !this.isSliderLoaded) {
                    this.slider.on('slide:after', $.proxy(this._onSliderAfter, this));
                    this.slider.on('slider:load', $.proxy(this.loadCarouselVideos, this));
                    this.slider.enable();
                    this.isSliderLoaded = true;
                } else {
                    this.loadCarouselVideos();
                }

                this.triggerMethod('enable');
            },

            destroy: function() {
                if(this.slider) {
                    this.slider.destroy();
                    this.isSliderLoaded = false;
                    this.isVideoLoaded = false;
                }
            },

            reload: function() {
                this.slider.reload();
            },

            getCurrentSlide: function() {
                if(this.isSliderLoaded) {
                    return this.slider.getCurrentSlide();
                }

                return false;
            },

            getSlideCount: function() {
                if(this.isSliderLoaded) {
                    return this.slider.getSlideCount();
                }

                return false;
            },

            play: function() {
                if(this.isSliderLoaded) {
                    this.slider.play();
                }
            },

            pause: function() {
                if(this.isSliderLoaded) {
                    this.slider.pause();
                }
            },

            goToSlide: function(index) {
                if(this.isSliderLoaded) {
                    this.slider.goToSlide(index);
                }
            },

            loadCarouselVideos: function(){
                var slideCount = this.slideCollection.length,
                    videoConfig, videoNode,
                    self = this;

                //timeout added just to minimize conflict between inline video and carousel video
                setTimeout(function(){
                    if(!self.isVideoLoaded) {
                        for (var i = 0; i < slideCount; i++) {
                            videoConfig = self.slideCollection[i].panel.video;
                            if(videoConfig){
                                // TODO: Get a better selector
                                videoNode = self.slider.$el.children().not('.bx-clone').filter(':eq('+i+')');
                                self.renderVideo(videoNode, videoConfig, i);
                            }
                        }

                        self.isVideoLoaded = true;
                    }
                }, 100);
            },

            renderVideo: function(node, config, slideIndex) {
                var self = this,
                    customConfig = config,
                    container = $(node).find('.video-frame'),
                    videoObj = this.slideCollection[slideIndex].panel.video;

                videoObj.baseConfig = {
                    autoPlay: config.autoPlay
                };

                // For embedded video passing autoplay false as default
                if (customConfig.displayOption !== 'Overlay') {
                    // setting the embedded carousel videos as autoplay as false.
                    customConfig.autoPlay = 'false';
                }
                // append carouselId in randomNumber to avoid panel conflict
                customConfig.randomNumber = 'video_' + this.carouselId + '_' + customConfig.randomNumber;

                //Add video instance in slide collection
                if(customConfig.displayOption === 'Overlay') {

                    videoObj.$overlayLink = $(node).find('a.video-overlay'),
                    videoObj.$close = $(node).find('button.mfp-close'),
                    videoObj.container = $(container).parents('.video-content');

                    videoObj.popup = new IEA.popup({
                        type: 'inline',
                        preloader: false,
                        callbacks: {
                            beforeOpen: function() {
                                self._initializeVideo(slideIndex, videoObj.container, customConfig);
                                self.slider.pause();
                            },
                            open: function() {
                                var $close = $('button.mfp-close', '.video-content');

                                $close.on('click', function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    videoObj.popup.close();
                                });
                            },
                            close: function(){
                                videoObj.instance.destroy();
                            }
                        }
                    });

                    videoObj.$overlayLink.off('click.popup').on('click.popup', function(){
                        videoObj.popup.open(videoObj.container);
                    });

                    videoObj.$close.on('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        videoObj.popup.close();
                    });
                } else {
                    this._initializeVideo(slideIndex, container, customConfig);
                }
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
                this.isYoutubeVideoReadyforFirstTime = false;
                this.isVimeoVideoReadyforFirstTime = false;
                this.isBrightcoveVideoReadyforFirstTime = false;
            },

            /**
            handle vcartousel click

            @method stopRotation

            @return {null}
            **/
            stopRotation: function(evt) {
                if(this.isSliderLoaded) {
                    this.slider.pause();
                }
            },

            startRotation: function(evt) {
                if(this.isSliderLoaded) {
                    this.slider.play();
                }
            },

            /**
            @method _carouselInitialization

            @return {null}
            **/
            _carouselInitialization: function(data) {
                var configuration = this.defaultSettings,
                    slideCount = this.$el.find('.iea-carousel li').length,
                    intervalsOfRotation = parseInt(data.carousel.intervalsOfRotation) * 1000;

                if (intervalsOfRotation >= 1000) {
                    if (slideCount > 1) {
                        configuration = $.extend(configuration, {
                            pause: intervalsOfRotation,
                            auto: true,
                            pager: true,
                            infiniteLoop: true
                        });
                    }
                } else {
                    if (slideCount > 1) {
                        configuration = $.extend(configuration, {
                            auto: false,
                            pager: true,
                            infiniteLoop: true
                        });
                    }
                }

                return configuration;
            },

            _onSliderAfter: function(elem, previousIndex, currentIndex){

                var slideCollection = this.slideCollection,
                currentSlide = slideCollection[currentIndex].panel,
                previousSlide = slideCollection[previousIndex].panel;

                if(currentSlide.video && currentSlide.video.displayOption !== 'Overlay' && currentSlide.video.baseConfig.autoPlay === 'true'){
                    this.slider.pause();
                    //this.videoInstances[currentIndex].instance.play();
                    currentSlide.video.instance.play();
                }

                if(previousSlide.video && previousSlide.video.displayOption !== 'Overlay'){

                    previousSlide.video.instance.pause();
                }

                // also publish an event from here which can be overridden for specific functionality
            },

                        /**
            * This method is used to intialize video using Video Service and handling its events
            */
            _initializeVideo: function(slideIndex, container, customConfig) {
                var self = this,
                    videoObj = this.slideCollection[slideIndex].panel.video;

                videoObj.instance = IEA.video(container, customConfig);

                // Subscribe to Youtube event and store player events
                videoObj.instance.on('youtube:onReady', function(evt, playerId){
                    self.playerObj[playerId] = evt;
                    if(!self.isYoutubeVideoReadyforFirstTime) {
                        //Reload the slider after video is ready
                        self.slider.reload();
                        self.isYoutubeVideoReadyforFirstTime = true;
                    }
                });

                // Subscribe to Vimeo event and store
                videoObj.instance.on('vimeo:ready', function(evt, vimeoObject, playerSource){
                    self.playerObj[slideIndex] = {
                        event: evt,
                        obj: vimeoObject,
                        src: playerSource
                    };
                    if(!self.isVimeoVideoReadyforFirstTime) {
                        //Reload the slider after video is ready
                        self.slider.reload();
                        self.isVimeoVideoReadyforFirstTime = true;
                    }
                });

                videoObj.instance.on('brightcove:templateReadyHandler', function(player, evt){
                    self.playerObj[slideIndex] = player;
                    if(!self.isBrightcoveVideoReadyforFirstTime) {
                        //Reload the slider after video is ready
                        self.slider.reload();
                        self.isBrightcoveVideoReadyforFirstTime = true;
                    }
                });
            }
        });

    });

    return Carousel;
});

/*
  backbone.paginator 2.0.0
  http://github.com/backbone-paginator/backbone.paginator

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/

(function (factory) {

  // CommonJS
  if (typeof exports == "object") {
    module.exports = factory(require("underscore"), require("backbone"));
  }
  // AMD
  else if (typeof define == "function" && define.amd) {
    define('paginator',["underscore", "backbone"], factory);
  }
  // Browser
  else if (typeof _ !== "undefined" && typeof Backbone !== "undefined") {
    var oldPageableCollection = Backbone.PageableCollection;
    var PageableCollection = factory(_, Backbone);

    /**
       __BROWSER ONLY__

       If you already have an object named `PageableCollection` attached to the
       `Backbone` module, you can use this to return a local reference to this
       Backbone.PageableCollection class and reset the name
       Backbone.PageableCollection to its previous definition.

           // The left hand side gives you a reference to this
           // Backbone.PageableCollection implementation, the right hand side
           // resets Backbone.PageableCollection to your other
           // Backbone.PageableCollection.
           var PageableCollection = Backbone.PageableCollection.noConflict();

       @static
       @member Backbone.PageableCollection
       @return {Backbone.PageableCollection}
    */
    Backbone.PageableCollection.noConflict = function () {
      Backbone.PageableCollection = oldPageableCollection;
      return PageableCollection;
    };
  }

}(function (_, Backbone) {

  "use strict";

  var _extend = _.extend;
  var _omit = _.omit;
  var _clone = _.clone;
  var _each = _.each;
  var _pick = _.pick;
  var _contains = _.contains;
  var _isEmpty = _.isEmpty;
  var _pairs = _.pairs;
  var _invert = _.invert;
  var _isArray = _.isArray;
  var _isFunction = _.isFunction;
  var _isObject = _.isObject;
  var _keys = _.keys;
  var _isUndefined = _.isUndefined;
  var ceil = Math.ceil;
  var floor = Math.floor;
  var max = Math.max;

  var BBColProto = Backbone.Collection.prototype;

  function finiteInt (val, name) {
    if (!_.isNumber(val) || _.isNaN(val) || !_.isFinite(val) || ~~val !== val) {
      throw new TypeError("`" + name + "` must be a finite integer");
    }
    return val;
  }

  function queryStringToParams (qs) {
    var kvp, k, v, ls, params = {}, decode = decodeURIComponent;
    var kvps = qs.split('&');
    for (var i = 0, l = kvps.length; i < l; i++) {
      var param = kvps[i];
      kvp = param.split('='), k = kvp[0], v = kvp[1] || true;
      k = decode(k), v = decode(v), ls = params[k];
      if (_isArray(ls)) ls.push(v);
      else if (ls) params[k] = [ls, v];
      else params[k] = v;
    }
    return params;
  }

  // hack to make sure the whatever event handlers for this event is run
  // before func is, and the event handlers that func will trigger.
  function runOnceAtLastHandler (col, event, func) {
    var eventHandlers = col._events[event];
    if (eventHandlers && eventHandlers.length) {
      var lastHandler = eventHandlers[eventHandlers.length - 1];
      var oldCallback = lastHandler.callback;
      lastHandler.callback = function () {
        try {
          oldCallback.apply(this, arguments);
          func();
        }
        catch (e) {
          throw e;
        }
        finally {
          lastHandler.callback = oldCallback;
        }
      };
    }
    else func();
  }

  var PARAM_TRIM_RE = /[\s'"]/g;
  var URL_TRIM_RE = /[<>\s'"]/g;

  /**
     Drop-in replacement for Backbone.Collection. Supports server-side and
     client-side pagination and sorting. Client-side mode also support fully
     multi-directional synchronization of changes between pages.

     @class Backbone.PageableCollection
     @extends Backbone.Collection
  */
  var PageableCollection = Backbone.PageableCollection = Backbone.Collection.extend({

    /**
       The container object to store all pagination states.

       You can override the default state by extending this class or specifying
       them in an `options` hash to the constructor.

       @property {Object} state

       @property {0|1} [state.firstPage=1] The first page index. Set to 0 if
       your server API uses 0-based indices. You should only override this value
       during extension, initialization or reset by the server after
       fetching. This value should be read only at other times.

       @property {number} [state.lastPage=null] The last page index. This value
       is __read only__ and it's calculated based on whether `firstPage` is 0 or
       1, during bootstrapping, fetching and resetting. Please don't change this
       value under any circumstances.

       @property {number} [state.currentPage=null] The current page index. You
       should only override this value during extension, initialization or reset
       by the server after fetching. This value should be read only at other
       times. Can be a 0-based or 1-based index, depending on whether
       `firstPage` is 0 or 1. If left as default, it will be set to `firstPage`
       on initialization.

       @property {number} [state.pageSize=25] How many records to show per
       page. This value is __read only__ after initialization, if you want to
       change the page size after initialization, you must call #setPageSize.

       @property {number} [state.totalPages=null] How many pages there are. This
       value is __read only__ and it is calculated from `totalRecords`.

       @property {number} [state.totalRecords=null] How many records there
       are. This value is __required__ under server mode. This value is optional
       for client mode as the number will be the same as the number of models
       during bootstrapping and during fetching, either supplied by the server
       in the metadata, or calculated from the size of the response.

       @property {string} [state.sortKey=null] The model attribute to use for
       sorting.

       @property {-1|0|1} [state.order=-1] The order to use for sorting. Specify
       -1 for ascending order or 1 for descending order. If 0, no client side
       sorting will be done and the order query parameter will not be sent to
       the server during a fetch.
    */
    state: {
      firstPage: 1,
      lastPage: null,
      currentPage: null,
      pageSize: 25,
      totalPages: null,
      totalRecords: null,
      sortKey: null,
      order: -1
    },

    /**
       @property {"server"|"client"|"infinite"} [mode="server"] The mode of
       operations for this collection. `"server"` paginates on the server-side,
       `"client"` paginates on the client-side and `"infinite"` paginates on the
       server-side for APIs that do not support `totalRecords`.
    */
    mode: "server",

    /**
       A translation map to convert Backbone.PageableCollection state attributes
       to the query parameters accepted by your server API.

       You can override the default state by extending this class or specifying
       them in `options.queryParams` object hash to the constructor.

       @property {Object} queryParams
       @property {string} [queryParams.currentPage="page"]
       @property {string} [queryParams.pageSize="per_page"]
       @property {string} [queryParams.totalPages="total_pages"]
       @property {string} [queryParams.totalRecords="total_entries"]
       @property {string} [queryParams.sortKey="sort_by"]
       @property {string} [queryParams.order="order"]
       @property {string} [queryParams.directions={"-1": "asc", "1": "desc"}] A
       map for translating a Backbone.PageableCollection#state.order constant to
       the ones your server API accepts.
    */
    queryParams: {
      currentPage: "page",
      pageSize: "per_page",
      totalPages: "total_pages",
      totalRecords: "total_entries",
      sortKey: "sort_by",
      order: "order",
      directions: {
        "-1": "asc",
        "1": "desc"
      }
    },

    /**
       __CLIENT MODE ONLY__

       This collection is the internal storage for the bootstrapped or fetched
       models. You can use this if you want to operate on all the pages.

       @property {Backbone.Collection} fullCollection
    */

    /**
       Given a list of models or model attributues, bootstraps the full
       collection in client mode or infinite mode, or just the page you want in
       server mode.

       If you want to initialize a collection to a different state than the
       default, you can specify them in `options.state`. Any state parameters
       supplied will be merged with the default. If you want to change the
       default mapping from #state keys to your server API's query parameter
       names, you can specifiy an object hash in `option.queryParams`. Likewise,
       any mapping provided will be merged with the default. Lastly, all
       Backbone.Collection constructor options are also accepted.

       See:

       - Backbone.PageableCollection#state
       - Backbone.PageableCollection#queryParams
       - [Backbone.Collection#initialize](http://backbonejs.org/#Collection-constructor)

       @param {Array.<Object>} [models]

       @param {Object} [options]

       @param {function(*, *): number} [options.comparator] If specified, this
       comparator is set to the current page under server mode, or the #fullCollection
       otherwise.

       @param {boolean} [options.full] If `false` and either a
       `options.comparator` or `sortKey` is defined, the comparator is attached
       to the current page. Default is `true` under client or infinite mode and
       the comparator will be attached to the #fullCollection.

       @param {Object} [options.state] The state attributes overriding the defaults.

       @param {string} [options.state.sortKey] The model attribute to use for
       sorting. If specified instead of `options.comparator`, a comparator will
       be automatically created using this value, and optionally a sorting order
       specified in `options.state.order`. The comparator is then attached to
       the new collection instance.

       @param {-1|1} [options.state.order] The order to use for sorting. Specify
       -1 for ascending order and 1 for descending order.

       @param {Object} [options.queryParam]
    */
    constructor: function (models, options) {

      BBColProto.constructor.apply(this, arguments);

      options = options || {};

      var mode = this.mode = options.mode || this.mode || PageableProto.mode;

      var queryParams = _extend({}, PageableProto.queryParams, this.queryParams,
                                options.queryParams || {});

      queryParams.directions = _extend({},
                                       PageableProto.queryParams.directions,
                                       this.queryParams.directions,
                                       queryParams.directions || {});

      this.queryParams = queryParams;

      var state = this.state = _extend({}, PageableProto.state, this.state,
                                       options.state || {});

      state.currentPage = state.currentPage == null ?
        state.firstPage :
        state.currentPage;

      if (!_isArray(models)) models = models ? [models] : [];
      models = models.slice();

      if (mode != "server" && state.totalRecords == null && !_isEmpty(models)) {
        state.totalRecords = models.length;
      }

      this.switchMode(mode, _extend({fetch: false,
                                     resetState: false,
                                     models: models}, options));

      var comparator = options.comparator;

      if (state.sortKey && !comparator) {
        this.setSorting(state.sortKey, state.order, options);
      }

      if (mode != "server") {
        var fullCollection = this.fullCollection;

        if (comparator && options.full) {
          this.comparator = null;
          fullCollection.comparator = comparator;
        }

        if (options.full) fullCollection.sort();

        // make sure the models in the current page and full collection have the
        // same references
        if (models && !_isEmpty(models)) {
          this.reset(models, _extend({silent: true}, options));
          this.getPage(state.currentPage);
          models.splice.apply(models, [0, models.length].concat(this.models));
        }
      }

      this._initState = _clone(this.state);
    },

    /**
       Makes a Backbone.Collection that contains all the pages.

       @private
       @param {Array.<Object|Backbone.Model>} models
       @param {Object} options Options for Backbone.Collection constructor.
       @return {Backbone.Collection}
    */
    _makeFullCollection: function (models, options) {

      var properties = ["url", "model", "sync", "comparator"];
      var thisProto = this.constructor.prototype;
      var i, length, prop;

      var proto = {};
      for (i = 0, length = properties.length; i < length; i++) {
        prop = properties[i];
        if (!_isUndefined(thisProto[prop])) {
          proto[prop] = thisProto[prop];
        }
      }

      var fullCollection = new (Backbone.Collection.extend(proto))(models, options);

      for (i = 0, length = properties.length; i < length; i++) {
        prop = properties[i];
        if (this[prop] !== thisProto[prop]) {
          fullCollection[prop] = this[prop];
        }
      }

      return fullCollection;
    },

    /**
       Factory method that returns a Backbone event handler that responses to
       the `add`, `remove`, `reset`, and the `sort` events. The returned event
       handler will synchronize the current page collection and the full
       collection's models.

       @private

       @param {Backbone.PageableCollection} pageCol
       @param {Backbone.Collection} fullCol

       @return {function(string, Backbone.Model, Backbone.Collection, Object)}
       Collection event handler
    */
    _makeCollectionEventHandler: function (pageCol, fullCol) {

      return function collectionEventHandler (event, model, collection, options) {

        var handlers = pageCol._handlers;
        _each(_keys(handlers), function (event) {
          var handler = handlers[event];
          pageCol.off(event, handler);
          fullCol.off(event, handler);
        });

        var state = _clone(pageCol.state);
        var firstPage = state.firstPage;
        var currentPage = firstPage === 0 ?
          state.currentPage :
          state.currentPage - 1;
        var pageSize = state.pageSize;
        var pageStart = currentPage * pageSize, pageEnd = pageStart + pageSize;

        if (event == "add") {
          var pageIndex, fullIndex, addAt, colToAdd, options = options || {};
          if (collection == fullCol) {
            fullIndex = fullCol.indexOf(model);
            if (fullIndex >= pageStart && fullIndex < pageEnd) {
              colToAdd = pageCol;
              pageIndex = addAt = fullIndex - pageStart;
            }
          }
          else {
            pageIndex = pageCol.indexOf(model);
            fullIndex = pageStart + pageIndex;
            colToAdd = fullCol;
            var addAt = !_isUndefined(options.at) ?
              options.at + pageStart :
              fullIndex;
          }

          if (!options.onRemove) {
            ++state.totalRecords;
            delete options.onRemove;
          }

          pageCol.state = pageCol._checkState(state);

          if (colToAdd) {
            colToAdd.add(model, _extend({}, options || {}, {at: addAt}));
            var modelToRemove = pageIndex >= pageSize ?
              model :
              !_isUndefined(options.at) && addAt < pageEnd && pageCol.length > pageSize ?
              pageCol.at(pageSize) :
              null;
            if (modelToRemove) {
              runOnceAtLastHandler(collection, event, function () {
                pageCol.remove(modelToRemove, {onAdd: true});
              });
            }
          }
        }

        // remove the model from the other collection as well
        if (event == "remove") {
          if (!options.onAdd) {
            // decrement totalRecords and update totalPages and lastPage
            if (!--state.totalRecords) {
              state.totalRecords = null;
              state.totalPages = null;
            }
            else {
              var totalPages = state.totalPages = ceil(state.totalRecords / pageSize);
              state.lastPage = firstPage === 0 ? totalPages - 1 : totalPages || firstPage;
              if (state.currentPage > totalPages) state.currentPage = state.lastPage;
            }
            pageCol.state = pageCol._checkState(state);

            var nextModel, removedIndex = options.index;
            if (collection == pageCol) {
              if (nextModel = fullCol.at(pageEnd)) {
                runOnceAtLastHandler(pageCol, event, function () {
                  pageCol.push(nextModel, {onRemove: true});
                });
              }
              else if (!pageCol.length && state.totalRecords) {
                pageCol.reset(fullCol.models.slice(pageStart - pageSize, pageEnd - pageSize),
                              _extend({}, options, {parse: false}));
              }
              fullCol.remove(model);
            }
            else if (removedIndex >= pageStart && removedIndex < pageEnd) {
              if (nextModel = fullCol.at(pageEnd - 1)) {
                runOnceAtLastHandler(pageCol, event, function() {
                  pageCol.push(nextModel, {onRemove: true});
                });
              }
              pageCol.remove(model);
              if (!pageCol.length && state.totalRecords) {
                pageCol.reset(fullCol.models.slice(pageStart - pageSize, pageEnd - pageSize),
                              _extend({}, options, {parse: false}));
              }
            }
          }
          else delete options.onAdd;
        }

        if (event == "reset") {
          options = collection;
          collection = model;

          // Reset that's not a result of getPage
          if (collection == pageCol && options.from == null &&
              options.to == null) {
            var head = fullCol.models.slice(0, pageStart);
            var tail = fullCol.models.slice(pageStart + pageCol.models.length);
            fullCol.reset(head.concat(pageCol.models).concat(tail), options);
          }
          else if (collection == fullCol) {
            if (!(state.totalRecords = fullCol.models.length)) {
              state.totalRecords = null;
              state.totalPages = null;
            }
            if (pageCol.mode == "client") {
              state.lastPage = state.currentPage = state.firstPage;
            }
            pageCol.state = pageCol._checkState(state);
            pageCol.reset(fullCol.models.slice(pageStart, pageEnd),
                          _extend({}, options, {parse: false}));
          }
        }

        if (event == "sort") {
          options = collection;
          collection = model;
          if (collection === fullCol) {
            pageCol.reset(fullCol.models.slice(pageStart, pageEnd),
                          _extend({}, options, {parse: false}));
          }
        }

        _each(_keys(handlers), function (event) {
          var handler = handlers[event];
          _each([pageCol, fullCol], function (col) {
            col.on(event, handler);
            var callbacks = col._events[event] || [];
            callbacks.unshift(callbacks.pop());
          });
        });
      };
    },

    /**
       Sanity check this collection's pagination states. Only perform checks
       when all the required pagination state values are defined and not null.
       If `totalPages` is undefined or null, it is set to `totalRecords` /
       `pageSize`. `lastPage` is set according to whether `firstPage` is 0 or 1
       when no error occurs.

       @private

       @throws {TypeError} If `totalRecords`, `pageSize`, `currentPage` or
       `firstPage` is not a finite integer.

       @throws {RangeError} If `pageSize`, `currentPage` or `firstPage` is out
       of bounds.

       @return {Object} Returns the `state` object if no error was found.
    */
    _checkState: function (state) {

      var mode = this.mode;
      var links = this.links;
      var totalRecords = state.totalRecords;
      var pageSize = state.pageSize;
      var currentPage = state.currentPage;
      var firstPage = state.firstPage;
      var totalPages = state.totalPages;

      if (totalRecords != null && pageSize != null && currentPage != null &&
          firstPage != null && (mode == "infinite" ? links : true)) {

        totalRecords = finiteInt(totalRecords, "totalRecords");
        pageSize = finiteInt(pageSize, "pageSize");
        currentPage = finiteInt(currentPage, "currentPage");
        firstPage = finiteInt(firstPage, "firstPage");

        if (pageSize < 1) {
          throw new RangeError("`pageSize` must be >= 1");
        }

        totalPages = state.totalPages = ceil(totalRecords / pageSize);

        if (firstPage < 0 || firstPage > 1) {
          throw new RangeError("`firstPage must be 0 or 1`");
        }

        state.lastPage = firstPage === 0 ? max(0, totalPages - 1) : totalPages || firstPage;

        if (mode == "infinite") {
          if (!links[currentPage + '']) {
            throw new RangeError("No link found for page " + currentPage);
          }
        }
        else if (currentPage < firstPage ||
                 (totalPages > 0 &&
                  (firstPage ? currentPage > totalPages : currentPage >= totalPages))) {
          throw new RangeError("`currentPage` must be firstPage <= currentPage " +
                               (firstPage ? ">" : ">=") +
                               " totalPages if " + firstPage + "-based. Got " +
                               currentPage + '.');
        }
      }

      return state;
    },

    /**
       Change the page size of this collection.

       Under most if not all circumstances, you should call this method to
       change the page size of a pageable collection because it will keep the
       pagination state sane. By default, the method will recalculate the
       current page number to one that will retain the current page's models
       when increasing the page size. When decreasing the page size, this method
       will retain the last models to the current page that will fit into the
       smaller page size.

       If `options.first` is true, changing the page size will also reset the
       current page back to the first page instead of trying to be smart.

       For server mode operations, changing the page size will trigger a #fetch
       and subsequently a `reset` event.

       For client mode operations, changing the page size will `reset` the
       current page by recalculating the current page boundary on the client
       side.

       If `options.fetch` is true, a fetch can be forced if the collection is in
       client mode.

       @param {number} pageSize The new page size to set to #state.
       @param {Object} [options] {@link #fetch} options.
       @param {boolean} [options.first=false] Reset the current page number to
       the first page if `true`.
       @param {boolean} [options.fetch] If `true`, force a fetch in client mode.

       @throws {TypeError} If `pageSize` is not a finite integer.
       @throws {RangeError} If `pageSize` is less than 1.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    setPageSize: function (pageSize, options) {
      pageSize = finiteInt(pageSize, "pageSize");

      options = options || {first: false};

      var state = this.state;
      var totalPages = ceil(state.totalRecords / pageSize);
      var currentPage = totalPages ?
          max(state.firstPage, floor(totalPages * state.currentPage / state.totalPages)) :
        state.firstPage;

      state = this.state = this._checkState(_extend({}, state, {
        pageSize: pageSize,
        currentPage: options.first ? state.firstPage : currentPage,
        totalPages: totalPages
      }));

      return this.getPage(state.currentPage, _omit(options, ["first"]));
    },

    /**
       Switching between client, server and infinite mode.

       If switching from client to server mode, the #fullCollection is emptied
       first and then deleted and a fetch is immediately issued for the current
       page from the server. Pass `false` to `options.fetch` to skip fetching.

       If switching to infinite mode, and if `options.models` is given for an
       array of models, #links will be populated with a URL per page, using the
       default URL for this collection.

       If switching from server to client mode, all of the pages are immediately
       refetched. If you have too many pages, you can pass `false` to
       `options.fetch` to skip fetching.

       If switching to any mode from infinite mode, the #links will be deleted.

       @param {"server"|"client"|"infinite"} [mode] The mode to switch to.

       @param {Object} [options]

       @param {boolean} [options.fetch=true] If `false`, no fetching is done.

       @param {boolean} [options.resetState=true] If 'false', the state is not
       reset, but checked for sanity instead.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this if `options.fetch` is `false`.
    */
    switchMode: function (mode, options) {

      if (!_contains(["server", "client", "infinite"], mode)) {
        throw new TypeError('`mode` must be one of "server", "client" or "infinite"');
      }

      options = options || {fetch: true, resetState: true};

      var state = this.state = options.resetState ?
        _clone(this._initState) :
        this._checkState(_extend({}, this.state));

      this.mode = mode;

      var self = this;
      var fullCollection = this.fullCollection;
      var handlers = this._handlers = this._handlers || {}, handler;
      if (mode != "server" && !fullCollection) {
        fullCollection = this._makeFullCollection(options.models || [], options);
        fullCollection.pageableCollection = this;
        this.fullCollection = fullCollection;
        var allHandler = this._makeCollectionEventHandler(this, fullCollection);
        _each(["add", "remove", "reset", "sort"], function (event) {
          handlers[event] = handler = _.bind(allHandler, {}, event);
          self.on(event, handler);
          fullCollection.on(event, handler);
        });
        fullCollection.comparator = this._fullComparator;
      }
      else if (mode == "server" && fullCollection) {
        _each(_keys(handlers), function (event) {
          handler = handlers[event];
          self.off(event, handler);
          fullCollection.off(event, handler);
        });
        delete this._handlers;
        this._fullComparator = fullCollection.comparator;
        delete this.fullCollection;
      }

      if (mode == "infinite") {
        var links = this.links = {};
        var firstPage = state.firstPage;
        var totalPages = ceil(state.totalRecords / state.pageSize);
        var lastPage = firstPage === 0 ? max(0, totalPages - 1) : totalPages || firstPage;
        for (var i = state.firstPage; i <= lastPage; i++) {
          links[i] = this.url;
        }
      }
      else if (this.links) delete this.links;

      return options.fetch ?
        this.fetch(_omit(options, "fetch", "resetState")) :
        this;
    },

    /**
       @return {boolean} `true` if this collection can page backward, `false`
       otherwise.
    */
    hasPreviousPage: function () {
      var state = this.state;
      var currentPage = state.currentPage;
      if (this.mode != "infinite") return currentPage > state.firstPage;
      return !!this.links[currentPage - 1];
    },

    /**
       @return {boolean} `true` if this collection can page forward, `false`
       otherwise.
    */
    hasNextPage: function () {
      var state = this.state;
      var currentPage = this.state.currentPage;
      if (this.mode != "infinite") return currentPage < state.lastPage;
      return !!this.links[currentPage + 1];
    },

    /**
       Fetch the first page in server mode, or reset the current page of this
       collection to the first page in client or infinite mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getFirstPage: function (options) {
      return this.getPage("first", options);
    },

    /**
       Fetch the previous page in server mode, or reset the current page of this
       collection to the previous page in client or infinite mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getPreviousPage: function (options) {
      return this.getPage("prev", options);
    },

    /**
       Fetch the next page in server mode, or reset the current page of this
       collection to the next page in client mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getNextPage: function (options) {
      return this.getPage("next", options);
    },

    /**
       Fetch the last page in server mode, or reset the current page of this
       collection to the last page in client mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getLastPage: function (options) {
      return this.getPage("last", options);
    },

    /**
       Given a page index, set #state.currentPage to that index. If this
       collection is in server mode, fetch the page using the updated state,
       otherwise, reset the current page of this collection to the page
       specified by `index` in client mode. If `options.fetch` is true, a fetch
       can be forced in client mode before resetting the current page. Under
       infinite mode, if the index is less than the current page, a reset is
       done as in client mode. If the index is greater than the current page
       number, a fetch is made with the results **appended** to #fullCollection.
       The current page will then be reset after fetching.

       @param {number|string} index The page index to go to, or the page name to
       look up from #links in infinite mode.
       @param {Object} [options] {@link #fetch} options or
       [reset](http://backbonejs.org/#Collection-reset) options for client mode
       when `options.fetch` is `false`.
       @param {boolean} [options.fetch=false] If true, force a {@link #fetch} in
       client mode.

       @throws {TypeError} If `index` is not a finite integer under server or
       client mode, or does not yield a URL from #links under infinite mode.

       @throws {RangeError} If `index` is out of bounds.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getPage: function (index, options) {

      var mode = this.mode, fullCollection = this.fullCollection;

      options = options || {fetch: false};

      var state = this.state,
      firstPage = state.firstPage,
      currentPage = state.currentPage,
      lastPage = state.lastPage,
      pageSize = state.pageSize;

      var pageNum = index;
      switch (index) {
        case "first": pageNum = firstPage; break;
        case "prev": pageNum = currentPage - 1; break;
        case "next": pageNum = currentPage + 1; break;
        case "last": pageNum = lastPage; break;
        default: pageNum = finiteInt(index, "index");
      }

      this.state = this._checkState(_extend({}, state, {currentPage: pageNum}));

      options.from = currentPage, options.to = pageNum;

      var pageStart = (firstPage === 0 ? pageNum : pageNum - 1) * pageSize;
      var pageModels = fullCollection && fullCollection.length ?
        fullCollection.models.slice(pageStart, pageStart + pageSize) :
        [];
      if ((mode == "client" || (mode == "infinite" && !_isEmpty(pageModels))) &&
          !options.fetch) {
        this.reset(pageModels, _omit(options, "fetch"));
        return this;
      }

      if (mode == "infinite") options.url = this.links[pageNum];

      return this.fetch(_omit(options, "fetch"));
    },

    /**
       Fetch the page for the provided item offset in server mode, or reset the current page of this
       collection to the page for the provided item offset in client mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getPageByOffset: function (offset, options) {
      if (offset < 0) {
        throw new RangeError("`offset must be > 0`");
      }
      offset = finiteInt(offset);

      var page = floor(offset / this.state.pageSize);
      if (this.state.firstPage !== 0) page++;
      if (page > this.state.lastPage) page = this.state.lastPage;
      return this.getPage(page, options);
    },

    /**
       Overidden to make `getPage` compatible with Zepto.

       @param {string} method
       @param {Backbone.Model|Backbone.Collection} model
       @param {Object} [options]

       @return {XMLHttpRequest}
    */
    sync: function (method, model, options) {
      var self = this;
      if (self.mode == "infinite") {
        var success = options.success;
        var currentPage = self.state.currentPage;
        options.success = function (resp, status, xhr) {
          var links = self.links;
          var newLinks = self.parseLinks(resp, _extend({xhr: xhr}, options));
          if (newLinks.first) links[self.state.firstPage] = newLinks.first;
          if (newLinks.prev) links[currentPage - 1] = newLinks.prev;
          if (newLinks.next) links[currentPage + 1] = newLinks.next;
          if (success) success(resp, status, xhr);
        };
      }

      return (BBColProto.sync || Backbone.sync).call(self, method, model, options);
    },

    /**
       Parse pagination links from the server response. Only valid under
       infinite mode.

       Given a response body and a XMLHttpRequest object, extract pagination
       links from them for infinite paging.

       This default implementation parses the RFC 5988 `Link` header and extract
       3 links from it - `first`, `prev`, `next`. Any subclasses overriding this
       method __must__ return an object hash having only the keys
       above. However, simply returning a `next` link or an empty hash if there
       are no more links should be enough for most implementations.

       @param {*} resp The deserialized response body.
       @param {Object} [options]
       @param {XMLHttpRequest} [options.xhr] The XMLHttpRequest object for this
       response.
       @return {Object}
    */
    parseLinks: function (resp, options) {
      var links = {};
      var linkHeader = options.xhr.getResponseHeader("Link");
      if (linkHeader) {
        var relations = ["first", "prev", "next"];
        _each(linkHeader.split(","), function (linkValue) {
          var linkParts = linkValue.split(";");
          var url = linkParts[0].replace(URL_TRIM_RE, '');
          var params = linkParts.slice(1);
          _each(params, function (param) {
            var paramParts = param.split("=");
            var key = paramParts[0].replace(PARAM_TRIM_RE, '');
            var value = paramParts[1].replace(PARAM_TRIM_RE, '');
            if (key == "rel" && _contains(relations, value)) links[value] = url;
          });
        });
      }

      return links;
    },

    /**
       Parse server response data.

       This default implementation assumes the response data is in one of two
       structures:

           [
             {}, // Your new pagination state
             [{}, ...] // An array of JSON objects
           ]

       Or,

           [{}] // An array of JSON objects

       The first structure is the preferred form because the pagination states
       may have been updated on the server side, sending them down again allows
       this collection to update its states. If the response has a pagination
       state object, it is checked for errors.

       The second structure is the
       [Backbone.Collection#parse](http://backbonejs.org/#Collection-parse)
       default.

       **Note:** this method has been further simplified since 1.1.7. While
       existing #parse implementations will continue to work, new code is
       encouraged to override #parseState and #parseRecords instead.

       @param {Object} resp The deserialized response data from the server.
       @param {Object} the options for the ajax request

       @return {Array.<Object>} An array of model objects
    */
    parse: function (resp, options) {
      var newState = this.parseState(resp, _clone(this.queryParams), _clone(this.state), options);
      if (newState) this.state = this._checkState(_extend({}, this.state, newState));
      return this.parseRecords(resp, options);
    },

    /**
       Parse server response for server pagination state updates. Not applicable
       under infinite mode.

       This default implementation first checks whether the response has any
       state object as documented in #parse. If it exists, a state object is
       returned by mapping the server state keys to this pageable collection
       instance's query parameter keys using `queryParams`.

       It is __NOT__ neccessary to return a full state object complete with all
       the mappings defined in #queryParams. Any state object resulted is merged
       with a copy of the current pageable collection state and checked for
       sanity before actually updating. Most of the time, simply providing a new
       `totalRecords` value is enough to trigger a full pagination state
       recalculation.

           parseState: function (resp, queryParams, state, options) {
             return {totalRecords: resp.total_entries};
           }

       If you want to use header fields use:

           parseState: function (resp, queryParams, state, options) {
               return {totalRecords: options.xhr.getResponseHeader("X-total")};
           }

       This method __MUST__ return a new state object instead of directly
       modifying the #state object. The behavior of directly modifying #state is
       undefined.

       @param {Object} resp The deserialized response data from the server.
       @param {Object} queryParams A copy of #queryParams.
       @param {Object} state A copy of #state.
       @param {Object} [options] The options passed through from
       `parse`. (backbone >= 0.9.10 only)

       @return {Object} A new (partial) state object.
     */
    parseState: function (resp, queryParams, state, options) {
      if (resp && resp.length === 2 && _isObject(resp[0]) && _isArray(resp[1])) {

        var newState = _clone(state);
        var serverState = resp[0];

        _each(_pairs(_omit(queryParams, "directions")), function (kvp) {
          var k = kvp[0], v = kvp[1];
          var serverVal = serverState[v];
          if (!_isUndefined(serverVal) && !_.isNull(serverVal)) newState[k] = serverState[v];
        });

        if (serverState.order) {
          newState.order = _invert(queryParams.directions)[serverState.order] * 1;
        }

        return newState;
      }
    },

    /**
       Parse server response for an array of model objects.

       This default implementation first checks whether the response has any
       state object as documented in #parse. If it exists, the array of model
       objects is assumed to be the second element, otherwise the entire
       response is returned directly.

       @param {Object} resp The deserialized response data from the server.
       @param {Object} [options] The options passed through from the
       `parse`. (backbone >= 0.9.10 only)

       @return {Array.<Object>} An array of model objects
     */
    parseRecords: function (resp, options) {
      if (resp && resp.length === 2 && _isObject(resp[0]) && _isArray(resp[1])) {
        return resp[1];
      }

      return resp;
    },

    /**
       Fetch a page from the server in server mode, or all the pages in client
       mode. Under infinite mode, the current page is refetched by default and
       then reset.

       The query string is constructed by translating the current pagination
       state to your server API query parameter using #queryParams. The current
       page will reset after fetch.

       @param {Object} [options] Accepts all
       [Backbone.Collection#fetch](http://backbonejs.org/#Collection-fetch)
       options.

       @return {XMLHttpRequest}
    */
    fetch: function (options) {

      options = options || {};

      var state = this._checkState(this.state);

      var mode = this.mode;

      if (mode == "infinite" && !options.url) {
        options.url = this.links[state.currentPage];
      }

      var data = options.data || {};

      // dedup query params
      var url = options.url || this.url || "";
      if (_isFunction(url)) url = url.call(this);
      var qsi = url.indexOf('?');
      if (qsi != -1) {
        _extend(data, queryStringToParams(url.slice(qsi + 1)));
        url = url.slice(0, qsi);
      }

      options.url = url;
      options.data = data;

      // map params except directions
      var queryParams = this.mode == "client" ?
        _pick(this.queryParams, "sortKey", "order") :
        _omit(_pick(this.queryParams, _keys(PageableProto.queryParams)),
              "directions");

      var i, kvp, k, v, kvps = _pairs(queryParams), thisCopy = _clone(this);
      for (i = 0; i < kvps.length; i++) {
        kvp = kvps[i], k = kvp[0], v = kvp[1];
        v = _isFunction(v) ? v.call(thisCopy) : v;
        if (state[k] != null && v != null) {
          data[v] = state[k];
        }
      }

      // fix up sorting parameters
      if (state.sortKey && state.order) {
        var o = _isFunction(queryParams.order) ?
          queryParams.order.call(thisCopy) :
          queryParams.order;
        data[o] = this.queryParams.directions[state.order + ""];
      }
      else if (!state.sortKey) delete data[queryParams.order];

      // map extra query parameters
      var extraKvps = _pairs(_omit(this.queryParams,
                                   _keys(PageableProto.queryParams)));
      for (i = 0; i < extraKvps.length; i++) {
        kvp = extraKvps[i];
        v = kvp[1];
        v = _isFunction(v) ? v.call(thisCopy) : v;
        if (v != null) data[kvp[0]] = v;
      }

      if (mode != "server") {
        var self = this, fullCol = this.fullCollection;
        var success = options.success;
        options.success = function (col, resp, opts) {

          // make sure the caller's intent is obeyed
          opts = opts || {};
          if (_isUndefined(options.silent)) delete opts.silent;
          else opts.silent = options.silent;

          var models = col.models;
          if (mode == "client") fullCol.reset(models, opts);
          else {
            fullCol.add(models, _extend({at: fullCol.length},
                                        _extend(opts, {parse: false})));
            self.trigger("reset", self, opts);
          }

          if (success) success(col, resp, opts);
        };

        // silent the first reset from backbone
        return BBColProto.fetch.call(this, _extend({}, options, {silent: true}));
      }

      return BBColProto.fetch.call(this, options);
    },

    /**
       Convenient method for making a `comparator` sorted by a model attribute
       identified by `sortKey` and ordered by `order`.

       Like a Backbone.Collection, a Backbone.PageableCollection will maintain
       the __current page__ in sorted order on the client side if a `comparator`
       is attached to it. If the collection is in client mode, you can attach a
       comparator to #fullCollection to have all the pages reflect the global
       sorting order by specifying an option `full` to `true`. You __must__ call
       `sort` manually or #fullCollection.sort after calling this method to
       force a resort.

       While you can use this method to sort the current page in server mode,
       the sorting order may not reflect the global sorting order due to the
       additions or removals of the records on the server since the last
       fetch. If you want the most updated page in a global sorting order, it is
       recommended that you set #state.sortKey and optionally #state.order, and
       then call #fetch.

       @protected

       @param {string} [sortKey=this.state.sortKey] See `state.sortKey`.
       @param {number} [order=this.state.order] See `state.order`.
       @param {(function(Backbone.Model, string): Object) | string} [sortValue] See #setSorting.

       See [Backbone.Collection.comparator](http://backbonejs.org/#Collection-comparator).
    */
    _makeComparator: function (sortKey, order, sortValue) {
      var state = this.state;

      sortKey = sortKey || state.sortKey;
      order = order || state.order;

      if (!sortKey || !order) return;

      if (!sortValue) sortValue = function (model, attr) {
        return model.get(attr);
      };

      return function (left, right) {
        var l = sortValue(left, sortKey), r = sortValue(right, sortKey), t;
        if (order === 1) t = l, l = r, r = t;
        if (l === r) return 0;
        else if (l < r) return -1;
        return 1;
      };
    },

    /**
       Adjusts the sorting for this pageable collection.

       Given a `sortKey` and an `order`, sets `state.sortKey` and
       `state.order`. A comparator can be applied on the client side to sort in
       the order defined if `options.side` is `"client"`. By default the
       comparator is applied to the #fullCollection. Set `options.full` to
       `false` to apply a comparator to the current page under any mode. Setting
       `sortKey` to `null` removes the comparator from both the current page and
       the full collection.

       If a `sortValue` function is given, it will be passed the `(model,
       sortKey)` arguments and is used to extract a value from the model during
       comparison sorts. If `sortValue` is not given, `model.get(sortKey)` is
       used for sorting.

       @chainable

       @param {string} sortKey See `state.sortKey`.
       @param {number} [order=this.state.order] See `state.order`.
       @param {Object} [options]
       @param {"server"|"client"} [options.side] By default, `"client"` if
       `mode` is `"client"`, `"server"` otherwise.
       @param {boolean} [options.full=true]
       @param {(function(Backbone.Model, string): Object) | string} [options.sortValue]
    */
    setSorting: function (sortKey, order, options) {

      var state = this.state;

      state.sortKey = sortKey;
      state.order = order = order || state.order;

      var fullCollection = this.fullCollection;

      var delComp = false, delFullComp = false;

      if (!sortKey) delComp = delFullComp = true;

      var mode = this.mode;
      options = _extend({side: mode == "client" ? mode : "server", full: true},
                        options);

      var comparator = this._makeComparator(sortKey, order, options.sortValue);

      var full = options.full, side = options.side;

      if (side == "client") {
        if (full) {
          if (fullCollection) fullCollection.comparator = comparator;
          delComp = true;
        }
        else {
          this.comparator = comparator;
          delFullComp = true;
        }
      }
      else if (side == "server" && !full) {
        this.comparator = comparator;
      }

      if (delComp) this.comparator = null;
      if (delFullComp && fullCollection) fullCollection.comparator = null;

      return this;
    }

  });

  var PageableProto = PageableCollection.prototype;

  return PageableCollection;

}));

/*global define*/

define('views/content-results-grid/_content-results-grid',[
    'waypoints',
    'paginator'
], function(
    Waypoints,
    Paginator) {

    'use strict';

    var ContentResultGrid = IEA.module('UI.content-results-grid', function (module, app, iea) {

        _.extend(module, {
            defaultSettings: {
                articleContainer: '.article-container',
                sortingEl: '.selected-sort-key',
                pageIndexEl: '.page-index',
                pageSortKey: 'default',
                waypointOffset: 'bottom-in-view',
                mode: 'client',
                sortingField: 'titleDetail',
                articleInnerEl: 'div.thumbnail'
            },
            events: {
                'click .sorting-list': '_handleclick',
                'click .btn-group': '_handleDropdownOverflow'
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this._super(options);

                this.ArticleCollection = Backbone.PageableCollection.extend({
                    model: IEA.Model.extend({})
                });

                this.articleTemplate = this.getTemplate('articles', 'content-results-grid/partial/content-result-grid-article.hbss');

                //app.on('window:scrolled', $.proxy(_.debounce(this._startInfiniteLoading, 300), this));
                this.isFirstPage = true;
                this.isSeverSide = this.isServerComponent;

                this.triggerMethod('init');
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }

                this.triggerMethod('render');

                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/
                var settings = this.defaultSettings,
                    isDefaultMatched = false,
                    idx = 0;
                this.$articleList = $(settings.articleContainer, this.$el);
                this.$sortKeySelected = $(settings.sortingEl, this.$el);
                this.$pageIndex = $(settings.pageIndexEl, this.$el);
                this.pageSortKey = settings.pageSortKey;

                if(!this.isServerComponent) {
                    var defaultSortOption = this.model.get('data').contentResultsGrid.configurations.defaultSortOption,
                        sortOptions = this.model.get('data').contentResultsGrid.configurations.sortOptions;

                    //selecting default sort option.
                    for(idx=0; idx<sortOptions.length; idx++) {
                        if(sortOptions[idx].value === defaultSortOption) {
                            this.pageSortKey = sortOptions[idx].key;
                            this.$sortKeySelected.html(defaultSortOption);
                            isDefaultMatched = true;
                            break;
                        }
                    }

                    this.model.set({'dataLoaded':true});
                    this._createObjects();
                    this._articleView();

                } else {
                    var self = this;
                    setTimeout(function() {
                        self._matchHeight();
                    }, 700);
                }

                var listItems = this.$el.find('ul.dropdown-menu li'),
                    defaultVal = $(listItems[0]).find('a').html();

                for(idx=1; idx<listItems.length; idx++) {
                    if($(listItems[idx]).find('a').html() === defaultVal) {
                        this.$el.find('ul.dropdown-menu li:first-child').remove();
                        isDefaultMatched = true;
                        break;
                    }
                }

                this.$sortKeySelected.html(defaultVal);

                this._startInfiniteLoading();
                //this.$el.find('.thumbnail-arrow').hide();
                this.triggerMethod('enable', this);
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
            },

            /**
            @method onWindowResized

            @return {null}
            **/
            onWindowResized: function() {
                var self = this;
                $(this.defaultSettings.articleInnerEl, this.$el).removeAttr("style");
                setTimeout(function() {
                    self._matchHeight();
                }, 700);
            },

            /* ----------------------------------------------------------------------------- *\
               Private Methods
            \* ----------------------------------------------------------------------------- */

            /**
            handle dropdown list select / click

            @method _handleclick

            @return {null}
            **/
            _handleclick: function(evt) {
                var a = evt.currentTarget,
                    dataKey = $(a).attr('data-key'),
                    dataField = $(a).attr('data-field'),
                    dataValue = $(a).html();
                evt.preventDefault();
                this.$sortKeySelected.html(dataValue);
                this.pageSortKey = dataKey;
                this.pageSortField = dataField;
                this.isFirstPage = true;
                this.isSeverSide = false;
                this.$articleList.html('');
                this._articleView();
            },

            /**
            handle infinite scrolling

            @method _startInfiniteLoading

            @return {null}
            **/
            _startInfiniteLoading: function(evt) {
                var self = this;

                $(this.defaultSettings.articleContainer, this.$el).waypoint({
                    handler: function(direction) {
                        if(direction === 'down') {
                            self._articleView();
                        }
                    },
                    offset: 'bottom-in-view'
                });

                /*console.log('_startInfiniteLoading',this.defaultSettings.articleContainer);
                $(this.defaultSettings.articleContainer, this.$el).waypoint({
                    handler: function() {
                        console.log('hit waypoint');
                        self.$articleList.waypoint('disable');
                        _.once(self._articleView());
                    },
                    offset: function () {
                        console.log(-$(this).height());
                        return -$(this).height();
                    }
                });*/
            },

            _getModel: function(cb) {
                var self = this;

                $.getJSON(this.model.get('data').contentResultsGrid.configurations.jsonUrl, function( data ) {
                    self.model.set({"data": data.data});
                    self.model.set({'dataLoaded':true});
                    self._createObjects();

                    if(typeof cb === 'function') {
                        cb.apply(self,[self.model]);
                    }
                });
            },

            _createObjects : function() {
                var contentResultData, contentResult;

                contentResultData = this.model.get('data'),
                contentResult = contentResultData.contentResultsGrid.contentResults,

                this.pageViewLimit = contentResultData.contentResultsGrid.configurations.lazyload ? parseInt(contentResultData.contentResultsGrid.configurations.pageSize) : parseInt(contentResultData.contentResultsGrid.resultCount);
                this.articles = new this.ArticleCollection(contentResult, {mode: this.defaultSettings.mode, state: {pageSize: this.pageViewLimit}});
            },

            /**
            creates subviews

            @method _articleView

            @return {null}
            **/
            _articleView: function() {
                if(this.model.get('dataLoaded')) {
                    this._showView();
                } else {
                    this._getModel($.proxy(this._showView, this));
                }
            },

            _showView: function() {
                var modelData = this.model.get('data');
                if(this.model.get('data').contentResultsGrid.resultCount > 0) {
                    if ((this.isFirstPage) || (this.articles.hasNextPage())) {
                        var resultModel = this._pagination(),
                            _self = this,
                            $resultView = this.articleTemplate({'data': resultModel.toJSON(), 'column': this.model.get('data').contentResultsGrid.configurations.viewFormat}),
                            showingCount = ((this.articles.state.currentPage * this.articles.state.pageSize) > this.articles.state.totalRecords) ? this.articles.state.totalRecords : (this.articles.state.currentPage * this.articles.state.pageSize);

                        this.$articleList.append($resultView);
                        this.$pageIndex.html(modelData.contentResultsGrid.showPrefixText + ' ' + showingCount + ' ' + modelData.contentResultsGrid.showPostfixText + ' ' + this.articles.state.totalRecords);

                        setTimeout(function () {
                            _self.app.trigger('image:lazyload', _self);
                            $.waypoints('refresh');
                        }, 300);

                        setTimeout(function() {
                            _self._matchHeight();
                        }, 700);

                        if(this.isFirstPage) {
                            this.triggerMethod('firstPage', resultModel);
                        } else {
                            this.triggerMethod('nextPage', resultModel);
                        }

                    }
                } else {
                    if(this.model.get('data').contentResultsGrid.configurations.noResultCopy) {
                       this.$articleList.html('<h4>' +  this.model.get('data').contentResultsGrid.configurations.noResultCopy+ '</h4>');
                    }

                }
            },

            /**
            handle pagination

            @method _pagination

            return list of next page articles as per sort key

            @return articles.getNextPage()
            **/
            _pagination: function() {
                switch(this.pageSortKey) {
                case 'asc':
                    this.articles.setSorting(this.pageSortField, -1);
                    this.articles.fullCollection.sort();
                    break;

                case 'desc':
                    this.articles.setSorting(this.pageSortField, 1);
                    this.articles.fullCollection.sort();
                    break;

                case 'default':
                    this.articles.setSorting(null);
                    break;
                }

                if (this.isFirstPage) {
                    this.isFirstPage = false;
                    //if (this.isSeverSide) { this.articles.getFirstPage(); }
                    return this.isSeverSide ? this.articles.getPage(2) : this.articles.getFirstPage();
                } else {
                    return this.articles.getNextPage();
                }
            },

            _handleDropdownOverflow: function () {
                var self = this;

                setTimeout(function () {
                    var documentWidth = $(document).width(),
                        windowWidth = $(window).width(),
                        $dropdown = $('.dropdown-menu', self.$el),
                        offsetWidth = 0;

                    if(documentWidth > windowWidth) {
                        offsetWidth = (documentWidth - windowWidth) + 10;
                        $dropdown.css({'margin-left':'-'+offsetWidth+'px'});
                    }
                }, 100);
            },

            /**
            makes the gird to equal height if any un evnen heights

            @method _articleView

            @return {null}
            **/
            _matchHeight: function () {
                var $articles = $(this.defaultSettings.articleInnerEl, this.$el),
                    elementHeights = $articles.map(function ()
                        {
                            return $(this).height();
                        }).get(),
                maxHeight = Math.max.apply(null, elementHeights);
                $articles.height(maxHeight);
            }

        });
    });

    return ContentResultGrid;
});

/*global define*/

define('views/country-language-selector/_country-language-selector',[],function() {

    'use strict';

    var CountryLanguageSelector = IEA.module('UI.country-language-selector', function (countryLanguageSelector, app, iea) {

        _.extend(countryLanguageSelector, {

            defaultSettings: {
                selectorBody: '.selector-body',
                desktopClass: 'desktop',
                mobileClass: 'mobile',
                selectorDisplayName: '.display-name',
                selectorDisplayFlag: '.display-flag',
                items: '.language-item'
            },

            events: {
                'click .region-title': '_handleAccordionToggle',
                'click .dropdown-menu': '_stopEvent',
                'mouseenter .dropdown-menu': '_stopEvent',
                'mouseenter .dropdown': '_handleToggleDropdown',
                'mouseleave .dropdown': '_handleToggleDropdown'
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this.triggerMethod('beforeInit');
                this._super(options);
                this.triggerMethod('init');                
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
                this.triggerMethod('beforeRender');
                this.$el.html(this.template(this.model.toJSON().data));
                this.triggerMethod('render', this);
                
                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }

                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/
                this.$el.on('show.bs.dropdown', $.proxy(this.triggerMethod, this, 'beforeOpen'));
                this.$el.on('shown.bs.dropdown', $.proxy(this.triggerMethod, this, 'afterOpen'));
                this.$el.on('hide.bs.dropdown', $.proxy(this.triggerMethod, this, 'beforeClose'));
                this.$el.on('hidden.bs.dropdown', $.proxy(this.triggerMethod, this, 'afterClose'));

                this.$selectDisplayName = $(this.defaultSettings.selectorDisplayName, this.$el);
                this.$selectDisplayFlag = $(this.defaultSettings.selectorDisplayFlag, this.$el);

                this._setPosition();

                this.triggerMethod('enable');
                //this._handleDefaultSelected();
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
                this.$el.off('show.bs.dropdown');
                this.$el.off('shown.bs.dropdown');
                this.$el.off('hide.bs.dropdown');
                this.$el.off('hidden.bs.dropdown');
            },

            /**
            @method onMatchDesktop

            @return {null}
            **/
            onMatchDesktop: function() {
                this._setCompForDesktopAndTablet();
            },

            /**
            @method onMatchTablet

            @return {null}
            **/
            onMatchTablet: function() {
                this._setCompForDesktopAndTablet();
            },

            /**
            @method onMatchMobile

            @return {null}
            **/
            onMatchMobile: function() {
                $(this.defaultSettings.selectorBody, this.$el).removeClass(this.defaultSettings.desktopClass).addClass(this.defaultSettings.mobileClass);
                this.$selectDisplayName.hide();
            },


            /* ----------------------------------------------------------------------------- *\
               Private Methods
            \* ----------------------------------------------------------------------------- */

            /**
            This method is used to set component for desktop and tablet viewport..

            @method setDisplayNameAndFlag

            @return {null}
            **/
            _setCompForDesktopAndTablet: function() {
                $(this.defaultSettings.selectorBody, this.$el).addClass(this.defaultSettings.desktopClass).removeClass(this.defaultSettings.mobileClass);
                this.$el.find('.country-list').show();

                this.$selectDisplayName.show();
            },

            /**
            This method handles click for Expand collapse of region heading

            @method _handleAccordionToggle

            @return {null}
            **/
            _handleAccordionToggle: function(evt) {
                this.triggerMethod('beforeExpand');

                if(app.getValue('isMobileBreakpoint')){
                    $(evt.currentTarget).toggleClass('expanded').next('.country-list').slideToggle();
                }

                this.triggerMethod('afterExpand');
            },

            /**
            Stop click event on dropdown-menu

            @method _stopEvent

            @return {null}
            **/
            _stopEvent: function (evt) {
                evt.stopPropagation();
            },

            /**
            Stop click event on dropdown-menu

            @method _showDropdown

            @return {null}
            **/
            _setPosition: function() {
                this.$el.each(function () {
                    if($(this).offset().left < $(window).width()/2) {
                        $(this).find('.selector-body').addClass('left-align');
                    }
                    else {
                        $(this).find('.selector-body').addClass('right-align');
                    }
                });
            },

            /**
            Stop click event on dropdown-menu

            @method _showDropdown

            @return {null}
            **/
            _handleToggleDropdown: function (evt) {
                if(app.getValue('isDesktopBreakpoint')) {
                    if (evt.type === 'mouseenter') {
                        $(evt.currentTarget).addClass('open');

                        // Hook for handling mouse enter event
                        this.triggerMethod('mouseenter');
                    } 
                    else {
                        $(evt.currentTarget).removeClass('open');

                        // Hook for handling mouse leave event
                        this.triggerMethod('mouseleave');
                    }
                }
            }

        });
    });

    return CountryLanguageSelector;
});

/*global define*/

define('views/expand-collapse/_expand-collapse',[],function() {

    'use strict';

    var ExpandCollapse = IEA.module('UI.expand-collapse', function (module, app, iea) {

        _.extend(module, {

            defaultSettings: {
                headerContainer: '.expandcollapse-header',
                speed: 400
            },

            events: {
                'click a.expandcollapse-toggle': '_handleExpandCollapse'
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this.triggerMethod('beforeInit', options);
                this._super(options);
                this.triggerMethod('init', options);
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
                this.triggerMethod('beforeRender', this);
                this.$el.html(this.template(this.model.toJSON().data));
                this.triggerMethod('render', this);
                
                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }

                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/
                this.triggerMethod('enable', this);
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
                // view cleanup code here, anything that needs to be temporarily paused when view is not currently displayed
            },

            expand: function(elem) {
                this.triggerMethod('BeforeExpand', elem);

                var elemsExpanded = $(this.defaultSettings.headerContainer).siblings('.expanded'),
                    self = this;

                if (elemsExpanded.length) {
                    elemsExpanded.each(function (i, element) {
                        var $element = $(element);
                        self.collapse($element);
                    });
                }

                elem.removeClass('collapsed').addClass('expanded').next().slideDown(this.defaultSettings.speed).toggleClass('hiding');
                this.triggerMethod('AfterExpand', elem);
            },

            collapse: function(elem) {
                this.triggerMethod('BeforeCollapse', elem);
                elem.addClass('collapsed').removeClass('expanded').next().slideUp(function() {elem.next().toggleClass('hiding')});
                this.triggerMethod('AfterCollapse', elem);
            },

            /* ----------------------------------------------------------------------------- *\
               Private Methods
            \* ----------------------------------------------------------------------------- */

            /**
            handle expand and collapse

            @method _handleExpandCollapse

            @return {null}
            **/

            _handleExpandCollapse: function(evt) {
                evt.preventDefault();
                var target = $(evt.currentTarget).parent();
                target.hasClass('expanded') ? this.collapse(target) : this.expand(target);
            }

        });
    });

    return ExpandCollapse;
});

// Backbone.Validation v0.9.1
//
// Copyright (c) 2011-2014 Thomas Pedersen
// Distributed under MIT License
//
// Documentation and full license available at:
// http://thedersen.com/projects/backbone-validation
(function (factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('backbone'), require('underscore'));
  } else if (typeof define === 'function' && define.amd) {
    define('validation',['backbone', 'underscore'], factory);
  }
}(function (Backbone, _) {
  Backbone.Validation = (function(_){
    'use strict';

    // Default options
    // ---------------

    var defaultOptions = {
      forceUpdate: false,
      selector: 'name',
      labelFormatter: 'sentenceCase',
      valid: Function.prototype,
      invalid: Function.prototype
    };


    // Helper functions
    // ----------------

    // Formatting functions used for formatting error messages
    var formatFunctions = {
      // Uses the configured label formatter to format the attribute name
      // to make it more readable for the user
      formatLabel: function(attrName, model) {
        return defaultLabelFormatters[defaultOptions.labelFormatter](attrName, model);
      },

      // Replaces nummeric placeholders like {0} in a string with arguments
      // passed to the function
      format: function() {
        var args = Array.prototype.slice.call(arguments),
            text = args.shift();
        return text.replace(/\{(\d+)\}/g, function(match, number) {
          return typeof args[number] !== 'undefined' ? args[number] : match;
        });
      }
    };

    // Flattens an object
    // eg:
    //
    //     var o = {
    //       address: {
    //         street: 'Street',
    //         zip: 1234
    //       }
    //     };
    //
    // becomes:
    //
    //     var o = {
    //       'address.street': 'Street',
    //       'address.zip': 1234
    //     };
    var flatten = function (obj, into, prefix) {
      into = into || {};
      prefix = prefix || '';

      _.each(obj, function(val, key) {
        if(obj.hasOwnProperty(key)) {
          if (val && typeof val === 'object' && !(
            val instanceof Array ||
            val instanceof Date ||
            val instanceof RegExp ||
            val instanceof Backbone.Model ||
            val instanceof Backbone.Collection)
          ) {
            flatten(val, into, prefix + key + '.');
          }
          else {
            into[prefix + key] = val;
          }
        }
      });

      return into;
    };

    // Validation
    // ----------

    var Validation = (function(){

      // Returns an object with undefined properties for all
      // attributes on the model that has defined one or more
      // validation rules.
      var getValidatedAttrs = function(model) {
        return _.reduce(_.keys(_.result(model, 'validation') || {}), function(memo, key) {
          memo[key] = void 0;
          return memo;
        }, {});
      };

      // Looks on the model for validations for a specified
      // attribute. Returns an array of any validators defined,
      // or an empty array if none is defined.
      var getValidators = function(model, attr) {
        var attrValidationSet = model.validation ? _.result(model, 'validation')[attr] || {} : {};

        // If the validator is a function or a string, wrap it in a function validator
        if (_.isFunction(attrValidationSet) || _.isString(attrValidationSet)) {
          attrValidationSet = {
            fn: attrValidationSet
          };
        }

        // Stick the validator object into an array
        if(!_.isArray(attrValidationSet)) {
          attrValidationSet = [attrValidationSet];
        }

        // Reduces the array of validators into a new array with objects
        // with a validation method to call, the value to validate against
        // and the specified error message, if any
        return _.reduce(attrValidationSet, function(memo, attrValidation) {
          _.each(_.without(_.keys(attrValidation), 'msg'), function(validator) {
            memo.push({
              fn: defaultValidators[validator],
              val: attrValidation[validator],
              msg: attrValidation.msg
            });
          });
          return memo;
        }, []);
      };

      // Validates an attribute against all validators defined
      // for that attribute. If one or more errors are found,
      // the first error message is returned.
      // If the attribute is valid, an empty string is returned.
      var validateAttr = function(model, attr, value, computed) {
        // Reduces the array of validators to an error message by
        // applying all the validators and returning the first error
        // message, if any.
        return _.reduce(getValidators(model, attr), function(memo, validator){
          // Pass the format functions plus the default
          // validators as the context to the validator
          var ctx = _.extend({}, formatFunctions, defaultValidators),
              result = validator.fn.call(ctx, value, attr, validator.val, model, computed);

          if(result === false || memo === false) {
            return false;
          }
          if (result && !memo) {
            return _.result(validator, 'msg') || result;
          }
          return memo;
        }, '');
      };

      // Loops through the model's attributes and validates them all.
      // Returns and object containing names of invalid attributes
      // as well as error messages.
      var validateModel = function(model, attrs) {
        var error,
            invalidAttrs = {},
            isValid = true,
            computed = _.clone(attrs),
            flattened = flatten(attrs);

        _.each(flattened, function(val, attr) {
          error = validateAttr(model, attr, val, computed);
          if (error) {
            invalidAttrs[attr] = error;
            isValid = false;
          }
        });

        return {
          invalidAttrs: invalidAttrs,
          isValid: isValid
        };
      };

      // Contains the methods that are mixed in on the model when binding
      var mixin = function(view, options) {
        return {

          // Check whether or not a value, or a hash of values
          // passes validation without updating the model
          preValidate: function(attr, value) {
            var self = this,
                result = {},
                error;

            if(_.isObject(attr)){
              _.each(attr, function(value, key) {
                error = self.preValidate(key, value);
                if(error){
                  result[key] = error;
                }
              });

              return _.isEmpty(result) ? undefined : result;
            }
            else {
              return validateAttr(this, attr, value, _.extend({}, this.attributes));
            }
          },

          // Check to see if an attribute, an array of attributes or the
          // entire model is valid. Passing true will force a validation
          // of the model.
          isValid: function(option) {
            var flattened = flatten(this.attributes);

            if(_.isString(option)){
              return !validateAttr(this, option, flattened[option], _.extend({}, this.attributes));
            }
            if(_.isArray(option)){
              return _.reduce(option, function(memo, attr) {
                return memo && !validateAttr(this, attr, flattened[attr], _.extend({}, this.attributes));
              }, true, this);
            }
            if(option === true) {
              this.validate();
            }
            return this.validation ? this._isValid : true;
          },

          // This is called by Backbone when it needs to perform validation.
          // You can call it manually without any parameters to validate the
          // entire model.
          validate: function(attrs, setOptions){
            var model = this,
                validateAll = !attrs,
                opt = _.extend({}, options, setOptions),
                validatedAttrs = getValidatedAttrs(model),
                allAttrs = _.extend({}, validatedAttrs, model.attributes, attrs),
                changedAttrs = flatten(attrs || allAttrs),

                result = validateModel(model, allAttrs);

            model._isValid = result.isValid;

            // After validation is performed, loop through all validated attributes
            // and call the valid callbacks so the view is updated.
            _.each(validatedAttrs, function(val, attr){
              var invalid = result.invalidAttrs.hasOwnProperty(attr);
              if(!invalid){
                opt.valid(view, attr, opt.selector);
              }
            });

            // After validation is performed, loop through all validated and changed attributes
            // and call the invalid callback so the view is updated.
            _.each(validatedAttrs, function(val, attr){
              var invalid = result.invalidAttrs.hasOwnProperty(attr),
                  changed = changedAttrs.hasOwnProperty(attr);

              if(invalid && (changed || validateAll)){
                opt.invalid(view, attr, result.invalidAttrs[attr], opt.selector);
              }
            });

            // Trigger validated events.
            // Need to defer this so the model is actually updated before
            // the event is triggered.
            _.defer(function() {
              model.trigger('validated', model._isValid, model, result.invalidAttrs);
              model.trigger('validated:' + (model._isValid ? 'valid' : 'invalid'), model, result.invalidAttrs);
            });

            // Return any error messages to Backbone, unless the forceUpdate flag is set.
            // Then we do not return anything and fools Backbone to believe the validation was
            // a success. That way Backbone will update the model regardless.
            if (!opt.forceUpdate && _.intersection(_.keys(result.invalidAttrs), _.keys(changedAttrs)).length > 0) {
              return result.invalidAttrs;
            }
          }
        };
      };

      // Helper to mix in validation on a model
      var bindModel = function(view, model, options) {
        _.extend(model, mixin(view, options));
      };

      // Removes the methods added to a model
      var unbindModel = function(model) {
        delete model.validate;
        delete model.preValidate;
        delete model.isValid;
      };

      // Mix in validation on a model whenever a model is
      // added to a collection
      var collectionAdd = function(model) {
        bindModel(this.view, model, this.options);
      };

      // Remove validation from a model whenever a model is
      // removed from a collection
      var collectionRemove = function(model) {
        unbindModel(model);
      };

      // Returns the public methods on Backbone.Validation
      return {

        // Current version of the library
        version: '0.9.1',

        // Called to configure the default options
        configure: function(options) {
          _.extend(defaultOptions, options);
        },

        // Hooks up validation on a view with a model
        // or collection
        bind: function(view, options) {
          options = _.extend({}, defaultOptions, defaultCallbacks, options);

          var model = options.model || view.model,
              collection = options.collection || view.collection;

          if(typeof model === 'undefined' && typeof collection === 'undefined'){
            throw 'Before you execute the binding your view must have a model or a collection.\n' +
                  'See http://thedersen.com/projects/backbone-validation/#using-form-model-validation for more information.';
          }

          if(model) {
            bindModel(view, model, options);
          }
          else if(collection) {
            collection.each(function(model){
              bindModel(view, model, options);
            });
            collection.bind('add', collectionAdd, {view: view, options: options});
            collection.bind('remove', collectionRemove);
          }
        },

        // Removes validation from a view with a model
        // or collection
        unbind: function(view, options) {
          options = _.extend({}, options);
          var model = options.model || view.model,
              collection = options.collection || view.collection;

          if(model) {
            unbindModel(model);
          }
          else if(collection) {
            collection.each(function(model){
              unbindModel(model);
            });
            collection.unbind('add', collectionAdd);
            collection.unbind('remove', collectionRemove);
          }
        },

        // Used to extend the Backbone.Model.prototype
        // with validation
        mixin: mixin(null, defaultOptions)
      };
    }());


    // Callbacks
    // ---------

    var defaultCallbacks = Validation.callbacks = {

      // Gets called when a previously invalid field in the
      // view becomes valid. Removes any error message.
      // Should be overridden with custom functionality.
      valid: function(view, attr, selector) {
        view.$('[' + selector + '~="' + attr + '"]')
            .removeClass('invalid')
            .removeAttr('data-error');
      },

      // Gets called when a field in the view becomes invalid.
      // Adds a error message.
      // Should be overridden with custom functionality.
      invalid: function(view, attr, error, selector) {
        view.$('[' + selector + '~="' + attr + '"]')
            .addClass('invalid')
            .attr('data-error', error);
      }
    };


    // Patterns
    // --------

    var defaultPatterns = Validation.patterns = {
      // Matches any digit(s) (i.e. 0-9)
      digits: /^\d+$/,

      // Matches any number (e.g. 100.000)
      number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,

      // Matches a valid email address (e.g. mail@example.com)
      email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,

      // Mathes any valid url (e.g. http://www.xample.com)
      url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
    };


    // Error messages
    // --------------

    // Error message for the build in validators.
    // {x} gets swapped out with arguments form the validator.
    var defaultMessages = Validation.messages = {
      required: '{0} is required',
      acceptance: '{0} must be accepted',
      min: '{0} must be greater than or equal to {1}',
      max: '{0} must be less than or equal to {1}',
      range: '{0} must be between {1} and {2}',
      length: '{0} must be {1} characters',
      minLength: '{0} must be at least {1} characters',
      maxLength: '{0} must be at most {1} characters',
      rangeLength: '{0} must be between {1} and {2} characters',
      oneOf: '{0} must be one of: {1}',
      equalTo: '{0} must be the same as {1}',
      digits: '{0} must only contain digits',
      number: '{0} must be a number',
      email: '{0} must be a valid email',
      url: '{0} must be a valid url',
      inlinePattern: '{0} is invalid'
    };

    // Label formatters
    // ----------------

    // Label formatters are used to convert the attribute name
    // to a more human friendly label when using the built in
    // error messages.
    // Configure which one to use with a call to
    //
    //     Backbone.Validation.configure({
    //       labelFormatter: 'label'
    //     });
    var defaultLabelFormatters = Validation.labelFormatters = {

      // Returns the attribute name with applying any formatting
      none: function(attrName) {
        return attrName;
      },

      // Converts attributeName or attribute_name to Attribute name
      sentenceCase: function(attrName) {
        return attrName.replace(/(?:^\w|[A-Z]|\b\w)/g, function(match, index) {
          return index === 0 ? match.toUpperCase() : ' ' + match.toLowerCase();
        }).replace(/_/g, ' ');
      },

      // Looks for a label configured on the model and returns it
      //
      //      var Model = Backbone.Model.extend({
      //        validation: {
      //          someAttribute: {
      //            required: true
      //          }
      //        },
      //
      //        labels: {
      //          someAttribute: 'Custom label'
      //        }
      //      });
      label: function(attrName, model) {
        return (model.labels && model.labels[attrName]) || defaultLabelFormatters.sentenceCase(attrName, model);
      }
    };


    // Built in validators
    // -------------------

    var defaultValidators = Validation.validators = (function(){
      // Use native trim when defined
      var trim = String.prototype.trim ?
        function(text) {
          return text === null ? '' : String.prototype.trim.call(text);
        } :
        function(text) {
          var trimLeft = /^\s+/,
              trimRight = /\s+$/;

          return text === null ? '' : text.toString().replace(trimLeft, '').replace(trimRight, '');
        };

      // Determines whether or not a value is a number
      var isNumber = function(value){
        return _.isNumber(value) || (_.isString(value) && value.match(defaultPatterns.number));
      };

      // Determines whether or not a value is empty
      var hasValue = function(value) {
        return !(_.isNull(value) || _.isUndefined(value) || (_.isString(value) && trim(value) === '') || (_.isArray(value) && _.isEmpty(value)));
      };

      return {
        // Function validator
        // Lets you implement a custom function used for validation
        fn: function(value, attr, fn, model, computed) {
          if(_.isString(fn)){
            fn = model[fn];
          }
          return fn.call(model, value, attr, computed);
        },

        // Required validator
        // Validates if the attribute is required or not
        // This can be specified as either a boolean value or a function that returns a boolean value
        required: function(value, attr, required, model, computed) {
          var isRequired = _.isFunction(required) ? required.call(model, value, attr, computed) : required;
          if(!isRequired && !hasValue(value)) {
            return false; // overrides all other validators
          }
          if (isRequired && !hasValue(value)) {
            return this.format(defaultMessages.required, this.formatLabel(attr, model));
          }
        },

        // Acceptance validator
        // Validates that something has to be accepted, e.g. terms of use
        // `true` or 'true' are valid
        acceptance: function(value, attr, accept, model) {
          if(value !== 'true' && (!_.isBoolean(value) || value === false)) {
            return this.format(defaultMessages.acceptance, this.formatLabel(attr, model));
          }
        },

        // Min validator
        // Validates that the value has to be a number and equal to or greater than
        // the min value specified
        min: function(value, attr, minValue, model) {
          if (!isNumber(value) || value < minValue) {
            return this.format(defaultMessages.min, this.formatLabel(attr, model), minValue);
          }
        },

        // Max validator
        // Validates that the value has to be a number and equal to or less than
        // the max value specified
        max: function(value, attr, maxValue, model) {
          if (!isNumber(value) || value > maxValue) {
            return this.format(defaultMessages.max, this.formatLabel(attr, model), maxValue);
          }
        },

        // Range validator
        // Validates that the value has to be a number and equal to or between
        // the two numbers specified
        range: function(value, attr, range, model) {
          if(!isNumber(value) || value < range[0] || value > range[1]) {
            return this.format(defaultMessages.range, this.formatLabel(attr, model), range[0], range[1]);
          }
        },

        // Length validator
        // Validates that the value has to be a string with length equal to
        // the length value specified
        length: function(value, attr, length, model) {
          if (!_.isString(value) || value.length !== length) {
            return this.format(defaultMessages.length, this.formatLabel(attr, model), length);
          }
        },

        // Min length validator
        // Validates that the value has to be a string with length equal to or greater than
        // the min length value specified
        minLength: function(value, attr, minLength, model) {
          if (!_.isString(value) || value.length < minLength) {
            return this.format(defaultMessages.minLength, this.formatLabel(attr, model), minLength);
          }
        },

        // Max length validator
        // Validates that the value has to be a string with length equal to or less than
        // the max length value specified
        maxLength: function(value, attr, maxLength, model) {
          if (!_.isString(value) || value.length > maxLength) {
            return this.format(defaultMessages.maxLength, this.formatLabel(attr, model), maxLength);
          }
        },

        // Range length validator
        // Validates that the value has to be a string and equal to or between
        // the two numbers specified
        rangeLength: function(value, attr, range, model) {
          if (!_.isString(value) || value.length < range[0] || value.length > range[1]) {
            return this.format(defaultMessages.rangeLength, this.formatLabel(attr, model), range[0], range[1]);
          }
        },

        // One of validator
        // Validates that the value has to be equal to one of the elements in
        // the specified array. Case sensitive matching
        oneOf: function(value, attr, values, model) {
          if(!_.include(values, value)){
            return this.format(defaultMessages.oneOf, this.formatLabel(attr, model), values.join(', '));
          }
        },

        // Equal to validator
        // Validates that the value has to be equal to the value of the attribute
        // with the name specified
        equalTo: function(value, attr, equalTo, model, computed) {
          if(value !== computed[equalTo]) {
            return this.format(defaultMessages.equalTo, this.formatLabel(attr, model), this.formatLabel(equalTo, model));
          }
        },

        // Pattern validator
        // Validates that the value has to match the pattern specified.
        // Can be a regular expression or the name of one of the built in patterns
        pattern: function(value, attr, pattern, model) {
          if (!hasValue(value) || !value.toString().match(defaultPatterns[pattern] || pattern)) {
            return this.format(defaultMessages[pattern] || defaultMessages.inlinePattern, this.formatLabel(attr, model), pattern);
          }
        }
      };
    }());

    // Set the correct context for all validators
    // when used from within a method validator
    _.each(defaultValidators, function(validator, key){
      defaultValidators[key] = _.bind(defaultValidators[key], _.extend({}, formatFunctions, defaultValidators));
    });

    return Validation;
  }(_));
  return Backbone.Validation;
}));

/*jshint bitwise:false */

define('validator',[
    'iea',
    'validation',
], function(
    IEA,
    Validation
) {
    'use strict';

    var Validator = IEA.module('form.validator', function(module, app, iea) {

        // Validate the card number based on prefix (IIN ranges) and length
        var cards = {
            AMERICAN_EXPRESS: {
                length: [15],
                prefix: ['34', '37']
            },
            DINERS_CLUB: {
                length: [14],
                prefix: ['300', '301', '302', '303', '304', '305', '36']
            },
            DINERS_CLUB_US: {
                length: [16],
                prefix: ['54', '55']
            },
            DISCOVER: {
                length: [16],
                prefix: ['6011', '622126', '622127', '622128', '622129', '62213',
                    '62214', '62215', '62216', '62217', '62218', '62219',
                    '6222', '6223', '6224', '6225', '6226', '6227', '6228',
                    '62290', '62291', '622920', '622921', '622922', '622923',
                    '622924', '622925', '644', '645', '646', '647', '648',
                    '649', '65'
                ]
            },
            JCB: {
                length: [16],
                prefix: ['3528', '3529', '353', '354', '355', '356', '357', '358']
            },
            LASER: {
                length: [16, 17, 18, 19],
                prefix: ['6304', '6706', '6771', '6709']
            },
            MAESTRO: {
                length: [12, 13, 14, 15, 16, 17, 18, 19],
                prefix: ['5018', '5020', '5038', '6304', '6759', '6761', '6762', '6763', '6764', '6765', '6766']
            },
            MASTERCARD: {
                length: [16],
                prefix: ['51', '52', '53', '54', '55']
            },
            SOLO: {
                length: [16, 18, 19],
                prefix: ['6334', '6767']
            },
            UNIONPAY: {
                length: [16, 17, 18, 19],
                prefix: ['622126', '622127', '622128', '622129', '62213', '62214',
                    '62215', '62216', '62217', '62218', '62219', '6222', '6223',
                    '6224', '6225', '6226', '6227', '6228', '62290', '62291',
                    '622920', '622921', '622922', '622923', '622924', '622925'
                ]
            },
            VISA: {
                length: [16],
                prefix: ['4']
            }
        };

        _.extend(this, Backbone.Validation);

        Backbone.Validation.configure({
            selector: 'form-validate'
        });

        Backbone.Validation.helpers = {
            /**
             * Execute a callback function
             *
             * @param {String|Function} functionName Can be
             * - name of global function
             * - name of namespace function (such as A.B.C)
             * - a function
             * @param {Array} args The callback arguments
             */
            call: function(functionName, args) {
                if ('function' === typeof functionName) {
                    return functionName.apply(this, args);
                } else if ('string' === typeof functionName) {
                    if ('()' === functionName.substring(functionName.length - 2)) {
                        functionName = functionName.substring(0, functionName.length - 2);
                    }
                    var ns = functionName.split('.'),
                        func = ns.pop(),
                        context = window;
                    for (var i = 0; i < ns.length; i++) {
                        context = context[ns[i]];
                    }

                    return (typeof context[func] === 'undefined') ? null : context[func].apply(this, args);
                }
            },

            /**
             * Format a string
             * It's used to format the error message
             * format('The field must between %s and %s', [10, 20]) = 'The field must between 10 and 20'
             *
             * @param {String} message
             * @param {Array} parameters
             * @returns {String}
             */
            format: function(message, parameters) {
                if (!$.isArray(parameters)) {
                    parameters = [parameters];
                }

                for (var i in parameters) {
                    message = message.replace('%s', parameters[i]);
                }

                return message;
            },

            /**
             * Validate a date
             *
             * @param {Number} year The full year in 4 digits
             * @param {Number} month The month number
             * @param {Number} day The day number
             * @param {Boolean} [notInFuture] If true, the date must not be in the future
             * @returns {Boolean}
             */
            date: function(year, month, day, notInFuture) {
                if (isNaN(year) || isNaN(month) || isNaN(day)) {
                    return false;
                }
                if (day.length > 2 || month.length > 2 || year.length > 4) {
                    return false;
                }

                day = parseInt(day, 10);
                month = parseInt(month, 10);
                year = parseInt(year, 10);

                if (year < 1000 || year > 9999 || month <= 0 || month > 12) {
                    return false;
                }
                var numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                // Update the number of days in Feb of leap year
                if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                    numDays[1] = 29;
                }

                // Check the day
                if (day <= 0 || day > numDays[month - 1]) {
                    return false;
                }

                if (notInFuture === true) {
                    var currentDate = new Date(),
                        currentYear = currentDate.getFullYear(),
                        currentMonth = currentDate.getMonth(),
                        currentDay = currentDate.getDate();
                    return (year < currentYear || (year === currentYear && month - 1 < currentMonth) || (year === currentYear && month - 1 === currentMonth && day < currentDay));
                }

                return true;
            },

            /**
             * Implement Luhn validation algorithm
             * Credit to https://gist.github.com/ShirtlessKirk/2134376
             *
             * @see http://en.wikipedia.org/wiki/Luhn
             * @param {String} value
             * @returns {Boolean}
             */
            luhn: function(value) {
                var length = value.length,
                    mul = 0,
                    prodArr = [
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
                    ],
                    sum = 0;

                while (length--) {
                    sum += prodArr[mul][parseInt(value.charAt(length), 10)];
                    mul ^= 1;
                }

                return (sum % 10 === 0 && sum > 0);
            },

            /**
             * Implement modulus 11, 10 (ISO 7064) algorithm
             *
             * @param {String} value
             * @returns {Boolean}
             */
            mod11And10: function(value) {
                var check = 5,
                    length = value.length;
                for (var i = 0; i < length; i++) {
                    check = (((check || 10) * 2) % 11 + parseInt(value.charAt(i), 10)) % 10;
                }
                return (check === 1);
            },

            /**
             * Implements Mod 37, 36 (ISO 7064) algorithm
             * Usages:
             * mod37And36('A12425GABC1234002M')
             * mod37And36('002006673085', '0123456789')
             *
             * @param {String} value
             * @param {String} [alphabet]
             * @returns {Boolean}
             */
            mod37And36: function(value, alphabet) {
                alphabet = alphabet || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                var modulus = alphabet.length,
                    length = value.length,
                    check = Math.floor(modulus / 2);
                for (var i = 0; i < length; i++) {
                    check = (((check || modulus) * 2) % (modulus + 1) + alphabet.indexOf(value.charAt(i))) % modulus;
                }
                return (check === 1);
            }
        };

        // Extend the callbacks to work with Bootstrap, as used in this example
        // See: http://thedersen.com/projects/backbone-validation/#configuration/callbacks
        _.extend(Backbone.Validation.callbacks, {
            valid: function(view, attr, selector) {
                var $el = view.$('[name=' + attr + ']'),
                    $group = $el.closest('.form-group');
                if($group.children('.multivalue').length > 0) {
                    var $parent = $('input[name='+attr+']').parents('.multivalue-field');
                    $parent.removeClass('has-error');
                    $parent.find('.help-block').html('').addClass('hidden');
                } else {
                    $group.removeClass('has-error');
                    $group.find('.help-block').html('').addClass('hidden');
                }
            },

            invalid: function(view, attr, error, selector) {
                var $el = view.$('[name=' + attr + ']'),
                    $group = $el.closest('.form-group');

                if($group.children('.multivalue').length > 0) {
                    var $parent = $('input[name='+attr+']').parents('.multivalue-field');
                    $parent.addClass('has-error');
                    $parent.find('.help-block').html(error).removeClass('hidden');
                } else {
                    $group.addClass('has-error');
                    $group.find('.help-block').html(error).removeClass('hidden');
                }


            }
        });

        // add custom validators
        _.extend(Backbone.Validation.validators, {
            required: function(value, attr, required, model, computed) {

                var isCheckbox = $('[name=' + attr + ']:checkbox', model.$el);
                var isRequired = _.isFunction(required) ? required.call(model, value, attr, computed) : required;

                if (!isRequired && !value) {
                    return false;
                }

                if (isCheckbox.length && !isCheckbox.filter(':checked').length) {
                    return true;
                }

                if (isRequired && !value) {
                    return true;
                }
            },

            cvv: function(value, attr, options, model, computed) {

                if (value === '') {
                    return true;
                }

                if (!Backbone.Validation.patterns.cvv.test(value)) {
                    return true;
                }
            },

            xss: function(value, attr, options, model, computed) {

                if (Backbone.Validation.patterns.xss.test(value)) {
                    return true;
                }
            },

            creditcard: function(value, attr, options, model, computed) {
                var type, i;

                if (value === '') {
                    return true;
                }

                // Accept only digits, dashes or spaces
                if (/[^0-9-\s]+/.test(value)) {
                    return true; //error
                }

            //    value = value.replace(/\D/g, '');

                if (!Backbone.Validation.helpers.luhn(value)) {
                    return true; // error
                }

                for (type in cards) {
                    for (i in cards[type].prefix) {
                        if (value.substr(0, cards[type].prefix[i].length) === cards[type].prefix[i] && $.inArray(value.length, cards[type].length) !== -1) // and length
                        {
                            return false; // valid card
                        }
                    }
                }

                return true; //its an invalid card
            },
        });

        // application level patterns for validation added
        _.extend(Backbone.Validation.patterns, {
            cvv: /^[0-9]{3,4}$/,
            xss: /<[^<]+?>/
        });

        /* ----------------------------------------------------------------------------- *\
           Public Methods
        \* ----------------------------------------------------------------------------- */

        this.addRules = function(view, validation) {
            var model = validation.model || view.model;

            if (typeof model !== 'undefined') {

                // if the model does not have a validation object, then add it and then add the rules
                // otherwise just keep on adding new rules into the validation object.
                if (typeof model.validation === 'undefined') {
                    _.extend(model, {
                        validation: validation.rules
                    });
                } else {
                    _.extend(model.validation, validation.rules);
                }
            }
        };

        this.addValidation = function(view, options) {
            Backbone.Validation.bind(view, options);
        };

        this.removeValidation = function(view, options) {
            Backbone.Validation.bind(view, options);
        };

    });

    return Validator;
});

/* =========================================================
 * bootstrap-datepicker.js
 * Repo: https://github.com/eternicode/bootstrap-datepicker/
 * Demo: http://eternicode.github.io/bootstrap-datepicker/
 * Docs: http://bootstrap-datepicker.readthedocs.org/
 * Forked from http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Started by Stefan Petre; improvements by Andrew Rowls + contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

(function($, undefined){

	var $window = $(window);

	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}
	function alias(method){
		return function(){
			return this[method].apply(this, arguments);
		};
	}

	var DateArray = (function(){
		var extras = {
			get: function(i){
				return this.slice(i)[0];
			},
			contains: function(d){
				// Array.indexOf is not cross-browser;
				// $.inArray doesn't work with Dates
				var val = d && d.valueOf();
				for (var i=0, l=this.length; i < l; i++)
					if (this[i].valueOf() === val)
						return i;
				return -1;
			},
			remove: function(i){
				this.splice(i,1);
			},
			replace: function(new_array){
				if (!new_array)
					return;
				if (!$.isArray(new_array))
					new_array = [new_array];
				this.clear();
				this.push.apply(this, new_array);
			},
			clear: function(){
				this.length = 0;
			},
			copy: function(){
				var a = new DateArray();
				a.replace(this);
				return a;
			}
		};

		return function(){
			var a = [];
			a.push.apply(a, arguments);
			$.extend(a, extras);
			return a;
		};
	})();


	// Picker object

	var Datepicker = function(element, options){
		this.dates = new DateArray();
		this.viewDate = UTCToday();
		this.focusDate = null;

		this._process_options(options);

		this.element = $(element);
		this.isInline = false;
		this.isInput = this.element.is('input');
		this.component = this.element.is('.date') ? this.element.find('.add-on, .input-group-addon, .btn') : false;
		this.hasInput = this.component && this.element.find('input').length;
		if (this.component && this.component.length === 0)
			this.component = false;

		this.picker = $(DPGlobal.template);
		this._buildEvents();
		this._attachEvents();

		if (this.isInline){
			this.picker.addClass('datepicker-inline').appendTo(this.element);
		}
		else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}

		if (this.o.rtl){
			this.picker.addClass('datepicker-rtl');
		}

		this.viewMode = this.o.startView;

		if (this.o.calendarWeeks)
			this.picker.find('tfoot th.today, tfoot th.clear')
						.attr('colspan', function(i, val){
							return parseInt(val) + 1;
						});

		this._allow_update = false;

		this.setStartDate(this._o.startDate);
		this.setEndDate(this._o.endDate);
		this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);

		this.fillDow();
		this.fillMonths();

		this._allow_update = true;

		this.update();
		this.showMode();

		if (this.isInline){
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_process_options: function(opts){
			// Store raw options for reference
			this._o = $.extend({}, this._o, opts);
			// Processed options
			var o = this.o = $.extend({}, this._o);

			// Check if "de-DE" style date is available, if not language should
			// fallback to 2 letter code eg "de"
			var lang = o.language;
			if (!dates[lang]){
				lang = lang.split('-')[0];
				if (!dates[lang])
					lang = defaults.language;
			}
			o.language = lang;

			switch (o.startView){
				case 2:
				case 'decade':
					o.startView = 2;
					break;
				case 1:
				case 'year':
					o.startView = 1;
					break;
				default:
					o.startView = 0;
			}

			switch (o.minViewMode){
				case 1:
				case 'months':
					o.minViewMode = 1;
					break;
				case 2:
				case 'years':
					o.minViewMode = 2;
					break;
				default:
					o.minViewMode = 0;
			}

			o.startView = Math.max(o.startView, o.minViewMode);

			// true, false, or Number > 0
			if (o.multidate !== true){
				o.multidate = Number(o.multidate) || false;
				if (o.multidate !== false)
					o.multidate = Math.max(0, o.multidate);
				else
					o.multidate = 1;
			}
			o.multidateSeparator = String(o.multidateSeparator);

			o.weekStart %= 7;
			o.weekEnd = ((o.weekStart + 6) % 7);

			var format = DPGlobal.parseFormat(o.format);
			if (o.startDate !== -Infinity){
				if (!!o.startDate){
					if (o.startDate instanceof Date)
						o.startDate = this._local_to_utc(this._zero_time(o.startDate));
					else
						o.startDate = DPGlobal.parseDate(o.startDate, format, o.language);
				}
				else {
					o.startDate = -Infinity;
				}
			}
			if (o.endDate !== Infinity){
				if (!!o.endDate){
					if (o.endDate instanceof Date)
						o.endDate = this._local_to_utc(this._zero_time(o.endDate));
					else
						o.endDate = DPGlobal.parseDate(o.endDate, format, o.language);
				}
				else {
					o.endDate = Infinity;
				}
			}

			o.daysOfWeekDisabled = o.daysOfWeekDisabled||[];
			if (!$.isArray(o.daysOfWeekDisabled))
				o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
			o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function(d){
				return parseInt(d, 10);
			});

			var plc = String(o.orientation).toLowerCase().split(/\s+/g),
				_plc = o.orientation.toLowerCase();
			plc = $.grep(plc, function(word){
				return (/^auto|left|right|top|bottom$/).test(word);
			});
			o.orientation = {x: 'auto', y: 'auto'};
			if (!_plc || _plc === 'auto')
				; // no action
			else if (plc.length === 1){
				switch (plc[0]){
					case 'top':
					case 'bottom':
						o.orientation.y = plc[0];
						break;
					case 'left':
					case 'right':
						o.orientation.x = plc[0];
						break;
				}
			}
			else {
				_plc = $.grep(plc, function(word){
					return (/^left|right$/).test(word);
				});
				o.orientation.x = _plc[0] || 'auto';

				_plc = $.grep(plc, function(word){
					return (/^top|bottom$/).test(word);
				});
				o.orientation.y = _plc[0] || 'auto';
			}
		},
		_events: [],
		_secondaryEvents: [],
		_applyEvents: function(evs){
			for (var i=0, el, ch, ev; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.on(ev, ch);
			}
		},
		_unapplyEvents: function(evs){
			for (var i=0, el, ev, ch; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.off(ev, ch);
			}
		},
		_buildEvents: function(){
			if (this.isInput){ // single input
				this._events = [
					[this.element, {
						focus: $.proxy(this.show, this),
						keyup: $.proxy(function(e){
							if ($.inArray(e.keyCode, [27,37,39,38,40,32,13,9]) === -1)
								this.update();
						}, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			else if (this.component && this.hasInput){ // component: input + button
				this._events = [
					// For components that are not readonly, allow keyboard nav
					[this.element.find('input'), {
						focus: $.proxy(this.show, this),
						keyup: $.proxy(function(e){
							if ($.inArray(e.keyCode, [27,37,39,38,40,32,13,9]) === -1)
								this.update();
						}, this),
						keydown: $.proxy(this.keydown, this)
					}],
					[this.component, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			else if (this.element.is('div')){  // inline datepicker
				this.isInline = true;
			}
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			this._events.push(
				// Component: listen for blur on element descendants
				[this.element, '*', {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}],
				// Input: listen for blur on element
				[this.element, {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}]
			);

			this._secondaryEvents = [
				[this.picker, {
					click: $.proxy(this.click, this)
				}],
				[$(window), {
					resize: $.proxy(this.place, this)
				}],
				[$(document), {
					'mousedown touchstart': $.proxy(function(e){
						// Clicked outside the datepicker, hide it
						if (!(
							this.element.is(e.target) ||
							this.element.find(e.target).length ||
							this.picker.is(e.target) ||
							this.picker.find(e.target).length
						)){
							this.hide();
						}
					}, this)
				}]
			];
		},
		_attachEvents: function(){
			this._detachEvents();
			this._applyEvents(this._events);
		},
		_detachEvents: function(){
			this._unapplyEvents(this._events);
		},
		_attachSecondaryEvents: function(){
			this._detachSecondaryEvents();
			this._applyEvents(this._secondaryEvents);
		},
		_detachSecondaryEvents: function(){
			this._unapplyEvents(this._secondaryEvents);
		},
		_trigger: function(event, altdate){
			var date = altdate || this.dates.get(-1),
				local_date = this._utc_to_local(date);

			this.element.trigger({
				type: event,
				date: local_date,
				dates: $.map(this.dates, this._utc_to_local),
				format: $.proxy(function(ix, format){
					if (arguments.length === 0){
						ix = this.dates.length - 1;
						format = this.o.format;
					}
					else if (typeof ix === 'string'){
						format = ix;
						ix = this.dates.length - 1;
					}
					format = format || this.o.format;
					var date = this.dates.get(ix);
					return DPGlobal.formatDate(date, format, this.o.language);
				}, this)
			});
		},

		show: function(){
			if (!this.isInline)
				this.picker.appendTo('body');
			this.picker.show();
			this.place();
			this._attachSecondaryEvents();
			this._trigger('show');
		},

		hide: function(){
			if (this.isInline)
				return;
			if (!this.picker.is(':visible'))
				return;
			this.focusDate = null;
			this.picker.hide().detach();
			this._detachSecondaryEvents();
			this.viewMode = this.o.startView;
			this.showMode();

			if (
				this.o.forceParse &&
				(
					this.isInput && this.element.val() ||
					this.hasInput && this.element.find('input').val()
				)
			)
				this.setValue();
			this._trigger('hide');
		},

		remove: function(){
			this.hide();
			this._detachEvents();
			this._detachSecondaryEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
			if (!this.isInput){
				delete this.element.data().date;
			}
		},

		_utc_to_local: function(utc){
			return utc && new Date(utc.getTime() + (utc.getTimezoneOffset()*60000));
		},
		_local_to_utc: function(local){
			return local && new Date(local.getTime() - (local.getTimezoneOffset()*60000));
		},
		_zero_time: function(local){
			return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
		},
		_zero_utc_time: function(utc){
			return utc && new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
		},

		getDates: function(){
			return $.map(this.dates, this._utc_to_local);
		},

		getUTCDates: function(){
			return $.map(this.dates, function(d){
				return new Date(d);
			});
		},

		getDate: function(){
			return this._utc_to_local(this.getUTCDate());
		},

		getUTCDate: function(){
			return new Date(this.dates.get(-1));
		},

		setDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, args);
			this._trigger('changeDate');
			this.setValue();
		},

		setUTCDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, $.map(args, this._utc_to_local));
			this._trigger('changeDate');
			this.setValue();
		},

		setDate: alias('setDates'),
		setUTCDate: alias('setUTCDates'),

		setValue: function(){
			var formatted = this.getFormattedDate();
			if (!this.isInput){
				if (this.component){
					this.element.find('input').val(formatted).change();
				}
			}
			else {
				this.element.val(formatted).change();
			}
		},

		getFormattedDate: function(format){
			if (format === undefined)
				format = this.o.format;

			var lang = this.o.language;
			return $.map(this.dates, function(d){
				return DPGlobal.formatDate(d, format, lang);
			}).join(this.o.multidateSeparator);
		},

		setStartDate: function(startDate){
			this._process_options({startDate: startDate});
			this.update();
			this.updateNavArrows();
		},

		setEndDate: function(endDate){
			this._process_options({endDate: endDate});
			this.update();
			this.updateNavArrows();
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
			this.update();
			this.updateNavArrows();
		},

		place: function(){
			if (this.isInline)
				return;
			var calendarWidth = this.picker.outerWidth(),
				calendarHeight = this.picker.outerHeight(),
				visualPadding = 10,
				windowWidth = $window.width(),
				windowHeight = $window.height(),
				scrollTop = $window.scrollTop();

			var parentsZindex = [];
			this.element.parents().each(function() {
				var itemZIndex = $(this).css('z-index');
				if ( itemZIndex !== 'auto' && itemZIndex !== 0 ) parentsZindex.push( parseInt( itemZIndex ) );
			});
			var zIndex = Math.max.apply( Math, parentsZindex ) + 10;
			var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
			var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
			var left = offset.left,
				top = offset.top;

			this.picker.removeClass(
				'datepicker-orient-top datepicker-orient-bottom '+
				'datepicker-orient-right datepicker-orient-left'
			);

			if (this.o.orientation.x !== 'auto'){
				this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
				if (this.o.orientation.x === 'right')
					left -= calendarWidth - width;
			}
			// auto x orientation is best-placement: if it crosses a window
			// edge, fudge it sideways
			else {
				// Default to left
				this.picker.addClass('datepicker-orient-left');
				if (offset.left < 0)
					left -= offset.left - visualPadding;
				else if (offset.left + calendarWidth > windowWidth)
					left = windowWidth - calendarWidth - visualPadding;
			}

			// auto y orientation is best-situation: top or bottom, no fudging,
			// decision based on which shows more of the calendar
			var yorient = this.o.orientation.y,
				top_overflow, bottom_overflow;
			if (yorient === 'auto'){
				top_overflow = -scrollTop + offset.top - calendarHeight;
				bottom_overflow = scrollTop + windowHeight - (offset.top + height + calendarHeight);
				if (Math.max(top_overflow, bottom_overflow) === bottom_overflow)
					yorient = 'top';
				else
					yorient = 'bottom';
			}
			this.picker.addClass('datepicker-orient-' + yorient);
			if (yorient === 'top')
				top += height;
			else
				top -= calendarHeight + parseInt(this.picker.css('padding-top'));

			this.picker.css({
				top: top,
				left: left,
				zIndex: zIndex
			});
		},

		_allow_update: true,
		update: function(){
			if (!this._allow_update)
				return;

			var oldDates = this.dates.copy(),
				dates = [],
				fromArgs = false;
			if (arguments.length){
				$.each(arguments, $.proxy(function(i, date){
					if (date instanceof Date)
						date = this._local_to_utc(date);
					dates.push(date);
				}, this));
				fromArgs = true;
			}
			else {
				dates = this.isInput
						? this.element.val()
						: this.element.data('date') || this.element.find('input').val();
				if (dates && this.o.multidate)
					dates = dates.split(this.o.multidateSeparator);
				else
					dates = [dates];
				delete this.element.data().date;
			}

			dates = $.map(dates, $.proxy(function(date){
				return DPGlobal.parseDate(date, this.o.format, this.o.language);
			}, this));
			dates = $.grep(dates, $.proxy(function(date){
				return (
					date < this.o.startDate ||
					date > this.o.endDate ||
					!date
				);
			}, this), true);
			this.dates.replace(dates);

			if (this.dates.length)
				this.viewDate = new Date(this.dates.get(-1));
			else if (this.viewDate < this.o.startDate)
				this.viewDate = new Date(this.o.startDate);
			else if (this.viewDate > this.o.endDate)
				this.viewDate = new Date(this.o.endDate);

			if (fromArgs){
				// setting date by clicking
				this.setValue();
			}
			else if (dates.length){
				// setting date by typing
				if (String(oldDates) !== String(this.dates))
					this._trigger('changeDate');
			}
			if (!this.dates.length && oldDates.length)
				this._trigger('clearDate');

			this.fill();
		},

		fillDow: function(){
			var dowCnt = this.o.weekStart,
				html = '<tr>';
			if (this.o.calendarWeeks){
				var cell = '<th class="cw">&nbsp;</th>';
				html += cell;
				this.picker.find('.datepicker-days thead tr:first-child').prepend(cell);
			}
			while (dowCnt < this.o.weekStart + 7){
				html += '<th class="dow">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function(){
			var html = '',
			i = 0;
			while (i < 12){
				html += '<span class="month">'+dates[this.o.language].monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		setRange: function(range){
			if (!range || !range.length)
				delete this.range;
			else
				this.range = $.map(range, function(d){
					return d.valueOf();
				});
			this.fill();
		},

		getClassNames: function(date){
			var cls = [],
				year = this.viewDate.getUTCFullYear(),
				month = this.viewDate.getUTCMonth(),
				today = new Date();
			if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)){
				cls.push('old');
			}
			else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)){
				cls.push('new');
			}
			if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
				cls.push('focused');
			// Compare internal UTC date with local today, not UTC today
			if (this.o.todayHighlight &&
				date.getUTCFullYear() === today.getFullYear() &&
				date.getUTCMonth() === today.getMonth() &&
				date.getUTCDate() === today.getDate()){
				cls.push('today');
			}
			if (this.dates.contains(date) !== -1)
				cls.push('active');
			if (date.valueOf() < this.o.startDate || date.valueOf() > this.o.endDate ||
				$.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1){
				cls.push('disabled');
			}
			if (this.range){
				if (date > this.range[0] && date < this.range[this.range.length-1]){
					cls.push('range');
				}
				if ($.inArray(date.valueOf(), this.range) !== -1){
					cls.push('selected');
				}
			}
			return cls;
		},

		fill: function(){
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				todaytxt = dates[this.o.language].today || dates['en'].today || '',
				cleartxt = dates[this.o.language].clear || dates['en'].clear || '',
				tooltip;
			if (isNaN(year) || isNaN(month)) return;
			this.picker.find('.datepicker-days thead th.datepicker-switch')
						.text(dates[this.o.language].months[month]+' '+year);
			this.picker.find('tfoot th.today')
						.text(todaytxt)
						.toggle(this.o.todayBtn !== false);
			this.picker.find('tfoot th.clear')
						.text(cleartxt)
						.toggle(this.o.clearBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month-1, 28),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while (prevMonth.valueOf() < nextMonth){
				if (prevMonth.getUTCDay() === this.o.weekStart){
					html.push('<tr>');
					if (this.o.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek =  (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ calWeek +'</td>');

					}
				}
				clsName = this.getClassNames(prevMonth);
				clsName.push('day');

				if (this.o.beforeShowDay !== $.noop){
					var before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
					if (before === undefined)
						before = {};
					else if (typeof(before) === 'boolean')
						before = {enabled: before};
					else if (typeof(before) === 'string')
						before = {classes: before};
					if (before.enabled === false)
						clsName.push('disabled');
					if (before.classes)
						clsName = clsName.concat(before.classes.split(/\s+/));
					if (before.tooltip)
						tooltip = before.tooltip;
				}

				clsName = $.unique(clsName);
				html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + '>'+prevMonth.getUTCDate() + '</td>');
				tooltip = null;
				if (prevMonth.getUTCDay() === this.o.weekEnd){
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));

			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');

			$.each(this.dates, function(i, d){
				if (d.getUTCFullYear() === year)
					months.eq(d.getUTCMonth()).addClass('active');
			});

			if (year < startYear || year > endYear){
				months.addClass('disabled');
			}
			if (year === startYear){
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year === endYear){
				months.slice(endMonth+1).addClass('disabled');
			}

			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			var years = $.map(this.dates, function(d){
					return d.getUTCFullYear();
				}),
				classes;
			for (var i = -1; i < 11; i++){
				classes = ['year'];
				if (i === -1)
					classes.push('old');
				else if (i === 10)
					classes.push('new');
				if ($.inArray(year, years) !== -1)
					classes.push('active');
				if (year < startYear || year > endYear)
					classes.push('disabled');
				html += '<span class="' + classes.join(' ') + '">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
		},

		updateNavArrows: function(){
			if (!this._allow_update)
				return;

			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth();
			switch (this.viewMode){
				case 0:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
				case 2:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear()){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear()){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		click: function(e){
			e.preventDefault();
			var target = $(e.target).closest('span, td, th'),
				year, month, day;
			if (target.length === 1){
				switch (target[0].nodeName.toLowerCase()){
					case 'th':
						switch (target[0].className){
							case 'datepicker-switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1);
								switch (this.viewMode){
									case 0:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										this._trigger('changeMonth', this.viewDate);
										break;
									case 1:
									case 2:
										this.viewDate = this.moveYear(this.viewDate, dir);
										if (this.viewMode === 1)
											this._trigger('changeYear', this.viewDate);
										break;
								}
								this.fill();
								break;
							case 'today':
								var date = new Date();
								date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

								this.showMode(-2);
								var which = this.o.todayBtn === 'linked' ? null : 'view';
								this._setDate(date, which);
								break;
							case 'clear':
								var element;
								if (this.isInput)
									element = this.element;
								else if (this.component)
									element = this.element.find('input');
								if (element)
									element.val("").change();
								this.update();
								this._trigger('changeDate');
								if (this.o.autoclose)
									this.hide();
								break;
						}
						break;
					case 'span':
						if (!target.is('.disabled')){
							this.viewDate.setUTCDate(1);
							if (target.is('.month')){
								day = 1;
								month = target.parent().find('span').index(target);
								year = this.viewDate.getUTCFullYear();
								this.viewDate.setUTCMonth(month);
								this._trigger('changeMonth', this.viewDate);
								if (this.o.minViewMode === 1){
									this._setDate(UTCDate(year, month, day));
								}
							}
							else {
								day = 1;
								month = 0;
								year = parseInt(target.text(), 10)||0;
								this.viewDate.setUTCFullYear(year);
								this._trigger('changeYear', this.viewDate);
								if (this.o.minViewMode === 2){
									this._setDate(UTCDate(year, month, day));
								}
							}
							this.showMode(-1);
							this.fill();
						}
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')){
							day = parseInt(target.text(), 10)||1;
							year = this.viewDate.getUTCFullYear();
							month = this.viewDate.getUTCMonth();
							if (target.is('.old')){
								if (month === 0){
									month = 11;
									year -= 1;
								}
								else {
									month -= 1;
								}
							}
							else if (target.is('.new')){
								if (month === 11){
									month = 0;
									year += 1;
								}
								else {
									month += 1;
								}
							}
							this._setDate(UTCDate(year, month, day));
						}
						break;
				}
			}
			if (this.picker.is(':visible') && this._focused_from){
				$(this._focused_from).focus();
			}
			delete this._focused_from;
		},

		_toggle_multidate: function(date){
			var ix = this.dates.contains(date);
			if (!date){
				this.dates.clear();
			}
			if (this.o.multidate === 1 && ix === 0){
                // single datepicker, don't remove selected date
            }
			else if (ix !== -1){
				this.dates.remove(ix);
			}
			else {
				this.dates.push(date);
			}
			if (typeof this.o.multidate === 'number')
				while (this.dates.length > this.o.multidate)
					this.dates.remove(0);
		},

		_setDate: function(date, which){
			if (!which || which === 'date')
				this._toggle_multidate(date && new Date(date));
			if (!which || which  === 'view')
				this.viewDate = date && new Date(date);

			this.fill();
			this.setValue();
			this._trigger('changeDate');
			var element;
			if (this.isInput){
				element = this.element;
			}
			else if (this.component){
				element = this.element.find('input');
			}
			if (element){
				element.change();
			}
			if (this.o.autoclose && (!which || which === 'date')){
				this.hide();
			}
		},

		moveMonth: function(date, dir){
			if (!date)
				return undefined;
			if (!dir)
				return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag === 1){
				test = dir === -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){
						return new_date.getUTCMonth() === month;
					}
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){
						return new_date.getUTCMonth() !== new_month;
					};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			}
			else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i < mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){
					return new_month !== new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		dateWithinRange: function(date){
			return date >= this.o.startDate && date <= this.o.endDate;
		},

		keydown: function(e){
			if (this.picker.is(':not(:visible)')){
				if (e.keyCode === 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, newDate, newViewDate,
				focusDate = this.focusDate || this.viewDate;
			switch (e.keyCode){
				case 27: // escape
					if (this.focusDate){
						this.focusDate = null;
						this.viewDate = this.dates.get(-1) || this.viewDate;
						this.fill();
					}
					else
						this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					if (!this.o.keyboardNavigation)
						break;
					dir = e.keyCode === 37 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveYear(focusDate, dir);
						this._trigger('changeYear', this.viewDate);
					}
					else if (e.shiftKey){
						newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveMonth(focusDate, dir);
						this._trigger('changeMonth', this.viewDate);
					}
					else {
						newDate = new Date(this.dates.get(-1) || UTCToday());
						newDate.setUTCDate(newDate.getUTCDate() + dir);
						newViewDate = new Date(focusDate);
						newViewDate.setUTCDate(focusDate.getUTCDate() + dir);
					}
					if (this.dateWithinRange(newDate)){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 38: // up
				case 40: // down
					if (!this.o.keyboardNavigation)
						break;
					dir = e.keyCode === 38 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveYear(focusDate, dir);
						this._trigger('changeYear', this.viewDate);
					}
					else if (e.shiftKey){
						newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveMonth(focusDate, dir);
						this._trigger('changeMonth', this.viewDate);
					}
					else {
						newDate = new Date(this.dates.get(-1) || UTCToday());
						newDate.setUTCDate(newDate.getUTCDate() + dir * 7);
						newViewDate = new Date(focusDate);
						newViewDate.setUTCDate(focusDate.getUTCDate() + dir * 7);
					}
					if (this.dateWithinRange(newDate)){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 32: // spacebar
					// Spacebar is used in manually typing dates in some formats.
					// As such, its behavior should not be hijacked.
					break;
				case 13: // enter
					focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
					if (this.o.keyboardNavigation) {
						this._toggle_multidate(focusDate);
						dateChanged = true;
					}
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.setValue();
					this.fill();
					if (this.picker.is(':visible')){
						e.preventDefault();
						if (this.o.autoclose)
							this.hide();
					}
					break;
				case 9: // tab
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.fill();
					this.hide();
					break;
			}
			if (dateChanged){
				if (this.dates.length)
					this._trigger('changeDate');
				else
					this._trigger('clearDate');
				var element;
				if (this.isInput){
					element = this.element;
				}
				else if (this.component){
					element = this.element.find('input');
				}
				if (element){
					element.change();
				}
			}
		},

		showMode: function(dir){
			if (dir){
				this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + dir));
			}
			this.picker
				.find('>div')
				.hide()
				.filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName)
					.css('display', 'block');
			this.updateNavArrows();
		}
	};

	var DateRangePicker = function(element, options){
		this.element = $(element);
		this.inputs = $.map(options.inputs, function(i){
			return i.jquery ? i[0] : i;
		});
		delete options.inputs;

		$(this.inputs)
			.datepicker(options)
			.bind('changeDate', $.proxy(this.dateUpdated, this));

		this.pickers = $.map(this.inputs, function(i){
			return $(i).data('datepicker');
		});
		this.updateDates();
	};
	DateRangePicker.prototype = {
		updateDates: function(){
			this.dates = $.map(this.pickers, function(i){
				return i.getUTCDate();
			});
			this.updateRanges();
		},
		updateRanges: function(){
			var range = $.map(this.dates, function(d){
				return d.valueOf();
			});
			$.each(this.pickers, function(i, p){
				p.setRange(range);
			});
		},
		dateUpdated: function(e){
			// `this.updating` is a workaround for preventing infinite recursion
			// between `changeDate` triggering and `setUTCDate` calling.  Until
			// there is a better mechanism.
			if (this.updating)
				return;
			this.updating = true;

			var dp = $(e.target).data('datepicker'),
				new_date = dp.getUTCDate(),
				i = $.inArray(e.target, this.inputs),
				l = this.inputs.length;
			if (i === -1)
				return;

			$.each(this.pickers, function(i, p){
				if (!p.getUTCDate())
					p.setUTCDate(new_date);
			});

			if (new_date < this.dates[i]){
				// Date being moved earlier/left
				while (i >= 0 && new_date < this.dates[i]){
					this.pickers[i--].setUTCDate(new_date);
				}
			}
			else if (new_date > this.dates[i]){
				// Date being moved later/right
				while (i < l && new_date > this.dates[i]){
					this.pickers[i++].setUTCDate(new_date);
				}
			}
			this.updateDates();

			delete this.updating;
		},
		remove: function(){
			$.map(this.pickers, function(p){ p.remove(); });
			delete this.element.data().datepicker;
		}
	};

	function opts_from_el(el, prefix){
		// Derive options from element data-attrs
		var data = $(el).data(),
			out = {}, inkey,
			replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
		prefix = new RegExp('^' + prefix.toLowerCase());
		function re_lower(_,a){
			return a.toLowerCase();
		}
		for (var key in data)
			if (prefix.test(key)){
				inkey = key.replace(replace, re_lower);
				out[inkey] = data[key];
			}
		return out;
	}

	function opts_from_locale(lang){
		// Derive options from locale plugins
		var out = {};
		// Check if "de-DE" style date is available, if not language should
		// fallback to 2 letter code eg "de"
		if (!dates[lang]){
			lang = lang.split('-')[0];
			if (!dates[lang])
				return;
		}
		var d = dates[lang];
		$.each(locale_opts, function(i,k){
			if (k in d)
				out[k] = d[k];
		});
		return out;
	}

	var old = $.fn.datepicker;
	$.fn.datepicker = function(option){
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function(){
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option === 'object' && option;
			if (!data){
				var elopts = opts_from_el(this, 'date'),
					// Preliminary otions
					xopts = $.extend({}, defaults, elopts, options),
					locopts = opts_from_locale(xopts.language),
					// Options priority: js args, data-attrs, locales, defaults
					opts = $.extend({}, defaults, locopts, elopts, options);
				if ($this.is('.input-daterange') || opts.inputs){
					var ropts = {
						inputs: opts.inputs || $this.find('input').toArray()
					};
					$this.data('datepicker', (data = new DateRangePicker(this, $.extend(opts, ropts))));
				}
				else {
					$this.data('datepicker', (data = new Datepicker(this, opts)));
				}
			}
			if (typeof option === 'string' && typeof data[option] === 'function'){
				internal_return = data[option].apply(data, args);
				if (internal_return !== undefined)
					return false;
			}
		});
		if (internal_return !== undefined)
			return internal_return;
		else
			return this;
	};

	var defaults = $.fn.datepicker.defaults = {
		autoclose: false,
		beforeShowDay: $.noop,
		calendarWeeks: false,
		clearBtn: false,
		daysOfWeekDisabled: [],
		endDate: Infinity,
		forceParse: true,
		format: 'mm/dd/yyyy',
		keyboardNavigation: true,
		language: 'en',
		minViewMode: 0,
		multidate: false,
		multidateSeparator: ',',
		orientation: "auto",
		rtl: false,
		startDate: -Infinity,
		startView: 0,
		todayBtn: false,
		todayHighlight: false,
		weekStart: 0
	};
	var locale_opts = $.fn.datepicker.locale_opts = [
		'format',
		'rtl',
		'weekStart'
	];
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			today: "Today",
			clear: "Clear"
		}
	};

	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		isLeapYear: function(year){
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
		},
		getDaysInMonth: function(year, month){
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language){
			if (!date)
				return undefined;
			if (date instanceof Date)
				return date;
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			var part_re = /([\-+]\d+)([dmwy])/,
				parts = date.match(/([\-+]\d+)([dmwy])/g),
				part, dir, i;
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)){
				date = new Date();
				for (i=0; i < parts.length; i++){
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch (part[2]){
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
			}
			parts = date && date.match(this.nonpunctuation) || [];
			date = new Date();
			var parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){
						return d.setUTCFullYear(v);
					},
					yy: function(d,v){
						return d.setUTCFullYear(2000+v);
					},
					m: function(d,v){
						if (isNaN(d))
							return d;
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() !== v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){
						return d.setUTCDate(v);
					}
				},
				val, filtered;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length !== fparts.length){
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			function match_part(){
				var m = this.slice(0, parts[i].length),
					p = parts[i].slice(0, m.length);
				return m === p;
			}
			if (parts.length === fparts.length){
				var cnt;
				for (i=0, cnt = fparts.length; i < cnt; i++){
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)){
						switch (part){
							case 'MM':
								filtered = $(dates[language].months).filter(match_part);
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(match_part);
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				var _date, s;
				for (i=0; i < setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s])){
						_date = new Date(date);
						setters_map[s](_date, parsed[s]);
						if (!isNaN(_date))
							date = _date;
					}
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
			if (!date)
				return '';
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			date = [];
			var seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
							'<tr>'+
								'<th class="prev">&laquo;</th>'+
								'<th colspan="5" class="datepicker-switch"></th>'+
								'<th class="next">&raquo;</th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot>'+
							'<tr>'+
								'<th colspan="7" class="today"></th>'+
							'</tr>'+
							'<tr>'+
								'<th colspan="7" class="clear"></th>'+
							'</tr>'+
						'</tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;


	/* DATEPICKER NO CONFLICT
	* =================== */

	$.fn.datepicker.noConflict = function(){
		$.fn.datepicker = old;
		return this;
	};


	/* DATEPICKER DATA-API
	* ================== */

	$(document).on(
		'focus.datepicker.data-api click.datepicker.data-api',
		'[data-provide="datepicker"]',
		function(e){
			var $this = $(this);
			if ($this.data('datepicker'))
				return;
			e.preventDefault();
			// component click requires us to explicitly show it
			$this.datepicker('show');
		}
	);
	$(function(){
		$('[data-provide="datepicker-inline"]').datepicker();
	});

}(window.jQuery));

define("datepicker", function(){});

/*global define*/

define('views/form/_form',[
    'validator',
    'datepicker',
    'popup'
], function(
    Validator,
    Datepicker,
    Popup) {

    'use strict';

    var Form = IEA.module('UI.form', function(module, app, iea) {

        _.extend(module, {
            defaultSettings: {
                calenderInput: '.input-calendar',
                calenderTodayBtn: 'linked',
                calenderAutoclose: true,
                calenderTodayHighlight: true,
                popupClass: 'white-popup-block',
                popupOpenType: 'inline',
                multivalueField: '.multivalue-field'
            },
            events: {
                'submit form': '_handleFormSubmit',
                'reset form': '_handleFormReset',
                'click .add-input': '_addMultiValueField',
                'click .remove-input': '_removeInput',
                'click .calendar-input': '_openCalendar'
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
             * intialize form component
             * @method initialize
             * @param {} options
             * @return
             */
            initialize: function(options) {
                this._super(options);
                this.validator = app.form.validator; // need to include validation DI to define.
                this.formCalendarLoaded = false;
                this.changedSet = {};
                this.isvalidationRequired = false;
                this.isFormValid = false;
                this.isSubmitted = false;
                this.multiValueFields = {};

                this.validator.addValidation(this, {
                    model: this.model
                });

                this.triggerMethod('init');
            },

            /**
             * render form view
             * @method render
             * @return ThisExpression
             */
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));

                if (this._isEnabled === false) {
                    this.enable();
                    this._isEnabled = true;
                }

                this.triggerMethod('render');

                return this;
            },

            /**
             * enable form
             * @method enable
             * @return
             */
            enable: function() {
                this.triggerMethod('beforEnable');

                var modelData = this.model.get('data'),
                    allElementsConfig = modelData.form.formElementsConfig,
                    idx = 0,
                    item, $elem;

                this.$form = $('form', this.$el);
                this.$formElements = this.$form.find(':input');
                this.popup = IEA.popup();
                this.form = {
                    isAjax: this.$form.data('ajax') || (modelData.form.isAjax) ? modelData.form.isAjax : false,
                    postURL: this.$form.attr('action') || (modelData.form.servletPath) ? modelData.form.servletPath : '',
                    failureMessage: this.$form.data('fail') || (modelData.form.failureMessage) ? modelData.form.failureMessage : 'Submission Failed',
                    successMessage: this.$form.data('success') || (modelData.form.successMessage) ? modelData.form.successMessage : 'Thank you for your submission',
                    validation: this.$form.data('validation') || (modelData.form.validation) ? modelData.form.validation : false,
                    successRedirectURL: this.$form.data('redirect') || (modelData.form.redirect) ? modelData.form.redirect : false,
                    errorRedirectURL: this.$form.data('redirect') || (modelData.form.failureRedirect) ? modelData.form.failureRedirect : false
                };

                this.setElementActions();

                // add validation rules from the model into the validator engine.
                this.validator.addRules(this, {
                    rules: this._createValidationRules()
                });

                // Getting all the multivalue field together
                for(idx=0; idx < allElementsConfig.length; idx++) {
                    item = allElementsConfig[idx].formElement;
                    if(item && item.multivalue) {
                        // adding rule to the first elemnet of multivalue
                        this.multiValueFields[item.name] = {
                            'name': item.name,
                            rules: this.model.validation[item.name]
                        };

                        $elem = $('input[name^='+item.name+']');
                        this._setUpMultiValueField($elem, item.name, item.name+'_1' );

                        delete this.model.validation[item.name];
                    }
                }

                this.triggerMethod('enable');
            },

            /**
             * set element behaviours
             * @method setElementActions
             * @return
             */
            setElementActions: function() {
                var settings = this.defaultSettings,
                    $dateInput = $(settings.calenderInput, this.$el);

                if (this.formCalendarLoaded === false) {
                    $dateInput.datepicker({
                        format: $dateInput.data('format'),
                        todayBtn: settings.calenderTodayBtn,
                        autoclose: settings.calenderAutoclose,
                        todayHighlight: settings.calenderTodayHighlight,
                        orientation: app.getValue('isMobileBreakpoint') ? 'top' : 'auto'
                    }).on('changeDate', function(ev){
                        $dateInput.datepicker('hide');
                    });

                    this.formCalendarLoaded = true;

                    $dateInput.on('focus', function(evt) {
                        if(!app.getValue('isDesktopBreakpoint')) {
                            $dateInput.blur();
                        }
                    });
                }

            },

            /**
             * unset all the element behaviours, used when switching viewport
             * @method unsetElementActions
             * @return
             */
            unsetElementActions: function() {
                $dateInput.datepicker('remove');
                this.formCalendarLoaded = false;
            },

            /**
             * on match desktop do some action
             * @method onMatchDesktop
             * @return
             */
            onMatchDesktop: function() {
                this.setElementActions();
            },

            /**
             * on unmatch desktop do some action
             * @method onUnmatchDesktop
             * @return
             */
            onUnmatchDesktop: function() {
                this.setElementActions();
            },

            /**
             * show copmnent
             * @method show
             * @return
             */
            show: function() {
                this._super();
            },

            /**
             * hide component
             * @method hide
             * @param {} cb
             * @param {} scope
             * @param {} params
             * @return
             */
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
             * clean compnent on exist from the component
             * @method clean
             * @return
             */
            clean: function() {
                this._super();
                this.unsetElementActions();
                this.validator.removeValidation(this, {
                    model: this.model
                });
            },

            /* ----------------------------------------------------------------------------- *\
               Private Methods
            \* ----------------------------------------------------------------------------- */

            /**
             * create validation rules from the model data and then create a the validation rules which
             * then is set to the form validation engine
             * @method _createValidationRules
             * @return validationRules
             */
            _createValidationRules: function() {
                var self = this,
                    formElements = this.model.get('data').form.formElementsConfig,
                    element, elementRule = {},
                    validationRules = {},
                    idx = 0,
                    jdx = 0,
                    pattern;

                for(idx = 0; idx<formElements.length; idx++) {
                    element = formElements[idx];
                    if(!_.isFunction(element.formElement)) {
                        validationRules[element.formElement.name] = [];
                        if (typeof element.formElement.rules !== 'undefined' && _.isArray(element.formElement.rules)) {

                            for (jdx = 0; jdx<element.formElement.rules.length; jdx++) {
                                self.isvalidationRequired = true;
                                elementRule = element.formElement.rules[jdx];
                                validationRules[element.formElement.name].push({
                                    xss: true
                                });
                                if (_.has(elementRule, 'pattern')) {
                                    if(elementRule.pattern === 'creditcard') {
                                        validationRules[element.formElement.name].push({
                                            creditcard: true,
                                            msg: elementRule.msg
                                        });
                                    } else {
                                        pattern = decodeURIComponent(elementRule.pattern).replace(/%24/g, '$');
                                        validationRules[element.formElement.name].push({
                                            pattern: this.validator.patterns[pattern] || new RegExp(pattern),
                                            msg: elementRule.msg
                                        });
                                    }
                                    
                                } else {
                                    validationRules[element.formElement.name].push(elementRule);
                                }
                            }

                        }
                    }
                }

                return validationRules;
            },

            /**
             * handle submit
             * @method _handleFormSubmit
             * @param {} evt
             * @return
             */
            _handleFormSubmit: function(evt) {
                var formData = IEA.serializeFormObject(this.$form),
                    submitxhr, idx =0, key, item;

                evt.preventDefault();

                this.model.unset(this.changedSet);
                this.model.set(formData);
                this.changedSet = this.model.changed;

                // Check if the model is valid before saving
                // See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
                if (!this.isvalidationRequired || (this.isvalidationRequired && this.model.isValid(true))) {
                    this.isFormValid = true;
                } else {
                    this.isFormValid = false;
                }

                for(idx in this.multiValueFields) {
                    var multiValueArray = [],
                        match, elem;
                    item = this.multiValueFields[idx];

                    // Get the value from input field and put it back to its hidden field
                    for(key in formData) {
                        match = key.match(item.name);
                        if(match && match.length > 0) {
                            elem = $('input[name='+key+']');
                            elem.siblings('input[type=hidden]').val(elem.val());
                        }
                    }

                    formData[item] = multiValueArray;
                }

                if(this.$errorBlock) {
                    this.$errorBlock.hide();
                }

                if (this.isFormValid && this.form.postURL !== '' && this.isSubmitted === false) {
                    if (this.form.isAjax) {

                        submitxhr = $.post(this.form.postURL, this.$form.serialize());
                        submitxhr.done($.proxy(this._successHandler, this));
                        submitxhr.fail($.proxy(this._errorHandler, this));

                    } else {
                        this.$form[0].submit();
                    }
                    this.triggerMethod('formSubmit', this);
                    this.isSubmitted = true;
                }
            },

            /**
             * handle form reset. all the errors and fields should be reset
             * @method _handleFormReset
             * @return
             */
            _handleFormReset: function() {
                var self = this,
                    formData = IEA.serializeFormObject(this.$form);

                // remove all the data from the model
                this.model.unset(formData);

                this.isFormValid = false;
                this.isSubmitted = false;

                // loop throught each element and remove the error classes
                this.$formElements.each(function() {
                    self.validator.callbacks.valid(self, $(this).attr('name'));
                });

                // removing multivalue field other than first one
                $('.form-group .multivalue').each(function(index) {
                    $(this).find(self.defaultSettings.multivalueField).each(function(index) {
                        if(index === 0) {
                            $(this).find('.remove-input').removeClass('remove-input').addClass('add-input')
                                   .find('.glyphicon-minus').removeClass('glyphicon-minus').addClass('glyphicon-plus');
                        } else {
                            $(this).remove();
                        }
                    });
                });

                this.triggerMethod('formReset', this);
            },

            /**
             * on success submission of the form
             * @method _successHandler
             * @param {} data
             * @return
             */
            _successHandler: function(data) {

                if(data.responseHeaders.status === 200) {
                    if (typeof this.form.successRedirectURL !== 'undefined' && this.form.successRedirectURL !== '' && this.form.successRedirectURL !== false) {
                        // if the router is running, then make sure its using hash url change
                        // otherwise change the complete URL
                        if (IEA.History.started) {
                            Router.navigate(this.form.successRedirectURL, {
                                trigger: true
                            });
                        } else {
                            window.location.href = this.form.successRedirectURL;
                        }
                    } else {
                        this.$sucessMsgBlock = $('<div class="form-success-msg"><span class="glyphicon glyphicon-ok"></span><span class="success-msg-text">' + this.form.successMessage + '</span></div>');
                        this.$form.before(this.$sucessMsgBlock);
                        this.$form.hide();
                    }
                } else {
                    this._errorHandler();
                }
                this.triggerMethod('success', this);
                this.isSubmitted = false;
            },

            /**
             * on form submission error
             * @method _errorHandler
             * @param {} err
             * @return
             */
            _errorHandler: function(err) {

                if (typeof this.form.errorRedirectURL !== 'undefined' && this.form.errorRedirectURL !== '' && this.form.errorRedirectURL !== false) {
                    // if the router is running, then make sure its using hash url change
                    // otherwise change the complete URL
                    if (IEA.History.started) {
                        Router.navigate(this.form.errorRedirectURL, {
                            trigger: true
                        });
                    } else {
                        window.location.href = this.form.errorRedirectURL;
                    }
                } else {
                    this.$errorBlock = $('<div class="form-error-msg text-danger"><span class="glyphicon glyphicon-warning-sign"></span><span class="error-msg-text">' + this.form.failureMessage + '</span></div>');
                    this.$form.before(this.$errorBlock);
                }

                this.triggerMethod('error', this.form.failureMessage);
                this.isSubmitted = false;
            },

            /**
             * Description
             * @method _addMultiValueField
             * @return elemObj
             */
            _addMultiValueField: function (evt) {

                var addInput = $(evt.currentTarget),
                    parentField = addInput.parents(this.defaultSettings.multivalueField),
                    multiInputFields = addInput.parents('.multivalue ').find(this.defaultSettings.multivalueField),
                    inputLimit = addInput.parent().attr('data-input-limit');

                // If limit is not provided put some bigger value
                inputLimit = inputLimit ? inputLimit : 100000;

                if(inputLimit && inputLimit > multiInputFields.length) {

                    var toBeAdded = $(parentField[0]).clone(true),
                        attrName = toBeAdded.find('input[type=text]').attr('name').slice(0, -2),
                        newAttrName = attrName + '_' + (multiInputFields.length +1),
                        inputElem =  toBeAdded.find('input').val('');


                    $(parentField[0]).find('.add-input')
                                          .removeClass('add-input')
                                          .addClass('remove-input');

                    $(parentField[0]).find('.glyphicon-plus')
                                          .removeClass('glyphicon-plus')
                                          .addClass('glyphicon-minus');

                    $(parentField[0]).after(toBeAdded);
                    this._setUpMultiValueField(inputElem, attrName, newAttrName);
                } else {
                    alert('Limit reached');
                }

            },

            /**
             * Description
             * @method _setUpMultiValueField
             * @return
             */
            _setUpMultiValueField: function(elem, attrName, newAttrName) {
                var newRule = {};

                elem.attr('name', newAttrName);
                elem.siblings('input[type=hidden]').attr('name', attrName);

                newRule[newAttrName] = this.multiValueFields[attrName].rules;

                this.validator.addRules(this, {
                    rules: newRule
                });
            },

            /**
             * Description
             * @method _removeInput
             * @return
             */
            _removeInput: function(evt) {

                var minusIcon = $(evt.currentTarget),
                    inputField = minusIcon.parents(this.defaultSettings.multivalueField);

                inputField.remove();
            },

            /**
             * Description
             * @method _openCalendar
             * @return
             */
            _openCalendar: function(evt) {
                var calIcon = $(evt.currentTarget),
                    inputField = calIcon.siblings('input');
                inputField.focus();
            },

            /**
             * Description
             * @method _populateElems
             * @return elemObj
             */
            _populateElems: function() {
                var elems = this.form.elements,
                    errorNode = null,
                    elemObj = {};
                for (var elem in elems) {
                    if (typeof elems[elem] === 'object' && ['submit', 'reset'].indexOf(elems[elem].type) === -1) {
                        errorNode = $(elems[elem]).parents('.row:first').find('.error')[0];
                        elemObj[elems[elem].name] = {
                            node: elems[elem],
                            type: elems[elem].type,
                            required: elems[elem].dataset.required || 'undefined',
                            constraint: unescape(elems[elem].dataset.constraint),
                            errorRequired: errorNode.dataset['errorRequired'],
                            errorConstraint: errorNode.dataset['errorConstraint'],
                            errorNode: errorNode
                        };
                    }
                }
                return elemObj;
            }
        });
    });

    return Form;
});

/* Tooltipster v3.2.6 */;(function(e,t,n){function s(t,n){this.bodyOverflowX;this.callbacks={hide:[],show:[]};this.checkInterval=null;this.Content;this.$el=e(t);this.$elProxy;this.elProxyPosition;this.enabled=true;this.options=e.extend({},i,n);this.mouseIsOverProxy=false;this.namespace="tooltipster-"+Math.round(Math.random()*1e5);this.Status="hidden";this.timerHide=null;this.timerShow=null;this.$tooltip;this.options.iconTheme=this.options.iconTheme.replace(".","");this.options.theme=this.options.theme.replace(".","");this._init()}function o(t,n){var r=true;e.each(t,function(e,i){if(typeof n[e]==="undefined"||t[e]!==n[e]){r=false;return false}});return r}function f(){return!a&&u}function l(){var e=n.body||n.documentElement,t=e.style,r="transition";if(typeof t[r]=="string"){return true}v=["Moz","Webkit","Khtml","O","ms"],r=r.charAt(0).toUpperCase()+r.substr(1);for(var i=0;i<v.length;i++){if(typeof t[v[i]+r]=="string"){return true}}return false}var r="tooltipster",i={animation:"fade",arrow:true,arrowColor:"",autoClose:true,content:null,contentAsHTML:false,contentCloning:true,debug:true,delay:200,minWidth:0,maxWidth:null,functionInit:function(e,t){},functionBefore:function(e,t){t()},functionReady:function(e,t){},functionAfter:function(e){},icon:"(?)",iconCloning:true,iconDesktop:false,iconTouch:false,iconTheme:"tooltipster-icon",interactive:false,interactiveTolerance:350,multiple:false,offsetX:0,offsetY:0,onlyOne:false,position:"top",positionTracker:false,speed:350,timer:0,theme:"tooltipster-default",touchDevices:true,trigger:"hover",updateAnimation:true};s.prototype={_init:function(){var t=this;if(n.querySelector){if(t.options.content!==null){t._content_set(t.options.content)}else{var r=t.$el.attr("title");if(typeof r==="undefined")r=null;t._content_set(r)}var i=t.options.functionInit.call(t.$el,t.$el,t.Content);if(typeof i!=="undefined")t._content_set(i);t.$el.removeAttr("title").addClass("tooltipstered");if(!u&&t.options.iconDesktop||u&&t.options.iconTouch){if(typeof t.options.icon==="string"){t.$elProxy=e('<span class="'+t.options.iconTheme+'"></span>');t.$elProxy.text(t.options.icon)}else{if(t.options.iconCloning)t.$elProxy=t.options.icon.clone(true);else t.$elProxy=t.options.icon}t.$elProxy.insertAfter(t.$el)}else{t.$elProxy=t.$el}if(t.options.trigger=="hover"){t.$elProxy.on("mouseenter."+t.namespace,function(){if(!f()||t.options.touchDevices){t.mouseIsOverProxy=true;t._show()}}).on("mouseleave."+t.namespace,function(){if(!f()||t.options.touchDevices){t.mouseIsOverProxy=false}});if(u&&t.options.touchDevices){t.$elProxy.on("touchstart."+t.namespace,function(){t._showNow()})}}else if(t.options.trigger=="click"){t.$elProxy.on("click."+t.namespace,function(){if(!f()||t.options.touchDevices){t._show()}})}}},_show:function(){var e=this;if(e.Status!="shown"&&e.Status!="appearing"){if(e.options.delay){e.timerShow=setTimeout(function(){if(e.options.trigger=="click"||e.options.trigger=="hover"&&e.mouseIsOverProxy){e._showNow()}},e.options.delay)}else e._showNow()}},_showNow:function(n){var r=this;r.options.functionBefore.call(r.$el,r.$el,function(){if(r.enabled&&r.Content!==null){if(n)r.callbacks.show.push(n);r.callbacks.hide=[];clearTimeout(r.timerShow);r.timerShow=null;clearTimeout(r.timerHide);r.timerHide=null;if(r.options.onlyOne){e(".tooltipstered").not(r.$el).each(function(t,n){var r=e(n),i=r.data("tooltipster-ns");e.each(i,function(e,t){var n=r.data(t),i=n.status(),s=n.option("autoClose");if(i!=="hidden"&&i!=="disappearing"&&s){n.hide()}})})}var i=function(){r.Status="shown";e.each(r.callbacks.show,function(e,t){t.call(r.$el)});r.callbacks.show=[]};if(r.Status!=="hidden"){var s=0;if(r.Status==="disappearing"){r.Status="appearing";if(l()){r.$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-"+r.options.animation+"-show");if(r.options.speed>0)r.$tooltip.delay(r.options.speed);r.$tooltip.queue(i)}else{r.$tooltip.stop().fadeIn(i)}}else if(r.Status==="shown"){i()}}else{r.Status="appearing";var s=r.options.speed;r.bodyOverflowX=e("body").css("overflow-x");e("body").css("overflow-x","hidden");var o="tooltipster-"+r.options.animation,a="-webkit-transition-duration: "+r.options.speed+"ms; -webkit-animation-duration: "+r.options.speed+"ms; -moz-transition-duration: "+r.options.speed+"ms; -moz-animation-duration: "+r.options.speed+"ms; -o-transition-duration: "+r.options.speed+"ms; -o-animation-duration: "+r.options.speed+"ms; -ms-transition-duration: "+r.options.speed+"ms; -ms-animation-duration: "+r.options.speed+"ms; transition-duration: "+r.options.speed+"ms; animation-duration: "+r.options.speed+"ms;",f=r.options.minWidth?"min-width:"+Math.round(r.options.minWidth)+"px;":"",c=r.options.maxWidth?"max-width:"+Math.round(r.options.maxWidth)+"px;":"",h=r.options.interactive?"pointer-events: auto;":"";r.$tooltip=e('<div class="tooltipster-base '+r.options.theme+'" style="'+f+" "+c+" "+h+" "+a+'"><div class="tooltipster-content"></div></div>');if(l())r.$tooltip.addClass(o);r._content_insert();r.$tooltip.appendTo("body");r.reposition();r.options.functionReady.call(r.$el,r.$el,r.$tooltip);if(l()){r.$tooltip.addClass(o+"-show");if(r.options.speed>0)r.$tooltip.delay(r.options.speed);r.$tooltip.queue(i)}else{r.$tooltip.css("display","none").fadeIn(r.options.speed,i)}r._interval_set();e(t).on("scroll."+r.namespace+" resize."+r.namespace,function(){r.reposition()});if(r.options.autoClose){e("body").off("."+r.namespace);if(r.options.trigger=="hover"){if(u){setTimeout(function(){e("body").on("touchstart."+r.namespace,function(){r.hide()})},0)}if(r.options.interactive){if(u){r.$tooltip.on("touchstart."+r.namespace,function(e){e.stopPropagation()})}var p=null;r.$elProxy.add(r.$tooltip).on("mouseleave."+r.namespace+"-autoClose",function(){clearTimeout(p);p=setTimeout(function(){r.hide()},r.options.interactiveTolerance)}).on("mouseenter."+r.namespace+"-autoClose",function(){clearTimeout(p)})}else{r.$elProxy.on("mouseleave."+r.namespace+"-autoClose",function(){r.hide()})}}else if(r.options.trigger=="click"){setTimeout(function(){e("body").on("click."+r.namespace+" touchstart."+r.namespace,function(){r.hide()})},0);if(r.options.interactive){r.$tooltip.on("click."+r.namespace+" touchstart."+r.namespace,function(e){e.stopPropagation()})}}}}if(r.options.timer>0){r.timerHide=setTimeout(function(){r.timerHide=null;r.hide()},r.options.timer+s)}}})},_interval_set:function(){var t=this;t.checkInterval=setInterval(function(){if(e("body").find(t.$el).length===0||e("body").find(t.$elProxy).length===0||t.Status=="hidden"||e("body").find(t.$tooltip).length===0){if(t.Status=="shown"||t.Status=="appearing")t.hide();t._interval_cancel()}else{if(t.options.positionTracker){var n=t._repositionInfo(t.$elProxy),r=false;if(o(n.dimension,t.elProxyPosition.dimension)){if(t.$elProxy.css("position")==="fixed"){if(o(n.position,t.elProxyPosition.position))r=true}else{if(o(n.offset,t.elProxyPosition.offset))r=true}}if(!r){t.reposition()}}}},200)},_interval_cancel:function(){clearInterval(this.checkInterval);this.checkInterval=null},_content_set:function(e){if(typeof e==="object"&&e!==null&&this.options.contentCloning){e=e.clone(true)}this.Content=e},_content_insert:function(){var e=this,t=this.$tooltip.find(".tooltipster-content");if(typeof e.Content==="string"&&!e.options.contentAsHTML){t.text(e.Content)}else{t.empty().append(e.Content)}},_update:function(e){var t=this;t._content_set(e);if(t.Content!==null){if(t.Status!=="hidden"){t._content_insert();t.reposition();if(t.options.updateAnimation){if(l()){t.$tooltip.css({width:"","-webkit-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-moz-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-o-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-ms-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms",transition:"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms"}).addClass("tooltipster-content-changing");setTimeout(function(){if(t.Status!="hidden"){t.$tooltip.removeClass("tooltipster-content-changing");setTimeout(function(){if(t.Status!=="hidden"){t.$tooltip.css({"-webkit-transition":t.options.speed+"ms","-moz-transition":t.options.speed+"ms","-o-transition":t.options.speed+"ms","-ms-transition":t.options.speed+"ms",transition:t.options.speed+"ms"})}},t.options.speed)}},t.options.speed)}else{t.$tooltip.fadeTo(t.options.speed,.5,function(){if(t.Status!="hidden"){t.$tooltip.fadeTo(t.options.speed,1)}})}}}}else{t.hide()}},_repositionInfo:function(e){return{dimension:{height:e.outerHeight(false),width:e.outerWidth(false)},offset:e.offset(),position:{left:parseInt(e.css("left")),top:parseInt(e.css("top"))}}},hide:function(n){var r=this;if(n)r.callbacks.hide.push(n);r.callbacks.show=[];clearTimeout(r.timerShow);r.timerShow=null;clearTimeout(r.timerHide);r.timerHide=null;var i=function(){e.each(r.callbacks.hide,function(e,t){t.call(r.$el)});r.callbacks.hide=[]};if(r.Status=="shown"||r.Status=="appearing"){r.Status="disappearing";var s=function(){r.Status="hidden";if(typeof r.Content=="object"&&r.Content!==null){r.Content.detach()}r.$tooltip.remove();r.$tooltip=null;e(t).off("."+r.namespace);e("body").off("."+r.namespace).css("overflow-x",r.bodyOverflowX);e("body").off("."+r.namespace);r.$elProxy.off("."+r.namespace+"-autoClose");r.options.functionAfter.call(r.$el,r.$el);i()};if(l()){r.$tooltip.clearQueue().removeClass("tooltipster-"+r.options.animation+"-show").addClass("tooltipster-dying");if(r.options.speed>0)r.$tooltip.delay(r.options.speed);r.$tooltip.queue(s)}else{r.$tooltip.stop().fadeOut(r.options.speed,s)}}else if(r.Status=="hidden"){i()}return r},show:function(e){this._showNow(e);return this},update:function(e){return this.content(e)},content:function(e){if(typeof e==="undefined"){return this.Content}else{this._update(e);return this}},reposition:function(){var n=this;if(e("body").find(n.$tooltip).length!==0){n.$tooltip.css("width","");n.elProxyPosition=n._repositionInfo(n.$elProxy);var r=null,i=e(t).width(),s=n.elProxyPosition,o=n.$tooltip.outerWidth(false),u=n.$tooltip.innerWidth()+1,a=n.$tooltip.outerHeight(false);if(n.$elProxy.is("area")){var f=n.$elProxy.attr("shape"),l=n.$elProxy.parent().attr("name"),c=e('img[usemap="#'+l+'"]'),h=c.offset().left,p=c.offset().top,d=n.$elProxy.attr("coords")!==undefined?n.$elProxy.attr("coords").split(","):undefined;if(f=="circle"){var v=parseInt(d[0]),m=parseInt(d[1]),g=parseInt(d[2]);s.dimension.height=g*2;s.dimension.width=g*2;s.offset.top=p+m-g;s.offset.left=h+v-g}else if(f=="rect"){var v=parseInt(d[0]),m=parseInt(d[1]),y=parseInt(d[2]),b=parseInt(d[3]);s.dimension.height=b-m;s.dimension.width=y-v;s.offset.top=p+m;s.offset.left=h+v}else if(f=="poly"){var w=[],E=[],S=0,x=0,T=0,N=0,C="even";for(var k=0;k<d.length;k++){var L=parseInt(d[k]);if(C=="even"){if(L>T){T=L;if(k===0){S=T}}if(L<S){S=L}C="odd"}else{if(L>N){N=L;if(k==1){x=N}}if(L<x){x=L}C="even"}}s.dimension.height=N-x;s.dimension.width=T-S;s.offset.top=p+x;s.offset.left=h+S}else{s.dimension.height=c.outerHeight(false);s.dimension.width=c.outerWidth(false);s.offset.top=p;s.offset.left=h}}var A=0,O=0,M=0,_=parseInt(n.options.offsetY),D=parseInt(n.options.offsetX),P=n.options.position;function H(){var n=e(t).scrollLeft();if(A-n<0){r=A-n;A=n}if(A+o-n>i){r=A-(i+n-o);A=i+n-o}}function B(n,r){if(s.offset.top-e(t).scrollTop()-a-_-12<0&&r.indexOf("top")>-1){P=n}if(s.offset.top+s.dimension.height+a+12+_>e(t).scrollTop()+e(t).height()&&r.indexOf("bottom")>-1){P=n;M=s.offset.top-a-_-12}}if(P=="top"){var j=s.offset.left+o-(s.offset.left+s.dimension.width);A=s.offset.left+D-j/2;M=s.offset.top-a-_-12;H();B("bottom","top")}if(P=="top-left"){A=s.offset.left+D;M=s.offset.top-a-_-12;H();B("bottom-left","top-left")}if(P=="top-right"){A=s.offset.left+s.dimension.width+D-o;M=s.offset.top-a-_-12;H();B("bottom-right","top-right")}if(P=="bottom"){var j=s.offset.left+o-(s.offset.left+s.dimension.width);A=s.offset.left-j/2+D;M=s.offset.top+s.dimension.height+_+12;H();B("top","bottom")}if(P=="bottom-left"){A=s.offset.left+D;M=s.offset.top+s.dimension.height+_+12;H();B("top-left","bottom-left")}if(P=="bottom-right"){A=s.offset.left+s.dimension.width+D-o;M=s.offset.top+s.dimension.height+_+12;H();B("top-right","bottom-right")}if(P=="left"){A=s.offset.left-D-o-12;O=s.offset.left+D+s.dimension.width+12;var F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_;if(A<0&&O+o>i){var I=parseFloat(n.$tooltip.css("border-width"))*2,q=o+A-I;n.$tooltip.css("width",q+"px");a=n.$tooltip.outerHeight(false);A=s.offset.left-D-q-12-I;F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_}else if(A<0){A=s.offset.left+D+s.dimension.width+12;r="left"}}if(P=="right"){A=s.offset.left+D+s.dimension.width+12;O=s.offset.left-D-o-12;var F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_;if(A+o>i&&O<0){var I=parseFloat(n.$tooltip.css("border-width"))*2,q=i-A-I;n.$tooltip.css("width",q+"px");a=n.$tooltip.outerHeight(false);F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_}else if(A+o>i){A=s.offset.left-D-o-12;r="right"}}if(n.options.arrow){var R="tooltipster-arrow-"+P;if(n.options.arrowColor.length<1){var U=n.$tooltip.css("background-color")}else{var U=n.options.arrowColor}if(!r){r=""}else if(r=="left"){R="tooltipster-arrow-right";r=""}else if(r=="right"){R="tooltipster-arrow-left";r=""}else{r="left:"+Math.round(r)+"px;"}if(P=="top"||P=="top-left"||P=="top-right"){var z=parseFloat(n.$tooltip.css("border-bottom-width")),W=n.$tooltip.css("border-bottom-color")}else if(P=="bottom"||P=="bottom-left"||P=="bottom-right"){var z=parseFloat(n.$tooltip.css("border-top-width")),W=n.$tooltip.css("border-top-color")}else if(P=="left"){var z=parseFloat(n.$tooltip.css("border-right-width")),W=n.$tooltip.css("border-right-color")}else if(P=="right"){var z=parseFloat(n.$tooltip.css("border-left-width")),W=n.$tooltip.css("border-left-color")}else{var z=parseFloat(n.$tooltip.css("border-bottom-width")),W=n.$tooltip.css("border-bottom-color")}if(z>1){z++}var X="";if(z!==0){var V="",J="border-color: "+W+";";if(R.indexOf("bottom")!==-1){V="margin-top: -"+Math.round(z)+"px;"}else if(R.indexOf("top")!==-1){V="margin-bottom: -"+Math.round(z)+"px;"}else if(R.indexOf("left")!==-1){V="margin-right: -"+Math.round(z)+"px;"}else if(R.indexOf("right")!==-1){V="margin-left: -"+Math.round(z)+"px;"}X='<span class="tooltipster-arrow-border" style="'+V+" "+J+';"></span>'}n.$tooltip.find(".tooltipster-arrow").remove();var K='<div class="'+R+' tooltipster-arrow" style="'+r+'">'+X+'<span style="border-color:'+U+';"></span></div>';n.$tooltip.append(K)}n.$tooltip.css({top:Math.round(M)+"px",left:Math.round(A)+"px"})}return n},enable:function(){this.enabled=true;return this},disable:function(){this.hide();this.enabled=false;return this},destroy:function(){var t=this;t.hide();if(t.$el[0]!==t.$elProxy[0])t.$elProxy.remove();t.$el.removeData(t.namespace).off("."+t.namespace);var n=t.$el.data("tooltipster-ns");if(n.length===1){var r=typeof t.Content==="string"?t.Content:e("<div></div>").append(t.Content).html();t.$el.removeClass("tooltipstered").attr("title",r).removeData(t.namespace).removeData("tooltipster-ns").off("."+t.namespace)}else{n=e.grep(n,function(e,n){return e!==t.namespace});t.$el.data("tooltipster-ns",n)}return t},elementIcon:function(){return this.$el[0]!==this.$elProxy[0]?this.$elProxy[0]:undefined},elementTooltip:function(){return this.$tooltip?this.$tooltip[0]:undefined},option:function(e,t){if(typeof t=="undefined")return this.options[e];else{this.options[e]=t;return this}},status:function(){return this.Status}};e.fn[r]=function(){var t=arguments;if(this.length===0){if(typeof t[0]==="string"){var n=true;switch(t[0]){case"setDefaults":e.extend(i,t[1]);break;default:n=false;break}if(n)return true;else return this}else{return this}}else{if(typeof t[0]==="string"){var r="#*$~&";this.each(function(){var n=e(this).data("tooltipster-ns"),i=n?e(this).data(n[0]):null;if(i){if(typeof i[t[0]]==="function"){var s=i[t[0]](t[1],t[2])}else{throw new Error('Unknown method .tooltipster("'+t[0]+'")')}if(s!==i){r=s;return false}}else{throw new Error("You called Tooltipster's \""+t[0]+'" method on an uninitialized element')}});return r!=="#*$~&"?r:this}else{var o=[],u=t[0]&&typeof t[0].multiple!=="undefined",a=u&&t[0].multiple||!u&&i.multiple,f=t[0]&&typeof t[0].debug!=="undefined",l=f&&t[0].debug||!f&&i.debug;this.each(function(){var n=false,r=e(this).data("tooltipster-ns"),i=null;if(!r){n=true}else if(a){n=true}else if(l){console.log('Tooltipster: one or more tooltips are already attached to this element: ignoring. Use the "multiple" option to attach more tooltips.')}if(n){i=new s(this,t[0]);if(!r)r=[];r.push(i.namespace);e(this).data("tooltipster-ns",r);e(this).data(i.namespace,i)}o.push(i)});if(a)return o;else return this}}};var u=!!("ontouchstart"in t);var a=false;e("body").one("mousemove",function(){a=true})})(jQuery,window,document);
define("tooltipster", function(){});

/*
Usage Example

//creating new instance of tootltip
var  tooltip = IEA.tooltip(element) // default configuration & element can be string or jQuery Object
ex. IEA.tooltip('.class-elem')
or
IEA.tooltip('#class-elem')
or
IEA.tooltip($('.class-elem')
NOTE: to use it with default config, do add 'title' attribute to your HTML element
or
var  tooltip = IEA.tooltip(element, {theme: 'my-custom-theme'}) // initialization with congiruation

//creating new instance of tootltip with content as markup
var  tooltip = IEA.tooltip(element, {content: '<div> Tooltip content as markup</div>', contentAsMarkup: true})

// creating tooltip instance with cross icon
var  tooltip = IEA.tooltip(element, {trigger: 'click'})

//public methods
tooltip.show();
tooltip.hide();
tooltip.disable();
tooltip.enable();
tooltip.destroy()
tooltip.content();
tooltip.updateContent();
tooltip.reposition();
tooltip.getTooltipElement();
tooltip.getIconElement();

//Events

*/

define('tooltip',['underscore',
    'iea',
    'tooltipster'
], function(_,
    IEA,
    Tooltipster) {

    'use strict';

    // get a new service method reference to Tooltip.
    IEA.service('tooltip', function(service, app, iea) {

        // new tooltip class defenition

        /**
        * Description
        * @method Tooltip
        * @return ThisExpression
        */
        var Tooltip = function(options) {
            return this;
        };

        // extend Tooltip defenition prototype
        _.extend(Tooltip.prototype, {

            initialize: function(element, options) {

                // Checking for the type of element to make it compatible
                if($.type(element) === 'string') {
                    this.element  = $(element);
                } else {
                    this.element  = element;
                }

                var self = this;
                var defaults = {
                    animation: 'fade',
                    arrow: true,
                    arrowColor: '',
                    autoClose: true,
                    content: null,
                    contentAsHTML: false,
                    contentCloning: true,
                    debug: true,
                    delay: 200,
                    minWidth: 0,
                    maxWidth: null,
                    icon: '(?)',
                    //If you provide a jQuery object to the 'icon' option, this sets if it is a clone of this object that should actually be used.
                    iconCloning: true,
                    //Generate an icon next to your content that is responsible for activating the tooltip on non-touch devices
                    iconDesktop: false,
                    iconTheme: 'tooltipster-icon',
                    iconTouch: false,
                    interactive: false,
                    interactiveTolerance: 350,
                    multiple: false,
                    offsetX: 0,
                    offsetY: 0,
                    onlyOne: false,
                    position: 'bottom',
                    speed: 350,
                    timer: 0,
                    theme: 'tooltipster-default',
                    touchDevices: true,
                    trigger: 'hover',
                    updateAnimation: true,
                    contentAsMarkup: false,

                    //Create a custom function to be fired only once at instantiation
                    functionInit: function(origin, content) {
                        self.triggerMethod('tooltip:init', origin, content);
                    },
                    //Create a custom function to be fired before the tooltip opens
                    functionBefore: function(origin, continueTooltip) {
                        continueTooltip();
                        self.triggerMethod('tooltip:before', origin, self);
                    },
                    //Create a custom function to be fired once the tooltip has been closed and removed from the DOM
                    functionAfter: function(origin) {
                        self.triggerMethod('tooltip:after', origin);
                    },
                    //Create a custom function to be fired when the tooltip and its contents have been added to the DOM
                    functionReady: function(origin, tooltip) {
                        self.triggerMethod('tooltip:ready', origin, tooltip, self);
                    }

                };

                this.options = _.extend(defaults, options);

                // If content is markup
                if(this.options.contentAsMarkup) {
                    this.options.content = $(this.options.content);
                }

                this._checkForCrossIcon();
                this.instance = this.element.tooltipster(this.options);

                return this;
            },


            /**
             * Checks for the trigger option if it is click then only add the icon
             * @method show
             * @return
             */
            _checkForCrossIcon: function() {
                var self = this;
                //If trigger is click add closs icon to let it close
                if(this.options.trigger === 'click') {
                    var crossIcon = $('<span class="cross-icon-tooltip"><i class="icon-close-light"></i></span>');

                    this.options.content.append(crossIcon);

                    // attaching event to cross icon
                    this.options.content.find('.cross-icon-tooltip').click(function() {
                        self.hide();
                    });

                    this.options.autoClose = false;
                    this.options.interactive = true;
                }
            },

            /**
             * Displays tooltip and callback is called
             * @method show
             * @return
             */
            show: function(callback) {
                this.element.tooltipster('show', callback);
                this.triggerMethod('tooltip:show');
            },

            /**
             * Hides tooltip and callback is called
             * @method hide
             * @return
             */
            hide: function(callback) {
                this.element.tooltipster('hide', callback);
                this.triggerMethod('tooltip:hide');
            },

            /**
             * Temporarily disable a tooltip from being able to open
             * @method disable
             * @return
             */
            disable: function() {
                this.element.tooltipster('disable');
                this.triggerMethod('tooltip:disable');
            },

            /**
             * If a tooltip was disabled from opening, reenable its previous functionality
             * @method enable
             * @return
             */
            enable: function() {
                this.element.tooltipster('enable');
                this.triggerMethod('tooltip:enable');
            },

            /**
             * Hide and destroy tooltip functionality
             * @method destroy
             * @return
             */
            destroy: function() {
                this.element.tooltipster('destroy');
                this.triggerMethod('tooltip:destroy');
            },

            /**
             * Return a tooltip's current content (if selector contains multiple origins, only the value of the first will be returned)
             * @method content
             * @return String
             */
            content: function() {
                return this.element.tooltipster('content');
            },

            /**
             * Update tooltip content
             * @method updateContent
             * @return
             */
            updateContent: function(newContent) {
                this.element.tooltipster('content', newContent);
                this.triggerMethod('tooltip:updateContent');
            },

            /**
             * Reposition and resize the tooltip
             * @method reposition
             * @return
             */
            reposition: function() {
                this.element.tooltipster('reposition');
                this.triggerMethod('tooltip:reposition');
            },

            /**
             * Return the HTML root element of the tooltip
             * @method getTooltipElement
             * @return HTML Element
             */
            getTooltipElement: function() {
                return this.element.tooltipster('elementTooltip');
            },

            /**
             * Return the HTML root element of the icon if there is one, 'undefined' otherwise
             * @method getIconElement
             * @return HTML Element
             */
            getIconElement: function() {
                return this.element.tooltipster('elementIcon');
            }
        });

        return Tooltip;
    });

});

/*global define*/

define('views/hotspot/_hotspot',[
    'tooltip'
], function(
    toolTip) {

    'use strict';

    var Hotspot = IEA.module('UI.hotspot', function (module, app, iea) {

        _.extend(module, {

            defaultSettings: {
                baseImage: '.base-image',
                pointerContainer: '.pointer',
                pointer: '.hotspot-pointer',
                pointerContent: '.hotspot-content',
                pointerEvent: 'click',
                pointerPosition: 'bottom',
                onlyOne: true
            },
            events: {
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this._super(options);

                this.triggerMethod('init');
            },

            /**
            @method render

            @return HotspotView
            **/
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));

                if (this._isEnabled === false) {
                    this.enable();
                    this._isEnabled = true;
                }

                this.triggerMethod('render');
                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/

                this.$el.find(this.defaultSettings.baseImage + ' picture img').on('load', $.proxy(this._plotPointers, this));
                this.$el.find(this.defaultSettings.baseImage + ' picture img').on('fail', this.triggerMethod('error', 'Error while loading base image'));
                this.on('window:resized', this._plotPointers);

                this.triggerMethod('enable', this);
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
                // view cleanup code here, anything that needs to be temporarily paused when view is not currently displayed
            },

            /* ----------------------------------------------------------------------------- *\
               Private Methods
            \* ----------------------------------------------------------------------------- */

            /**
            handle pointer plot

            @method _plotPointers

            @return {null}
            **/
            _plotPointers: function(evt){
                var config = this.defaultSettings,
                    $baseImage = $(config.baseImage),
                    $hotspotPointers = $(config.pointerContainer).not('.hidden'),
                    baseImageWidth = $baseImage.width(),
                    baseImageHeight = $baseImage.height(),
                    pointerHeight = $(config.pointer + ':first').height(),
                    pointerWidth = $(config.pointer + ':first').width(),
                    tooltipArray = [],
                    tooltipInstance = null;

                $.each($hotspotPointers, function(){
                    var $pointer = $(this).children(config.pointer),
                        $toolTipContent = $(this).children(config.pointerContent);
                    $pointer.css({
                        left: ($pointer.data('left')*baseImageWidth)/100 - pointerWidth/2,
                        top: ($pointer.data('top')*baseImageHeight)/100 - pointerHeight
                    });

                    tooltipInstance = IEA.tooltip($pointer, {content: $toolTipContent,
                                                                contentAsMarkup: true,
                                                                trigger: config.pointerEvent,
                                                                position: config.pointerPosition,
                                                                onlyOne: config.onlyOne });
                    tooltipArray.push(tooltipInstance);

                    tooltipInstance.on('tooltip:ready', function(origin, tooltip, object) {
                        var idx = 0,
                            length = tooltipArray.length;

                        for(idx = 0; idx<=length; idx++) {
                            // hide all toolt ip instances
                            if(tooltipArray[idx]) {
                                tooltipArray[idx].hide();
                            }
                        }
                        // show the current tooltip
                        object.show();
                    });
                });

            }
        });
    });

    return Hotspot;
});

/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */


/*!
 * EventEmitter v4.2.6 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

(function () {
	

	/**
	 * Class for managing events.
	 * Can be extended to provide event functionality in other classes.
	 *
	 * @class EventEmitter Manages event registering and emitting.
	 */
	function EventEmitter() {}

	// Shortcuts to improve speed and size
	var proto = EventEmitter.prototype;
	var exports = this;
	var originalGlobalValue = exports.EventEmitter;

	/**
	 * Finds the index of the listener for the event in it's storage array.
	 *
	 * @param {Function[]} listeners Array of listeners to search through.
	 * @param {Function} listener Method to look for.
	 * @return {Number} Index of the specified listener, -1 if not found
	 * @api private
	 */
	function indexOfListener(listeners, listener) {
		var i = listeners.length;
		while (i--) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Alias a method while keeping the context correct, to allow for overwriting of target method.
	 *
	 * @param {String} name The name of the target method.
	 * @return {Function} The aliased method
	 * @api private
	 */
	function alias(name) {
		return function aliasClosure() {
			return this[name].apply(this, arguments);
		};
	}

	/**
	 * Returns the listener array for the specified event.
	 * Will initialise the event object and listener arrays if required.
	 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	 * Each property in the object response is an array of listener functions.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Function[]|Object} All listener functions for the event.
	 */
	proto.getListeners = function getListeners(evt) {
		var events = this._getEvents();
		var response;
		var key;

		// Return a concatenated array of all matching events if
		// the selector is a regular expression.
		if (typeof evt === 'object') {
			response = {};
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					response[key] = events[key];
				}
			}
		}
		else {
			response = events[evt] || (events[evt] = []);
		}

		return response;
	};

	/**
	 * Takes a list of listener objects and flattens it into a list of listener functions.
	 *
	 * @param {Object[]} listeners Raw listener objects.
	 * @return {Function[]} Just the listener functions.
	 */
	proto.flattenListeners = function flattenListeners(listeners) {
		var flatListeners = [];
		var i;

		for (i = 0; i < listeners.length; i += 1) {
			flatListeners.push(listeners[i].listener);
		}

		return flatListeners;
	};

	/**
	 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Object} All listener functions for an event in an object.
	 */
	proto.getListenersAsObject = function getListenersAsObject(evt) {
		var listeners = this.getListeners(evt);
		var response;

		if (listeners instanceof Array) {
			response = {};
			response[evt] = listeners;
		}

		return response || listeners;
	};

	/**
	 * Adds a listener function to the specified event.
	 * The listener will not be added if it is a duplicate.
	 * If the listener returns true then it will be removed after it is called.
	 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListener = function addListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var listenerIsWrapped = typeof listener === 'object';
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
				listeners[key].push(listenerIsWrapped ? listener : {
					listener: listener,
					once: false
				});
			}
		}

		return this;
	};

	/**
	 * Alias of addListener
	 */
	proto.on = alias('addListener');

	/**
	 * Semi-alias of addListener. It will add a listener that will be
	 * automatically removed after it's first execution.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addOnceListener = function addOnceListener(evt, listener) {
		return this.addListener(evt, {
			listener: listener,
			once: true
		});
	};

	/**
	 * Alias of addOnceListener.
	 */
	proto.once = alias('addOnceListener');

	/**
	 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	 * You need to tell it what event names should be matched by a regex.
	 *
	 * @param {String} evt Name of the event to create.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvent = function defineEvent(evt) {
		this.getListeners(evt);
		return this;
	};

	/**
	 * Uses defineEvent to define multiple events.
	 *
	 * @param {String[]} evts An array of event names to define.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvents = function defineEvents(evts) {
		for (var i = 0; i < evts.length; i += 1) {
			this.defineEvent(evts[i]);
		}
		return this;
	};

	/**
	 * Removes a listener function from the specified event.
	 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to remove the listener from.
	 * @param {Function} listener Method to remove from the event.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListener = function removeListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var index;
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				index = indexOfListener(listeners[key], listener);

				if (index !== -1) {
					listeners[key].splice(index, 1);
				}
			}
		}

		return this;
	};

	/**
	 * Alias of removeListener
	 */
	proto.off = alias('removeListener');

	/**
	 * Adds listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	 * You can also pass it a regular expression to add the array of listeners to all events that match it.
	 * Yeah, this function does quite a bit. That's probably a bad thing.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListeners = function addListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(false, evt, listeners);
	};

	/**
	 * Removes listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be removed.
	 * You can also pass it a regular expression to remove the listeners from all events that match it.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListeners = function removeListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(true, evt, listeners);
	};

	/**
	 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	 * The first argument will determine if the listeners are removed (true) or added (false).
	 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be added/removed.
	 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	 *
	 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
		var i;
		var value;
		var single = remove ? this.removeListener : this.addListener;
		var multiple = remove ? this.removeListeners : this.addListeners;

		// If evt is an object then pass each of it's properties to this method
		if (typeof evt === 'object' && !(evt instanceof RegExp)) {
			for (i in evt) {
				if (evt.hasOwnProperty(i) && (value = evt[i])) {
					// Pass the single listener straight through to the singular method
					if (typeof value === 'function') {
						single.call(this, i, value);
					}
					else {
						// Otherwise pass back to the multiple function
						multiple.call(this, i, value);
					}
				}
			}
		}
		else {
			// So evt must be a string
			// And listeners must be an array of listeners
			// Loop over it and pass each one to the multiple method
			i = listeners.length;
			while (i--) {
				single.call(this, evt, listeners[i]);
			}
		}

		return this;
	};

	/**
	 * Removes all listeners from a specified event.
	 * If you do not specify an event then all listeners will be removed.
	 * That means every event will be emptied.
	 * You can also pass a regex to remove all events that match it.
	 *
	 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeEvent = function removeEvent(evt) {
		var type = typeof evt;
		var events = this._getEvents();
		var key;

		// Remove different things depending on the state of evt
		if (type === 'string') {
			// Remove all listeners for the specified event
			delete events[evt];
		}
		else if (type === 'object') {
			// Remove all events matching the regex.
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					delete events[key];
				}
			}
		}
		else {
			// Remove all listeners in all events
			delete this._events;
		}

		return this;
	};

	/**
	 * Alias of removeEvent.
	 *
	 * Added to mirror the node API.
	 */
	proto.removeAllListeners = alias('removeEvent');

	/**
	 * Emits an event of your choice.
	 * When emitted, every listener attached to that event will be executed.
	 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	 * So they will not arrive within the array on the other side, they will be separate.
	 * You can also pass a regular expression to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {Array} [args] Optional array of arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emitEvent = function emitEvent(evt, args) {
		var listeners = this.getListenersAsObject(evt);
		var listener;
		var i;
		var key;
		var response;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				i = listeners[key].length;

				while (i--) {
					// If the listener returns true then it shall be removed from the event
					// The function is executed either with a basic call or an apply if there is an args array
					listener = listeners[key][i];

					if (listener.once === true) {
						this.removeListener(evt, listener.listener);
					}

					response = listener.listener.apply(this, args || []);

					if (response === this._getOnceReturnValue()) {
						this.removeListener(evt, listener.listener);
					}
				}
			}
		}

		return this;
	};

	/**
	 * Alias of emitEvent
	 */
	proto.trigger = alias('emitEvent');

	/**
	 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {...*} Optional additional arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emit = function emit(evt) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(evt, args);
	};

	/**
	 * Sets the current value to check against when executing listeners. If a
	 * listeners return value matches the one set here then it will be removed
	 * after execution. This value defaults to true.
	 *
	 * @param {*} value The new value to check for when executing listeners.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.setOnceReturnValue = function setOnceReturnValue(value) {
		this._onceReturnValue = value;
		return this;
	};

	/**
	 * Fetches the current value to check against when executing listeners. If
	 * the listeners return value matches this one then it should be removed
	 * automatically. It will return true by default.
	 *
	 * @return {*|Boolean} The current value to check for or the default, true.
	 * @api private
	 */
	proto._getOnceReturnValue = function _getOnceReturnValue() {
		if (this.hasOwnProperty('_onceReturnValue')) {
			return this._onceReturnValue;
		}
		else {
			return true;
		}
	};

	/**
	 * Fetches the events object and creates one if required.
	 *
	 * @return {Object} The events storage object.
	 * @api private
	 */
	proto._getEvents = function _getEvents() {
		return this._events || (this._events = {});
	};

	/**
	 * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	 *
	 * @return {Function} Non conflicting EventEmitter class.
	 */
	EventEmitter.noConflict = function noConflict() {
		exports.EventEmitter = originalGlobalValue;
		return EventEmitter;
	};

	// Expose the class either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define('eventEmitter/EventEmitter',[],function () {
			return EventEmitter;
		});
	}
	else if (typeof module === 'object' && module.exports){
		module.exports = EventEmitter;
	}
	else {
		this.EventEmitter = EventEmitter;
	}
}.call(this));

/*!
 * eventie v1.0.4
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'eventie/eventie',eventie );
} else {
  // browser global
  window.eventie = eventie;
}

})( this );

/*!
 * imagesLoaded v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( 'imagesloaded',[
      'eventEmitter/EventEmitter',
      'eventie/eventie'
    ], function( EventEmitter, eventie ) {
      return factory( window, EventEmitter, eventie );
    });
  } else if ( typeof exports === 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('wolfy87-eventemitter'),
      require('eventie')
    );
  } else {
    // browser global
    window.imagesLoaded = factory(
      window,
      window.EventEmitter,
      window.eventie
    );
  }

})( window,

// --------------------------  factory -------------------------- //

function factory( window, EventEmitter, eventie ) {



var $ = window.jQuery;
var console = window.console;
var hasConsole = typeof console !== 'undefined';

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) === '[object Array]';
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

  // -------------------------- imagesLoaded -------------------------- //

  /**
   * @param {Array, Element, NodeList, String} elem
   * @param {Object or Function} options - if function, use as callback
   * @param {Function} onAlways - callback function
   */
  function ImagesLoaded( elem, options, onAlways ) {
    // coerce ImagesLoaded() without new, to be new ImagesLoaded()
    if ( !( this instanceof ImagesLoaded ) ) {
      return new ImagesLoaded( elem, options );
    }
    // use elem as selector string
    if ( typeof elem === 'string' ) {
      elem = document.querySelectorAll( elem );
    }

    this.elements = makeArray( elem );
    this.options = extend( {}, this.options );

    if ( typeof options === 'function' ) {
      onAlways = options;
    } else {
      extend( this.options, options );
    }

    if ( onAlways ) {
      this.on( 'always', onAlways );
    }

    this.getImages();

    if ( $ ) {
      // add jQuery Deferred object
      this.jqDeferred = new $.Deferred();
    }

    // HACK check async to allow time to bind listeners
    var _this = this;
    setTimeout( function() {
      _this.check();
    });
  }

  ImagesLoaded.prototype = new EventEmitter();

  ImagesLoaded.prototype.options = {};

  ImagesLoaded.prototype.getImages = function() {
    this.images = [];

    // filter & find items if we have an item selector
    for ( var i=0, len = this.elements.length; i < len; i++ ) {
      var elem = this.elements[i];
      // filter siblings
      if ( elem.nodeName === 'IMG' ) {
        this.addImage( elem );
      }
      // find children
      // no non-element nodes, #143
      var nodeType = elem.nodeType;
      if ( !nodeType || !( nodeType === 1 || nodeType === 9 || nodeType === 11 ) ) {
        continue;
      }
      var childElems = elem.querySelectorAll('img');
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        var img = childElems[j];
        this.addImage( img );
      }
    }
  };

  /**
   * @param {Image} img
   */
  ImagesLoaded.prototype.addImage = function( img ) {
    var loadingImage = new LoadingImage( img );
    this.images.push( loadingImage );
  };

  ImagesLoaded.prototype.check = function() {
    var _this = this;
    var checkedCount = 0;
    var length = this.images.length;
    this.hasAnyBroken = false;
    // complete if no images
    if ( !length ) {
      this.complete();
      return;
    }

    function onConfirm( image, message ) {
      if ( _this.options.debug && hasConsole ) {
        console.log( 'confirm', image, message );
      }

      _this.progress( image );
      checkedCount++;
      if ( checkedCount === length ) {
        _this.complete();
      }
      return true; // bind once
    }

    for ( var i=0; i < length; i++ ) {
      var loadingImage = this.images[i];
      loadingImage.on( 'confirm', onConfirm );
      loadingImage.check();
    }
  };

  ImagesLoaded.prototype.progress = function( image ) {
    this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
    // HACK - Chrome triggers event before object properties have changed. #83
    var _this = this;
    setTimeout( function() {
      _this.emit( 'progress', _this, image );
      if ( _this.jqDeferred && _this.jqDeferred.notify ) {
        _this.jqDeferred.notify( _this, image );
      }
    });
  };

  ImagesLoaded.prototype.complete = function() {
    var eventName = this.hasAnyBroken ? 'fail' : 'done';
    this.isComplete = true;
    var _this = this;
    // HACK - another setTimeout so that confirm happens after progress
    setTimeout( function() {
      _this.emit( eventName, _this );
      _this.emit( 'always', _this );
      if ( _this.jqDeferred ) {
        var jqMethod = _this.hasAnyBroken ? 'reject' : 'resolve';
        _this.jqDeferred[ jqMethod ]( _this );
      }
    });
  };

  // -------------------------- jquery -------------------------- //

  if ( $ ) {
    $.fn.imagesLoaded = function( options, callback ) {
      var instance = new ImagesLoaded( this, options, callback );
      return instance.jqDeferred.promise( $(this) );
    };
  }


  // --------------------------  -------------------------- //

  function LoadingImage( img ) {
    this.img = img;
  }

  LoadingImage.prototype = new EventEmitter();

  LoadingImage.prototype.check = function() {
    // first check cached any previous images that have same src
    var resource = cache[ this.img.src ] || new Resource( this.img.src );
    if ( resource.isConfirmed ) {
      this.confirm( resource.isLoaded, 'cached was confirmed' );
      return;
    }

    // If complete is true and browser supports natural sizes,
    // try to check for image status manually.
    if ( this.img.complete && this.img.naturalWidth !== undefined ) {
      // report based on naturalWidth
      this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
      return;
    }

    // If none of the checks above matched, simulate loading on detached element.
    var _this = this;
    resource.on( 'confirm', function( resrc, message ) {
      _this.confirm( resrc.isLoaded, message );
      return true;
    });

    resource.check();
  };

  LoadingImage.prototype.confirm = function( isLoaded, message ) {
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  // -------------------------- Resource -------------------------- //

  // Resource checks each src, only once
  // separate class from LoadingImage to prevent memory leaks. See #115

  var cache = {};

  function Resource( src ) {
    this.src = src;
    // add to cache
    cache[ src ] = this;
  }

  Resource.prototype = new EventEmitter();

  Resource.prototype.check = function() {
    // only trigger checking once
    if ( this.isChecked ) {
      return;
    }
    // simulate loading on detached element
    var proxyImage = new Image();
    eventie.bind( proxyImage, 'load', this );
    eventie.bind( proxyImage, 'error', this );
    proxyImage.src = this.src;
    // set flag
    this.isChecked = true;
  };

  // ----- events ----- //

  // trigger specified handler for event type
  Resource.prototype.handleEvent = function( event ) {
    var method = 'on' + event.type;
    if ( this[ method ] ) {
      this[ method ]( event );
    }
  };

  Resource.prototype.onload = function( event ) {
    this.confirm( true, 'onload' );
    this.unbindProxyEvents( event );
  };

  Resource.prototype.onerror = function( event ) {
    this.confirm( false, 'onerror' );
    this.unbindProxyEvents( event );
  };

  // ----- confirm ----- //

  Resource.prototype.confirm = function( isLoaded, message ) {
    this.isConfirmed = true;
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  Resource.prototype.unbindProxyEvents = function( event ) {
    eventie.unbind( event.target, 'load', this );
    eventie.unbind( event.target, 'error', this );
  };

  // -----  ----- //

  return ImagesLoaded;

});

define('views/instagram-feed/_instagram-feed',[
    'imagesloaded'
], function(
    Imagesloaded) {

    'use strict';

    var InstagramFeedComponent = IEA.module('UI.instagram-feed', function (module, app, iea) {

        _.extend(module, {

            events: {},

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this._super(options);
                this.feedsTemplate = this.getTemplate('partial','instagram-feed/partial/instagram-feeds.hbss');
                this.triggerMethod('init');
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }

                this.triggerMethod('render');
                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                this._handleStyle();
                this.$instagramFeedWrapper = $('.instagram-feed-wrapper', this.$el);
                if (this.model.get('data').instagramFeed.maxImageNum) {
                    if (parseInt(this.model.get('data').instagramFeed.maxImageNum) > 0) {
                        if ((this.model.get('data').instagramFeed.instagramUserName !== "") && (this.model.get('data').instagramFeed.instagramUserName !== undefined)) {
                            this._getInstagramUserId();
                        }
                    }
                } else {
                    if ((this.model.get('data').instagramFeed.instagramUserName !== "") && (this.model.get('data').instagramFeed.instagramUserName !== undefined)) {
                        this._getInstagramUserId();
                    }
                }

                this.triggerMethod('enable');
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
            },

            /**
            @method onWindowResized

            @return {null}
            **/
            onWindowResized: function() {
                var self = this;
                this._handleHideCaption();
                $('.feeds', this.$el).removeAttr("style");
                setTimeout(function() {
                    self._matchHeight();
                }, 700);
            },

            /* ----------------------------------------------------------------------------- *\
               Private Methods
            \* ----------------------------------------------------------------------------- */

            /**
            gets the instragram user id

            @method _getInstagramUserId

            @return {null}
            **/
            _getInstagramUserId: function() {
                var self = this,
                    instagramUserName = this.model.get('data').instagramFeed.instagramUserName,
                    requestUrl = "https://api.instagram.com/v1/users/search?q=" + instagramUserName + "&access_token=" + app.getValue('instagramAccessToken');
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    cache: 0,
                    url: requestUrl,
                    success: function(response) {
                        var instagramUserId = response.data[0].id;
                        self._getInstagramFeed(instagramUserId);
                    }
                });
            },

            /**
            creates the subview for feeds

            @method _getInstagramFeed

            @return {null}
            **/
            _getInstagramFeed: function(instagramUserId) {
                var self = this,
                    instagramFeedURL = "https://api.instagram.com/v1/users/" + instagramUserId + "/media/recent/?access_token=" + app.getValue('instagramAccessToken') + "&count=" + self.model.get('data').instagramFeed.maxImageNum;
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    cache: 0,
                    url: instagramFeedURL,
                    success: function(feeds) {
                        var modalFeeds = new Backbone.Model(feeds),
                            $feedsView = '';
                        if (self.model.get('data').instagramFeed.hideCaption) {
                            modalFeeds.set('isCaption', false);
                        } else {
                            modalFeeds.set('isCaption', true);
                        }
                        $feedsView = self.feedsTemplate(modalFeeds.toJSON());
                        self.$instagramFeedWrapper.append($feedsView);
                    },
                    complete: function(){
                        self._handleHideCaption();
                        self.$instagramFeedWrapper.imagesLoaded( function() {
                            self._matchHeight();
                        });
                    }
                });
            },

            /**
            makes the gird to equal height if any un evnen heights

            @method _articleView

            @return {null}
            **/
            _matchHeight: function () {
                var $grid = $('.feeds', this.$el),
                    elementHeights = $grid.map(function () {
                        return $(this).height();
                    }).get(),
                maxHeight = Math.max.apply(null, elementHeights);
                $grid.height(maxHeight);
            },

            /**
            Hiding the caption if the container is less than 140px

            @method _handleHideCaption

            @return {null}
            **/
            _handleHideCaption: function () {
                var $grid = $('.feeds', this.$el),
                    $gridContainer = $('.instagram-feed-wrapper', this.$el),
                    feedWrapperWidth = $gridContainer.width(),
                    $gridCaption = $('.feeds .thumbnail', this.$el),
                    thumbnailWidth = $gridCaption.width();

                if (!app.getValue('isMobileBreakpoint')) {
                    if (feedWrapperWidth < 340) {
                        $grid.attr('class', 'feeds col-xs-12');
                    } else if (feedWrapperWidth < 540) {
                        $grid.attr('class', 'feeds col-xs-6');
                    } else if (feedWrapperWidth < 740) {
                        $grid.attr('class', 'feeds col-xs-4');
                    }
                }

                
                if (thumbnailWidth < 180) {
                    if(!$gridCaption.hasClass('no-caption')) {
                        $gridCaption.addClass('no-caption');
                    }
                } else {
                    if($gridCaption.hasClass('no-caption')) {
                        $gridCaption.removeClass('no-caption');
                    }
                }
            },

            _handleStyle: function () {
                var $gridContainer = $('.instagram-feed-wrapper', this.$el),
                    feedWrapperWidth = $gridContainer.width();

                if (!app.getValue('isMobileBreakpoint')) {
                    if (feedWrapperWidth < 340) {

                        if(!this.$el.hasClass('x-small-container')) {
                            this.$el.addClass('x-small-container');
                        }

                    } else if (feedWrapperWidth < 540) {

                        if(!this.$el.hasClass('small-container')) {
                            this.$el.addClass('small-container');
                        }

                    } else if (feedWrapperWidth < 740) {

                        if(!this.$el.hasClass('medium-container')) {
                            this.$el.addClass('medium-container');
                        }
                    }
                }
            }

        });
    });

    return InstagramFeedComponent;
});

/*global define*/

define('views/link-list/_link-list',[],function() {

    'use strict';

    var LinkList = IEA.module('UI.link-list', function(module, app, iea) {

        _.extend(module, {

            events: {

            },

            /**
             * Description
             * @method initialize
             * @param {} options
             * @return
             */
            initialize: function(options) {
                this._super(options);
                this.triggerMethod('init');
            },


            /**
             * Description
             * @method render
             * @return ThisExpression
             */
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));

                if (this._isEnabled === false) {
                    this.enable();
                    this._isEnabled = true;
                }

                this.triggerMethod('render');
                return this;
            },


            /**
             * Description
             * @method enable
             * @return
             */
            enable: function() {
                this.triggerMethod('enable');
            },

            /**
             * Description
             * @method show
             * @return
             */
            show: function() {
                this._super();
            },


            /**
             * Description
             * @method hide
             * @param {} cb
             * @param {} scope
             * @param {} params
             * @return
             */
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },


            /**
             * Description
             * @method clean
             * @return
             */
            clean: function() {
                this._super();
            },
        });
    });

    return LinkList;
});

/*global define*/

define('views/list/_list',[],function() {

    'use strict';

    var LinkListStatic = IEA.module('UI.list', function (module, app, iea) {

        _.extend(module, {

            events: {

            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                IEA.View.prototype.initialize.apply(this, arguments);
                this._isEnabled= false;
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled= true;
                }

                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                IEA.View.prototype.show.apply(this, arguments);
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                IEA.View.prototype.hide.apply(this, arguments);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                IEA.View.prototype.clean.apply(this, arguments);
                // view cleanup code here, anything that needs to be temporarily paused when view is not currently displayed
            },
        });
    });

    return LinkListStatic;
});

/*global define*/

define('views/media-gallery/_media-gallery',[
    'popup',
    'slider',
    'video',
], function(
    Popup,
    Slider,
    Video) {

    'use strict';

    var MediaGallery = IEA.module('UI.media-gallery', function(module, app, iea) {

        _.extend(module, {

            defaultSettings: {
                mediaLink:'.media-link',
                mediaSlides: '.media-slides',
                mediaThumbnails: '.media-thumbnails',
                caption: '.caption',
                thumbnail: 'thumbnail'


            },

            events: {
                'click .media-link': '_handleSlideClick',
                'mouseenter .media-link': '_handleSlideHover',
                'mouseleave .media-link': '_handleSlideHover'
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
             * Description
             * @return
             * @method initialize
             * @param {} opts
             * @return
             */
            initialize: function(options) {
                this._super(options);
                this.popupItems = [];
                this.isPopupEnabled = false;
                this.isSliderEnabled = false;
                this.componentVideos = {};

                this.triggerMethod('init');
            },

            /**
             * Description
             * @method render
             * @return ThisExpression
             */
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));

                if (this._isEnabled === false) {
                    this.enable();
                    this._isEnabled = true;
                }

                this.triggerMethod('render');

                return this;
            },

            /**
             * Description
             * @method onMatchMobile
             * @return
             */
            onMatchMobile: function() {
                this._disablePopup();
                this._enableSlider();
            },

            /**
             * Description
             * @method onMatchTablet
             * @return
             */
            onMatchTablet: function() {
                this._enablePopup();
                this._disableSlider();
            },

            /**
             * Description
             * @method onMatchDesktop
             * @return
             */
            onMatchDesktop: function() {
                this._enablePopup();
                this._disableSlider();
            },

            /**
             * enable function for the component
             * @return
             * @method enable
             * @return
             */
            enable: function() {
                this.mediaItems = $('.media-link', this.$el);
                this.sliderContainer = $('.media-slides', this.$el);
                this.slidePagination = $('.media-thumbnails', this.$el);
                this.$captions = $('.caption', this.$el);
                this.slides = $('.thumbnail', this.$el);
                this.paginationThumbnails = $('.media-thumbnail', this.$el);

                this.triggerMethod('enable', this);

            },

            /**
             * show the component
             * @return
             * @method show
             * @return
             */
            show: function() {
                this._super();
            },

            /**
             * hide the component
             * @return
             * @method hide
             * @param {} cb
             * @param {} scope
             * @param {} params
             * @return
             */
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
             * Description
             * @return
             * @method clean
             * @return
             */
            clean: function() {
                this._super();
            },

            /**
             * ----------------------------------------------------------------------------- *\
             * Private Methods
             * -----------------------------------------------------------------------------
             * @method _enablePopup
             * @return
             */
            _enablePopup: function() {
                var self = this,
                    $el;

                if (this.isPopupEnabled) {
                    return;
                }

                // kill all videos if its coming from a mobile breakpoint.
                this._killAllVideos();

                // create the item object from the DOM so that the approach can be used
                // for server side compnents
                this.mediaItems.each(function(index, value) {
                    $el = $(this);
                    self.popupItems.push({
                        src: $el.attr('href'),
                        type: $el.attr('type')
                    });
                });

                this.popup = IEA.popup({
                    items: this.popupItems,
                    type: (this.popupItems.length > 1) ? 'gallery' : 'inline'
                });

                this.popup.on('popup:open', function(item) {
                    var $video = $('.video', item.content);
                    self._enableVideo($video, item.index);
                });
                this.popup.on('popup:beforeClose', $.proxy(this._killVideo, this));
                this.popup.on('popup:change', function(item, instance) {
                    // when the slide changes, make sure to kill the previous video , if exists
                    // and enable new item video.
                    setTimeout(function() {
                        var $video = $('.video', instance.content);
                        self._killAllVideos.apply(self, instance);
                        self._enableVideo.apply(self, [$video, instance.index]);
                    }, 300);
                });

                this.triggerMethod('popupEnable', this);

            },

            /**
             * Description
             * @method _enableSlider
             * @return
             */
            _enableSlider: function() {
                var self = this;

                this.$captions.each(function() {
                    $(this).attr('style', '');
                });

                if (this.isSliderEnabled) {
                    this.slider.reload();
                    return;
                }

                this.slider = IEA.slider(this.sliderContainer, {
                    auto: false,
                    pager: false,
                    infiniteLoop: true
                });

                this.slider.enable();

                this.paginationSlider = IEA.slider(this.slidePagination, {
                    auto: false,
                    minSlides: (this.slider.getSlideCount() > 6) ? 6 : this.slider.getSlideCount(),
                    maxSlides: (this.slider.getSlideCount() > 6) ? 6 : this.slider.getSlideCount(),
                    slideWidth: 100,
                    slideMargin: 10,
                    moveSlides: 1,
                    pager: false,
                    infiniteLoop: false,
                    hideControlOnEnd: true
                });

                this.paginationSlider.enable();

                this._bindSliderEvents(this.slider, this.paginationSlider);

                this.mediaItems.each(function(index, elem) {
                    var $video = $('.video', elem);

                    if ($video.length) {
                        self._enableVideo($video, index);
                    }
                });

                this.isSliderEnabled = true;
                this.triggerMethod('sliderEnable', this);
            },

            /**
             * Description
             * @method _disableSlider
             * @return
             */
            _disableSlider: function() {
                if (this.isSliderEnabled) {
                    this.slider.destroy();
                    this.paginationSlider.destroy();

                    this.isSliderEnabled = false;
                }
            },

            /**
             * Description
             * @method _bindSliderEvents
             * @param {} slider
             * @param {} pagination
             * @return
             */
            _bindSliderEvents: function(slider, pagination) {
                var self = this,
                    thumbnails = $('.media-thumbnail', pagination.$el);

                this._slideThumbnail(pagination, thumbnails, slider.getCurrentSlide());

                slider.on('slide:before', function(item, oldIndex, newIndex) {
                    self._slideThumbnail(pagination, thumbnails, newIndex);
                });

                // on thumbnail click the index is used to goto the corresponing slide in the carousel
                pagination.$el.on('click', 'li', function(evt) {
                    evt.preventDefault();
                    slider.goToSlide(_.indexOf(self.paginationThumbnails, evt.currentTarget));
                });

            },

            /**
             * Description
             * @method _slideThumbnail
             * @param {} pagination
             * @param {} thumbnails
             * @param {} newIndex
             * @return
             */
            _slideThumbnail: function(pagination, thumbnails, newIndex) {
                var slideCount = (this.slider.getSlideCount() > 6) ? 6 : this.slider.getSlideCount();
                // remove the existing active and add active class to current slide
                thumbnails.removeClass('active');
                thumbnails.eq(newIndex).addClass('active');

                // only move the slide if the active state has reached the end and there is more
                // thumbs to be shown
                if (pagination.getSlideCount() - newIndex >= slideCount) {
                    pagination.goToSlide(newIndex);
                } else {
                    pagination.goToSlide(pagination.getSlideCount() - slideCount);
                }
            },

            /**
             * Description
             * @method _disablePopup
             * @return
             */
            _disablePopup: function() {
                if ($.magnificPopup.instance.isOpen) {
                    $.magnificPopup.instance.close();
                }

                if (this.isPopupEnabled) {
                    $.magnificPopup.instance.popupsCache = {};
                }
            },

            /**
             * Description
             * @method _enableVideo
             * @param {} $video
             * @param {} index
             * @return
             */
            _enableVideo: function($video, index) {
                var self=this;
                if ($video.length) {
                    var videoURL = $video.data('url'),
                        videoType = $video.data('type');

                    if(videoType === "html5") {
                          this.componentVideos[index] = IEA.video($video, {
                            viewType: videoType,
                            randomNumber: 'video-' + Math.floor(Math.random() * 100),
                            videoFormats: {
                                mp4Video: $video.data('mp4'),
                                oggVideo: $video.data('ogg'),
                                flvVideo: $video.data('flv')
                            },
                            autoplay: true,
                            showControls: true,
                            loopPlayback: false
                        });
                        if(index === 0) {
                            self.slider.redraw();
                        }  
                    }
                    else { 
                        this.componentVideos[index] = IEA.video($video, {
                            viewType: videoType,
                            randomNumber: 'video-' + Math.floor(Math.random() * 100),
                            videoId: videoURL,
                            autoplay: true,
                            showControls: true,
                            loopPlayback: false,
                            audio: true
                        });
                        if(index === 0) {
                            this.componentVideos[index].on('video:loaded', function() {
                                self.slider.redraw();
                            });
                        }
                    }

                    $video.data('video', this.componentVideos[index]);
                }
            },
            /**
             * Description
             * @method _killVideo
             * @param {} item
             * @param {} instance
             * @return
             */
            _killVideo: function(item, instance) {
                if (typeof instance.index !== 'undefined' && typeof this.componentVideos[instance.index] !== 'undefined') {
                    this.componentVideos[instance.index].destroy();
                    delete this.componentVideos[instance.index];
                }
            },

            /**
             * Description
             * @method _stopVideo
             * @param {} content
             * @param {} oldIndex
             * @return
             */
            _stopVideo: function(content, oldIndex) {
                if (typeof this.componentVideos !== 'undefined' && typeof this.componentVideos[oldIndex] !== 'undefined') {
                    this.componentVideos[oldIndex].stop();
                }
            },

            /**
             * Description
             * @method _playVideo
             * @param {} content
             * @param {} oldIndex
             * @param {} newIndex
             * @return
             */
            _playVideo: function(content, oldIndex, newIndex) {
                if (typeof this.componentVideos !== 'undefined' && typeof this.componentVideos[newIndex] !== 'undefined') {
                    this.componentVideos[newIndex].play();
                }
            },

            /**
             * Description
             * @method _killAllVideos
             * @return
             */
            _killAllVideos: function() {
                var index;

                for (index in this.componentVideos) {
                    this.componentVideos[index].destroy();
                    delete this.componentVideos[index];
                }
            },

            /**
             * Description
             * @return
             * @method _handleSlideHover
             * @param {} evt
             * @return
             */
            _handleSlideHover: function(evt) {
                if (!app.getValue('isMobileBreakpoint')) {
                    var $el = $(evt.currentTarget),
                        $caption = $el.find('.caption');

                    if (!$caption.length) {
                        return;
                    }

                    if (evt.type === 'mouseenter') {
                        // since its starting from bottom , call it slideDown
                        $caption.slideDown("fast");
                        $el.parent('.thumbnail').addClass('active');
                    } else {
                        $caption.slideUp("fast");
                        $el.parent('.thumbnail').removeClass('active');
                    }
                }
            },

            /**
             * Description
             * @return
             * @method _handleSlideClick
             * @param {} evt
             * @return
             */
            _handleSlideClick: function(evt) {
                evt.preventDefault();

                if (!app.getValue('isMobileBreakpoint')) {
                    this.popup.open(_.indexOf(this.mediaItems, evt.currentTarget));
                }
            }

        });
    });

    return MediaGallery;
});

/*global define*/

define('views/navigation/_navigation',[],function() {

    'use strict';

    var Navigation = IEA.module('UI.navigation', function(module, app, iea) {

        _.extend(module, {

            defaultSettings: {
                dropdownEl: '.dropdown',
                multiColumnEl: '.multi-column div',
                mainMenuIcon: '> a span',
                enableHover: true,
                flyoutOpenIcon: 'glyphicon-chevron-up',
                flyoutCloseIcon: 'glyphicon-chevron-down',
                transitionTime: 200
            },
            events: {
                'mouseenter .navbar-nav .dropdown': '_handleNavToggle',
                'mouseleave .navbar-nav .dropdown': '_handleNavToggle',
                'touchend .navbar-nav .dropdown': '_handleTouch',
                'click .navbar-nav .dropdown > a' : '_handleNavClick',
                'click .dropdown' : '_handleTopNavClick'
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this.triggerMethod('beforeInit');
                IEA.View.prototype.initialize.apply(this, arguments);

                this.triggerMethod('init');
            },

            /**
            @method render

            @return Navigation
            **/
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));
                this.$navElements = $(this.defaultSettings.dropdownEl, this.$el);

                if (this._isEnabled === false) {
                    this.enable();
                    this._isEnabled = true;
                }

                this.triggerMethod('render');

                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                // Hook for handling load event
                this.triggerMethod('enable');
            },

            /**
            @method onMatchDesktop

            @return {null}
            **/
            onMatchDesktop: function () {
                $('.navbar-collapse', this.$el).removeClass('in');
                this._disableDropdown();
            },

            /**
            @method onMatchTablet

            @return {null}
            **/
            onMatchTablet: function() {
                this._enableDropdown();
            },

            /**
            @method onMatchMobile

            @return {null}
            **/
            onMatchMobile: function() {
                this._enableDropdown();
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                IEA.View.prototype.show.apply(this, arguments);
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                IEA.View.prototype.hide.apply(this, arguments);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                IEA.View.prototype.clean.apply(this, arguments);
                // view cleanup code here, anything that needs to be temporarily paused when view is not currently displayed
            },

            _equalHeight: function(groupEl) {
                var tallest = 0;
                groupEl.each(function() {
                    var thisHeight = $(this).height();
                    if (thisHeight > tallest) {
                        tallest = thisHeight;
                    }
                });
                groupEl.height(tallest);
            },

            /* ----------------------------------------------------------------------------- *\
               private Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method _enableDropdown

            @return {null}
            **/
            _enableDropdown: function() {
                if(this.$el.hasClass('top-navigation')) {
                    $('.navbar-toggle', this.$el).html('').addClass('icon-top-gear');
                    $('.container-fluid', this.$el).addClass('dropdown');
                    $('.navbar-header', this.$el).addClass('dropdown-toggle');
                    $('.collapse.navbar-collapse', this.$el).addClass('dropdown-menu');
                }
            },

            /**
            @method _disableDropdown

            @return {null}
            **/
            _disableDropdown: function() {
                if(this.$el.hasClass('top-navigation')) {
                    $('.navbar-toggle', this.$el).html('').removeClass('icon-top-gear');
                    $('.container-fluid', this.$el).removeClass('dropdown');
                    $('.navbar-header', this.$el).removeClass('dropdown-toggle');
                    $('.collapse.navbar-collapse', this.$el).removeClass('dropdown-menu');
                }
            },

            /**
            handle vcartousel click

            @method _handleclick

            @return {null}
            **/
            _handleNavToggle: function(evt) {
                var config = this.defaultSettings,
                    groupEl = $(config.multiColumnEl, $(evt.currentTarget)),
                    $mainMenuIcon = $(config.mainMenuIcon, $(evt.currentTarget)),
                    component = this;

                groupEl.attr('style', '');
                if(config.enableHover) {
                    if (evt.type === 'mouseenter') {
                        $(evt.currentTarget).addClass('open');
                        $mainMenuIcon.addClass(config.flyoutOpenIcon).removeClass(config.flyoutCloseIcon);
                        this._equalHeight(groupEl);

                        // Adjusting the overflowing dropdown
                        this._handleNavOverflow(evt.currentTarget);

                        // Hook for handling mouse enter event
                        component.triggerMethod('mouseenter');
                    } 
                    else {
                        $(evt.currentTarget).removeClass('open');
                        $mainMenuIcon.addClass(config.flyoutCloseIcon).removeClass(config.flyoutOpenIcon);

                        // Hook for handling mouse leave event
                        component.triggerMethod('mouseleave');
                    }
                }

            },
            _handleTouch: function(evt) {
                var config = this.defaultSettings,
                $mainMenuIcon = $(config.mainMenuIcon, $(evt.currentTarget));
                if($mainMenuIcon.hasClass(config.flyoutOpenIcon)) {
                    $mainMenuIcon.addClass(config.flyoutCloseIcon).removeClass(config.flyoutOpenIcon);
                }
                else {
                    $mainMenuIcon.addClass(config.flyoutOpenIcon).removeClass(config.flyoutCloseIcon);
                }
            },

            /**
            handle navigation click

            @method _handleNavClick

            @return {null}
            **/
            _handleNavClick: function(evt) {
                if(app.getValue('isDesktopBreakpoint')) {
                    window.location.href= $(evt.target).attr('href');
                }

                if(app.getValue('isTabletBreakpoint')) {
                    if ($(evt.currentTarget).hasClass("dropdown-toggle")) {
                        evt.preventDefault();
                    } else {
                        window.location.href= $(evt.target).attr('href');
                    }
                }

                this.triggerMethod('mouseclick');
            },

            /**
            @method _handleTopNavClick

            @return {null}
            **/
            _handleTopNavClick: function(evt) {
                // debugger;
                if(this.$el.hasClass('top-navigation')) {
                    evt.preventDefault();
                    var dropdown = $('.navbar-default .navbar-collapse.dropdown-menu', this.$el);
                    dropdown.hasClass('slide-open') ? this.closeDropdown(dropdown) : this.openDropdown(dropdown);
                }
            },

            /**
            opens the dropdown

            @method openDropdown

            @return {null}
            **/
            openDropdown: function(elem) {
                this.triggerMethod('onBeforeOpen');
                elem.slideToggle(this.defaultSettings.transitionTime);
                elem.toggleClass('slide-open');
                this.triggerMethod('onAfterOpen');
            },

            /**
            closes the dropdown

            @method closeDropdown

            @return {null}
            **/
            closeDropdown: function(elem) {
                this.triggerMethod('onBeforeClose');
                elem.slideToggle(this.defaultSettings.transitionTime);
                elem.toggleClass('slide-open');
                this.triggerMethod('onAfterClose');
            },

            /**
            handle navigation overflow

            @method _handleNavOverflow

            @return {null}
            **/
            _handleNavOverflow: function(dropdown) {
                var documentWidth = $(document).width(),
                    windowWidth = $(window).width(),
                    $dropdown = $(dropdown).find('.dropdown-menu'),
                    offsetWidth = 0;

                if(documentWidth > windowWidth) {
                    offsetWidth = (documentWidth - windowWidth) + 20;
                    $dropdown.css({'margin-left':'-'+offsetWidth+'px'});
                }
            }
        });
    });

    return Navigation;
});

/*global define*/

define('views/panel/_panel',[
    'video',
    'popup'
], function(
    Video,
    Popup) {

    'use strict';


    var Panel = IEA.module('UI.panel', function (module, app, iea) {

        _.extend(module, {

            events: {
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
				this.triggerMethod('beforeInit');
                this._super(options);
				this.triggerMethod('init');
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
				this.triggerMethod('beforeRender');
                this.$el.html(this.template(this.model.toJSON().data));
				this.triggerMethod('render', this);
				
                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }

                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/
				this.triggerMethod('beforeEnable');
                // Call the video init using video facade
                var customConfig = this.model.get('data').panel.video,
                    container = this.$el.find('.video-frame');

                if (customConfig) {
					this.renderVideo(customConfig, container);
				}
				this.triggerMethod('enable');
            },

            renderVideo: function(customConfig, container) {
                var instance;

                if(customConfig.displayOption === 'Overlay'){
                    var $overlayLink = this.$el.find('a.video-overlay'),
                    $close = this.$el.find('button.mfp-close');

                    var popup = new IEA.popup({
                        type: 'inline',
                        preloader: false
                    });

                    popup.on('popup:beforeOpen', function () {
                        instance = IEA.video(container, customConfig);
                    });

                    popup.on('popup:open', function() {
                        if(app.getValue('isDesktopBreakpoint')) {
                            $('.mfp-content').addClass('video');
                         }

                        if(instance.options.viewType === 'html5') {
                            instance.play();
                        }
                    });

                    popup.on('popup:close', function () {
                        instance.destroy();
                    });

                    $overlayLink.on('click', function(){
                        popup.open($(container).parents('.video-content'));
                    });

                    $close.on('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        popup.close();
                    });

                } else {
                    instance = IEA.video(container, customConfig);
                }
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
                // view cleanup code here, anything that needs to be temporarily paused when view is not currently displayed
            }

        });
    });

    return Panel;
});

/*!
 * Masonry PACKAGED v3.1.5
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

/**
 * Bridget makes jQuery widgets
 * v1.0.1
 */

( function( window ) {



// -------------------------- utils -------------------------- //

var slice = Array.prototype.slice;

function noop() {}

// -------------------------- definition -------------------------- //

function defineBridget( $ ) {

// bail if no jQuery
if ( !$ ) {
  return;
}

// -------------------------- addOptionMethod -------------------------- //

/**
 * adds option method -> $().plugin('option', {...})
 * @param {Function} PluginClass - constructor class
 */
function addOptionMethod( PluginClass ) {
  // don't overwrite original option method
  if ( PluginClass.prototype.option ) {
    return;
  }

  // option setter
  PluginClass.prototype.option = function( opts ) {
    // bail out if not an object
    if ( !$.isPlainObject( opts ) ){
      return;
    }
    this.options = $.extend( true, this.options, opts );
  };
}


// -------------------------- plugin bridge -------------------------- //

// helper function for logging errors
// $.error breaks jQuery chaining
var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

/**
 * jQuery plugin bridge, access methods like $elem.plugin('method')
 * @param {String} namespace - plugin name
 * @param {Function} PluginClass - constructor class
 */
function bridge( namespace, PluginClass ) {
  // add to jQuery fn namespace
  $.fn[ namespace ] = function( options ) {
    if ( typeof options === 'string' ) {
      // call plugin method when first argument is a string
      // get arguments for method
      var args = slice.call( arguments, 1 );

      for ( var i=0, len = this.length; i < len; i++ ) {
        var elem = this[i];
        var instance = $.data( elem, namespace );
        if ( !instance ) {
          logError( "cannot call methods on " + namespace + " prior to initialization; " +
            "attempted to call '" + options + "'" );
          continue;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === '_' ) {
          logError( "no such method '" + options + "' for " + namespace + " instance" );
          continue;
        }

        // trigger method with arguments
        var returnValue = instance[ options ].apply( instance, args );

        // break look and return first value if provided
        if ( returnValue !== undefined ) {
          return returnValue;
        }
      }
      // return this if no return value
      return this;
    } else {
      return this.each( function() {
        var instance = $.data( this, namespace );
        if ( instance ) {
          // apply options & init
          instance.option( options );
          instance._init();
        } else {
          // initialize new instance
          instance = new PluginClass( this, options );
          $.data( this, namespace, instance );
        }
      });
    }
  };

}

// -------------------------- bridget -------------------------- //

/**
 * converts a Prototypical class into a proper jQuery plugin
 *   the class must have a ._init method
 * @param {String} namespace - plugin name, used in $().pluginName
 * @param {Function} PluginClass - constructor class
 */
$.bridget = function( namespace, PluginClass ) {
  addOptionMethod( PluginClass );
  bridge( namespace, PluginClass );
};

return $.bridget;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'jquery-bridget/jquery.bridget',[ 'jquery' ], defineBridget );
} else {
  // get jquery from browser global
  defineBridget( window.jQuery );
}

})( window );

/*!
 * eventie v1.0.5
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'eventie/eventie',eventie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = eventie;
} else {
  // browser global
  window.eventie = eventie;
}

})( this );

/*!
 * docReady
 * Cross browser DOMContentLoaded event emitter
 */

/*jshint browser: true, strict: true, undef: true, unused: true*/
/*global define: false */

( function( window ) {



var document = window.document;
// collection of functions to be triggered on ready
var queue = [];

function docReady( fn ) {
  // throw out non-functions
  if ( typeof fn !== 'function' ) {
    return;
  }

  if ( docReady.isReady ) {
    // ready now, hit it
    fn();
  } else {
    // queue function when ready
    queue.push( fn );
  }
}

docReady.isReady = false;

// triggered on various doc ready events
function init( event ) {
  // bail if IE8 document is not ready just yet
  var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
  if ( docReady.isReady || isIE8NotReady ) {
    return;
  }
  docReady.isReady = true;

  // process queue
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var fn = queue[i];
    fn();
  }
}

function defineDocReady( eventie ) {
  eventie.bind( document, 'DOMContentLoaded', init );
  eventie.bind( document, 'readystatechange', init );
  eventie.bind( window, 'load', init );

  return docReady;
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  // if RequireJS, then doc is already ready
  docReady.isReady = typeof requirejs === 'function';
  define( 'doc-ready/doc-ready',[ 'eventie/eventie' ], defineDocReady );
} else {
  // browser global
  window.docReady = defineDocReady( window.eventie );
}

})( this );

/*!
 * EventEmitter v4.2.7 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

(function () {
	

	/**
	 * Class for managing events.
	 * Can be extended to provide event functionality in other classes.
	 *
	 * @class EventEmitter Manages event registering and emitting.
	 */
	function EventEmitter() {}

	// Shortcuts to improve speed and size
	var proto = EventEmitter.prototype;
	var exports = this;
	var originalGlobalValue = exports.EventEmitter;

	/**
	 * Finds the index of the listener for the event in it's storage array.
	 *
	 * @param {Function[]} listeners Array of listeners to search through.
	 * @param {Function} listener Method to look for.
	 * @return {Number} Index of the specified listener, -1 if not found
	 * @api private
	 */
	function indexOfListener(listeners, listener) {
		var i = listeners.length;
		while (i--) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Alias a method while keeping the context correct, to allow for overwriting of target method.
	 *
	 * @param {String} name The name of the target method.
	 * @return {Function} The aliased method
	 * @api private
	 */
	function alias(name) {
		return function aliasClosure() {
			return this[name].apply(this, arguments);
		};
	}

	/**
	 * Returns the listener array for the specified event.
	 * Will initialise the event object and listener arrays if required.
	 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	 * Each property in the object response is an array of listener functions.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Function[]|Object} All listener functions for the event.
	 */
	proto.getListeners = function getListeners(evt) {
		var events = this._getEvents();
		var response;
		var key;

		// Return a concatenated array of all matching events if
		// the selector is a regular expression.
		if (evt instanceof RegExp) {
			response = {};
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					response[key] = events[key];
				}
			}
		}
		else {
			response = events[evt] || (events[evt] = []);
		}

		return response;
	};

	/**
	 * Takes a list of listener objects and flattens it into a list of listener functions.
	 *
	 * @param {Object[]} listeners Raw listener objects.
	 * @return {Function[]} Just the listener functions.
	 */
	proto.flattenListeners = function flattenListeners(listeners) {
		var flatListeners = [];
		var i;

		for (i = 0; i < listeners.length; i += 1) {
			flatListeners.push(listeners[i].listener);
		}

		return flatListeners;
	};

	/**
	 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Object} All listener functions for an event in an object.
	 */
	proto.getListenersAsObject = function getListenersAsObject(evt) {
		var listeners = this.getListeners(evt);
		var response;

		if (listeners instanceof Array) {
			response = {};
			response[evt] = listeners;
		}

		return response || listeners;
	};

	/**
	 * Adds a listener function to the specified event.
	 * The listener will not be added if it is a duplicate.
	 * If the listener returns true then it will be removed after it is called.
	 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListener = function addListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var listenerIsWrapped = typeof listener === 'object';
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
				listeners[key].push(listenerIsWrapped ? listener : {
					listener: listener,
					once: false
				});
			}
		}

		return this;
	};

	/**
	 * Alias of addListener
	 */
	proto.on = alias('addListener');

	/**
	 * Semi-alias of addListener. It will add a listener that will be
	 * automatically removed after it's first execution.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addOnceListener = function addOnceListener(evt, listener) {
		return this.addListener(evt, {
			listener: listener,
			once: true
		});
	};

	/**
	 * Alias of addOnceListener.
	 */
	proto.once = alias('addOnceListener');

	/**
	 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	 * You need to tell it what event names should be matched by a regex.
	 *
	 * @param {String} evt Name of the event to create.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvent = function defineEvent(evt) {
		this.getListeners(evt);
		return this;
	};

	/**
	 * Uses defineEvent to define multiple events.
	 *
	 * @param {String[]} evts An array of event names to define.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvents = function defineEvents(evts) {
		for (var i = 0; i < evts.length; i += 1) {
			this.defineEvent(evts[i]);
		}
		return this;
	};

	/**
	 * Removes a listener function from the specified event.
	 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to remove the listener from.
	 * @param {Function} listener Method to remove from the event.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListener = function removeListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var index;
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				index = indexOfListener(listeners[key], listener);

				if (index !== -1) {
					listeners[key].splice(index, 1);
				}
			}
		}

		return this;
	};

	/**
	 * Alias of removeListener
	 */
	proto.off = alias('removeListener');

	/**
	 * Adds listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	 * You can also pass it a regular expression to add the array of listeners to all events that match it.
	 * Yeah, this function does quite a bit. That's probably a bad thing.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListeners = function addListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(false, evt, listeners);
	};

	/**
	 * Removes listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be removed.
	 * You can also pass it a regular expression to remove the listeners from all events that match it.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListeners = function removeListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(true, evt, listeners);
	};

	/**
	 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	 * The first argument will determine if the listeners are removed (true) or added (false).
	 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be added/removed.
	 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	 *
	 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
		var i;
		var value;
		var single = remove ? this.removeListener : this.addListener;
		var multiple = remove ? this.removeListeners : this.addListeners;

		// If evt is an object then pass each of it's properties to this method
		if (typeof evt === 'object' && !(evt instanceof RegExp)) {
			for (i in evt) {
				if (evt.hasOwnProperty(i) && (value = evt[i])) {
					// Pass the single listener straight through to the singular method
					if (typeof value === 'function') {
						single.call(this, i, value);
					}
					else {
						// Otherwise pass back to the multiple function
						multiple.call(this, i, value);
					}
				}
			}
		}
		else {
			// So evt must be a string
			// And listeners must be an array of listeners
			// Loop over it and pass each one to the multiple method
			i = listeners.length;
			while (i--) {
				single.call(this, evt, listeners[i]);
			}
		}

		return this;
	};

	/**
	 * Removes all listeners from a specified event.
	 * If you do not specify an event then all listeners will be removed.
	 * That means every event will be emptied.
	 * You can also pass a regex to remove all events that match it.
	 *
	 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeEvent = function removeEvent(evt) {
		var type = typeof evt;
		var events = this._getEvents();
		var key;

		// Remove different things depending on the state of evt
		if (type === 'string') {
			// Remove all listeners for the specified event
			delete events[evt];
		}
		else if (evt instanceof RegExp) {
			// Remove all events matching the regex.
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					delete events[key];
				}
			}
		}
		else {
			// Remove all listeners in all events
			delete this._events;
		}

		return this;
	};

	/**
	 * Alias of removeEvent.
	 *
	 * Added to mirror the node API.
	 */
	proto.removeAllListeners = alias('removeEvent');

	/**
	 * Emits an event of your choice.
	 * When emitted, every listener attached to that event will be executed.
	 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	 * So they will not arrive within the array on the other side, they will be separate.
	 * You can also pass a regular expression to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {Array} [args] Optional array of arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emitEvent = function emitEvent(evt, args) {
		var listeners = this.getListenersAsObject(evt);
		var listener;
		var i;
		var key;
		var response;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				i = listeners[key].length;

				while (i--) {
					// If the listener returns true then it shall be removed from the event
					// The function is executed either with a basic call or an apply if there is an args array
					listener = listeners[key][i];

					if (listener.once === true) {
						this.removeListener(evt, listener.listener);
					}

					response = listener.listener.apply(this, args || []);

					if (response === this._getOnceReturnValue()) {
						this.removeListener(evt, listener.listener);
					}
				}
			}
		}

		return this;
	};

	/**
	 * Alias of emitEvent
	 */
	proto.trigger = alias('emitEvent');

	/**
	 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {...*} Optional additional arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emit = function emit(evt) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(evt, args);
	};

	/**
	 * Sets the current value to check against when executing listeners. If a
	 * listeners return value matches the one set here then it will be removed
	 * after execution. This value defaults to true.
	 *
	 * @param {*} value The new value to check for when executing listeners.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.setOnceReturnValue = function setOnceReturnValue(value) {
		this._onceReturnValue = value;
		return this;
	};

	/**
	 * Fetches the current value to check against when executing listeners. If
	 * the listeners return value matches this one then it should be removed
	 * automatically. It will return true by default.
	 *
	 * @return {*|Boolean} The current value to check for or the default, true.
	 * @api private
	 */
	proto._getOnceReturnValue = function _getOnceReturnValue() {
		if (this.hasOwnProperty('_onceReturnValue')) {
			return this._onceReturnValue;
		}
		else {
			return true;
		}
	};

	/**
	 * Fetches the events object and creates one if required.
	 *
	 * @return {Object} The events storage object.
	 * @api private
	 */
	proto._getEvents = function _getEvents() {
		return this._events || (this._events = {});
	};

	/**
	 * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	 *
	 * @return {Function} Non conflicting EventEmitter class.
	 */
	EventEmitter.noConflict = function noConflict() {
		exports.EventEmitter = originalGlobalValue;
		return EventEmitter;
	};

	// Expose the class either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define('eventEmitter/EventEmitter',[],function () {
			return EventEmitter;
		});
	}
	else if (typeof module === 'object' && module.exports){
		module.exports = EventEmitter;
	}
	else {
		this.EventEmitter = EventEmitter;
	}
}.call(this));

/*!
 * getStyleProperty v1.0.3
 * original by kangax
 * http://perfectionkills.com/feature-testing-css-properties/
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false, exports: false, module: false */

( function( window ) {



var prefixes = 'Webkit Moz ms Ms O'.split(' ');
var docElemStyle = document.documentElement.style;

function getStyleProperty( propName ) {
  if ( !propName ) {
    return;
  }

  // test standard property first
  if ( typeof docElemStyle[ propName ] === 'string' ) {
    return propName;
  }

  // capitalize
  propName = propName.charAt(0).toUpperCase() + propName.slice(1);

  // test vendor specific properties
  var prefixed;
  for ( var i=0, len = prefixes.length; i < len; i++ ) {
    prefixed = prefixes[i] + propName;
    if ( typeof docElemStyle[ prefixed ] === 'string' ) {
      return prefixed;
    }
  }
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'get-style-property/get-style-property',[],function() {
    return getStyleProperty;
  });
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = getStyleProperty;
} else {
  // browser global
  window.getStyleProperty = getStyleProperty;
}

})( window );

/**
 * getSize v1.1.7
 * measure size of elements
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, exports: false, require: false, module: false */

( function( window, undefined ) {



// -------------------------- helpers -------------------------- //

var getComputedStyle = window.getComputedStyle;
var getStyle = getComputedStyle ?
  function( elem ) {
    return getComputedStyle( elem, null );
  } :
  function( elem ) {
    return elem.currentStyle;
  };

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') === -1 && !isNaN( num );
  return isValid && num;
}

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}



function defineGetSize( getStyleProperty ) {

// -------------------------- box sizing -------------------------- //

var boxSizingProp = getStyleProperty('boxSizing');
var isBoxSizeOuter;

/**
 * WebKit measures the outer-width on style.width on border-box elems
 * IE & Firefox measures the inner-width
 */
( function() {
  if ( !boxSizingProp ) {
    return;
  }

  var div = document.createElement('div');
  div.style.width = '200px';
  div.style.padding = '1px 2px 3px 4px';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px 2px 3px 4px';
  div.style[ boxSizingProp ] = 'border-box';

  var body = document.body || document.documentElement;
  body.appendChild( div );
  var style = getStyle( div );

  isBoxSizeOuter = getStyleSize( style.width ) === 200;
  body.removeChild( div );
})();


// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  // use querySeletor if elem is string
  if ( typeof elem === 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem !== 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display === 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = !!( boxSizingProp &&
    style[ boxSizingProp ] && style[ boxSizingProp ] === 'border-box' );

  // get all measurements
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    value = mungeNonPixel( elem, value );
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

// IE8 returns percent values, not pixels
// taken from jQuery's curCSS
function mungeNonPixel( elem, value ) {
  // IE8 and has percent value
  if ( getComputedStyle || value.indexOf('%') === -1 ) {
    return value;
  }
  var style = elem.style;
  // Remember the original values
  var left = style.left;
  var rs = elem.runtimeStyle;
  var rsLeft = rs && rs.left;

  // Put in the new values to get a computed value out
  if ( rsLeft ) {
    rs.left = elem.currentStyle.left;
  }
  style.left = value;
  value = style.pixelLeft;

  // Revert the changed values
  style.left = left;
  if ( rsLeft ) {
    rs.left = rsLeft;
  }

  return value;
}

return getSize;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD for RequireJS
  define( 'get-size/get-size',[ 'get-style-property/get-style-property' ], defineGetSize );
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = defineGetSize( require('get-style-property') );
} else {
  // browser global
  window.getSize = defineGetSize( window.getStyleProperty );
}

})( window );

/**
 * matchesSelector helper v1.0.1
 *
 * @name matchesSelector
 *   @param {Element} elem
 *   @param {String} selector
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false */

( function( global, ElemProto ) {

  

  var matchesMethod = ( function() {
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0, len = prefixes.length; i < len; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  // ----- match ----- //

  function match( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  }

  // ----- appendToFragment ----- //

  function checkParent( elem ) {
    // not needed if already has parent
    if ( elem.parentNode ) {
      return;
    }
    var fragment = document.createDocumentFragment();
    fragment.appendChild( elem );
  }

  // ----- query ----- //

  // fall back to using QSA
  // thx @jonathantneal https://gist.github.com/3062955
  function query( elem, selector ) {
    // append to fragment if no parent
    checkParent( elem );

    // match elem with all selected elems of parent
    var elems = elem.parentNode.querySelectorAll( selector );
    for ( var i=0, len = elems.length; i < len; i++ ) {
      // return true if match
      if ( elems[i] === elem ) {
        return true;
      }
    }
    // otherwise return false
    return false;
  }

  // ----- matchChild ----- //

  function matchChild( elem, selector ) {
    checkParent( elem );
    return match( elem, selector );
  }

  // ----- matchesSelector ----- //

  var matchesSelector;

  if ( matchesMethod ) {
    // IE9 supports matchesSelector, but doesn't work on orphaned elems
    // check for that
    var div = document.createElement('div');
    var supportsOrphans = match( div, 'div' );
    matchesSelector = supportsOrphans ? match : matchChild;
  } else {
    matchesSelector = query;
  }

  // transport
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( 'matches-selector/matches-selector',[],function() {
      return matchesSelector;
    });
  } else {
    // browser global
    window.matchesSelector = matchesSelector;
  }

})( this, Element.prototype );

/**
 * Outlayer Item
 */

( function( window ) {



// ----- get style ----- //

var getComputedStyle = window.getComputedStyle;
var getStyle = getComputedStyle ?
  function( elem ) {
    return getComputedStyle( elem, null );
  } :
  function( elem ) {
    return elem.currentStyle;
  };


// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

function isEmptyObj( obj ) {
  for ( var prop in obj ) {
    return false;
  }
  prop = null;
  return true;
}

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
function toDash( str ) {
  return str.replace( /([A-Z])/g, function( $1 ){
    return '-' + $1.toLowerCase();
  });
}

// -------------------------- Outlayer definition -------------------------- //

function outlayerItemDefinition( EventEmitter, getSize, getStyleProperty ) {

// -------------------------- CSS3 support -------------------------- //

var transitionProperty = getStyleProperty('transition');
var transformProperty = getStyleProperty('transform');
var supportsCSS3 = transitionProperty && transformProperty;
var is3d = !!getStyleProperty('perspective');

var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'otransitionend',
  transition: 'transitionend'
}[ transitionProperty ];

// properties that could have vendor prefix
var prefixableProperties = [
  'transform',
  'transition',
  'transitionDuration',
  'transitionProperty'
];

// cache all vendor properties
var vendorProperties = ( function() {
  var cache = {};
  for ( var i=0, len = prefixableProperties.length; i < len; i++ ) {
    var prop = prefixableProperties[i];
    var supportedProp = getStyleProperty( prop );
    if ( supportedProp && supportedProp !== prop ) {
      cache[ prop ] = supportedProp;
    }
  }
  return cache;
})();

// -------------------------- Item -------------------------- //

function Item( element, layout ) {
  if ( !element ) {
    return;
  }

  this.element = element;
  // parent layout class, i.e. Masonry, Isotope, or Packery
  this.layout = layout;
  this.position = {
    x: 0,
    y: 0
  };

  this._create();
}

// inherit EventEmitter
extend( Item.prototype, EventEmitter.prototype );

Item.prototype._create = function() {
  // transition objects
  this._transn = {
    ingProperties: {},
    clean: {},
    onEnd: {}
  };

  this.css({
    position: 'absolute'
  });
};

// trigger specified handler for event type
Item.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

Item.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
Item.prototype.css = function( style ) {
  var elemStyle = this.element.style;

  for ( var prop in style ) {
    // use vendor property if available
    var supportedProp = vendorProperties[ prop ] || prop;
    elemStyle[ supportedProp ] = style[ prop ];
  }
};

 // measure position, and sets it
Item.prototype.getPosition = function() {
  var style = getStyle( this.element );
  var layoutOptions = this.layout.options;
  var isOriginLeft = layoutOptions.isOriginLeft;
  var isOriginTop = layoutOptions.isOriginTop;
  var x = parseInt( style[ isOriginLeft ? 'left' : 'right' ], 10 );
  var y = parseInt( style[ isOriginTop ? 'top' : 'bottom' ], 10 );

  // clean up 'auto' or other non-integer values
  x = isNaN( x ) ? 0 : x;
  y = isNaN( y ) ? 0 : y;
  // remove padding from measurement
  var layoutSize = this.layout.size;
  x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
  y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

  this.position.x = x;
  this.position.y = y;
};

// set settled position, apply padding
Item.prototype.layoutPosition = function() {
  var layoutSize = this.layout.size;
  var layoutOptions = this.layout.options;
  var style = {};

  if ( layoutOptions.isOriginLeft ) {
    style.left = ( this.position.x + layoutSize.paddingLeft ) + 'px';
    // reset other property
    style.right = '';
  } else {
    style.right = ( this.position.x + layoutSize.paddingRight ) + 'px';
    style.left = '';
  }

  if ( layoutOptions.isOriginTop ) {
    style.top = ( this.position.y + layoutSize.paddingTop ) + 'px';
    style.bottom = '';
  } else {
    style.bottom = ( this.position.y + layoutSize.paddingBottom ) + 'px';
    style.top = '';
  }

  this.css( style );
  this.emitEvent( 'layout', [ this ] );
};


// transform translate function
var translate = is3d ?
  function( x, y ) {
    return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
  } :
  function( x, y ) {
    return 'translate(' + x + 'px, ' + y + 'px)';
  };


Item.prototype._transitionTo = function( x, y ) {
  this.getPosition();
  // get current x & y from top/left
  var curX = this.position.x;
  var curY = this.position.y;

  var compareX = parseInt( x, 10 );
  var compareY = parseInt( y, 10 );
  var didNotMove = compareX === this.position.x && compareY === this.position.y;

  // save end position
  this.setPosition( x, y );

  // if did not move and not transitioning, just go to layout
  if ( didNotMove && !this.isTransitioning ) {
    this.layoutPosition();
    return;
  }

  var transX = x - curX;
  var transY = y - curY;
  var transitionStyle = {};
  // flip cooridinates if origin on right or bottom
  var layoutOptions = this.layout.options;
  transX = layoutOptions.isOriginLeft ? transX : -transX;
  transY = layoutOptions.isOriginTop ? transY : -transY;
  transitionStyle.transform = translate( transX, transY );

  this.transition({
    to: transitionStyle,
    onTransitionEnd: {
      transform: this.layoutPosition
    },
    isCleaning: true
  });
};

// non transition + transform support
Item.prototype.goTo = function( x, y ) {
  this.setPosition( x, y );
  this.layoutPosition();
};

// use transition and transforms if supported
Item.prototype.moveTo = supportsCSS3 ?
  Item.prototype._transitionTo : Item.prototype.goTo;

Item.prototype.setPosition = function( x, y ) {
  this.position.x = parseInt( x, 10 );
  this.position.y = parseInt( y, 10 );
};

// ----- transition ----- //

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
Item.prototype._nonTransition = function( args ) {
  this.css( args.to );
  if ( args.isCleaning ) {
    this._removeStyles( args.to );
  }
  for ( var prop in args.onTransitionEnd ) {
    args.onTransitionEnd[ prop ].call( this );
  }
};

/**
 * proper transition
 * @param {Object} args - arguments
 *   @param {Object} to - style to transition to
 *   @param {Object} from - style to start transition from
 *   @param {Boolean} isCleaning - removes transition styles after transition
 *   @param {Function} onTransitionEnd - callback
 */
Item.prototype._transition = function( args ) {
  // redirect to nonTransition if no transition duration
  if ( !parseFloat( this.layout.options.transitionDuration ) ) {
    this._nonTransition( args );
    return;
  }

  var _transition = this._transn;
  // keep track of onTransitionEnd callback by css property
  for ( var prop in args.onTransitionEnd ) {
    _transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
  }
  // keep track of properties that are transitioning
  for ( prop in args.to ) {
    _transition.ingProperties[ prop ] = true;
    // keep track of properties to clean up when transition is done
    if ( args.isCleaning ) {
      _transition.clean[ prop ] = true;
    }
  }

  // set from styles
  if ( args.from ) {
    this.css( args.from );
    // force redraw. http://blog.alexmaccaw.com/css-transitions
    var h = this.element.offsetHeight;
    // hack for JSHint to hush about unused var
    h = null;
  }
  // enable transition
  this.enableTransition( args.to );
  // set styles that are transitioning
  this.css( args.to );

  this.isTransitioning = true;

};

var itemTransitionProperties = transformProperty && ( toDash( transformProperty ) +
  ',opacity' );

Item.prototype.enableTransition = function(/* style */) {
  // only enable if not already transitioning
  // bug in IE10 were re-setting transition style will prevent
  // transitionend event from triggering
  if ( this.isTransitioning ) {
    return;
  }

  // make transition: foo, bar, baz from style object
  // TODO uncomment this bit when IE10 bug is resolved
  // var transitionValue = [];
  // for ( var prop in style ) {
  //   // dash-ify camelCased properties like WebkitTransition
  //   transitionValue.push( toDash( prop ) );
  // }
  // enable transition styles
  // HACK always enable transform,opacity for IE10
  this.css({
    transitionProperty: itemTransitionProperties,
    transitionDuration: this.layout.options.transitionDuration
  });
  // listen for transition end event
  this.element.addEventListener( transitionEndEvent, this, false );
};

Item.prototype.transition = Item.prototype[ transitionProperty ? '_transition' : '_nonTransition' ];

// ----- events ----- //

Item.prototype.onwebkitTransitionEnd = function( event ) {
  this.ontransitionend( event );
};

Item.prototype.onotransitionend = function( event ) {
  this.ontransitionend( event );
};

// properties that I munge to make my life easier
var dashedVendorProperties = {
  '-webkit-transform': 'transform',
  '-moz-transform': 'transform',
  '-o-transform': 'transform'
};

Item.prototype.ontransitionend = function( event ) {
  // disregard bubbled events from children
  if ( event.target !== this.element ) {
    return;
  }
  var _transition = this._transn;
  // get property name of transitioned property, convert to prefix-free
  var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

  // remove property that has completed transitioning
  delete _transition.ingProperties[ propertyName ];
  // check if any properties are still transitioning
  if ( isEmptyObj( _transition.ingProperties ) ) {
    // all properties have completed transitioning
    this.disableTransition();
  }
  // clean style
  if ( propertyName in _transition.clean ) {
    // clean up style
    this.element.style[ event.propertyName ] = '';
    delete _transition.clean[ propertyName ];
  }
  // trigger onTransitionEnd callback
  if ( propertyName in _transition.onEnd ) {
    var onTransitionEnd = _transition.onEnd[ propertyName ];
    onTransitionEnd.call( this );
    delete _transition.onEnd[ propertyName ];
  }

  this.emitEvent( 'transitionEnd', [ this ] );
};

Item.prototype.disableTransition = function() {
  this.removeTransitionStyles();
  this.element.removeEventListener( transitionEndEvent, this, false );
  this.isTransitioning = false;
};

/**
 * removes style property from element
 * @param {Object} style
**/
Item.prototype._removeStyles = function( style ) {
  // clean up transition styles
  var cleanStyle = {};
  for ( var prop in style ) {
    cleanStyle[ prop ] = '';
  }
  this.css( cleanStyle );
};

var cleanTransitionStyle = {
  transitionProperty: '',
  transitionDuration: ''
};

Item.prototype.removeTransitionStyles = function() {
  // remove transition
  this.css( cleanTransitionStyle );
};

// ----- show/hide/remove ----- //

// remove element from DOM
Item.prototype.removeElem = function() {
  this.element.parentNode.removeChild( this.element );
  this.emitEvent( 'remove', [ this ] );
};

Item.prototype.remove = function() {
  // just remove element if no transition support or no transition
  if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
    this.removeElem();
    return;
  }

  // start transition
  var _this = this;
  this.on( 'transitionEnd', function() {
    _this.removeElem();
    return true; // bind once
  });
  this.hide();
};

Item.prototype.reveal = function() {
  delete this.isHidden;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;
  this.transition({
    from: options.hiddenStyle,
    to: options.visibleStyle,
    isCleaning: true
  });
};

Item.prototype.hide = function() {
  // set flag
  this.isHidden = true;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;
  this.transition({
    from: options.visibleStyle,
    to: options.hiddenStyle,
    // keep hidden stuff hidden
    isCleaning: true,
    onTransitionEnd: {
      opacity: function() {
        // check if still hidden
        // during transition, item may have been un-hidden
        if ( this.isHidden ) {
          this.css({ display: 'none' });
        }
      }
    }
  });
};

Item.prototype.destroy = function() {
  this.css({
    position: '',
    left: '',
    right: '',
    top: '',
    bottom: '',
    transition: '',
    transform: ''
  });
};

return Item;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'outlayer/item',[
      'eventEmitter/EventEmitter',
      'get-size/get-size',
      'get-style-property/get-style-property'
    ],
    outlayerItemDefinition );
} else {
  // browser global
  window.Outlayer = {};
  window.Outlayer.Item = outlayerItemDefinition(
    window.EventEmitter,
    window.getSize,
    window.getStyleProperty
  );
}

})( window );

/*!
 * Outlayer v1.2.0
 * the brains and guts of a layout library
 * MIT license
 */

( function( window ) {



// ----- vars ----- //

var document = window.document;
var console = window.console;
var jQuery = window.jQuery;

var noop = function() {};

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}


var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) === '[object Array]';
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( obj && typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

// http://stackoverflow.com/a/384380/182183
var isElement = ( typeof HTMLElement === 'object' ) ?
  function isElementDOM2( obj ) {
    return obj instanceof HTMLElement;
  } :
  function isElementQuirky( obj ) {
    return obj && typeof obj === 'object' &&
      obj.nodeType === 1 && typeof obj.nodeName === 'string';
  };

// index of helper cause IE8
var indexOf = Array.prototype.indexOf ? function( ary, obj ) {
    return ary.indexOf( obj );
  } : function( ary, obj ) {
    for ( var i=0, len = ary.length; i < len; i++ ) {
      if ( ary[i] === obj ) {
        return i;
      }
    }
    return -1;
  };

function removeFrom( obj, ary ) {
  var index = indexOf( ary, obj );
  if ( index !== -1 ) {
    ary.splice( index, 1 );
  }
}

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
function toDashed( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
}


function outlayerDefinition( eventie, docReady, EventEmitter, getSize, matchesSelector, Item ) {

// -------------------------- Outlayer -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Outlayer intances
var instances = {};


/**
 * @param {Element, String} element
 * @param {Object} options
 * @constructor
 */
function Outlayer( element, options ) {
  // use element as selector string
  if ( typeof element === 'string' ) {
    element = document.querySelector( element );
  }

  // bail out if not proper element
  if ( !element || !isElement( element ) ) {
    if ( console ) {
      console.error( 'Bad ' + this.constructor.namespace + ' element: ' + element );
    }
    return;
  }

  this.element = element;

  // options
  this.options = extend( {}, this.constructor.defaults );
  this.option( options );

  // add id for Outlayer.getFromElement
  var id = ++GUID;
  this.element.outlayerGUID = id; // expando
  instances[ id ] = this; // associate via id

  // kick it off
  this._create();

  if ( this.options.isInitLayout ) {
    this.layout();
  }
}

// settings are for internal use only
Outlayer.namespace = 'outlayer';
Outlayer.Item = Item;

// default options
Outlayer.defaults = {
  containerStyle: {
    position: 'relative'
  },
  isInitLayout: true,
  isOriginLeft: true,
  isOriginTop: true,
  isResizeBound: true,
  isResizingContainer: true,
  // item options
  transitionDuration: '0.4s',
  hiddenStyle: {
    opacity: 0,
    transform: 'scale(0.001)'
  },
  visibleStyle: {
    opacity: 1,
    transform: 'scale(1)'
  }
};

// inherit EventEmitter
extend( Outlayer.prototype, EventEmitter.prototype );

/**
 * set options
 * @param {Object} opts
 */
Outlayer.prototype.option = function( opts ) {
  extend( this.options, opts );
};

Outlayer.prototype._create = function() {
  // get items from children
  this.reloadItems();
  // elements that affect layout, but are not laid out
  this.stamps = [];
  this.stamp( this.options.stamp );
  // set container style
  extend( this.element.style, this.options.containerStyle );

  // bind resize method
  if ( this.options.isResizeBound ) {
    this.bindResize();
  }
};

// goes through all children again and gets bricks in proper order
Outlayer.prototype.reloadItems = function() {
  // collection of item elements
  this.items = this._itemize( this.element.children );
};


/**
 * turn elements into Outlayer.Items to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Outlayer Items
 */
Outlayer.prototype._itemize = function( elems ) {

  var itemElems = this._filterFindItemElements( elems );
  var Item = this.constructor.Item;

  // create new Outlayer Items for collection
  var items = [];
  for ( var i=0, len = itemElems.length; i < len; i++ ) {
    var elem = itemElems[i];
    var item = new Item( elem, this );
    items.push( item );
  }

  return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
Outlayer.prototype._filterFindItemElements = function( elems ) {
  // make array of elems
  elems = makeArray( elems );
  var itemSelector = this.options.itemSelector;
  var itemElems = [];

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // check that elem is an actual element
    if ( !isElement( elem ) ) {
      continue;
    }
    // filter & find items if we have an item selector
    if ( itemSelector ) {
      // filter siblings
      if ( matchesSelector( elem, itemSelector ) ) {
        itemElems.push( elem );
      }
      // find children
      var childElems = elem.querySelectorAll( itemSelector );
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        itemElems.push( childElems[j] );
      }
    } else {
      itemElems.push( elem );
    }
  }

  return itemElems;
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
Outlayer.prototype.getItemElements = function() {
  var elems = [];
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    elems.push( this.items[i].element );
  }
  return elems;
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
Outlayer.prototype.layout = function() {
  this._resetLayout();
  this._manageStamps();

  // don't animate first layout
  var isInstant = this.options.isLayoutInstant !== undefined ?
    this.options.isLayoutInstant : !this._isLayoutInited;
  this.layoutItems( this.items, isInstant );

  // flag for initalized
  this._isLayoutInited = true;
};

// _init is alias for layout
Outlayer.prototype._init = Outlayer.prototype.layout;

/**
 * logic before any new layout
 */
Outlayer.prototype._resetLayout = function() {
  this.getSize();
};


Outlayer.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
Outlayer.prototype._getMeasurement = function( measurement, size ) {
  var option = this.options[ measurement ];
  var elem;
  if ( !option ) {
    // default to 0
    this[ measurement ] = 0;
  } else {
    // use option as an element
    if ( typeof option === 'string' ) {
      elem = this.element.querySelector( option );
    } else if ( isElement( option ) ) {
      elem = option;
    }
    // use size of element, if element
    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  }
};

/**
 * layout a collection of item elements
 * @api public
 */
Outlayer.prototype.layoutItems = function( items, isInstant ) {
  items = this._getItemsForLayout( items );

  this._layoutItems( items, isInstant );

  this._postLayout();
};

/**
 * get the items to be laid out
 * you may want to skip over some items
 * @param {Array} items
 * @returns {Array} items
 */
Outlayer.prototype._getItemsForLayout = function( items ) {
  var layoutItems = [];
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    if ( !item.isIgnored ) {
      layoutItems.push( item );
    }
  }
  return layoutItems;
};

/**
 * layout items
 * @param {Array} items
 * @param {Boolean} isInstant
 */
Outlayer.prototype._layoutItems = function( items, isInstant ) {
  var _this = this;
  function onItemsLayout() {
    _this.emitEvent( 'layoutComplete', [ _this, items ] );
  }

  if ( !items || !items.length ) {
    // no items, emit event with empty array
    onItemsLayout();
    return;
  }

  // emit layoutComplete when done
  this._itemsOn( items, 'layout', onItemsLayout );

  var queue = [];

  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    // get x/y object from method
    var position = this._getItemLayoutPosition( item );
    // enqueue
    position.item = item;
    position.isInstant = isInstant || item.isLayoutInstant;
    queue.push( position );
  }

  this._processLayoutQueue( queue );
};

/**
 * get item layout position
 * @param {Outlayer.Item} item
 * @returns {Object} x and y position
 */
Outlayer.prototype._getItemLayoutPosition = function( /* item */ ) {
  return {
    x: 0,
    y: 0
  };
};

/**
 * iterate over array and position each item
 * Reason being - separating this logic prevents 'layout invalidation'
 * thx @paul_irish
 * @param {Array} queue
 */
Outlayer.prototype._processLayoutQueue = function( queue ) {
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var obj = queue[i];
    this._positionItem( obj.item, obj.x, obj.y, obj.isInstant );
  }
};

/**
 * Sets position of item in DOM
 * @param {Outlayer.Item} item
 * @param {Number} x - horizontal position
 * @param {Number} y - vertical position
 * @param {Boolean} isInstant - disables transitions
 */
Outlayer.prototype._positionItem = function( item, x, y, isInstant ) {
  if ( isInstant ) {
    // if not transition, just set CSS
    item.goTo( x, y );
  } else {
    item.moveTo( x, y );
  }
};

/**
 * Any logic you want to do after each layout,
 * i.e. size the container
 */
Outlayer.prototype._postLayout = function() {
  this.resizeContainer();
};

Outlayer.prototype.resizeContainer = function() {
  if ( !this.options.isResizingContainer ) {
    return;
  }
  var size = this._getContainerSize();
  if ( size ) {
    this._setContainerMeasure( size.width, true );
    this._setContainerMeasure( size.height, false );
  }
};

/**
 * Sets width or height of container if returned
 * @returns {Object} size
 *   @param {Number} width
 *   @param {Number} height
 */
Outlayer.prototype._getContainerSize = noop;

/**
 * @param {Number} measure - size of width or height
 * @param {Boolean} isWidth
 */
Outlayer.prototype._setContainerMeasure = function( measure, isWidth ) {
  if ( measure === undefined ) {
    return;
  }

  var elemSize = this.size;
  // add padding and border width if border box
  if ( elemSize.isBorderBox ) {
    measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
      elemSize.borderLeftWidth + elemSize.borderRightWidth :
      elemSize.paddingBottom + elemSize.paddingTop +
      elemSize.borderTopWidth + elemSize.borderBottomWidth;
  }

  measure = Math.max( measure, 0 );
  this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
};

/**
 * trigger a callback for a collection of items events
 * @param {Array} items - Outlayer.Items
 * @param {String} eventName
 * @param {Function} callback
 */
Outlayer.prototype._itemsOn = function( items, eventName, callback ) {
  var doneCount = 0;
  var count = items.length;
  // event callback
  var _this = this;
  function tick() {
    doneCount++;
    if ( doneCount === count ) {
      callback.call( _this );
    }
    return true; // bind once
  }
  // bind callback
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    item.on( eventName, tick );
  }
};

// -------------------------- ignore & stamps -------------------------- //


/**
 * keep item in collection, but do not lay it out
 * ignored items do not get skipped in layout
 * @param {Element} elem
 */
Outlayer.prototype.ignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
Outlayer.prototype.unignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    delete item.isIgnored;
  }
};

/**
 * adds elements to stamps
 * @param {NodeList, Array, Element, or String} elems
 */
Outlayer.prototype.stamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ) {
    return;
  }

  this.stamps = this.stamps.concat( elems );
  // ignore
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    this.ignore( elem );
  }
};

/**
 * removes elements to stamps
 * @param {NodeList, Array, or Element} elems
 */
Outlayer.prototype.unstamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ){
    return;
  }

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // filter out removed stamp elements
    removeFrom( elem, this.stamps );
    this.unignore( elem );
  }

};

/**
 * finds child elements
 * @param {NodeList, Array, Element, or String} elems
 * @returns {Array} elems
 */
Outlayer.prototype._find = function( elems ) {
  if ( !elems ) {
    return;
  }
  // if string, use argument as selector string
  if ( typeof elems === 'string' ) {
    elems = this.element.querySelectorAll( elems );
  }
  elems = makeArray( elems );
  return elems;
};

Outlayer.prototype._manageStamps = function() {
  if ( !this.stamps || !this.stamps.length ) {
    return;
  }

  this._getBoundingRect();

  for ( var i=0, len = this.stamps.length; i < len; i++ ) {
    var stamp = this.stamps[i];
    this._manageStamp( stamp );
  }
};

// update boundingLeft / Top
Outlayer.prototype._getBoundingRect = function() {
  // get bounding rect for container element
  var boundingRect = this.element.getBoundingClientRect();
  var size = this.size;
  this._boundingRect = {
    left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
    top: boundingRect.top + size.paddingTop + size.borderTopWidth,
    right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
    bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
  };
};

/**
 * @param {Element} stamp
**/
Outlayer.prototype._manageStamp = noop;

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Object} offset - has left, top, right, bottom
 */
Outlayer.prototype._getElementOffset = function( elem ) {
  var boundingRect = elem.getBoundingClientRect();
  var thisRect = this._boundingRect;
  var size = getSize( elem );
  var offset = {
    left: boundingRect.left - thisRect.left - size.marginLeft,
    top: boundingRect.top - thisRect.top - size.marginTop,
    right: thisRect.right - boundingRect.right - size.marginRight,
    bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
  };
  return offset;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
Outlayer.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

/**
 * Bind layout to window resizing
 */
Outlayer.prototype.bindResize = function() {
  // bind just one listener
  if ( this.isResizeBound ) {
    return;
  }
  eventie.bind( window, 'resize', this );
  this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
Outlayer.prototype.unbindResize = function() {
  if ( this.isResizeBound ) {
    eventie.unbind( window, 'resize', this );
  }
  this.isResizeBound = false;
};

// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

// this fires every resize
Outlayer.prototype.onresize = function() {
  if ( this.resizeTimeout ) {
    clearTimeout( this.resizeTimeout );
  }

  var _this = this;
  function delayed() {
    _this.resize();
    delete _this.resizeTimeout;
  }

  this.resizeTimeout = setTimeout( delayed, 100 );
};

// debounced, layout on resize
Outlayer.prototype.resize = function() {
  // don't trigger if size did not change
  // or if resize was unbound. See #9

  if ( !this.isResizeBound || !this.needsResizeLayout() ) {
    return;
  }

  this.layout();
};

/**
 * check if layout is needed post layout
 * @returns Boolean
 */
Outlayer.prototype.needsResizeLayout = function() {
  var size = getSize( this.element );
  // check that this.size and size are there
  // IE8 triggers resize on body size change, so they might not be
  var hasSizes = this.size && size;
  return hasSizes && size.innerWidth !== this.size.innerWidth;
};

// -------------------------- methods -------------------------- //

/**
 * add items to Outlayer instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Outlayer.Items
**/
Outlayer.prototype.addItems = function( elems ) {
  var items = this._itemize( elems );
  // add items to collection
  if ( items.length ) {
    this.items = this.items.concat( items );
  }
  return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.appended = function( elems ) {
  var items = this.addItems( elems );
  if ( !items.length ) {
    return;
  }
  // layout and reveal just the new items
  this.layoutItems( items, true );
  this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.prepended = function( elems ) {
  var items = this._itemize( elems );
  if ( !items.length ) {
    return;
  }
  // add items to beginning of collection
  var previousItems = this.items.slice(0);
  this.items = items.concat( previousItems );
  // start new layout
  this._resetLayout();
  this._manageStamps();
  // layout new stuff without transition
  this.layoutItems( items, true );
  this.reveal( items );
  // layout previous items
  this.layoutItems( previousItems );
};

/**
 * reveal a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.reveal = function( items ) {
  var len = items && items.length;
  if ( !len ) {
    return;
  }
  for ( var i=0; i < len; i++ ) {
    var item = items[i];
    item.reveal();
  }
};

/**
 * hide a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.hide = function( items ) {
  var len = items && items.length;
  if ( !len ) {
    return;
  }
  for ( var i=0; i < len; i++ ) {
    var item = items[i];
    item.hide();
  }
};

/**
 * get Outlayer.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Outlayer.Item} item
 */
Outlayer.prototype.getItem = function( elem ) {
  // loop through items to get the one that matches
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    if ( item.element === elem ) {
      // return item
      return item;
    }
  }
};

/**
 * get collection of Outlayer.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Outlayer.Items
 */
Outlayer.prototype.getItems = function( elems ) {
  if ( !elems || !elems.length ) {
    return;
  }
  var items = [];
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    var item = this.getItem( elem );
    if ( item ) {
      items.push( item );
    }
  }

  return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.remove = function( elems ) {
  elems = makeArray( elems );

  var removeItems = this.getItems( elems );
  // bail if no items to remove
  if ( !removeItems || !removeItems.length ) {
    return;
  }

  this._itemsOn( removeItems, 'remove', function() {
    this.emitEvent( 'removeComplete', [ this, removeItems ] );
  });

  for ( var i=0, len = removeItems.length; i < len; i++ ) {
    var item = removeItems[i];
    item.remove();
    // remove item from collection
    removeFrom( item, this.items );
  }
};

// ----- destroy ----- //

// remove and disable Outlayer instance
Outlayer.prototype.destroy = function() {
  // clean up dynamic styles
  var style = this.element.style;
  style.height = '';
  style.position = '';
  style.width = '';
  // destroy items
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    item.destroy();
  }

  this.unbindResize();

  delete this.element.outlayerGUID;
  // remove data for jQuery
  if ( jQuery ) {
    jQuery.removeData( this.element, this.constructor.namespace );
  }

};

// -------------------------- data -------------------------- //

/**
 * get Outlayer instance from element
 * @param {Element} elem
 * @returns {Outlayer}
 */
Outlayer.data = function( elem ) {
  var id = elem && elem.outlayerGUID;
  return id && instances[ id ];
};


// -------------------------- create Outlayer class -------------------------- //

/**
 * create a layout class
 * @param {String} namespace
 */
Outlayer.create = function( namespace, options ) {
  // sub-class Outlayer
  function Layout() {
    Outlayer.apply( this, arguments );
  }
  // inherit Outlayer prototype, use Object.create if there
  if ( Object.create ) {
    Layout.prototype = Object.create( Outlayer.prototype );
  } else {
    extend( Layout.prototype, Outlayer.prototype );
  }
  // set contructor, used for namespace and Item
  Layout.prototype.constructor = Layout;

  Layout.defaults = extend( {}, Outlayer.defaults );
  // apply new options
  extend( Layout.defaults, options );
  // keep prototype.settings for backwards compatibility (Packery v1.2.0)
  Layout.prototype.settings = {};

  Layout.namespace = namespace;

  Layout.data = Outlayer.data;

  // sub-class Item
  Layout.Item = function LayoutItem() {
    Item.apply( this, arguments );
  };

  Layout.Item.prototype = new Item();

  // -------------------------- declarative -------------------------- //

  /**
   * allow user to initialize Outlayer via .js-namespace class
   * options are parsed from data-namespace-option attribute
   */
  docReady( function() {
    var dashedNamespace = toDashed( namespace );
    var elems = document.querySelectorAll( '.js-' + dashedNamespace );
    var dataAttr = 'data-' + dashedNamespace + '-options';

    for ( var i=0, len = elems.length; i < len; i++ ) {
      var elem = elems[i];
      var attr = elem.getAttribute( dataAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' +
            elem.nodeName.toLowerCase() + ( elem.id ? '#' + elem.id : '' ) + ': ' +
            error );
        }
        continue;
      }
      // initialize
      var instance = new Layout( elem, options );
      // make available via $().data('layoutname')
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    }
  });

  // -------------------------- jQuery bridge -------------------------- //

  // make into jQuery plugin
  if ( jQuery && jQuery.bridget ) {
    jQuery.bridget( namespace, Layout );
  }

  return Layout;
};

// ----- fin ----- //

// back in global
Outlayer.Item = Item;

return Outlayer;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'outlayer/outlayer',[
      'eventie/eventie',
      'doc-ready/doc-ready',
      'eventEmitter/EventEmitter',
      'get-size/get-size',
      'matches-selector/matches-selector',
      './item'
    ],
    outlayerDefinition );
} else {
  // browser global
  window.Outlayer = outlayerDefinition(
    window.eventie,
    window.docReady,
    window.EventEmitter,
    window.getSize,
    window.matchesSelector,
    window.Outlayer.Item
  );
}

})( window );

/*!
 * Masonry v3.1.5
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

( function( window ) {



// -------------------------- helpers -------------------------- //

var indexOf = Array.prototype.indexOf ?
  function( items, value ) {
    return items.indexOf( value );
  } :
  function ( items, value ) {
    for ( var i=0, len = items.length; i < len; i++ ) {
      var item = items[i];
      if ( item === value ) {
        return i;
      }
    }
    return -1;
  };

// -------------------------- masonryDefinition -------------------------- //

// used for AMD definition and requires
function masonryDefinition( Outlayer, getSize ) {
  // create an Outlayer layout class
  var Masonry = Outlayer.create('masonry');

  Masonry.prototype._resetLayout = function() {
    this.getSize();
    this._getMeasurement( 'columnWidth', 'outerWidth' );
    this._getMeasurement( 'gutter', 'outerWidth' );
    this.measureColumns();

    // reset column Y
    var i = this.cols;
    this.colYs = [];
    while (i--) {
      this.colYs.push( 0 );
    }

    this.maxY = 0;
  };

  Masonry.prototype.measureColumns = function() {
    this.getContainerWidth();
    // if columnWidth is 0, default to outerWidth of first item
    if ( !this.columnWidth ) {
      var firstItem = this.items[0];
      var firstItemElem = firstItem && firstItem.element;
      // columnWidth fall back to item of first element
      this.columnWidth = firstItemElem && getSize( firstItemElem ).outerWidth ||
        // if first elem has no width, default to size of container
        this.containerWidth;
    }

    this.columnWidth += this.gutter;

    this.cols = Math.floor( ( this.containerWidth + this.gutter ) / this.columnWidth );
    this.cols = Math.max( this.cols, 1 );
  };

  Masonry.prototype.getContainerWidth = function() {
    // container is parent if fit width
    var container = this.options.isFitWidth ? this.element.parentNode : this.element;
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var size = getSize( container );
    this.containerWidth = size && size.innerWidth;
  };

  Masonry.prototype._getItemLayoutPosition = function( item ) {
    item.getSize();
    // how many columns does this brick span
    var remainder = item.size.outerWidth % this.columnWidth;
    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
    // round if off by 1 pixel, otherwise use ceil
    var colSpan = Math[ mathMethod ]( item.size.outerWidth / this.columnWidth );
    colSpan = Math.min( colSpan, this.cols );

    var colGroup = this._getColGroup( colSpan );
    // get the minimum Y value from the columns
    var minimumY = Math.min.apply( Math, colGroup );
    var shortColIndex = indexOf( colGroup, minimumY );

    // position the brick
    var position = {
      x: this.columnWidth * shortColIndex,
      y: minimumY
    };

    // apply setHeight to necessary columns
    var setHeight = minimumY + item.size.outerHeight;
    var setSpan = this.cols + 1 - colGroup.length;
    for ( var i = 0; i < setSpan; i++ ) {
      this.colYs[ shortColIndex + i ] = setHeight;
    }

    return position;
  };

  /**
   * @param {Number} colSpan - number of columns the element spans
   * @returns {Array} colGroup
   */
  Masonry.prototype._getColGroup = function( colSpan ) {
    if ( colSpan < 2 ) {
      // if brick spans only one column, use all the column Ys
      return this.colYs;
    }

    var colGroup = [];
    // how many different places could this brick fit horizontally
    var groupCount = this.cols + 1 - colSpan;
    // for each group potential horizontal position
    for ( var i = 0; i < groupCount; i++ ) {
      // make an array of colY values for that one group
      var groupColYs = this.colYs.slice( i, i + colSpan );
      // and get the max value of the array
      colGroup[i] = Math.max.apply( Math, groupColYs );
    }
    return colGroup;
  };

  Masonry.prototype._manageStamp = function( stamp ) {
    var stampSize = getSize( stamp );
    var offset = this._getElementOffset( stamp );
    // get the columns that this stamp affects
    var firstX = this.options.isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor( firstX / this.columnWidth );
    firstCol = Math.max( 0, firstCol );
    var lastCol = Math.floor( lastX / this.columnWidth );
    // lastCol should not go over if multiple of columnWidth #425
    lastCol -= lastX % this.columnWidth ? 0 : 1;
    lastCol = Math.min( this.cols - 1, lastCol );
    // set colYs to bottom of the stamp
    var stampMaxY = ( this.options.isOriginTop ? offset.top : offset.bottom ) +
      stampSize.outerHeight;
    for ( var i = firstCol; i <= lastCol; i++ ) {
      this.colYs[i] = Math.max( stampMaxY, this.colYs[i] );
    }
  };

  Masonry.prototype._getContainerSize = function() {
    this.maxY = Math.max.apply( Math, this.colYs );
    var size = {
      height: this.maxY
    };

    if ( this.options.isFitWidth ) {
      size.width = this._getContainerFitWidth();
    }

    return size;
  };

  Masonry.prototype._getContainerFitWidth = function() {
    var unusedCols = 0;
    // count unused columns
    var i = this.cols;
    while ( --i ) {
      if ( this.colYs[i] !== 0 ) {
        break;
      }
      unusedCols++;
    }
    // fit container to columns that have been used
    return ( this.cols - unusedCols ) * this.columnWidth - this.gutter;
  };

  Masonry.prototype.needsResizeLayout = function() {
    var previousWidth = this.containerWidth;
    this.getContainerWidth();
    return previousWidth !== this.containerWidth;
  };

  return Masonry;
}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'masonry',[
      'outlayer/outlayer',
      'get-size/get-size'
    ],
    masonryDefinition );
} else {
  // browser global
  window.Masonry = masonryDefinition(
    window.Outlayer,
    window.getSize
  );
}

})( window );


/**
 * Bridget makes jQuery widgets
 * v1.0.1
 */

( function( window ) {

'use strict';

// -------------------------- utils -------------------------- //

var slice = Array.prototype.slice;

function noop() {}

// -------------------------- definition -------------------------- //

function defineBridget( $ ) {

// bail if no jQuery
if ( !$ ) {
  return;
}

// -------------------------- addOptionMethod -------------------------- //

/**
 * adds option method -> $().plugin('option', {...})
 * @param {Function} PluginClass - constructor class
 */
function addOptionMethod( PluginClass ) {
  // don't overwrite original option method
  if ( PluginClass.prototype.option ) {
    return;
  }

  // option setter
  PluginClass.prototype.option = function( opts ) {
    // bail out if not an object
    if ( !$.isPlainObject( opts ) ){
      return;
    }
    this.options = $.extend( true, this.options, opts );
  };
}


// -------------------------- plugin bridge -------------------------- //

// helper function for logging errors
// $.error breaks jQuery chaining
var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

/**
 * jQuery plugin bridge, access methods like $elem.plugin('method')
 * @param {String} namespace - plugin name
 * @param {Function} PluginClass - constructor class
 */
function bridge( namespace, PluginClass ) {
  // add to jQuery fn namespace
  $.fn[ namespace ] = function( options ) {
    if ( typeof options === 'string' ) {
      // call plugin method when first argument is a string
      // get arguments for method
      var args = slice.call( arguments, 1 );

      for ( var i=0, len = this.length; i < len; i++ ) {
        var elem = this[i];
        var instance = $.data( elem, namespace );
        if ( !instance ) {
          logError( "cannot call methods on " + namespace + " prior to initialization; " +
            "attempted to call '" + options + "'" );
          continue;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === '_' ) {
          logError( "no such method '" + options + "' for " + namespace + " instance" );
          continue;
        }

        // trigger method with arguments
        var returnValue = instance[ options ].apply( instance, args );

        // break look and return first value if provided
        if ( returnValue !== undefined ) {
          return returnValue;
        }
      }
      // return this if no return value
      return this;
    } else {
      return this.each( function() {
        var instance = $.data( this, namespace );
        if ( instance ) {
          // apply options & init
          instance.option( options );
          instance._init();
        } else {
          // initialize new instance
          instance = new PluginClass( this, options );
          $.data( this, namespace, instance );
        }
      });
    }
  };

}

// -------------------------- bridget -------------------------- //

/**
 * converts a Prototypical class into a proper jQuery plugin
 *   the class must have a ._init method
 * @param {String} namespace - plugin name, used in $().pluginName
 * @param {Function} PluginClass - constructor class
 */
$.bridget = function( namespace, PluginClass ) {
  addOptionMethod( PluginClass );
  bridge( namespace, PluginClass );
};

return $.bridget;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'bridget',[ 'jquery' ], defineBridget );
} else {
  // get jquery from browser global
  defineBridget( window.jQuery );
}

})( window );

define('views/pinterest/_pinterest',[
    'masonry',
    'bridget',
    'imagesloaded'
], function(
    Masonry,
    Bridget,
    Imagesloaded) {

    'use strict';

    var PinterestFeed = IEA.module('UI.pinterest', function (module, app, iea) {

        _.extend(module, {

            events: {},

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this._super(options);
                $.bridget('masonry', Masonry);
                this.triggerMethod('init');
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }

                this.triggerMethod('render');
                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                //this._renderPinterest();
                var pinterestData = this.model.toJSON().data.pinterest,
                    boardUrl = pinterestData.pinterestUserName + "/" + pinterestData.pinterestBoardURL,
                    feedCount = pinterestData.maxPinNum ? pinterestData.maxPinNum : 20,
                    $feedContainer = $('.pinitfeeds', this.el);

                if (((pinterestData.pinterestUserName !== "") && (pinterestData.pinterestUserName !== undefined)) && ((pinterestData.pinterestBoardURL !== "") && (pinterestData.pinterestBoardURL !== undefined))) {
                    this._createFeeds($feedContainer, boardUrl, feedCount);
                }

                this.triggerMethod('enable');
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
            },

            /* ----------------------------------------------------------------------------- *\
               Private Methods
            \* ----------------------------------------------------------------------------- */

            /**
            render pinsterest feeds

            @method _createFeeds

            @return {null}
            **/

            _createFeeds: function(el, feedUrl, limit) {

                // Add ul tag to target element
                $(el).append('<ul class="stream"></ul>');

                // Set Pinterest RSS url using Google Feed API
                var href = 'http://www.pinterest.com/' + feedUrl + '.rss',
                    url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+limit+'&callback=?&q=' + encodeURIComponent(href),
                    $container = $('.stream',el);

                // jQuery AJAX call
                jQuery.ajax({
                    url: url,
                    cache: true,
                    dataType: 'jsonp',
                    success: function(a){
                        a = a.responseData.feed.entries;
                        $.each(a, function(i,item) {
                            if(i < limit) {
                                var img = '<a href="'+item.link+'" target="_blank"><img src="'+$('img',item.content).attr('src')+'" alt="" /></a>',
                                    html = '<li class="item">' + img + '<p>' + item.contentSnippet + '</p></li>';

                                // Add pinterest feed items to stream
                                $container.append(html);
                            }
                        });
                    },
                    complete: function(){
                        $container.imagesLoaded( function() {
                            $container.masonry({
                                itemSelector: '.item',
                                'gutter': 20
                            });
                        });
                    }
                });
            }

        });
    });

    return PinterestFeed;
});

/*global define*/

define('views/plain-text-image/_plain-text-image',[],function() {

    'use strict';

    var PlainTextImage = IEA.module('UI.plain-text-image', function (module, app, iea) {

        _.extend(module, {

            events: {
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this._super(options);
            },

            /**
            @method render

            @return PlainTextImage
            **/
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }

                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
                // view cleanup code here, anything that needs to be temporarily paused when view is not currently displayed
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */
        });
    });

    return PlainTextImage;
});

/*global define*/

define('views/related-content-list/_related-content-list',[],function() {

    'use strict';

    var RelatedContentList = IEA.module('UI.related-content-list', function (module, app, iea) {

        _.extend(module, {

            events: {},

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this._super(options);
                this.triggerMethod('init');
            },

            /**
            @method render

            @return RelatedContentList
            **/
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));
                if(this._isEnabled === false){
                    this.enable();
                    this._isEnabled=true;
                }
                this.triggerMethod('render');
                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/
                this.triggerMethod('enable');
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
            }
        });
    });

    return RelatedContentList;
});

/*global define*/

define('views/rich-text-image/_rich-text-image',[],function() {

    'use strict';

    var RichTextImage = IEA.module('UI.rich-text-image', function (module, app, iea) {

        _.extend(module, {

            events: {
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this._super(options);

                this.triggerMethod('init');
            },

            /**
            @method render

            @return RichTextImage
            **/
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }

                this.triggerMethod('render');

                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/

                this.triggerMethod('enable');
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
                // view cleanup code here, anything that needs to be temporarily paused when view is not currently displayed
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */
        });
    });

    return RichTextImage;
});

/*global define*/

define('views/search-input/_search-input',[],function() {

    'use strict';

    var HeaderSiteSearchComponent = IEA.module('UI.search-input', function (module, app, iea) {

        _.extend(module, {

            defaultSettings: {
                searchBox: '.search-textbox',
                searchButton: '.btn-default',
                inputGroup: '.input-group',
                headerInputGroup: 'header .input-group',
                searchIcon: '.search-icon'
            },

            events: {
                'click .btn-default': '_handleclick',
                'blur .search-textbox': '_handleSearchBoxBlur',
                'keyup .search-textbox': '_handleButtonEnable',
                'click .search-icon': '_handleToggleSearchBox'
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this._super(options);
                this.searchConfig = this.model.get('data').searchInput;

                this.triggerMethod('init');
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }

                this.triggerMethod('render');

                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/
                this.$searchTextBox = $(this.defaultSettings.searchBox, this.$el);
                this.$searchButton = $(this.defaultSettings.searchButton, this.$el);
                this.$searchButton.attr('disabled','disabled');
                this.$searchTextBox.val('');

                this.triggerMethod('enable', this);
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
            },

            /**
            @method onMatchMobile

            @return {null}
            **/
            onMatchMobile: function() {
                var inputGroup = $(this.defaultSettings.inputGroup, this.$el);

                inputGroup.hide();
                $(this.defaultSettings.searchIcon, this.$el).show();
                inputGroup.css('marginTop', 31+'px');
            },


            /**
            @method onMatchTablet

            @return {null}
            **/
            onMatchTablet: function() {
                 var inputGroup = $(this.defaultSettings.inputGroup, this.$el);

                inputGroup.hide();
                $(this.defaultSettings.searchIcon, this.$el).show();
                inputGroup.css('marginTop', 31+'px');
            },

            /**
            @method onMatchDesktop

            @return {null}
            **/
            onMatchDesktop: function() {
                var inputGroup = $(this.defaultSettings.inputGroup, this.$el);

                inputGroup.show();
                $(this.defaultSettings.searchIcon, this.$el).hide();
                inputGroup.css('marginTop', -9+'px');
            },

            /**
            @method onWindowResized

            @return {null}
            **/
            onWindowResized: function() {
                if (app.getValue('isDesktopBreakpoint')) {
                    $(this.defaultSettings.inputGroup, this.$el).removeAttr("style");
                } else {
                    this._handleToggleSearchBox();
                }
            },

            /* ----------------------------------------------------------------------------- *\
               Private Methods
            \* ----------------------------------------------------------------------------- */

            /**
            handle button click

            @method _handleclick

            @return {null}
            **/
            _handleclick: function(evt) {
                var url = this._formURL();
                window.location.href = url;
            },

            /**
            form the result base url

            @method _formURL

            @return url
            **/
            _formURL: function() {
                var url = '',
                    queryString = '',
                    basePath = this.searchConfig.basePath.replace(/\//g, '|'),
                    SearchValue = this.$searchTextBox.val();
                queryString = 'q=' + SearchValue + '.basePath=' + basePath + '.limit=' + this.searchConfig.limit + '.noOfResults=' + this.searchConfig.noOfResults + '.doLazyLoad=' + this.searchConfig.doLazyLoad + '.isAjax=' + this.searchConfig.isAjax;
                url = this.searchConfig.resultPagePath + '.' + 'html?searchParams=' + queryString;

                return url;
            },

            /**
            handle search box blur

            @method _handleSearchBoxBlur

            @return {null}
            **/
            _handleSearchBoxBlur: function(evt) {
                var textbox = evt.currentTarget,
                    searchValue = $(textbox).val();

                if(searchValue === '') {
                    this.$searchButton.attr('disabled','disabled');
                }
            },


            /**
            toggle the search box

            @method _handleToggleSearchBox

            @return {null}
            **/
            _handleToggleSearchBox: function(evt) {
                if(evt) {
                    evt.preventDefault();
                }

                var inputGroup = $(this.defaultSettings.inputGroup, this.$el),
                    windowWidth = $(window).width(),
                    offset;

                inputGroup.toggle();

                offset = inputGroup.offset();

                if(this.$el.parents('header').length > 0) {
                    inputGroup.css({
                        'width': windowWidth+'px',
                        'marginTop': 4+'px',
                        'marginLeft': -1*offset.left
                    });
                }
            },

            /**
            enable or disable the search button

            @method _handleButtonEnable

            @return {null}
            **/
            _handleButtonEnable: function(evt) {
                var textbox = evt.currentTarget,
                    searchValue = $(textbox).val();

                if (evt.keyCode === 13) {
                    this._handleclick();
                }

                if(searchValue === '') {
                    this.$searchButton.attr('disabled','disabled');
                } else {
                    this.$searchButton.removeAttr('disabled');
                }
            }
        });
    });

    return HeaderSiteSearchComponent;
});

/*global define*/
define('views/search-result/_search-result',[
    'paginator'
], function(
    Paginator) {

    'use strict';

    var SearchResult = IEA.module('UI.search-result', function (module, app, iea) {

        _.extend(module, {
            defaultSettings: {
                loadmore: '.load-more',
                searchContainer: '.search-result-container',
                currentRecordEl: '.start',
                totalRecordEl: '.total',
                activeclass: 'active',
                mode: 'server'
            },
            events: {
                'click .load-more': '_handleLoadMore'
            },

            /**
            @method initialize
            @return {null}
            **/
            initialize: function(options) {
                this._super(options);
                var searchResultData = this.model.get('data'),
                    searchModel = Backbone.Model.extend({}),
                    SearchCollection = null;

                if(typeof searchResultData === 'undefined' || typeof searchResultData.searchResult === 'undefined') {
                    return;
                }

                this.loadUrl = (searchResultData.searchResult.loadMoreConfig) ? searchResultData.searchResult.loadMoreConfig.loadMoreBaseUrl : '';
                this.loadUrlParam = (searchResultData.searchResult.loadMoreConfig) ? searchResultData.searchResult.loadMoreConfig.loadMoreAjaxUrl : '';
                this.searchArticleTemplate = this.getTemplate('articles', 'search-result/partial/search-result-article.hbss');
                this.pageViewLimit = (searchResultData.searchResult.resultSize > 0) ? searchResultData.searchResult.resultSize : 1;
                this.isFirstPage = true;

                SearchCollection = Backbone.PageableCollection.extend({
                        model: searchModel,
                        url: this.loadUrl,
                        queryParams: {
                            searchParams: this.loadUrlParam
                        }
                    });

                this.searchArticles = new SearchCollection(searchResultData.searchResult.results, {
                    mode: this.defaultSettings.mode,
                    state: {
                        pageSize: this.pageViewLimit,
                        totalRecords: searchResultData.searchResult.totalResults
                    }
                });
                this.triggerMethod('init');
            },

            /**
            @method render
            @return SearchResult
            **/
            render: function() {
                var settings = this.defaultSettings;
                this.$el.html(this.template(this.model.toJSON().data));
                this.$searchList = $(settings.searchContainer, this.$el);
                this.$loadmore = $(settings.loadmore, this.$el);

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }

                this.triggerMethod('render');

                return this;
            },

            /**
            @description:enable function for the component , load first set of record
            @method enable
            @return {null}
            **/
            enable: function() {
                /*Load first set of record*/
                this._searchView();
                this.triggerMethod('enable', this);
            },

            /**
            @description: Show the component
            @method show
            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            @description: Hide the component
            @method hide
            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean
            @return {null}
            **/
            clean: function() {
                this._super();
            },

            /**
            @description: creates search result item view
            @method _searchView
            @return {null}
            **/
            _searchView: function() {
                var self = this;

                if (this.isFirstPage) {
                    var resultModel = this._pagination();
                    this._renderSubView(resultModel,self, true);

                    this.triggerMethod('firstPage', resultModel);

                } else {
                    self._pagination().done(function(response){
                        self.$loadmore.removeClass(self.defaultSettings.activeclass);
                        self._renderSubView(response, self, false);

                        self.triggerMethod('nextPage', response);
                    })
                    .error(function(err){
                        self.triggerMethod('error', err);
                        console.log('%c Error : ', 'background: #ff0000; color: #fff',  err.responseText);
                    });
                }
            },

            /**
            @description: render search result item view and update DOM
            @method _renderSubView
            @return {null}
            **/
            _renderSubView: function(response, self, isFirstPage) {
                var $currentRecordEl = this.$el.find(self.defaultSettings.currentRecordEl),
                    $totalRecordEl = this.$el.find(self.defaultSettings.totalRecordEl),
                    resultModel = (isFirstPage) ? response : response.data.searchResult.results,
                    resultView = (isFirstPage) ? self.searchArticleTemplate(resultModel.toJSON()) : self.searchArticleTemplate(resultModel),
                    totalPagesShowing = (isFirstPage) ? resultModel.length : self.searchArticles.state.currentPage * self.pageViewLimit,
                    totalRecords = (isFirstPage) ? self.searchArticles.state.totalRecords: response.data.searchResult.totalResults,
                    showingCount = 0;

                self.loadUrl = (isFirstPage) ? response.url : response.data.searchResult.loadMoreConfig.loadMoreBaseUrl;
                self.loadUrlParam = (isFirstPage) ? resultModel.queryParams.searchParams : response.data.searchResult.loadMoreConfig.loadMoreAjaxUrl;

                if(totalPagesShowing >= totalRecords) {
                    showingCount = totalRecords;
                    self.$loadmore.hide();

                    self.triggerMethod('lastPage', resultModel);

                } else {
                    showingCount = totalPagesShowing;
                }
                self.$searchList.append(resultView);
                $currentRecordEl.html(showingCount);
                $totalRecordEl.html(totalRecords);
                app.trigger('image:lazyload',self);
            },

            /**
            @description: handle pagination
            @method _pagination
            @return list of next page search result
            @return searchArticles.getFirstPage()
            @return searchArticles.getNextPage()
            **/
            _pagination: function() {
                if (this.isFirstPage) {
                    this.isFirstPage = false;
                    return this.searchArticles;
                } else {
                    this.searchArticles.queryParams.searchParams = this.loadUrlParam;
                    this.searchArticles.url = this.loadUrl;
                    return this.searchArticles.getNextPage();
                }
            },

            /**
            @description: handle load more click event
            @method: _handleclick
            @return: {null}
            **/
            _handleLoadMore: function() {
                this.$loadmore.addClass(this.defaultSettings.activeclass);
                this._searchView();
            }
        });
    });
    return SearchResult;
});

/*global define*/

define('views/section-navigation/_section-navigation',[],function() {

    'use strict';

    var SectionNavigation = IEA.module('UI.section-navigation', function (sectionNavigation, app, iea) {

        _.extend(sectionNavigation, {

            defaultSettings: {
                expandEl: '.expandable',
                navCollapse: '.navbar-collapse'
            },

            events: {
                'click .sub-menu > a': '_slideUpDownMenu'
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this.triggerMethod('beforeInit',options);
                this._super(options);
                this.triggerMethod('init',options);
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
                this.triggerMethod('beforeRender', this);
                this.$el.html(this.template(this.model.toJSON().data));
                this.triggerMethod('render', this);
                
                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }

                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/
                this.triggerMethod('beforeEnable');
                var self = this;
                $(this.defaultSettings.expandEl, this.$el).find('li').each(function() {
                    if($(this).hasClass('active')) {
                        $(this).parents('.sub-menu').addClass('active');
                        self.showMenu($(this).parents('.sub-menu'));
                    }
                });
                this.triggerMethod('enable');
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
                // view cleanup code here, anything that needs to be temporarily paused when view is not currently displayed
            },

            /**
            @method gets fired when hits Tablet breakpoint

            @return {null}
            **/
            onMatchTablet: function ()  {
                $(this.defaultSettings.navCollapse, this.$el).addClass('in');
                $(this.defaultSettings.navCollapse, this.$el).height('auto');
            },

            /**
            @method gets fired when moves out from Tablet breakpoint

            @return {null}
            **/
            onUnmatchTablet: function () {
                $(this.defaultSettings.navCollapse, this.$el).removeClass('in');
                $(this.defaultSettings.navCollapse, this.$el).height(0);
            },

            showMenu: function($elem) {
                this.triggerMethod('beforeShowMenu', $elem);

                $elem.addClass('expanded').children(this.defaultSettings.expandEl).slideDown();

                this.triggerMethod('afterShowMenu', $elem);
            },

            hideMenu: function($elem) {
                this.triggerMethod('beforeHideMenu', $elem);

                $elem.removeClass('expanded').children(this.defaultSettings.expandEl).slideUp();

                this.triggerMethod('afterHideMenu', $elem);
            },
             /**
            }
            expand submenu on click

            @method _expandSubMenu

            @return {null}
            **/
            _slideUpDownMenu: function(evt) {
                var $currSubMenu = $(evt.currentTarget).parent();

                $currSubMenu.hasClass('expanded') ? this.hideMenu($currSubMenu) : this.showMenu($currSubMenu);
            }
        });
    });

    return SectionNavigation;
});

/* (c) 2008-2014 AddThis, Inc */
var addthis_conf = { ver:300 };
if(!(window._atc||{}).ver)var _atd="www.addthis.com/",_atr=window.addthis_cdn||"//s7.addthis.com/",_euc=encodeURIComponent,_duc=decodeURIComponent,_atc={dbg:0,rrev:"7.0",dr:0,ver:250,loc:0,enote:"",cwait:500,bamp:.25,camp:1,csmp:1e-4,damp:1,famp:1,pamp:.1,abmp:.5,sfmp:-1,tamp:1,plmp:1,stmp:0,vamp:1,cscs:1,dtt:.01,ohmp:0,ltj:1,xamp:1,abf:!!window.addthis_do_ab,qs:0,cdn:0,rsrcs:{bookmark:_atr+"static/r07/bookmark046.html",atimg:_atr+"static/r07/atimg046.html",countercss:_atr+"static/r07/plugins/counter015.css",counterIE67css:_atr+"static/r07/counterIE67004.css",counter:_atr+"static/r07/plugins/counter020.js",core:_atr+"static/r07/core159.js",wombat:_atr+"static/r07/bar026.js",wombatcss:_atr+"static/r07/bar012.css",qbarcss:_atr+"bannerQuirks.css",fltcss:_atr+"static/r07/floating010.css",barcss:_atr+"static/r07/banner006.css",barjs:_atr+"static/r07/banner004.js",contentcss:_atr+"static/r07/content009.css",contentjs:_atr+"static/r07/content023.js",layersjs:_atr+"static/r07/plugins/layers081.js",layerscss:_atr+"static/r07/plugins/layers065.css",layersiecss:_atr+"static/r07/plugins/layersIE6008.css",layersdroidcss:_atr+"static/r07/plugins/layersdroid005.css",warning:_atr+"static/r07/warning000.html",ssojs:_atr+"static/r07/ssi005.js",ssocss:_atr+"static/r07/ssi004.css",peekaboocss:_atr+"static/r07/peekaboo002.css",overlayjs:_atr+"static/r07/overlay005.js",widgetWhite32CSS:_atr+"static/r07/widget/css/widget007.white.32.css",widgetIE67css:_atr+"static/r07/widgetIE67006.css",widgetpng:"//s7.addthis.com/",widgetOldCSS:_atr+"static/r07/widget/css/widget007.old.css",widgetOld16CSS:_atr+"static/r07/widget/css/widget007.old.16.css",widgetOld20CSS:_atr+"static/r07/widget/css/widget007.old.20.css",widgetOld32CSS:_atr+"static/r07/widget/css/widget007.old.32.css",widgetMobileCSS:_atr+"static/r07/widget/css/widget007.mobile.css",embed:_atr+"static/r07/embed010.js",embedcss:_atr+"static/r07/embed004.css",lightbox:_atr+"static/r07/lightbox000.js",lightboxcss:_atr+"static/r07/lightbox001.css",link:_atr+"static/r07/link005.html",pinit:_atr+"static/r07/pinit022.html",linkedin:_atr+"static/r07/linkedin025.html",fbshare:_atr+"static/r07/fbshare004.html",tweet:_atr+"static/r07/tweet029.html",menujs:_atr+"static/r07/menu167.js",sh:_atr+"static/r07/sh176.html"}};!function(){function t(t,s,e,a){return function(){this.qs||(this.qs=0),_atc.qs++,this.qs++>0&&a||_atc.qs>1e3||!window.addthis||window.addthis.plo.push({call:t,args:arguments,ns:s,ctx:e})}}function s(t){var s=this,e=this.queue=[];this.name=t,this.call=function(){e.push(arguments)},this.call.queuer=this,this.flush=function(t,a){this.flushed=1;for(var i=0;i<e.length;i++)t.apply(a||s,e[i]);return t}}function e(t){t.style.width=t.style.height="1px",t.style.position="absolute",t.style.zIndex=1e5}function a(t){t&&!(t.data||{}).addthisxf&&window.addthis&&(addthis._pmh.flushed?_ate.pmh(t):addthis._pmh.call(t))}var i,r,c,n,d=window,o="https:"==window.location.protocol,l=(navigator.userAgent||"unk").toLowerCase(),h=/firefox/.test(l),u=/msie/.test(l)&&!/opera/.test(l),g={0:_atr,1:"//ct1.addthis.com/",6:"//ct6z.addthis.com/"},_={gb:"1",nl:"1",no:"1"},m={gr:"1",it:"1",cz:"1",ie:"1",es:"1",pt:"1",ro:"1",ca:"1",pl:"1",be:"1",fr:"1",dk:"1",hr:"1",de:"1",hu:"1",fi:"1",us:"1",ua:"1",mx:"1",se:"1",at:"1"},p={nz:"1"},w=(w=document.getElementsByTagName("script"))&&w[w.length-1].parentNode;if(_atc.cdn=0,!window.addthis||window.addthis.nodeType!==i){try{if(r=window.navigator?navigator.userLanguage||navigator.language:"",c=r.split("-").pop().toLowerCase(),n=r.substring(0,2),2!=c.length&&(c="unk"),_atr.indexOf("-")>-1||(window.addthis_cdn!==i?_atc.cdn=window.addthis_cdn:p[c]?_atc.cdn=6:_[c]?_atc.cdn=h||u?0:1:m[c]&&(_atc.cdn=u?0:1)),_atc.cdn){for(var f in _atc.rsrcs)_atc.rsrcs.hasOwnProperty(f)&&(_atc.rsrcs[f]=_atc.rsrcs[f].replace(_atr,"string"==typeof window.addthis_cdn?window.addthis_cdn:g[_atc.cdn]).replace(/live\/([a-z])07/,"live/$107"));_atr=g[_atc.cdn]}}catch(v){}if(window.addthis={ost:0,cache:{},plo:[],links:[],ems:[],timer:{load:(new Date).getTime()},_Queuer:s,_queueFor:t,data:{getShareCount:t("getShareCount","data")},bar:{show:t("show","bar"),initialize:t("initialize","bar")},layers:t("layers"),login:{initialize:t("initialize","login"),connect:t("connect","login")},configure:function(t){d.addthis_config||(d.addthis_config={}),d.addthis_share||(d.addthis_share={});for(var s in t)if("share"==s&&"object"==typeof t[s])for(var e in t[s])t[s].hasOwnProperty(e)&&(addthis.ost?addthis.update("share",e,t[s][e]):d.addthis_share[e]=t[s][e]);else t.hasOwnProperty(s)&&(addthis.ost?addthis.update("config",s,t[s]):d.addthis_config[s]=t[s])},box:t("box"),button:t("button"),counter:t("counter"),count:t("count"),lightbox:t("lightbox"),toolbox:t("toolbox"),update:t("update"),init:t("init"),ad:{menu:t("menu","ad","ad"),event:t("event","ad"),getPixels:t("getPixels","ad")},util:{getServiceName:t("getServiceName")},ready:t("ready"),addEventListener:t("addEventListener","ed","ed"),removeEventListener:t("removeEventListener","ed","ed"),user:{getID:t("getID","user"),getGeolocation:t("getGeolocation","user",null,!0),getPreferredServices:t("getPreferredServices","user",null,!0),getServiceShareHistory:t("getServiceShareHistory","user",null,!0),ready:t("ready","user"),isReturning:t("isReturning","user"),isOptedOut:t("isOptedOut","user"),isUserOf:t("isUserOf","user"),hasInterest:t("hasInterest","user"),isLocatedIn:t("isLocatedIn","user"),interests:t("getInterests","user"),services:t("getServices","user"),location:t("getLocation","user")},session:{source:t("getSource","session"),isSocial:t("isSocial","session"),isSearch:t("isSearch","session")},_pmh:new s("pmh"),_pml:[],error:function(){},log:function(){}},-1==document.location.href.indexOf(_atr)){var b=document.getElementById("_atssh");if(b||(b=document.createElement("div"),b.style.visibility="hidden",b.id="_atssh",e(b),w.appendChild(b)),window.postMessage&&(window.attachEvent?window.attachEvent("onmessage",a):window.addEventListener&&window.addEventListener("message",a,!1),addthis._pml.push(a)),!b.firstChild){var y,l=navigator.userAgent.toLowerCase(),S=Math.floor(1e3*Math.random());y=document.createElement("iframe"),y.id="_atssh"+S,y.title="AddThis utility frame",b.appendChild(y),e(y),y.frameborder=y.style.border=0,y.style.top=y.style.left=0,_atc._atf=y}}var x=document.createElement("script");x.type="text/javascript",x.src=(o?"https:":"http:")+_atc.rsrcs.core,w.appendChild(x);var j=1e4;setTimeout(function(){if(!window.addthis.timer.core&&(Math.random()<_atc.ohmp&&((new Image).src="//m.addthisedge.com/live/t00/oh.gif?"+Math.floor(4294967295*Math.random()).toString(36)+"&cdn="+_atc.cdn+"&sr="+_atc.ohmp+"&rev="+_atc.rrev+"&to="+j),0!==_atc.cdn)){var t=document.createElement("script");t.type="text/javascript",t.src=(o?"https:":"http:")+_atr+"static/r07/core159.js",w.appendChild(t)}},j)}}();

define("addthis", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.addthis;
    };
}(this)));

/*global define*/
define('views/social-share-print/_social-share-print',[
    'addthis'
], function(
    AddThis) {

    'use strict';

    var SocialSharePrint = IEA.module('UI.social-share-print', function (module, app, iea) {

        _.extend(module, {
            events: {},

            /**
            @method initialize
            @return {null}
            **/
            initialize: function(options) {
                this._super(options);
                this.triggerMethod('init');
            },

            /**
            @method render
            @return SearchResult
            **/
            render: function() {
                this.$el.html(this.template(this.model.toJSON().data));

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }

                this.triggerMethod('render');
                return this;
            },

            /**
            @description:enable function for the component , initialize addthis button instance with configurations. addthis_config available at http://support.addthis.com/customer/portal/articles/1337994-the-addthis_config-variable and addthis_share variables at http://support.addthis.com/customer/portal/articles/1337996-the-addthis_share-variable
            @method enable
            @return {null}
            **/
            enable: function() {
                // incase of tab it will not show dialog and required services_compact
                var addThisOptions = String(this.model.get('data').socialSharePrint.addThisOptions),
                    compact = (app.getValue('isDesktopBreakpoint')) ? 'none' : addThisOptions,
                    addthisConfig = {
                        services_expanded: (addThisOptions !== 'undefined') ? addThisOptions : 'default',
                        services_compact: compact,
                        ui_click: false,
                        ui_delay: 500
                    },
                    sharingObject={};
                addthis.button('.addthis_button_compact', addthisConfig, sharingObject);
                this.triggerMethod('enable');
            },

            /**
            @description: Show the component
            @method show
            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            @description: Hide the component
            @method hide
            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean
            @return {null}
            **/
            clean: function() {
                this._super();
            }
        });
    });
    return SocialSharePrint;
});

/*jshint immed: false */
!function ($) {

    'use strict';

    // TABCOLLAPSE CLASS DEFINITION
    // ======================

    var TabCollapse = function (el, options) {
        this.options   = options;
        this.$tabs  = $(el);

        this._accordionVisible = false; //content is attached to tabs at first
        this._initAccordion();
        this._checkStateOnResize();

        this.checkState();
    };

    TabCollapse.DEFAULTS = {
        accordionClass: 'visible-xs',
        tabsClass: 'hidden-xs',
        accordionTemplate: function(heading, groupId, parentId, active){
            return '<div class="panel panel-default">' +
                '   <div class="panel-heading">' +
                '      <h4 class="panel-title">' +
                '        <a class="' + (active ? '' : 'collapsed') + '" data-toggle="collapse" data-parent="#' + parentId + '" href="#' + groupId + '">' +
                '           ' + heading +
                '        </a>' +
                '      </h4>' +
                '   </div>' +
                '   <div id="' + groupId + '" class="panel-collapse collapse ' + (active ? 'in' : '') + '">' +
                '       <div class="panel-body">' +
                '       </div>' +
                '   </div>' +
                '</div>';
        }
    };

    TabCollapse.prototype.checkState = function(){
        if (this.$tabs.is(':visible') && this._accordionVisible){
            this.showTabs();
            this._accordionVisible = false;
        } else if (this.$accordion.is(':visible') && !this._accordionVisible){
            this.showAccordion();
            this._accordionVisible = true;
        }
    };

    TabCollapse.prototype.showTabs = function(){
        this.$tabs.trigger($.Event('show-tabs.bs.tabcollapse'));

        var $panelBodies = this.$accordion.find('.panel-body');
        $panelBodies.each(function(){
            var $panelBody = $(this),
                $tabPane = $panelBody.data('bs.tabcollapse.tabpane');
            $tabPane.append($panelBody.children('*').detach());
        });
        this.$accordion.html('');

        this.$tabs.trigger($.Event('shown-tabs.bs.tabcollapse'));
    };

    TabCollapse.prototype.showAccordion = function(){
        this.$tabs.trigger($.Event('show-accordion.bs.tabcollapse'));

        var $headings = this.$tabs.find('li:not(.dropdown) [data-toggle="tab"], li:not(.dropdown) [data-toggle="pill"]'),
            view = this;
        $headings.each(function(){
            var $heading = $(this);
            view.$accordion.append(view._createAccordionGroup(view.$accordion.attr('id'), $heading));
        });

        this.$tabs.trigger($.Event('shown-accordion.bs.tabcollapse'));
    };

    TabCollapse.prototype._checkStateOnResize = function(){
        var view = this;
        $(window).resize(function(){
            clearTimeout(view._resizeTimeout);
            view._resizeTimeout = setTimeout(function(){
                view.checkState();
            }, 100);
        });
    };


    TabCollapse.prototype._initAccordion = function(){
        this.$accordion = $('<div class="panel-group ' + this.options.accordionClass + '" id="' + this.$tabs.attr('id') + '-accordion' +'"></div>');
        this.$tabs.after(this.$accordion);
        this.$tabs.addClass(this.options.tabsClass);
        this.$tabs.siblings('.tab-content').addClass(this.options.tabsClass);
    };

    TabCollapse.prototype._createAccordionGroup = function(parentId, $heading){
        var tabSelector = $heading.attr('data-target'),
            active = $heading.parent().is('.active');

        if (!tabSelector) {
            tabSelector = $heading.attr('href');
            tabSelector = tabSelector && tabSelector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
        }

        var $tabPane = $(tabSelector),
            groupId = $tabPane.attr('id') + '-collapse',
            $panel = $(this.options.accordionTemplate($heading.html(), groupId, parentId, active));
        $panel.find('.panel-body').append($tabPane.children('*').detach())
            .data('bs.tabcollapse.tabpane', $tabPane);

        return $panel;
    };



    // TABCOLLAPSE PLUGIN DEFINITION
    // =======================

    $.fn.tabCollapse = function (option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('bs.tabcollapse');
            var options = $.extend({}, TabCollapse.DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (!data) {
                $this.data('bs.tabcollapse', new TabCollapse(this, options));
            }
        });
    };

    $.fn.tabCollapse.Constructor = TabCollapse;


}(window.jQuery);
define("bootstrap_tabcollapse", function(){});

/*global define*/

define('views/tabbed-content/_tabbed-content',[
    'bootstrap_tabcollapse'
], function(
    bootstrap_tabcollapse) {

    'use strict';

    var TabbedContent = IEA.module('UI.tabbed-content', function (module, app, iea) {

        _.extend(module, {
            defaultSettings: {
                enableAccordian: 'true'
            },
            events: {
                'click .panel-heading a': '_handleclick'
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                IEA.View.prototype.initialize.apply(this, arguments);
                this.triggerMethod('init');
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled=true;
                }
                this.triggerMethod('render');
                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                /*enable logic goes here*/
                if(this.defaultSettings.enableAccordian === 'true'){
                    $('ul[role="tablist"]').tabCollapse({
                        tabsClass: 'hidden-xs hidden-sm',
                        accordionClass: 'visible-xs visible-sm'
                    });
                }
                $('.panel-heading a').not('.collapsed').parents('.panel').addClass('active');
                $(window).off('resize.switchTabs').on('resize.switchTabs', this._handleclick);

                var tabs = $('.tabbed-content .nav-tabs li'),
                    tabLength = tabs.length;
                if(tabLength <= 5) {
                    tabs.css('width', (100/tabLength)+'%');
                }
                this.triggerMethod('enable');
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                IEA.View.prototype.show.apply(this, arguments);
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                IEA.View.prototype.hide.apply(this, arguments);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                IEA.View.prototype.clean.apply(this, arguments);
                // view cleanup code here, anything that needs to be temporarily paused when view is not currently displayed
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            handle vcartousel click

            @method _handleclick

            @return {null}
            **/
            _handleclick: function(evt) {
                var $current = $(evt.target).parents('.panel');
                $('.panel').not($current).removeClass('active');
                $current.toggleClass('active');

            }
        });
    });
    return TabbedContent;
});

define('views/twitter-feed/_twitter-feed',[
    'twitterWidget'
], function(
    TwitterWidget) {

    'use strict';

    var TwitterFeed = IEA.module('UI.twitter-feed', function (module, app, iea) {

        _.extend(module, {

            events: {},

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                this._super(options);
                this.triggerMethod('init');
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
                var componentData = this.model.get('data'),
                    widgetId = app.getValue('twitterWidgetId');

                if (widgetId === 'undefined' || widgetId === '') {
                    console.info('%c Twitter Widget ID Not Available : ', 'background: #ffb400; color: #fff', widgetId);
                }

                // add twitterWidgetId from tenant config to component data object
                componentData.tenant = {
                    twitterWidgetId: widgetId
                };

                this.$el.html(this.template(componentData));

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled = true;
                }

                this.triggerMethod('render');

                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                var self = this;
                setTimeout(function() {

                    self.triggerMethod('beforeEnable', self);

                    twttr.widgets.load();

                    self.triggerMethod('enable', self);

                }, 200);


                twttr.events.bind(
                    'rendered',
                    function (event) {
                        //adjusting the tweet height not to overflow
                        setTimeout(function() {
                            var twitterHeight = $('.twitter-timeline', self.el).height() + 60;
                            $('.twitter-timeline', self.el).css('height', twitterHeight + "px");
                        }, 400);

                        $('iframe#twitter-widget-0', self.el).contents().find('head').append('<style> .var-chromeless .tweet {padding-bottom:9px !important; border-bottom: 1px solid #ccc; margin-bottom:5px;}</style>');
                    }
                );
            },

            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                this._super();
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                this._super(cb, scope, params);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                this._super();
            },

            /* ----------------------------------------------------------------------------- *\
               Private Methods
            \* ----------------------------------------------------------------------------- */

            /**
            Handle the scaling of typography based on width.

            @method _handleStyle

            @return {null}
            **/
            _handleStyle: function () {
                var $gridContainer = $('.twitter-feed-wrapper', this.$el),
                    feedWrapperWidth = $gridContainer.width();

                if (!app.getValue('isMobileBreakpoint')) {
                    if (feedWrapperWidth < 340) {

                        if(!this.$el.hasClass('x-small-container')) {
                            this.$el.addClass('x-small-container');
                        }

                    } else if (feedWrapperWidth < 540) {

                        if(!this.$el.hasClass('small-container')) {
                            this.$el.addClass('small-container');
                        }

                    } else if (feedWrapperWidth < 740) {

                        if(!this.$el.hasClass('medium-container')) {
                            this.$el.addClass('medium-container');
                        }
                    }
                }
            }

        });
    });

    return TwitterFeed;
});

/*global define*/

define('views/video/_video',[
    'video',
    'popup'
], function(
    Video,
    Popup) {

    'use strict';


    var Video = IEA.module('UI.video', function(module, app, iea) {

        _.extend(module, {
            instance: (this.instance) ? this.instance: {},
            events: {},

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            @method initialize

            @return {null}
            **/
            initialize: function(options) {
                IEA.View.prototype.initialize.apply(this, arguments);
                this.triggerMethod('init');
            },

            /**
            @method render

            @return BlogView
            **/
            render: function() {
                //this.$el.html(this.template({video: this.model.toJSON().data.video}));

                this.$el.html(this.template(this.model.toJSON()));

                if (this._isEnabled === false) {
                    this.enable();
                    this._isEnabled = true;
                }

                this.triggerMethod('render');
                return this;
            },

            /**
            enable function for the component

            @method enable

            @return {null}
            **/
            enable: function() {
                this.triggerMethod('beforeEnable');
                /*enable logic goes here*/
                var customConfig = this.model.get('data').video,
                    container = this.$el.find('.video-frame'),
                    self = this;

                // var instance = new VideoFacade({
                //     config: customConfig,
                //     container: container
                // });

                this.key =  customConfig.randomNumber;

                if (customConfig.displayOption === 'Overlay') {

                    var $overlayLink = this.$el.find('a.video-overlay'),
                        $close = this.$el.find('button.mfp-close');

                    var popup = new IEA.popup({
                        type: 'inline',
                        preloader: false
                    });

                    this.popup = popup;

                    popup.on('popup:beforeOpen', function() {
                        self.instance[self.key] = IEA.video(container, customConfig);
                    });

                    popup.on('popup:open', function() {
                        if(app.getValue('isDesktopBreakpoint')) {
                            $('.mfp-content').addClass('video');
                         }

                        var videoPlayer = self.instance[self.key];
                        if(videoPlayer.options.viewType === 'html5') {
                            videoPlayer.play();
                        }
                    });

                    popup.on('popup:close', function() {
                        self.instance[self.key].destroy();
                    });

                    $overlayLink.on('click', function() {
                        popup.open($(container).parents('.video-content'));
                    });

                    $close.on('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        popup.close();
                    });

                } else {

                    this.instance[this.key] = IEA.video(container, customConfig);
                }

                this.triggerMethod('enable', this.instance[customConfig.randomNumber]);
            },

            play: function() {
                this.instance[this.key].play();
                this.triggerMethod('play', this.instance[this.key]);
            },

            pause: function() {
                this.instance[this.key].pause();
                this.triggerMethod('pause', this.instance[this.key]);
            },

            stop: function() {
                this.instance[this.key].stop();
                this.triggerMethod('stop', this.instance[this.key]);
            },

            destroy: function() {
                this.instance[this.key].destroy();
                this.triggerMethod('destroy', this.instance[this.key]);
            },

            restart: function() {
                this.instance[this.key].restart();
                this.triggerMethod('restart', this.instance[this.key]);
            },

            seek: function(seconds) {
                this.instance[this.key].seek(seconds);
                this.triggerMethod('seek', this.instance[this.key], seconds);
            },

            resize: function(width, height) {
                this.instance[this.key].resize(width, height);
                this.triggerMethod('resize', this.instance[this.key], width, height);
            },


            /**
            show the component

            @method show

            @return {null}
            **/
            show: function() {
                IEA.View.prototype.show.apply(this, arguments);
            },

            /**
            hide the component

            @method hide

            @return {null}
            **/
            hide: function(cb, scope, params) {
                IEA.View.prototype.hide.apply(this, arguments);
            },

            /**
            @method clean

            @return {null}
            **/
            clean: function() {
                IEA.View.prototype.clean.apply(this, arguments);
                // view cleanup code here, anything that needs to be temporarily paused when view is not currently displayed
            },

            /* ----------------------------------------------------------------------------- *\
               Public Methods
            \* ----------------------------------------------------------------------------- */

            /**
            handle vcartousel click

            @method _handleclick

            @return {null}
            **/
            _handleclick: function(evt) {}
        });
    });

    return Video;
});

/* jshint quotmark:false */

define('helpers',[
    'handlebars'
], function(
    Handlebars
) {
    'use strict';

    var Helper = IEA.module('helpers', function(module, app, iea) {
        var helpers = {},
            self = this;

        this.stringify = function(obj) {
            if ("JSON" in window) {
                return JSON.stringify(obj);
            }

            var t = typeof(obj);
            if (t !== "object" || obj === null) {
                // simple data type
                if (t === "string") {
                    obj = '"' + obj + '"';
                }

                return String(obj);
            } else {
                // recurse array or object
                var n, v, json = [],
                    arr = (obj && obj.constructor === Array);

                for (n in obj) {
                    v = obj[n];
                    t = typeof(v);
                    if (obj.hasOwnProperty(n)) {
                        if (t === "string") {
                            v = '"' + v + '"';
                        } else if (t === "object" && v !== null) {
                            v = jQuery.stringify(v);
                        }

                        json.push((arr ? "" : '"' + n + '":') + String(v));
                    }
                }

                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        };

        // all the helpers for handlebar goes here.
        _.extend(helpers, {
            /**
             * Description
             * @method include
             * @param {} contextData
             * @param {} path
             * @param {} c
             * @return NewExpression
             */
            include: function(contextData, path, c) {
                var datas = app.getTemplate('include', path)(contextData);
                return new Handlebars.SafeString(datas);
            },

            /**
             * Description
             * @method ifCond
             * @param {} v1
             * @param {} v2
             * @param {} options
             * @return CallExpression
             */
            ifCond: function(v1, v2, options) {
                if (v1 === v2) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },

            /**
             * Checks if the val is present in set of multiVal
             * @method ifCond
             * @param {} multiVal
             * @param {} val
             * @param {} options
             * @return CallExpression
             */
            hasValue: function(multiVal, val, options) {
                var strArray = multiVal.split(',');

                if(strArray.indexOf($.trim(val)) !== -1) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },

            ifCondx: function(v1, operator, v2, options) {
                switch (operator) {
                    case '===':
                        return (v1 === v2) ? options.fn(this) : options.inverse(this);
                    case '<':
                        return (v1 < v2) ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                    case '>':
                        return (v1 > v2) ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return (v1 && v2) ? options.fn(this) : options.inverse(this);
                    case '||':
                        return (v1 || v2) ? options.fn(this) : options.inverse(this);
                    case '!==':
                        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            },

            eachUpTo: function(ary, max, options) {
                if(!ary || ary.length === 0) {
                    return options.inverse(this);
                }

                var result = [ ];
                for(var i = 0; i < max && i < ary.length; ++i) {
                    result.push(options.fn(ary[i]));
                }
                return result.join('');
            },

            media: function(bp, options) {
                if (app.getCurrentBreakpoint() === bp) {
                    return options.fn(this);
                }
            },

            stringify: function(data, options) {
                return self.stringify(data);
            },

            /**
             * Description
             * @method adaptive
             * @param {} url
             * @param {} ext
             * @param {} alt
             * @param {} title
             * @param {} filename
             * @return NewExpression
             */
            adaptive: function(url, ext, alt, title, filename) {
                var parsedURL = [],
                    imageExtension = (typeof ext !== 'undefined' && ext !== '' && typeof ext !== 'object') ? ext : app.getValue('extension'),
                    imageMarkup = '';
                /*
                    url : http://www.engagednow.com/content/dam/engagednow/hero-idea.jpg
                    url" /content/engagewithadobe/en_us/events/jcr:content/flexi_hero_par/adaptiveimage

                    selector : enscale

                    filename: hero-idea
                    filename: ''

                    extension: .jpg

                    http://www.engagednow.com/content/dam/engagednow/hero-idea.jpg.enscale.hero-idea.full.high.jpg
                    /content/engagewithadobe/en_us/events/jcr:content/flexi_hero_par/adaptiveimage.enscale.full.high.jpg

                */

                parsedURL.push(url);

                if (app.getValue('selector')) {
                    parsedURL.push(app.getValue('selector'));
                }

                if (typeof filename !== 'undefined' && filename !== '' && typeof filename !== 'object') {
                    parsedURL.push(filename);
                }

                parsedURL = parsedURL.join('.');

                if (typeof title !== 'undefined' && title !== '' && typeof title !== 'object') {
                    imageMarkup = '<img class="' + title + '" src="' + parsedURL + app.getValue('breakpoints').desktop.prefix + imageExtension + '" title="' + title + '" alt="' + alt + '">';
                } else {
                    imageMarkup = '<img src="' + parsedURL + app.getValue('breakpoints').desktop.prefix + imageExtension + '" alt="' + alt + '">';
                }

                return new Handlebars.SafeString(
                    '<picture class="lazy-load is-loading">' +
                    '<!--[if IE 9]><video style="display: none;"><![endif]-->' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').desktop.prefix + imageExtension + '" media="' + app.getValue('breakpoints').desktop.media + '">' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').tabletLandscape.prefix + imageExtension + '" media="' + app.getValue('breakpoints').tabletLandscape.media + '">' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').tablet.prefix + imageExtension + '" media="' + app.getValue('breakpoints').tablet.media + '">' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').mobileLandscape.prefix + imageExtension + '" media="' + app.getValue('breakpoints').mobileLandscape.media + '">' +
                    '<source srcset="' + parsedURL + app.getValue('breakpoints').mobile.prefix + imageExtension + '" media="' + app.getValue('breakpoints').mobile.media + '">' +
                    '<!--[if IE 9]></video><![endif]-->' +
                    imageMarkup +
                    '</picture>'
                );
            },

            /**
             * Description
             * @method debug
             * @param {} value
             * @return CallExpression
             */
            debug: function(value) {
                console.log('===============DEBUG START==================');
                console.log('Context: ', this);
                console.log('Value: ', value);
                return console.log('=============DEBUG END====================');
            }

        });

        // register all helpers from the helper object into handlebars
        /**
         * Description
         * @method registerHelpers
         * @param {} options
         * @return
         */
        this.registerHelpers = function(options) {
            options = options || {};
            for (var helper in helpers) {
                if (helpers.hasOwnProperty(helper)) {
                    Handlebars.registerHelper(helper, helpers[helper]);
                }
            }
            this.triggerMethod('helper:registered');
        };

        // add self init code to fire register helper when module loaded.
        this.addInitializer(this.registerHelpers);

    });

    return Helper;
});

define('iea.templates',['handlebars', 'helpers'], function(Handlebars) {

this["lib"] = this["lib"] || {};

this["lib"]["lib/js/templates/accordion/defaultView.hbss"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "\r\n<div class=\"panel-group\" id=\"accordion\">\r\n  <div class=\"panel panel-default\">\r\n    <div class=\"panel-heading\">\r\n      <h4 class=\"panel-title\">\r\n        <a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapseOne\">\r\n          Collapsible Group Item #1\r\n        </a>\r\n      </h4>\r\n    </div>\r\n    <div id=\"collapseOne\" class=\"panel-collapse collapse in\">\r\n      <div class=\"panel-body\">\r\n        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"panel panel-default\">\r\n    <div class=\"panel-heading\">\r\n      <h4 class=\"panel-title\">\r\n        <a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapseTwo\">\r\n          Collapsible Group Item #2\r\n        </a>\r\n      </h4>\r\n    </div>\r\n    <div id=\"collapseTwo\" class=\"panel-collapse collapse\">\r\n      <div class=\"panel-body\">\r\n        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"panel panel-default\">\r\n    <div class=\"panel-heading\">\r\n      <h4 class=\"panel-title\">\r\n        <a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapseThree\">\r\n          Collapsible Group Item #3\r\n        </a>\r\n      </h4>\r\n    </div>\r\n    <div id=\"collapseThree\" class=\"panel-collapse collapse\">\r\n      <div class=\"panel-body\">\r\n        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/adaptive-image/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.escapeExpression, alias2=helpers.helperMissing;

  return "	<a class= \"image-link\" href=\""
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.adaptiveImage : depth0)) != null ? stack1.completeUrl : stack1), depth0))
    + "\" target= \""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(depth0,((stack1 = (depth0 != null ? depth0.adaptiveImage : depth0)) != null ? stack1.windowType : stack1),"Yes",{"name":"ifCond","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\r\n		"
    + alias1((helpers.adaptive || (depth0 && depth0.adaptive) || alias2).call(depth0,((stack1 = (depth0 != null ? depth0.adaptiveImage : depth0)) != null ? stack1.fileReference : stack1),((stack1 = (depth0 != null ? depth0.adaptiveImage : depth0)) != null ? stack1.extension : stack1),((stack1 = (depth0 != null ? depth0.adaptiveImage : depth0)) != null ? stack1.alt : stack1),((stack1 = (depth0 != null ? depth0.adaptiveImage : depth0)) != null ? stack1.title : stack1),((stack1 = (depth0 != null ? depth0.adaptiveImage : depth0)) != null ? stack1.fileName : stack1),{"name":"adaptive","hash":{},"data":data}))
    + "\r\n	</a>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return "_blank";
},"4":function(depth0,helpers,partials,data) {
    return "_self";
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return "		"
    + this.escapeExpression((helpers.adaptive || (depth0 && depth0.adaptive) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.adaptiveImage : depth0)) != null ? stack1.fileReference : stack1),((stack1 = (depth0 != null ? depth0.adaptiveImage : depth0)) != null ? stack1.extension : stack1),((stack1 = (depth0 != null ? depth0.adaptiveImage : depth0)) != null ? stack1.alt : stack1),((stack1 = (depth0 != null ? depth0.adaptiveImage : depth0)) != null ? stack1.title : stack1),((stack1 = (depth0 != null ? depth0.adaptiveImage : depth0)) != null ? stack1.fileName : stack1),{"name":"adaptive","hash":{},"data":data}))
    + "\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.adaptiveImage : depth0)) != null ? stack1.completeUrl : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});

this["lib"]["lib/js/templates/breadcrumb/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <li "
    + ((stack1 = helpers['if'].call(depth0,(data && data.last),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.pageName : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </li>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return "class=\"active\"";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.pageURL : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "");
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "            <a href=\""
    + this.escapeExpression(((helper = (helper = helpers.pageURL || (depth0 != null ? depth0.pageURL : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"pageURL","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.pageName || (depth0 != null ? depth0.pageName : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"pageName","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var helper;

  return "                <a href=\"javascript:void(0)\">"
    + this.escapeExpression(((helper = (helper = helpers.pageName || (depth0 != null ? depth0.pageName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"pageName","hash":{},"data":data}) : helper)))
    + "</a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<ul>\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.breadcrumb : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"useData":true});

this["lib"]["lib/js/templates/carousel/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <li class=\""
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.image : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.image : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + "        </li>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return " image ";
},"4":function(depth0,helpers,partials,data) {
    return " video ";
},"6":function(depth0,helpers,partials,data) {
    return "                "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,depth0,"panel/imagePanel.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"8":function(depth0,helpers,partials,data) {
    return "                "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,depth0,"panel/videoPanel.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"iea-carousel clearfix\">\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.carousel : depth0)) != null ? stack1.slides : stack1),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/content-results-grid/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <h3>"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.noResultCopy : stack1), depth0))
    + "</h3>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"grid-body\">\r\n    <div class=\"grid-body-head\">\r\n            <div class=\"total-res col-sm-6 col-xs-7\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.lazyload : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.sortRequired : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n    </div>\r\n\r\n    <div class=\"grid-body-section\">\r\n        <div class=\"row article-container\">\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.clientSideRendering : stack1),"false",{"name":"ifCond","hash":{},"fn":this.program(17, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\r\n\r\n        <div class=\"loader\">\r\n        </div>\r\n    </div>\r\n</div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.resultCount : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.pageSize : stack1),{"name":"ifCondx","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.resultCount : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.pageSize : stack1),{"name":"ifCondx","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                    <span class=\"page-index\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.showPrefixText : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.resultCount : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.showPostfixText : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.resultCount : stack1), depth0))
    + "</span>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                    <span class=\"page-index\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.showPrefixText : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.pageSize : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.showPostfixText : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.resultCount : stack1), depth0))
    + "</span>\r\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                <span class=\"page-index\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.showPrefixText : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.resultCount : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.showPostfixText : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.resultCount : stack1), depth0))
    + "</span>\r\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.sortOptions : stack1),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"12":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "           <div class=\"col-sm-6 col-xs-5\">\r\n                <div class=\"sortby hide-large-device\">\r\n                    <div class=\"btn-group\">\r\n                        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">\r\n                            <span class=\"selected-sort-key\">"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.sortOptions : stack1)) != null ? stack1['0'] : stack1)) != null ? stack1.value : stack1), depth0))
    + "</span> <span class=\"caret\"></span>\r\n                        </button>\r\n                        <ul class=\"dropdown-menu\" role=\"menu\">\r\n                            <li><a class=\"sorting-list\" href=\"#\" data-key=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.defaultSortOption : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.defaultSortOption : stack1), depth0))
    + "</a></li>\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.sortOptions : stack1),{"name":"each","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        </ul>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"sortby hide-mobile\">\r\n                    "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.sortLabel : stack1), depth0))
    + " <span class=\"colon\">: </span>\r\n                    <div class=\"btn-group\">\r\n                        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">\r\n                            <span class=\"selected-sort-key\">"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.sortOptions : stack1)) != null ? stack1['0'] : stack1)) != null ? stack1.value : stack1), depth0))
    + "</span> <span class=\"caret\"></span>\r\n                        </button>\r\n                        <ul class=\"dropdown-menu\" role=\"menu\">\r\n                            <li><a class=\"sorting-list\" href=\"#\" data-key=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.defaultSortOption : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.defaultSortOption : stack1), depth0))
    + "</a></li>\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.sortOptions : stack1),{"name":"each","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        </ul>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n";
},"13":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.value : depth0),"!==","",{"name":"ifCondx","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"14":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.key : depth0),"!==","",{"name":"ifCondx","hash":{},"fn":this.program(15, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"15":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                                        <li><a class=\"sorting-list\" href=\"#\" data-key=\""
    + alias3(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" data-field=\""
    + alias3(((helper = (helper = helpers.field || (depth0 != null ? depth0.field : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"field","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"value","hash":{},"data":data}) : helper)))
    + "</a></li>\r\n";
},"17":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.contentResults : stack1),{"name":"each","hash":{},"fn":this.program(18, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"18":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.viewFormat : stack1),"4",{"name":"ifCond","hash":{},"fn":this.program(19, data, 0),"inverse":this.program(21, data, 0),"data":data})) != null ? stack1 : "")
    + "                            <div class=\"thumbnail\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageDetail : depth0),{"name":"if","hash":{},"fn":this.program(23, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                                <div class=\"caption\">\r\n                                    <span class=\"thumbnail-arrow glyphicon glyphicon-chevron-up\"></span>\r\n                                    <h4><a href=\""
    + alias3(((helper = (helper = helpers.ctaUrl || (depth0 != null ? depth0.ctaUrl : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ctaUrl","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.titleDetail || (depth0 != null ? depth0.titleDetail : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"titleDetail","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a></h4>\r\n                                    <p>"
    + ((stack1 = ((helper = (helper = helpers.shortDescription || (depth0 != null ? depth0.shortDescription : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"shortDescription","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</p>\r\n                                    <a href=\""
    + alias3(((helper = (helper = helpers.ctaUrl || (depth0 != null ? depth0.ctaUrl : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ctaUrl","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.windowType : depth0),{"name":"if","hash":{},"fn":this.program(25, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias3(((helper = (helper = helpers.ctaText || (depth0 != null ? depth0.ctaText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ctaText","hash":{},"data":data}) : helper)))
    + "</a>\r\n                                </div>\r\n                            </div>\r\n                        </article>\r\n";
},"19":function(depth0,helpers,partials,data) {
    return "                        <article class=\"col-md-3 col-sm-3 col-xs-12 lazy\">\r\n";
},"21":function(depth0,helpers,partials,data) {
    return "                        <article class=\"col-md-4 col-sm-4 col-xs-12 lazy\">\r\n";
},"23":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "                                    <a href=\""
    + alias2(((helper = (helper = helpers.ctaUrl || (depth0 != null ? depth0.ctaUrl : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"ctaUrl","hash":{},"data":data}) : helper)))
    + "\">\r\n                                        "
    + alias2((helpers.adaptive || (depth0 && depth0.adaptive) || alias1).call(depth0,(depth0 != null ? depth0.imageDetail : depth0),(depth0 != null ? depth0.extension : depth0),(depth0 != null ? depth0.titleDetail : depth0),(depth0 != null ? depth0.titleDetail : depth0),"",{"name":"adaptive","hash":{},"data":data}))
    + "\r\n                                    </a>\r\n";
},"25":function(depth0,helpers,partials,data) {
    return " target=\"_blank\" ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"grid-header\">\r\n    <h2>"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.resultContentLabel : stack1), depth0))
    + "</h2>\r\n</div>\r\n"
    + ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.contentResultsGrid : depth0)) != null ? stack1.resultCount : stack1),"===","0",{"name":"ifCondx","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});

this["lib"]["lib/js/templates/content-results-grid/partial/content-result-grid-article.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depths[1] != null ? depths[1].column : depths[1]),"4",{"name":"ifCond","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.program(4, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "    <div class=\"thumbnail\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageDetail : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"caption\">\r\n            <span class=\"thumbnail-arrow glyphicon glyphicon-chevron-up\"></span>\r\n            <h4><a href=\""
    + alias3(((helper = (helper = helpers.ctaUrl || (depth0 != null ? depth0.ctaUrl : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ctaUrl","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.titleDetail || (depth0 != null ? depth0.titleDetail : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"titleDetail","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a></h4>\r\n            <p>"
    + ((stack1 = ((helper = (helper = helpers.shortDescription || (depth0 != null ? depth0.shortDescription : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"shortDescription","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</p>\r\n            <a href=\""
    + alias3(((helper = (helper = helpers.ctaUrl || (depth0 != null ? depth0.ctaUrl : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ctaUrl","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.windowType : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias3(((helper = (helper = helpers.ctaText || (depth0 != null ? depth0.ctaText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ctaText","hash":{},"data":data}) : helper)))
    + "</a>\r\n        </div>\r\n    </div>\r\n</article>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return "<article class=\"col-md-3 col-sm-3 col-xs-12 lazy\">\r\n";
},"4":function(depth0,helpers,partials,data) {
    return "<article class=\"col-md-4 col-sm-4 col-xs-12 lazy\">\r\n";
},"6":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "            <a href=\""
    + alias2(((helper = (helper = helpers.ctaUrl || (depth0 != null ? depth0.ctaUrl : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"ctaUrl","hash":{},"data":data}) : helper)))
    + "\">\r\n		"
    + alias2((helpers.adaptive || (depth0 && depth0.adaptive) || alias1).call(depth0,(depth0 != null ? depth0.imageDetail : depth0),(depth0 != null ? depth0.extension : depth0),(depth0 != null ? depth0.titleDetail : depth0),(depth0 != null ? depth0.titleDetail : depth0),"",{"name":"adaptive","hash":{},"data":data}))
    + "\r\n            </a>\r\n";
},"8":function(depth0,helpers,partials,data) {
    return " target=\"_blank\" ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.data : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});

this["lib"]["lib/js/templates/country-language-selector/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "			<div class=\"region-group\">\r\n				<div class=\"region-title "
    + ((stack1 = helpers['if'].call(depth0,(data && data.first),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n					<a href=\"javascript:void(0)\">"
    + this.escapeExpression(((helper = (helper = helpers.region || (depth0 != null ? depth0.region : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"region","hash":{},"data":data}) : helper)))
    + "</a>\r\n				</div> \r\n				<ul class=\"country-list "
    + ((stack1 = helpers['if'].call(depth0,(data && data.first),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.countries : depth0),{"name":"each","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "				</ul>\r\n			</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return "expanded";
},"4":function(depth0,helpers,partials,data) {
    return "in";
},"6":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "						<li class=\"country-item\">\r\n							<a href=\""
    + alias3(((helper = (helper = helpers.flagImage || (depth0 != null ? depth0.flagImage : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"flagImage","hash":{},"data":data}) : helper)))
    + "\">\r\n								<img src=\""
    + alias3(((helper = (helper = helpers.flagImage || (depth0 != null ? depth0.flagImage : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"flagImage","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + alias3(((helper = (helper = helpers.flagImageAlt || (depth0 != null ? depth0.flagImageAlt : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"flagImageAlt","hash":{},"data":data}) : helper)))
    + "\">\r\n							</a>\r\n							<span class=\"country-title\">"
    + alias3(((helper = (helper = helpers.countryName || (depth0 != null ? depth0.countryName : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"countryName","hash":{},"data":data}) : helper)))
    + "</span>\r\n							<ul class=\"language-list\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "							</ul>\r\n							</a>\r\n						</li>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "								<li class=\"language-item\">\r\n									<a "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " href=\""
    + alias3(((helper = (helper = helpers.pageURL || (depth0 != null ? depth0.pageURL : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"pageURL","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.language || (depth0 != null ? depth0.language : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"language","hash":{},"data":data}) : helper)))
    + "</a>\r\n								</li>\r\n";
},"8":function(depth0,helpers,partials,data) {
    return " class=\"selected-item\" ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"dropdown\">\r\n	<div class=\"selector-header dropdown-toggle\" data-toggle=\"dropdown\">\r\n		<img class=\"display-flag\" src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.countryLanguageSelector : depth0)) != null ? stack1.imagePath : stack1), depth0))
    + "\" alt=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.countryLanguageSelector : depth0)) != null ? stack1.imageAltText : stack1), depth0))
    + "\"></img>\r\n		<span class=\"display-name\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.countryLanguageSelector : depth0)) != null ? stack1.heading : stack1), depth0))
    + "</span>\r\n		<span class=\"display-arrow\"></span>\r\n	</div>\r\n	<div class=\"selector-body dropdown-menu\">\r\n		<div class=\"global-title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.countryLanguageSelector : depth0)) != null ? stack1.title : stack1), depth0))
    + "</div>\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.countryLanguageSelector : depth0)) != null ? stack1.regions : stack1),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</div>\r\n</div>";
},"useData":true});

this["lib"]["lib/js/templates/dynamic-page-properties/defaultView.hbss"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<span class=\"dynamic-page-properties\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.propertyValue : stack1), depth0))
    + "</span>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/expand-collapse/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"expandcollapse-panel\">\r\n	<div class=\"expandcollapse-header "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.expanded : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\r\n	    <a class=\"expandcollapse-toggle\" href=\"#\">\r\n	        <h3>"
    + alias3(((helper = (helper = helpers.heading || (depth0 != null ? depth0.heading : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"heading","hash":{},"data":data}) : helper)))
    + "</h3>\r\n	    </a>\r\n	</div>\r\n	<div class=\"expandcollapse-body "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.expanded : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\r\n	    <img src=\""
    + alias3(((helper = (helper = helpers.imagePath || (depth0 != null ? depth0.imagePath : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"imagePath","hash":{},"data":data}) : helper)))
    + "\"/>\r\n	    <p>"
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</p>\r\n	</div>\r\n</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return " expanded ";
},"4":function(depth0,helpers,partials,data) {
    return " collapsed ";
},"6":function(depth0,helpers,partials,data) {
    return " ";
},"8":function(depth0,helpers,partials,data) {
    return " hiding ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.expandCollapse : depth0)) != null ? stack1.panels : stack1),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["lib"]["lib/js/templates/flyOutMenu/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "        <ul class=\"dropdown-menu single-result\">\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <ul class=\"dropdown-menu multi-column columns-"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.flyOutMenu : depth0)) != null ? stack1.flyOutMenuLinks : stack1)) != null ? stack1.length : stack1), depth0))
    + "\">\r\n            <div class=\"\">\r\n";
},"5":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=helpers.helperMissing;

  return "\r\n"
    + ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || alias1).call(depth0,((stack1 = ((stack1 = (depths[1] != null ? depths[1].flyOutMenu : depths[1])) != null ? stack1.flyOutMenuLinks : stack1)) != null ? stack1.length : stack1),"===",2,{"name":"ifCondx","hash":{},"fn":this.program(6, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || alias1).call(depth0,((stack1 = ((stack1 = (depths[1] != null ? depths[1].flyOutMenu : depths[1])) != null ? stack1.flyOutMenuLinks : stack1)) != null ? stack1.length : stack1),"===",3,{"name":"ifCondx","hash":{},"fn":this.program(8, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || alias1).call(depth0,((stack1 = ((stack1 = (depths[1] != null ? depths[1].flyOutMenu : depths[1])) != null ? stack1.flyOutMenuLinks : stack1)) != null ? stack1.length : stack1),"===",4,{"name":"ifCondx","hash":{},"fn":this.program(10, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.menuTitle : depth0),{"name":"if","hash":{},"fn":this.program(12, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imagePath : depth0),{"name":"if","hash":{},"fn":this.program(14, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.menus : depth0),{"name":"if","hash":{},"fn":this.program(19, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n\r\n"
    + ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || alias1).call(depth0,((stack1 = ((stack1 = (depths[1] != null ? depths[1].flyOutMenu : depths[1])) != null ? stack1.flyOutMenuLinks : stack1)) != null ? stack1.length : stack1),">",1,{"name":"ifCondx","hash":{},"fn":this.program(25, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"6":function(depth0,helpers,partials,data) {
    return "                <div class=\"col-sm-6 \">\r\n                    <ul class=\"multi-column-dropdown\">\r\n";
},"8":function(depth0,helpers,partials,data) {
    return "                <div class=\"col-sm-4 \">\r\n                    <ul class=\"multi-column-dropdown\">\r\n";
},"10":function(depth0,helpers,partials,data) {
    return "                <div class=\"col-sm-2 \">\r\n                    <ul class=\"multi-column-dropdown\">\r\n";
},"12":function(depth0,helpers,partials,data) {
    var helper;

  return "                    <h4>"
    + this.escapeExpression(((helper = (helper = helpers.menuTitle || (depth0 != null ? depth0.menuTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"menuTitle","hash":{},"data":data}) : helper)))
    + "</h4>\r\n";
},"14":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageLinkUrl : depth0),{"name":"if","hash":{},"fn":this.program(15, data, 0),"inverse":this.program(17, data, 0),"data":data})) != null ? stack1 : "");
},"15":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "                            <li>\r\n                                <a href=\""
    + alias2(((helper = (helper = helpers.imageLinkUrl || (depth0 != null ? depth0.imageLinkUrl : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"imageLinkUrl","hash":{},"data":data}) : helper)))
    + "\">\r\n                                    "
    + alias2((helpers.adaptive || (depth0 && depth0.adaptive) || alias1).call(depth0,(depth0 != null ? depth0.imagePath : depth0),"",(depth0 != null ? depth0.imageAltText : depth0),"","",{"name":"adaptive","hash":{},"data":data}))
    + "\r\n                                </a>\r\n                            </li>\r\n";
},"17":function(depth0,helpers,partials,data) {
    return "                            <li>\r\n                                "
    + this.escapeExpression((helpers.adaptive || (depth0 && depth0.adaptive) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.imagePath : depth0),"",(depth0 != null ? depth0.imageAltText : depth0),"","",{"name":"adaptive","hash":{},"data":data}))
    + "\r\n                            </li>\r\n";
},"19":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.menus : depth0),{"name":"each","hash":{},"fn":this.program(20, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"20":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.menuLink : depth0),{"name":"if","hash":{},"fn":this.program(21, data, 0),"inverse":this.program(23, data, 0),"data":data})) != null ? stack1 : "");
},"21":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                                <li><a href=\""
    + alias3(((helper = (helper = helpers.menuLink || (depth0 != null ? depth0.menuLink : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"menuLink","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.menuLabel || (depth0 != null ? depth0.menuLabel : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"menuLabel","hash":{},"data":data}) : helper)))
    + "</a></li>\r\n";
},"23":function(depth0,helpers,partials,data) {
    var helper;

  return "                                <li><span>"
    + this.escapeExpression(((helper = (helper = helpers.menuLabel || (depth0 != null ? depth0.menuLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"menuLabel","hash":{},"data":data}) : helper)))
    + "</span></li>\r\n";
},"25":function(depth0,helpers,partials,data) {
    return "                    </ul>\r\n                </div>\r\n";
},"27":function(depth0,helpers,partials,data) {
    return "        </div>\r\n    </ul>\r\n";
},"29":function(depth0,helpers,partials,data) {
    return "        </ul>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=helpers.helperMissing;

  return "\r\n"
    + ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || alias1).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.flyOutMenu : depth0)) != null ? stack1.flyOutMenuLinks : stack1)) != null ? stack1.length : stack1),"===",1,{"name":"ifCondx","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || alias1).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.flyOutMenu : depth0)) != null ? stack1.flyOutMenuLinks : stack1)) != null ? stack1.length : stack1),">",1,{"name":"ifCondx","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.flyOutMenu : depth0)) != null ? stack1.flyOutMenuLinks : stack1),{"name":"each","hash":{},"fn":this.program(5, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || alias1).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.flyOutMenu : depth0)) != null ? stack1.flyOutMenuLinks : stack1)) != null ? stack1.length : stack1),">",1,{"name":"ifCondx","hash":{},"fn":this.program(27, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || alias1).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.flyOutMenu : depth0)) != null ? stack1.flyOutMenuLinks : stack1)) != null ? stack1.length : stack1),"===",1,{"name":"ifCondx","hash":{},"fn":this.program(29, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});

this["lib"]["lib/js/templates/form-element/calendar.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "sr-only";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"form-group\">\r\n    <label class=\"col-sm-2 control-label "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.hideTitle : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\" for=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</label>\r\n    <div class=\"input-group input-small\">\r\n        <input id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" name=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" type=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1), depth0))
    + "\" placeholder=\""
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.dateFormat : stack1), depth0)) != null ? stack1 : "")
    + "\" class=\"form-control input-md input-calendar\" data-format=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.dateFormat : stack1), depth0))
    + "\" title=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.description : stack1), depth0))
    + "\" value=\""
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.defaultValue : stack1), depth0)) != null ? stack1 : "")
    + "\" >\r\n\r\n        <span class=\"input-group-addon calendar-input\">\r\n            <i class=\"icon-calendar\"></i>\r\n        </span>\r\n    </div>\r\n    <span class=\"help-block hidden \">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.description : stack1), depth0))
    + "</span>\r\n\r\n</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/form-element/dropdown.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "sr-only";
},"3":function(depth0,helpers,partials,data) {
    return "multiple";
},"5":function(depth0,helpers,partials,data) {
    return "data-required=\"true\"";
},"7":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression, alias2=helpers.helperMissing;

  return "               <option class = \"selectoption\" value=\""
    + alias1(this.lambda(depth0, depth0))
    + "\" "
    + ((stack1 = (helpers.hasValue || (depth0 && depth0.hasValue) || alias2).call(depth0,((stack1 = (depths[1] != null ? depths[1].formElement : depths[1])) != null ? stack1.defaultValue : stack1),depth0,{"name":"hasValue","hash":{},"fn":this.program(8, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"8":function(depth0,helpers,partials,data) {
    return " selected ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"form-group\">\r\n    <label class=\"col-sm-2 control-label "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.hideTitle : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\" for=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</label>\r\n    <div class=\"col-sm-10 "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1), depth0))
    + "\">\r\n        <select id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" name=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" class=\"form-control input-md input-small\"  "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.multiSelection : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.required : stack1),{"name":"if","hash":{},"fn":this.program(5, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " data-rules=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.rules : stack1), depth0))
    + "\">\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.dropdownOptions : stack1),{"name":"each","hash":{},"fn":this.program(7, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\r\n        <span class=\"help-block hidden \">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.description : stack1), depth0))
    + "</span>\r\n        </div>\r\n</div>\r\n\r\n";
},"useData":true,"useDepths":true});

this["lib"]["lib/js/templates/form-element/radio.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "sr-only";
},"3":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing;

  return "        <div class=\"radio input-small\">\r\n            <label for=\""
    + alias2(alias1(((stack1 = (depths[1] != null ? depths[1].formElement : depths[1])) != null ? stack1.name : stack1), depth0))
    + "-"
    + alias2(alias1(depth0, depth0))
    + "\">\r\n              <input type=\"radio\" name=\""
    + alias2(alias1(((stack1 = (depths[1] != null ? depths[1].formElement : depths[1])) != null ? stack1.name : stack1), depth0))
    + "\" id=\""
    + alias2(alias1(((stack1 = (depths[1] != null ? depths[1].formElement : depths[1])) != null ? stack1.name : stack1), depth0))
    + "-"
    + alias2(alias1(depth0, depth0))
    + "\" value=\""
    + alias2(alias1(depth0, depth0))
    + "\" "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias3).call(depth0,((stack1 = (depths[1] != null ? depths[1].formElement : depths[1])) != null ? stack1.defaultValue : stack1),depth0,{"name":"ifCond","hash":{},"fn":this.program(4, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\r\n            "
    + alias2(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias3),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + "\r\n            </label>\r\n        </div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    return " checked ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<!-- Multiple Radios -->\r\n<div class=\"form-group\">\r\n<label class=\"col-sm-2 control-label "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.hideTitle : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\" for=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</label>\r\n    <div class=\"col-sm-10 "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1), depth0))
    + "\">\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.radioOptions : stack1),{"name":"each","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <span class=\"help-block hidden\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.description : stack1), depth0)) != null ? stack1 : "")
    + "</span>\r\n    </div>\r\n</div>\r\n";
},"useData":true,"useDepths":true});

this["lib"]["lib/js/templates/form-element/text.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "sr-only";
},"3":function(depth0,helpers,partials,data) {
    return "multivalue ";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return "data-input-limit="
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.inputLimit : stack1), depth0))
    + " ";
},"7":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "\r\n               <div class=\"multivalue-field\">\r\n                    <div class=\"input-group input-small\">\r\n                      <input name=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" type=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1), depth0))
    + "\" placeholder=\""
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "\" class=\"form-control input-md\" title=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.description : stack1), depth0))
    + "\" value=\""
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.defaultValue : stack1), depth0)) != null ? stack1 : "")
    + "\" >\r\n                      <input name=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" type=\"hidden\">\r\n                        <span class=\"input-group-addon add-input\">\r\n                          <i class=\"glyphicon glyphicon-plus\"></i>\r\n                        </span>\r\n                    </div>\r\n                    <span class=\"help-block hidden \">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.description : stack1), depth0))
    + "</span>\r\n                </div>\r\n\r\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.dateFormat : stack1),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.program(12, data, 0),"data":data})) != null ? stack1 : "");
},"10":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                    <div class=\"input-group input-small\">\r\n                        <input id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" name=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" type=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1), depth0))
    + "\" placeholder=\""
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.dateFormat : stack1), depth0)) != null ? stack1 : "")
    + "\" class=\"form-control input-md input-calendar\" data-format=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.dateFormat : stack1), depth0))
    + "\" title=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.description : stack1), depth0))
    + "\" value=\""
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.defaultValue : stack1), depth0)) != null ? stack1 : "")
    + "\" >\r\n\r\n                        <span class=\"input-group-addon calendar-input\">\r\n                            <i class=\"icon-calendar-new\"></i>\r\n                        </span>\r\n                    </div>\r\n                    <span class=\"help-block hidden \">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.description : stack1), depth0))
    + "</span>\r\n";
},"12":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                    <input id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" name=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" type=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1), depth0))
    + "\" placeholder=\""
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "\" class=\"form-control input-md input-small\" title=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.description : stack1), depth0))
    + "\" value=\""
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.defaultValue : stack1), depth0)) != null ? stack1 : "")
    + "\" >\r\n                    <span class=\"help-block hidden \">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.description : stack1), depth0))
    + "</span>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<!-- Text input-->\r\n\r\n<div class=\"form-group\">\r\n    <label class=\"col-sm-2 control-label "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.hideTitle : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\" for=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</label>\r\n        <div class=\"col-sm-10 "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1), depth0))
    + " "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.multivalue : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\" "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.multivalue : stack1),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.multivalue : stack1),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "        </div>\r\n</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/form/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "true";
},"3":function(depth0,helpers,partials,data) {
    return "false";
},"5":function(depth0,helpers,partials,data) {
    return " onsubmit=\"return false;\"";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return " data-redirect=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.redirect : stack1), depth0))
    + "\"";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <legend class=\"form-title\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.title : stack1), depth0))
    + "</legend>\r\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1),"text",{"name":"ifCond","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1),"search",{"name":"ifCond","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1),"password",{"name":"ifCond","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1),"email",{"name":"ifCond","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1),"url",{"name":"ifCond","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1),"color",{"name":"ifCond","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1),"select",{"name":"ifCond","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.formElement : depth0)) != null ? stack1.viewType : stack1),"radio",{"name":"ifCond","hash":{},"fn":this.program(16, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n";
},"12":function(depth0,helpers,partials,data) {
    return "        "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,depth0,"form-element/text.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"14":function(depth0,helpers,partials,data) {
    return "        "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,depth0,"form-element/dropdown.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"16":function(depth0,helpers,partials,data) {
    return "        "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,depth0,"form-element/radio.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"18":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "      <!-- Button (Double) -->\r\n      <div class=\"form-group\">\r\n          <div class=\"col-sm-3\">\r\n              <button id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.randomNumber : stack1), depth0))
    + "-submit\" type=\"submit\" name=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.randomNumber : stack1), depth0))
    + "-submit\" class=\"btn btn-primary btn-md col-xs-12 input-submit\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.formEndConfig : stack1)) != null ? stack1.name : stack1), depth0))
    + "</button>\r\n          </div>\r\n          <div class=\"col-sm-3\">\r\n              <button id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.randomNumber : stack1), depth0))
    + "-reset\" type=\"reset\" name=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.randomNumber : stack1), depth0))
    + "-reset\" class=\"btn btn-inverse btn-md col-xs-12 input-reset\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.formEndConfig : stack1)) != null ? stack1.resetName : stack1), depth0))
    + "</button>\r\n          </div>\r\n      </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<form name=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.formid : stack1), depth0))
    + "\"\r\n  id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.formid : stack1), depth0))
    + "\"\r\n  method = \"POST\"\r\n  action=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.action : stack1), depth0))
    + "\"\r\n  data-ajax=\""
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.isAjax : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\r\n  "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.isAjax : stack1),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n  data-fail=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.failureDescription : stack1), depth0))
    + "\"\r\n  "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.redirect : stack1),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n  class=\"form-horizontal form-validate\"\r\n  role=\"form\"\r\n  data-validation=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.validation : stack1), depth0))
    + "\" novalidate>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.title : stack1),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.formElementsConfig : stack1),{"name":"each","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.form : depth0)) != null ? stack1.formEndConfig : stack1),{"name":"if","hash":{},"fn":this.program(18, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n</form>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/hotspot/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"image-title\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.hotspot : depth0)) != null ? stack1.bgTitle : stack1), depth0))
    + "</div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"base-image\">\r\n    "
    + this.escapeExpression((helpers.adaptive || (depth0 && depth0.adaptive) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.hotspot : depth0)) != null ? stack1.background : stack1),((stack1 = (depth0 != null ? depth0.hotspot : depth0)) != null ? stack1.extension : stack1),((stack1 = (depth0 != null ? depth0.hotspot : depth0)) != null ? stack1.bgAltText : stack1),((stack1 = (depth0 != null ? depth0.hotspot : depth0)) != null ? stack1.bgTitle : stack1),"",{"name":"adaptive","hash":{},"data":data}))
    + "\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.hotspot : depth0)) != null ? stack1.hotspots : stack1),{"name":"each","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "        <div class=\"pointer "
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"unless","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n            <div class=\"hotspot-pointer\" data-top=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.position : depth0)) != null ? stack1.top : stack1), depth0))
    + "\" data-left = \""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.position : depth0)) != null ? stack1.left : stack1), depth0))
    + "\"></div>\r\n            <div class=\"hotspot-content\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageSRC : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.program(17, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\r\n        </div>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.description : depth0),{"name":"unless","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.imageSRC : depth0),{"name":"unless","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"7":function(depth0,helpers,partials,data) {
    return "hidden";
},"9":function(depth0,helpers,partials,data) {
    var helper;

  return "                    <div class=\"image hotspot-image\">\r\n                        <img src=\""
    + this.escapeExpression(((helper = (helper = helpers.imageSRC || (depth0 != null ? depth0.imageSRC : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imageSRC","hash":{},"data":data}) : helper)))
    + "\" alt=\"\">\r\n                    </div>\r\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.program(15, data, 0),"data":data})) != null ? stack1 : "");
},"12":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                        <div class=\"content "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageSRC : depth0),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n                            <h3 class = \"title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h3>\r\n                            <p class = \"desc\">"
    + alias3(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper)))
    + "</p>\r\n                        </div>\r\n";
},"13":function(depth0,helpers,partials,data) {
    return " with-image ";
},"15":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "                        <div class=\"content "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageSRC : depth0),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n                            <h3 class = \"title\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h3>\r\n                        </div>\r\n";
},"17":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":this.program(18, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"18":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "                    <div class=\"content "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageSRC : depth0),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n                        <p class = \"desc\">"
    + this.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper)))
    + "</p>\r\n                    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.hotspot : depth0)) != null ? stack1.bgTitle : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.hotspot : depth0)) != null ? stack1.background : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["lib"]["lib/js/templates/instagram-feed/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.instagramFeed : depth0)) != null ? stack1.title : stack1),"!==","",{"name":"ifCondx","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <h2>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.instagramFeed : depth0)) != null ? stack1.title : stack1), depth0))
    + "</h2>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.instagramFeed : depth0)) != null ? stack1.subHeading : stack1),"!==","",{"name":"ifCondx","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <p>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.instagramFeed : depth0)) != null ? stack1.subHeading : stack1), depth0))
    + "</p>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCondx || (depth0 && depth0.ifCondx) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.instagramFeed : depth0)) != null ? stack1.iconImage : stack1),"!==","",{"name":"ifCondx","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"8":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <img src=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.instagramFeed : depth0)) != null ? stack1.iconImage : stack1), depth0))
    + "\" >\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"instagram-feed-header row\">\r\n    <div class=\"instagram-title col-xs-12 no-gutter\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.instagramFeed : depth0)) != null ? stack1.title : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.instagramFeed : depth0)) != null ? stack1.subHeading : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n\r\n    <div class=\"instagram-logo\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.instagramFeed : depth0)) != null ? stack1.iconImage : stack1),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n</div>\r\n\r\n<div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"instagram-feed-wrapper row\">\r\n\r\n        </div>\r\n    </div>\r\n</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/instagram-feed/partial/instagram-feeds.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"feeds col-md-4 col-xs-12 col-lg-3\">\r\n    <div class=\"thumbnail\">\r\n        <a href=\""
    + alias3(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"link","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">\r\n            <img src=\""
    + alias3(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.images : depth0)) != null ? stack1.low_resolution : stack1)) != null ? stack1.url : stack1), depth0))
    + "\" alt=\""
    + alias3(((helper = (helper = helpers.caption || (depth0 != null ? depth0.caption : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"caption","hash":{},"data":data}) : helper)))
    + "\" />\r\n        </a>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depths[1] != null ? depths[1].isCaption : depths[1]),{"name":"if","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        \r\n    </div>\r\n</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.caption : depth0)) != null ? stack1.text : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <p>\r\n            "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.caption : depth0)) != null ? stack1.text : stack1), depth0))
    + "\r\n        </p>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.data : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});

this["lib"]["lib/js/templates/list/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "<h4>"
    + ((stack1 = this.lambda(((stack1 = (depth0 != null ? depth0.list : depth0)) != null ? stack1.heading : stack1), depth0)) != null ? stack1 : "")
    + "</h4>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "<h5>"
    + ((stack1 = this.lambda(((stack1 = (depth0 != null ? depth0.list : depth0)) != null ? stack1.subHeading : stack1), depth0)) != null ? stack1 : "")
    + "</h5>\r\n";
},"5":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=helpers.helperMissing;

  return "        <li>\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depths[1] != null ? depths[1].list : depths[1])) != null ? stack1.isDescImgRequired : stack1),"true",{"name":"ifCond","hash":{},"fn":this.program(6, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.linkName : depth0),{"name":"if","hash":{},"fn":this.program(16, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depths[1] != null ? depths[1].list : depths[1])) != null ? stack1.isDescImgRequired : stack1),"true",{"name":"ifCond","hash":{},"fn":this.program(21, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </div>\r\n        </li>\r\n";
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imagePath : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"7":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <div class=\"thumbnail-image\">\r\n                    <a target= \""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.windowType : depth0),"Yes",{"name":"ifCond","hash":{},"fn":this.program(8, data, 0),"inverse":this.program(10, data, 0),"data":data})) != null ? stack1 : "")
    + "\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.linkUrl : depth0),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.program(14, data, 0),"data":data})) != null ? stack1 : "")
    + "><img src=\""
    + alias3(((helper = (helper = helpers.imagePath || (depth0 != null ? depth0.imagePath : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"imagePath","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + alias3(((helper = (helper = helpers.imageAltText || (depth0 != null ? depth0.imageAltText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"imageAltText","hash":{},"data":data}) : helper)))
    + "\"/></a>\r\n                </div>\r\n";
},"8":function(depth0,helpers,partials,data) {
    return "_blank";
},"10":function(depth0,helpers,partials,data) {
    return "_self";
},"12":function(depth0,helpers,partials,data) {
    var helper;

  return "href=\""
    + this.escapeExpression(((helper = (helper = helpers.linkUrl || (depth0 != null ? depth0.linkUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"linkUrl","hash":{},"data":data}) : helper)))
    + "\"";
},"14":function(depth0,helpers,partials,data) {
    return "disabled";
},"16":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <div class=\"list-content\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.linkUrl : depth0),{"name":"if","hash":{},"fn":this.program(17, data, 0),"inverse":this.program(19, data, 0),"data":data})) != null ? stack1 : "");
},"17":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "                    <a target= \""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.windowType : depth0),"Yes",{"name":"ifCond","hash":{},"fn":this.program(8, data, 0),"inverse":this.program(10, data, 0),"data":data})) != null ? stack1 : "")
    + "\" href=\""
    + this.escapeExpression(((helper = (helper = helpers.linkUrl || (depth0 != null ? depth0.linkUrl : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"linkUrl","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.linkName || (depth0 != null ? depth0.linkName : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"linkName","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\r\n";
},"19":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "                    <span>"
    + ((stack1 = ((helper = (helper = helpers.linkName || (depth0 != null ? depth0.linkName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"linkName","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span>\r\n";
},"21":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.linkDesc : depth0),{"name":"if","hash":{},"fn":this.program(22, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"22":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "                        <p>"
    + ((stack1 = ((helper = (helper = helpers.linkDesc || (depth0 != null ? depth0.linkDesc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"linkDesc","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</p>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.list : depth0)) != null ? stack1.heading : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.list : depth0)) != null ? stack1.subHeading : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "<ul>\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.list : depth0)) != null ? stack1.linkList : stack1),{"name":"each","hash":{},"fn":this.program(5, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"useData":true,"useDepths":true});

this["lib"]["lib/js/templates/media-gallery/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <h1 class=\"media-gallery-heading\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.mediaGallery : depth0)) != null ? stack1.heading : stack1), depth0))
    + "</h1>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <p class=\"media-gallery-subheading\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.mediaGallery : depth0)) != null ? stack1.subHeading : stack1), depth0))
    + "</p>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "            <div class=\"col-lf-3 col-md-3 col-sm-3 col-xs-12 media-slide\">\r\n                <div class=\"thumbnail\">\r\n                    <a class=\"media-link\" href=\"#overlay-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" type=\"inline\">\r\n                      <img class=\"hidden-xs hidden-sm\" src=\""
    + alias2(this.lambda((depth0 != null ? depth0.thumbnailURL : depth0), depth0))
    + "\" alt=\"\">\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.mediaType : depth0),"image",{"name":"ifCond","hash":{},"fn":this.program(6, data, 0),"inverse":this.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "                      <span class=\"icon-Enlarge\"></span>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n";
},"6":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "                          <div id=\"overlay-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"overlay visible-xs visible-sm hidden-md hidden-lg\">\r\n                            "
    + alias2((helpers.adaptive || (depth0 && depth0.adaptive) || alias1).call(depth0,(depth0 != null ? depth0.fileReference : depth0),(depth0 != null ? depth0.extension : depth0),(depth0 != null ? depth0.alt : depth0),(depth0 != null ? depth0.imageTitle : depth0),(depth0 != null ? depth0.fileName : depth0),{"name":"adaptive","hash":{},"data":data}))
    + "\r\n                          </div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageTitle : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"7":function(depth0,helpers,partials,data) {
    return "                          <div class=\"caption\">\r\n                            <h4>"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.imageTitle : depth0), depth0))
    + "</h4>\r\n                          </div>\r\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing;

  return "                          <div id=\"overlay-"
    + this.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"overlay visible-xs visible-sm hidden-md hidden-lg\">\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.viewType : depth0),"html5",{"name":"ifCond","hash":{},"fn":this.program(10, data, 0),"inverse":this.program(12, data, 0),"data":data})) != null ? stack1 : "")
    + "                          </div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.videoTitle : depth0),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"10":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                              <div class=\"video\" data-mp4=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.videoFormats : depth0)) != null ? stack1.mp4Video : stack1), depth0))
    + "\" data-ogg=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.videoFormats : depth0)) != null ? stack1.oggVideo : stack1), depth0))
    + "\" data-flv=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.videoFormats : depth0)) != null ? stack1.flvVideo : stack1), depth0))
    + "\" data-type=\""
    + alias2(alias1((depth0 != null ? depth0.viewType : depth0), depth0))
    + "\"></div>\r\n";
},"12":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "                              <div class=\"video\" data-url=\""
    + alias2(alias1((depth0 != null ? depth0.videoId : depth0), depth0))
    + "\" data-type=\""
    + alias2(alias1((depth0 != null ? depth0.viewType : depth0), depth0))
    + "\"></div>\r\n";
},"14":function(depth0,helpers,partials,data) {
    return "                          <div class=\"caption\">\r\n                            <h4>"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.videoTitle : depth0), depth0))
    + "</h4>\r\n                          </div>\r\n";
},"16":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing;

  return "          <li class=\"media-thumbnail slide-index-"
    + this.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"><a href=\"#\">\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.mediaType : depth0),"image",{"name":"ifCond","hash":{},"fn":this.program(17, data, 0),"inverse":this.program(19, data, 0),"data":data})) != null ? stack1 : "")
    + "          </a>\r\n          </li>\r\n";
},"17":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "              <img src=\""
    + alias2(alias1((depth0 != null ? depth0.thumbnailURL : depth0), depth0))
    + "\" alt=\""
    + alias2(alias1((depth0 != null ? depth0.imageTitle : depth0), depth0))
    + "\">\r\n";
},"19":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "              <img src=\""
    + alias2(alias1((depth0 != null ? depth0.thumbnailURL : depth0), depth0))
    + "\" alt=\""
    + alias2(alias1((depth0 != null ? depth0.videoTitle : depth0), depth0))
    + "\">\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"media-gallery-container row clearfix\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.mediaGallery : depth0)) != null ? stack1.heading : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.mediaGallery : depth0)) != null ? stack1.subHeading : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n    <div class=\"media-slides\">\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.mediaGallery : depth0)) != null ? stack1.media : stack1),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n    <div class=\"media-thumbnail-container visible-xs visible-sm hidden-md hidden-lg\">\r\n      <ul class=\"media-thumbnails\">\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.mediaGallery : depth0)) != null ? stack1.media : stack1),{"name":"each","hash":{},"fn":this.program(16, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "      </ul>\r\n    </div>\r\n</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/navigation/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.flyOutMenu : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "                        <li class=\"dropdown\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.navigationURL : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "                            "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,depth0,"flyOutMenu/defaultView.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n                        </li>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                            <a href=\""
    + alias3(((helper = (helper = helpers.navigationURL || (depth0 != null ? depth0.navigationURL : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"navigationURL","hash":{},"data":data}) : helper)))
    + "\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\r\n                                "
    + alias3(((helper = (helper = helpers.navigationLabel || (depth0 != null ? depth0.navigationLabel : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"navigationLabel","hash":{},"data":data}) : helper)))
    + "\r\n                                <span class=\"glyphicon glyphicon-chevron-down\"></span>\r\n                            </a>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "                            <a class=\"dropdown-toggle\" data-toggle=\"dropdown\">\r\n                                "
    + this.escapeExpression(((helper = (helper = helpers.navigationLabel || (depth0 != null ? depth0.navigationLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"navigationLabel","hash":{},"data":data}) : helper)))
    + "\r\n                                <span class=\"glyphicon glyphicon-chevron-down\"></span>\r\n                            </a>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.navigationLabel : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"8":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.navigationURL : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.program(11, data, 0),"data":data})) != null ? stack1 : "");
},"9":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                                <li>\r\n                                    <a href=\""
    + alias3(((helper = (helper = helpers.navigationURL || (depth0 != null ? depth0.navigationURL : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"navigationURL","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.navigationLabel || (depth0 != null ? depth0.navigationLabel : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"navigationLabel","hash":{},"data":data}) : helper)))
    + "</a>\r\n                                </li>\r\n";
},"11":function(depth0,helpers,partials,data) {
    var helper;

  return "                                <li>\r\n                                    <a href=\"javascript:void(0)\">"
    + this.escapeExpression(((helper = (helper = helpers.navigationLabel || (depth0 != null ? depth0.navigationLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"navigationLabel","hash":{},"data":data}) : helper)))
    + "</a>\r\n                                </li>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<nav class=\"navbar navbar-default\" role=\"navigation\">\r\n        <div class=\"navbar-header\">\r\n            <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar-collapse-"
    + alias3(((helper = (helper = helpers.randomNumber || (depth0 != null ? depth0.randomNumber : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"randomNumber","hash":{},"data":data}) : helper)))
    + "\">\r\n                <span class=\"sr-only\">Toggle navigation</span>\r\n                <span class=\"icon-bar\"></span>\r\n                <span class=\"icon-bar\"></span>\r\n                <span class=\"icon-bar\"></span>\r\n            </button>\r\n        </div>\r\n        <div class=\"collapse navbar-collapse\" id=\"navbar-collapse-"
    + alias3(((helper = (helper = helpers.randomNumber || (depth0 != null ? depth0.randomNumber : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"randomNumber","hash":{},"data":data}) : helper)))
    + "\">\r\n            <ul class=\"nav navbar-nav\">\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.navigation : depth0)) != null ? stack1.navigationLabel : stack1),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n            </ul>\r\n        </div>\r\n</nav>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/notfound/defaultView.hbss"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"jumbotron\">\r\n  <h1>"
    + alias3(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"status","hash":{},"data":data}) : helper)))
    + "</h1>\r\n  <p>"
    + alias3(((helper = (helper = helpers.details || (depth0 != null ? depth0.details : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"details","hash":{},"data":data}) : helper)))
    + "</p>\r\n</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/panel/imagePanel.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.escapeExpression, alias2=this.lambda;

  return "\r\n    <div class = \"media\">\r\n        "
    + alias1((helpers.adaptive || (depth0 && depth0.adaptive) || helpers.helperMissing).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.image : stack1)) != null ? stack1.fileReference : stack1),((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.image : stack1)) != null ? stack1.extension : stack1),((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.image : stack1)) != null ? stack1.altImage : stack1),((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.image : stack1)) != null ? stack1.title : stack1),((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.image : stack1)) != null ? stack1.fileName : stack1),{"name":"adaptive","hash":{},"data":data}))
    + "\r\n\r\n    </div>\r\n    <div class=\"panel-overlay "
    + alias1(alias2(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.alignmentOfLinks : stack1), depth0))
    + "\">\r\n        <div class=\"text\">\r\n            <h3>"
    + alias1(alias2(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.headline : stack1), depth0))
    + "</h3>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.subHeadLine : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\r\n        <p class=\"animate-header-button\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.displayUrl : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.secondaryDisplayUrl : stack1),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </p>\r\n    </div>\r\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "               <p class=\"text-small\">"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.subHeadLine : stack1), depth0))
    + "</p>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.actionUrl : stack1),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(10, data, 0),"data":data})) != null ? stack1 : "");
},"5":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                    <a target= \""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.primaryBrowserSelection : stack1),"yes",{"name":"ifCond","hash":{},"fn":this.program(6, data, 0),"inverse":this.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + "\" href=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.actionUrl : stack1), depth0))
    + "\" class=\"btn btn-info btn-iea\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.displayUrl : stack1), depth0))
    + "</a>\r\n";
},"6":function(depth0,helpers,partials,data) {
    return "_blank";
},"8":function(depth0,helpers,partials,data) {
    return "_self";
},"10":function(depth0,helpers,partials,data) {
    var stack1;

  return "                    <a disabled>"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.displayUrl : stack1), depth0))
    + "</a>\r\n";
},"12":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.secondaryActionUrl : stack1),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.program(15, data, 0),"data":data})) != null ? stack1 : "");
},"13":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                    <a target= \""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.secondaryBrowserSelection : stack1),"yes",{"name":"ifCond","hash":{},"fn":this.program(6, data, 0),"inverse":this.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + "\" href=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.secondaryActionUrl : stack1), depth0))
    + "\" class=\"link\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.secondaryDisplayUrl : stack1), depth0))
    + "</a>\r\n";
},"15":function(depth0,helpers,partials,data) {
    var stack1;

  return "                    <a disabled>"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.secondaryDisplayUrl : stack1), depth0))
    + "</a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.image : stack1)) != null ? stack1.fileReference : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["lib"]["lib/js/templates/panel/landingView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "    "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,depth0,"panel/imagePanel.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "    "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,depth0,"panel/videoPanel.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.image : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});

this["lib"]["lib/js/templates/panel/videoPanel.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "        "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.panel : depth0),"video/youtube.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.video : stack1)) != null ? stack1.viewType : stack1),"vimeo",{"name":"ifCond","hash":{},"fn":this.program(4, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    return "            "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.panel : depth0),"video/vimeo.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.video : stack1)) != null ? stack1.viewType : stack1),"html5",{"name":"ifCond","hash":{},"fn":this.program(7, data, 0),"inverse":this.program(9, data, 0),"data":data})) != null ? stack1 : "");
},"7":function(depth0,helpers,partials,data) {
    return "                "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.panel : depth0),"video/dam.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"9":function(depth0,helpers,partials,data) {
    return "                "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.panel : depth0),"video/brightcove.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1;

  return "            <p class=\"text-small\">"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.subHeadLine : stack1), depth0))
    + "</p>\r\n";
},"13":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.actionUrl : stack1),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.program(19, data, 0),"data":data})) != null ? stack1 : "");
},"14":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                <a target= \""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.primaryBrowserSelection : stack1),"yes",{"name":"ifCond","hash":{},"fn":this.program(15, data, 0),"inverse":this.program(17, data, 0),"data":data})) != null ? stack1 : "")
    + "\" href=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.actionUrl : stack1), depth0))
    + "\" class=\"btn btn-info btn-iea\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.displayUrl : stack1), depth0))
    + "</a>\r\n";
},"15":function(depth0,helpers,partials,data) {
    return "_blank";
},"17":function(depth0,helpers,partials,data) {
    return "_self";
},"19":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <a disabled>"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.displayUrl : stack1), depth0))
    + "</a>\r\n";
},"21":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.secondaryActionUrl : stack1),{"name":"if","hash":{},"fn":this.program(22, data, 0),"inverse":this.program(24, data, 0),"data":data})) != null ? stack1 : "");
},"22":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                <a target= \""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.secondaryBrowserSelection : stack1),"yes",{"name":"ifCond","hash":{},"fn":this.program(15, data, 0),"inverse":this.program(17, data, 0),"data":data})) != null ? stack1 : "")
    + "\" href=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.secondaryActionUrl : stack1), depth0))
    + "\" class=\"link\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.secondaryDisplayUrl : stack1), depth0))
    + "</a>\r\n";
},"24":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <a disabled>"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.secondaryDisplayUrl : stack1), depth0))
    + "</a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class = \"media carousel-video video\">\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.video : stack1)) != null ? stack1.viewType : stack1),"youtube",{"name":"ifCond","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>\r\n<div class=\"panel-overlay\">\r\n    <div class=\"text "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.alignmentOfLinks : stack1), depth0))
    + "\">\r\n        <h3>"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.headline : stack1), depth0))
    + "</h3>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.subHeadLine : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n    <p class=\"animate-header-button\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.displayUrl : stack1),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.panel : depth0)) != null ? stack1.properties : stack1)) != null ? stack1.secondaryDisplayUrl : stack1),{"name":"if","hash":{},"fn":this.program(21, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </p>\r\n</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/pinterest/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "            <a class=\"btn\" href=\"http://www.pinterest.com/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pinterest : depth0)) != null ? stack1.pinterestUserName : stack1), depth0))
    + "/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pinterest : depth0)) != null ? stack1.pinterestBoardURL : stack1), depth0))
    + "\" target=\"_blank\">\r\n                 "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pinterest : depth0)) != null ? stack1.followCTAText : stack1), depth0))
    + " <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pinterest : depth0)) != null ? stack1.iconImage : stack1), depth0))
    + "\" />\r\n            </a>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "            <a class=\"btn\" href=\"http://www.pinterest.com/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pinterest : depth0)) != null ? stack1.pinterestUserName : stack1), depth0))
    + "/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pinterest : depth0)) != null ? stack1.pinterestBoardURL : stack1), depth0))
    + "\" target=\"_blank\">\r\n                "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pinterest : depth0)) != null ? stack1.followCTAText : stack1), depth0))
    + "\r\n            </a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"pinterest-wrapper\">\r\n    <div class=\"pinterest-header\">\r\n        <div class=\"title-wrapper\">\r\n            <h1>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pinterest : depth0)) != null ? stack1.header : stack1), depth0))
    + "</h1>\r\n            <p>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pinterest : depth0)) != null ? stack1.subTitle : stack1), depth0))
    + "</p>\r\n        </div>\r\n\r\n        <div class=\"icon-wrapper\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.pinterest : depth0)) != null ? stack1.iconImage : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "        </div>\r\n    </div>\r\n\r\n    <div class=\"pinitfeeds\">\r\n\r\n    </div>\r\n</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/plain-text-image/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "            "
    + this.escapeExpression((helpers.adaptive || (depth0 && depth0.adaptive) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.fileReference : stack1),((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.extension : stack1),((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.imageAlt : stack1),((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.imageTitle : stack1),((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.fileName : stack1),{"name":"adaptive","hash":{},"data":data}))
    + "\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.ctaurl : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.program(9, data, 0),"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                <a target= \""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.windowType : stack1),"Yes",{"name":"ifCond","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "\" class=\"btn btn-primary\" href =\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.ctaurl : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.ctacopy : stack1), depth0))
    + "</a>\r\n";
},"5":function(depth0,helpers,partials,data) {
    return "_blank";
},"7":function(depth0,helpers,partials,data) {
    return "_self";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <a disabled>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.ctacopy : stack1), depth0))
    + "</a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"thumbnail\">\r\n    <div class = \"plain-image\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.fileReference : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n    <div class=\"caption\">\r\n        <h3>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.heading : stack1), depth0))
    + "</h3>\r\n        <h4>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.subheading : stack1), depth0))
    + "</h4>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.plainTextImage : depth0)) != null ? stack1.ctacopy : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/related-content-list/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "            <h3>"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.relatedContentList : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.noResultCopy : stack1), depth0))
    + "</h3>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.eachUpTo || (depth0 && depth0.eachUpTo) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.relatedContentList : depth0)) != null ? stack1.contentResults : stack1),((stack1 = (depth0 != null ? depth0.relatedContentList : depth0)) != null ? stack1.resultCount : stack1),{"name":"eachUpTo","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <div class=\"content-list-wrapper row\">\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageDetail : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n                    <div class=\"col-md-9 col-sm-12\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.titleDetail : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.shortDescription : depth0),{"name":"if","hash":{},"fn":this.program(15, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.ctaUrl : depth0),{"name":"if","hash":{},"fn":this.program(17, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                    </div>\r\n                </div>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return "                    <figure class=\"col-md-3 col-sm-12\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.ctaUrl : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + "                    </figure>\r\n";
},"6":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "                        <a href=\""
    + alias2(((helper = (helper = helpers.ctaUrl || (depth0 != null ? depth0.ctaUrl : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"ctaUrl","hash":{},"data":data}) : helper)))
    + "\">\r\n                        "
    + alias2((helpers.adaptive || (depth0 && depth0.adaptive) || alias1).call(depth0,(depth0 != null ? depth0.imageDetail : depth0),(depth0 != null ? depth0.extension : depth0),(depth0 != null ? depth0.titleDetail : depth0),(depth0 != null ? depth0.titleDetail : depth0),"",{"name":"adaptive","hash":{},"data":data}))
    + "\r\n                        </a>\r\n";
},"8":function(depth0,helpers,partials,data) {
    return "                        "
    + this.escapeExpression((helpers.adaptive || (depth0 && depth0.adaptive) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.imageDetail : depth0),(depth0 != null ? depth0.extension : depth0),(depth0 != null ? depth0.titleDetail : depth0),(depth0 != null ? depth0.titleDetail : depth0),"",{"name":"adaptive","hash":{},"data":data}))
    + "\r\n";
},"10":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.ctaUrl : depth0),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.program(13, data, 0),"data":data})) != null ? stack1 : "");
},"11":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                        <h2><a href=\""
    + alias3(((helper = (helper = helpers.ctaUrl || (depth0 != null ? depth0.ctaUrl : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ctaUrl","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.titleDetail || (depth0 != null ? depth0.titleDetail : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"titleDetail","hash":{},"data":data}) : helper)))
    + "</a></h2>\r\n";
},"13":function(depth0,helpers,partials,data) {
    var helper;

  return "                        <h2>"
    + this.escapeExpression(((helper = (helper = helpers.titleDetail || (depth0 != null ? depth0.titleDetail : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"titleDetail","hash":{},"data":data}) : helper)))
    + "</h2>\r\n";
},"15":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "                        <p>"
    + ((stack1 = ((helper = (helper = helpers.shortDescription || (depth0 != null ? depth0.shortDescription : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"shortDescription","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</p>\r\n";
},"17":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                        <a class=\"cta\" href=\""
    + alias3(((helper = (helper = helpers.ctaUrl || (depth0 != null ? depth0.ctaUrl : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ctaUrl","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.ctaText || (depth0 != null ? depth0.ctaText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ctaText","hash":{},"data":data}) : helper)))
    + "</a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"row\">\r\n    <div class=\"col-xs-12 related-content-header\">\r\n    <h1>"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.relatedContentList : depth0)) != null ? stack1.configurations : stack1)) != null ? stack1.resultContentLabel : stack1), depth0))
    + "</h1>\r\n    </div>\r\n    <div class=\"col-xs-12\">\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.relatedContentList : depth0)) != null ? stack1.resultCount : stack1),"0",{"name":"ifCond","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "    </div>\r\n</div>";
},"useData":true});

this["lib"]["lib/js/templates/rich-text-image/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.escapeExpression, alias2=helpers.helperMissing;

  return "        <a class= \"image-link\" href=\""
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.linkURL : stack1), depth0))
    + "\" target= \""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(depth0,((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.windowType : stack1),"Yes",{"name":"ifCond","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\r\n            "
    + alias1((helpers.adaptive || (depth0 && depth0.adaptive) || alias2).call(depth0,((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.fileReference : stack1),((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.extension : stack1),((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.imageAlt : stack1),((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.imageTitle : stack1),((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.fileName : stack1),{"name":"adaptive","hash":{},"data":data}))
    + "\r\n        </a>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return "_blank";
},"4":function(depth0,helpers,partials,data) {
    return "_self";
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.ctaurl : stack1),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.program(9, data, 0),"data":data})) != null ? stack1 : "");
},"7":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                <a class=\"btn btn-primary\"  target= \""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.ctaWindow : stack1),"Yes",{"name":"ifCond","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.ctaurl : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.ctacopy : stack1), depth0))
    + "</a>\r\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <a disabled>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.ctacopy : stack1), depth0))
    + "</a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"thumbnail\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.fileReference : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    <div class=\"caption\">\r\n        "
    + ((stack1 = this.lambda(((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.text : stack1), depth0)) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.richTextImage : depth0)) != null ? stack1.ctacopy : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n</div>";
},"useData":true});

this["lib"]["lib/js/templates/search-input/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <label>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.searchInput : depth0)) != null ? stack1.searchLabel : stack1), depth0))
    + "</label>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <button class=\"btn btn-default btn-iea\" type=\"button\">\r\n            "
    + ((stack1 = this.lambda(((stack1 = (depth0 != null ? depth0.searchInput : depth0)) != null ? stack1.searchButtonText : stack1), depth0)) != null ? stack1 : "")
    + "\r\n        </button>\r\n";
},"5":function(depth0,helpers,partials,data) {
    return "        <button class=\"btn btn-default search-submit-btn\" type=\"button\">\r\n            <span class=\"glyphicon glyphicon-search\"></span>\r\n        </button>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"search-icon-wrapper\">\r\n    <a class=\"search-icon btn\" href=\"#\"><span class=\"glyphicon glyphicon-search\"></span></a>\r\n</div>\r\n<div class=\"input-group\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.searchInput : depth0)) != null ? stack1.searchLabel : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    <input type=\"text\" class=\"form-control search-textbox\" placeholder=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.searchInput : depth0)) != null ? stack1.defaultText : stack1), depth0))
    + "\">\r\n    <span class=\"input-group-btn\">\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.searchInput : depth0)) != null ? stack1.searchButtonText : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "\r\n    </span>\r\n</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/search-result/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"search-result-container\">\r\n    </div>\r\n    <button type=\"button\" class=\"load-more btn btn-lg btn-primary btn-block\">"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.searchResult : depth0)) != null ? stack1.staticConfigurations : stack1)) != null ? stack1.showMoreResultsCopy : stack1), depth0))
    + "</button>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <p class=\"no-result\">"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.searchResult : depth0)) != null ? stack1.staticConfigurations : stack1)) != null ? stack1.noResultsText : stack1), depth0))
    + "</p>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<h1>"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.searchResult : depth0)) != null ? stack1.staticConfigurations : stack1)) != null ? stack1.searchResultsHeading : stack1), depth0))
    + "</h1>\r\n<div class=\"result-count row\">\r\n    <p class=\"col-md-12 col-sm-12\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.searchResult : depth0)) != null ? stack1.staticConfigurations : stack1)) != null ? stack1.showingLabelCopy : stack1), depth0))
    + " <span class=\"start\"></span> "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.searchResult : depth0)) != null ? stack1.staticConfigurations : stack1)) != null ? stack1.paginatingOfCopy : stack1), depth0))
    + " <span class=\"total\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.searchResult : depth0)) != null ? stack1.totalResults : stack1), depth0))
    + "</span> "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.searchResult : depth0)) != null ? stack1.staticConfigurations : stack1)) != null ? stack1.resultsForCopy : stack1), depth0))
    + " \""
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.searchResult : depth0)) != null ? stack1.searchText : stack1), depth0)) != null ? stack1 : "")
    + "\"</p>\r\n</div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.searchResult : depth0)) != null ? stack1.results : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});

this["lib"]["lib/js/templates/search-result/partial/search-result-article.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageDetail : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression, alias3="function";

  return "        <article class=\"row\">\r\n            <figure class=\"col-md-3 col-sm-3\">\r\n              "
    + alias2((helpers.adaptive || (depth0 && depth0.adaptive) || alias1).call(depth0,(depth0 != null ? depth0.imageDetail : depth0),(depth0 != null ? depth0.extension : depth0),"Alt",{"name":"adaptive","hash":{},"data":data}))
    + "\r\n            </figure>\r\n            <div class=\"col-md-9 col-sm-9\">\r\n                <h2><a href=\""
    + alias2(((helper = (helper = helpers.linkUrl || (depth0 != null ? depth0.linkUrl : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"linkUrl","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.linkTitle || (depth0 != null ? depth0.linkTitle : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"linkTitle","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a></h2>\r\n                <p>"
    + ((stack1 = ((helper = (helper = helpers.linkSummary || (depth0 != null ? depth0.linkSummary : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"linkSummary","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</p>\r\n            </div>\r\n        </article>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "        <article class=\"row\">\r\n            <div class=\"col-md-12 col-sm-12\">\r\n                <h2><a href=\""
    + this.escapeExpression(((helper = (helper = helpers.linkUrl || (depth0 != null ? depth0.linkUrl : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"linkUrl","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.linkTitle || (depth0 != null ? depth0.linkTitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"linkTitle","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a></h2>\r\n                <p>"
    + ((stack1 = ((helper = (helper = helpers.linkSummary || (depth0 != null ? depth0.linkSummary : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"linkSummary","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</p>\r\n            </div>\r\n        </article>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n";
},"useData":true});

this["lib"]["lib/js/templates/section-navigation/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.items : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(16, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "					<li class=\"sub-menu\">\r\n						<a href=\"javascript:void(0)\">"
    + ((stack1 = ((helper = (helper = helpers.linklabel || (depth0 != null ? depth0.linklabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"linklabel","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\r\n						<ul class=\"expandable\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "						</ul>\r\n					</li>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.items : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.program(13, data, 0),"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "								<li class=\"sub-menu "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n									<a href=\"javascript:void(0)\">"
    + ((stack1 = ((helper = (helper = helpers.linklabel || (depth0 != null ? depth0.linklabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"linklabel","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\r\n									<ul class=\"expandable\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "									</ul>\r\n								</li>\r\n";
},"5":function(depth0,helpers,partials,data) {
    return "active";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.linklabel : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"8":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "												<li class=\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n													<a "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.linkURL : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.program(11, data, 0),"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.linklabel || (depth0 != null ? depth0.linklabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"linklabel","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\r\n												</li>	\r\n";
},"9":function(depth0,helpers,partials,data) {
    var helper;

  return "href=\""
    + this.escapeExpression(((helper = (helper = helpers.linkURL || (depth0 != null ? depth0.linkURL : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"linkURL","hash":{},"data":data}) : helper)))
    + "\" ";
},"11":function(depth0,helpers,partials,data) {
    return " href=\"javascript:void(0)\" ";
},"13":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.linklabel : depth0),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"14":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "										<li class=\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n											<a "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.linkURL : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.program(11, data, 0),"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.linklabel || (depth0 != null ? depth0.linklabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"linklabel","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\r\n										</li>\r\n";
},"16":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.linklabel : depth0),{"name":"if","hash":{},"fn":this.program(17, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"17":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "						<li class=\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n							<a "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.linkURL : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.program(11, data, 0),"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.linklabel || (depth0 != null ? depth0.linklabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"linklabel","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\r\n						</li>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.lambda, alias2=helpers.helperMissing, alias3="function", alias4=this.escapeExpression;

  return "<nav role=\"navigation\" class=\"navbar navbar-default\">\r\n    <!-- Brand and toggle get grouped for better mobile display -->\r\n    <div class=\"navbar-header\">\r\n    	<span>"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.sectionNavigation : depth0)) != null ? stack1.title : stack1), depth0)) != null ? stack1 : "")
    + "</span>\r\n        <button type=\"button\" data-target=\"#navbarCollapse-"
    + alias4(((helper = (helper = helpers.randomNumber || (depth0 != null ? depth0.randomNumber : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(depth0,{"name":"randomNumber","hash":{},"data":data}) : helper)))
    + "\" data-toggle=\"collapse\" class=\"navbar-toggle\">\r\n    		<span class=\"sr-only\">Toggle navigation</span>\r\n            <span class=\"icon-bar\"></span>\r\n            <span class=\"icon-bar\"></span>\r\n            <span class=\"icon-bar\"></span>\r\n        </button>\r\n    </div>\r\n    <!-- Collection of nav links and other content for toggling -->\r\n    <div id=\"navbarCollapse-"
    + alias4(((helper = (helper = helpers.randomNumber || (depth0 != null ? depth0.randomNumber : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(depth0,{"name":"randomNumber","hash":{},"data":data}) : helper)))
    + "\" class=\"collapse navbar-collapse\">\r\n    	<div class=\"parent-label\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.sectionNavigation : depth0)) != null ? stack1.title : stack1), depth0)) != null ? stack1 : "")
    + "</div>\r\n        <ul class=\"nav nav-stacked\">\r\n        	<li><a href='javascript:void(0)'>"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.sectionNavigation : depth0)) != null ? stack1.parentlabel : stack1), depth0)) != null ? stack1 : "")
    + "</a></li>\r\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.sectionNavigation : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\r\n    </div>\r\n</nav>";
},"useData":true});

this["lib"]["lib/js/templates/social-share-print/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.shareTitle : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "        <div class=\"addthis_toolbox addthis_32x32_style\" addthis:url=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.shareUrl : stack1), depth0))
    + "\" addthis:title=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.shareTitle : stack1), depth0))
    + "\">\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <div class=\"addthis_toolbox addthis_32x32_style\" addthis:url=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.shareUrl : stack1), depth0))
    + "\">\r\n";
},"6":function(depth0,helpers,partials,data) {
    return "    <div class=\"addthis_toolbox addthis_32x32_style\">\r\n";
},"8":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <a class=\"addthis_button_compact\">\r\n        <img src=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.sharectaicon : stack1), depth0))
    + "\" alt=\"Share\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.shareTitle : stack1),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </a>\r\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return "            <span class=\"share-title\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.shareTitle : stack1), depth0))
    + "</span>\r\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <a class=\"addthis_button_compact\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.shareTitle : stack1),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </a>\r\n";
},"13":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <a class=\"addthis_button_print\">\r\n        <img src=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.printctaicon : stack1), depth0))
    + "\" alt=\"Print\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.printTitle : stack1),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </a>\r\n";
},"14":function(depth0,helpers,partials,data) {
    var stack1;

  return "            <span class=\"share-title\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.printTitle : stack1), depth0))
    + "</span>\r\n";
},"16":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <a class=\"addthis_button_print\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.printTitle : stack1),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.shareUrl : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.sharectaicon : stack1),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.program(11, data, 0),"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.socialSharePrint : depth0)) != null ? stack1.printctaicon : stack1),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.program(16, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/tabbed-content/defaultView.hbss"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"row\">\r\n  <div class=\"col-md-12 col-sm-12 col-xs-12\">\r\n      <ul class=\"nav nav-tabs\" role = \"tablist\" id = \"myTab\">\r\n        <li class=\"active\"><a href=\"#home\" role=\"tab\" data-toggle=\"tab\">Tab 1</a></li>\r\n        <li><a href=\"#profile\" role=\"tab\" data-toggle=\"tab\">Tab 2</a></li>\r\n        <li><a href=\"#messages\" role=\"tab\" data-toggle=\"tab\">Tab 3</a></li>\r\n        <li><a href=\"#settings\" role=\"tab\" data-toggle=\"tab\">Tab 4</a></li>\r\n      </ul>\r\n\r\n      <div class=\"tab-content\" id = \"myTabContent\">\r\n        <div class=\"tab-pane fade in active\" id=\"home\">\r\n          <h3>Lorem ipsum dolor sit amet, consectetur adipisicing  elit.</h3>\r\n          <h4>Lorem ipsum dolor sit amet.</h4>\r\n          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p><p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n        </div>\r\n        <div class=\"tab-pane fade\" id=\"profile\">\r\n          <h3>Lorem ipsum dolor sit amet, consectetur adipisicing  elit.</h3>\r\n          <h4>Lorem ipsum dolor sit amet.</h4>\r\n          <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.</p><p> And a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\r\n        </div>\r\n        <div class=\"tab-pane fade\" id=\"messages\">\r\n          <h3>Lorem ipsum dolor sit amet, consectetur adipisicing  elit.</h3>\r\n          <h4>Lorem ipsum dolor sit amet.</h4>\r\n          <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words.</p><p> Consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.</p>\r\n        </div>\r\n        <div class=\"tab-pane fade\" id=\"settings\">\r\n          <h3>Lorem ipsum dolor sit amet, consectetur adipisicing  elit.</h3>\r\n          <h4>Lorem ipsum dolor sit amet.</h4>\r\n          <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p><p> All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  <div class=\"col-md-4 col-sm-0 col-xs-0\">\r\n  </div>\r\n</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/twitter-feed/defaultView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.followCTAText : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.iconImage : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(5, data, 0),"data":data})) != null ? stack1 : "");
},"3":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                        <div class=\"button-wrapper\">\r\n                            <a class=\"btn\" href=\"https://twitter.com/intent/follow?screen_name="
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.includedAccountName : stack1), depth0))
    + "\">\r\n                            <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.iconImage : stack1), depth0))
    + "\"> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.followCTAText : stack1), depth0))
    + "</a>\r\n                        </div>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                        <div class=\"button-wrapper\">\r\n                            <a class=\"btn\" href=\"https://twitter.com/intent/follow?screen_name="
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.includedAccountName : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.followCTAText : stack1), depth0))
    + "</a>\r\n                        </div>\r\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.iconImage : stack1),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"8":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                        <div class=\"button-wrapper\">\r\n                            <a class=\"btn\" href=\"https://twitter.com/intent/follow?screen_name="
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.includedAccountName : stack1), depth0))
    + "\">\r\n                            <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.iconImage : stack1), depth0))
    + "\"></a>\r\n                        </div>\r\n";
},"10":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "            <div class=\"row\">\r\n                <div class=\"col-xs-12\">\r\n                    <a class=\"twitter-timeline\"\r\n                        data-widget-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.tenant : depth0)) != null ? stack1.twitterWidgetId : stack1), depth0))
    + "\"\r\n                        data-chrome=\"noheader nofooter noborders transparent\"\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.maxTweets : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + "                        lang=\"EN\"\r\n                        data-theme=\"light\"\r\n                        data-screen-name=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.includedAccountName : stack1), depth0))
    + "\"\r\n                        href=\"https://twitter.com/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.includedAccountName : stack1), depth0))
    + "\"\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.displayTweetReply : stack1),{"name":"if","hash":{},"fn":this.program(15, data, 0),"inverse":this.program(17, data, 0),"data":data})) != null ? stack1 : "")
    + "                        data-aria-polite=\"assertive\" >\r\n                        "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.followCTAText : stack1), depth0))
    + "\r\n                    </a>\r\n                </div>\r\n            </div>\r\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1;

  return "                        data-tweet-limit=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.maxTweets : stack1), depth0))
    + "\"\r\n";
},"13":function(depth0,helpers,partials,data) {
    return "                        data-tweet-limit=\"20\"\r\n";
},"15":function(depth0,helpers,partials,data) {
    return "                            data-show-replies=\"true\"\r\n";
},"17":function(depth0,helpers,partials,data) {
    return "                            data-show-replies=\"false\"\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "\r\n    <div class=\"col-xs-12 twitter-feed-wrapper no-gutter\">\r\n        <div class=\"twitter-header row\">\r\n            <div class=\"col-xs-12\">\r\n                <h1>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.header : stack1), depth0))
    + "</h1>\r\n                <p>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.subTitle : stack1), depth0))
    + "</p>\r\n            </div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.includedAccountName : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n        </div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.twitterFeed : depth0)) != null ? stack1.includedAccountName : stack1),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n\r\n";
},"useData":true});

this["lib"]["lib/js/templates/video/brightcove.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "<legend class=\"video-title\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoTitle : stack1), depth0))
    + "</legend>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.thumbnailUrl : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.escapeExpression;

  return "        <a class = \"brightcove-overlay video-overlay\" href =\"javascript:void(0)\">\r\n            "
    + alias1((helpers.adaptive || (depth0 && depth0.adaptive) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.thumbnailUrl : stack1),"",((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.alt : stack1),"","",{"name":"adaptive","hash":{},"data":data}))
    + "\r\n        </a>\r\n\r\n        <div class = \"video-content mfp-hide brightcove-content\" id = \"brightcove-"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.randomNumber : stack1), depth0))
    + "\">\r\n            <div class = \"popup-content\">\r\n                <div class = \"video-frame\"></div>\r\n            </div>\r\n        </div>\r\n";
},"6":function(depth0,helpers,partials,data) {
    return "    <div class = \"video-frame\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoTitle : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.displayOption : stack1),"Overlay",{"name":"ifCond","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "<div class=\"video-details\">\r\n    <h5 class=\"video-subheading\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoSubHeadline : stack1), depth0)) != null ? stack1 : "")
    + "</h5>\r\n    <p class=\"video-desc\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoDescription : stack1), depth0)) != null ? stack1 : "")
    + "</p>\r\n</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/video/dam.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "<legend class=\"video-title\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoTitle : stack1), depth0))
    + "</legend>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.thumbnailUrl : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.escapeExpression;

  return "        <a class = \"html5-overlay video-overlay\" href = \"javascript:void(0)\">\r\n            "
    + alias1((helpers.adaptive || (depth0 && depth0.adaptive) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.thumbnailUrl : stack1),"",((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.alt : stack1),"","",{"name":"adaptive","hash":{},"data":data}))
    + "\r\n        </a>\r\n\r\n        <div class = \"video-content mfp-hide html5-content\" id = \"html5-"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.randomNumber : stack1), depth0))
    + "\">\r\n            <div class = \"popup-content\">\r\n                <div class = \"video-frame\"></div>\r\n            </div>\r\n        </div>\r\n";
},"6":function(depth0,helpers,partials,data) {
    return "    <div class = \"video-frame\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoTitle : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.displayOption : stack1),"Overlay",{"name":"ifCond","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "<div class=\"video-details\">\r\n    <h5 class=\"video-subheading\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoSubHeadline : stack1), depth0)) != null ? stack1 : "")
    + "</h5>\r\n    <p class=\"video-desc\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoDescription : stack1), depth0)) != null ? stack1 : "")
    + "</p>\r\n</div>";
},"useData":true});

this["lib"]["lib/js/templates/video/landingView.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "<legend class=\"video-title\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoTitle : stack1), depth0))
    + "</legend>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.video : stack1)) != null ? stack1.viewType : stack1),"youtube",{"name":"ifCond","hash":{},"fn":this.program(4, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    return "        "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.data : depth0),"video/youtube.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.video : stack1)) != null ? stack1.viewType : stack1),"vimeo",{"name":"ifCond","hash":{},"fn":this.program(7, data, 0),"inverse":this.program(9, data, 0),"data":data})) != null ? stack1 : "");
},"7":function(depth0,helpers,partials,data) {
    return "            "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.data : depth0),"video/vimeo.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.video : stack1)) != null ? stack1.viewType : stack1),"html5",{"name":"ifCond","hash":{},"fn":this.program(10, data, 0),"inverse":this.program(12, data, 0),"data":data})) != null ? stack1 : "");
},"10":function(depth0,helpers,partials,data) {
    return "                "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.data : depth0),"video/dam.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"12":function(depth0,helpers,partials,data) {
    return "                "
    + this.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.data : depth0),"video/brightcove.hbss",{"name":"include","hash":{},"data":data}))
    + "\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoTitle : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.video : stack1)) != null ? stack1.viewType : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["lib"]["lib/js/templates/video/vimeo.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "<legend class=\"video-title\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoTitle : stack1), depth0))
    + "</legend>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.thumbnailUrl : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.escapeExpression;

  return "        <a class = \"vimeo-overlay video-overlay\" href=\"javascript:void(0)\">\r\n            "
    + alias1((helpers.adaptive || (depth0 && depth0.adaptive) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.thumbnailUrl : stack1),"",((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.alt : stack1),"","",{"name":"adaptive","hash":{},"data":data}))
    + "\r\n        </a>\r\n\r\n        <div class = \"video-content mfp-hide\" id = \"vimeo-"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.randomNumber : stack1), depth0))
    + "\">\r\n            <div class = \"popup-content\">\r\n                <div class = \"video-frame\"></div>\r\n            </div>\r\n        </div>\r\n";
},"6":function(depth0,helpers,partials,data) {
    return "    <div class = \"video-frame\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoTitle : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.displayOption : stack1),"Overlay",{"name":"ifCond","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "<div class=\"video-details\">\r\n    <h5 class=\"video-subheading\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoSubHeadline : stack1), depth0)) != null ? stack1 : "")
    + "</h5>\r\n    <p class=\"video-desc\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoDescription : stack1), depth0)) != null ? stack1 : "")
    + "</p>\r\n</div>\r\n";
},"useData":true});

this["lib"]["lib/js/templates/video/youtube.hbss"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "<legend class=\"video-title\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoTitle : stack1), depth0))
    + "</legend>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.thumbnailUrl : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.escapeExpression;

  return "        <a class = \"youtube-overlay video-overlay\" href = \"javascript:void(0)\">\r\n            "
    + alias1((helpers.adaptive || (depth0 && depth0.adaptive) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.thumbnailUrl : stack1),"",((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.alt : stack1),"","",{"name":"adaptive","hash":{},"data":data}))
    + "\r\n        </a>\r\n\r\n        <div class = \"video-content mfp-hide\" id = \"youtube-"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.randomNumber : stack1), depth0))
    + "\">\r\n            <div class = \"popup-content\">\r\n                <div class = \"video-frame\"></div>\r\n            </div>\r\n        </div>\r\n";
},"6":function(depth0,helpers,partials,data) {
    return "    <div class = \"video-frame\"></div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoTitle : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0,((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.displayOption : stack1),"Overlay",{"name":"ifCond","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "<div class=\"video-details\">\r\n    <h5 class=\"video-subheading\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoSubHeadline : stack1), depth0)) != null ? stack1 : "")
    + "</h5>\r\n    <p class=\"video-desc\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.video : depth0)) != null ? stack1.videoDescription : stack1), depth0)) != null ? stack1 : "")
    + "</p>\r\n</div>\r\n";
},"useData":true});

return this["lib"];

});
define('iea.components',["views/accordion/_accordion","views/adaptive-image/_adaptive-image","views/breadcrumb/_breadcrumb","views/carousel/_carousel","views/content-results-grid/_content-results-grid","views/country-language-selector/_country-language-selector","views/expand-collapse/_expand-collapse","views/form/_form","views/hotspot/_hotspot","views/instagram-feed/_instagram-feed","views/link-list/_link-list","views/list/_list","views/media-gallery/_media-gallery","views/navigation/_navigation","views/panel/_panel","views/pinterest/_pinterest","views/plain-text-image/_plain-text-image","views/related-content-list/_related-content-list","views/rich-text-image/_rich-text-image","views/search-input/_search-input","views/search-result/_search-result","views/section-navigation/_section-navigation","views/social-share-print/_social-share-print","views/tabbed-content/_tabbed-content","views/twitter-feed/_twitter-feed","views/video/_video","iea.templates"],function(){return Array.prototype.slice.call(arguments);});
