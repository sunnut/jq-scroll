(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery);
(function($,h,c){var a=$([]),e=$.resize=$.extend($.resize,{}),i,k="setTimeout",j="resize",d=j+"-special-event",b="delay",f="throttleWindow";e[b]=250;e[f]=true;$.event.special[j]={setup:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.add(l);$.data(this,d,{w:l.width(),h:l.height()});if(a.length===1){g()}},teardown:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.not(l);l.removeData(d);if(!a.length){clearTimeout(i)}},add:function(l){if(!e[f]&&this[k]){return false}var n;function m(s,o,p){var q=$(this),r=$.data(this,d);r.w=o!==c?o:q.width();r.h=p!==c?p:q.height();n.apply(this,arguments)}if($.isFunction(l)){n=l;return m}else{n=l.handler;l.handler=m}}};function g(){i=h[k](function(){a.each(function(){var n=$(this),m=n.width(),l=n.height(),o=$.data(this,d);if(m!==o.w||l!==o.h){n.trigger(j,[o.w=m,o.h=l])}});g()},e[b])}})(jQuery,this);
$(function($){
	$.fn.scroll = function(options) {
		var bound = 10;
		var margin = 2;
		var $scrollObj = this;
		
		function addScroll( $target ){
			var $detail = $target.find('.scroll-detail');
			var maxHeight = $target.height();
			var trueHeight = $detail.height();
			var scale = parseInt( ( maxHeight - margin ) * ( maxHeight / trueHeight ) );
			if( trueHeight > maxHeight ){
				if( !$target.children('div').is('.scroll-bar') ){
					$target
						.append('<div class="scroll-bar"><a class="scroll-button" style="height:'+ scale +'px;"></a></div>')
						.mousewheel(function(event,delta){ wheelTo(event,delta); })
						.find('.scroll-base').width( $target.find('.scroll-base').width() - 10 );
				}else{
					var $button = $target.find('.scroll-button').height( scale );
					if( $button.position().top + scale > $target.height() || trueHeight + $detail.position().top < maxHeight ){
						$button.css('top', $target.height() - scale - margin + 'px');
						$detail.animate({ top : - ( $detail.height() - $target.height() ) }, 250);
					}
				}
			}else{
				$target.find('.scroll-detail').animate({ top : 0 }, 250);
				$target.find('.scroll-bar').remove();
				$target.find('.scroll-base').css('width', $target.width() + 'px');
				$target.unbind("mousewheel");
			}
		}
		function wheelTo( event , delta ){
			var $target = $(event.currentTarget) || $(e.activeElement);
			var $button = $target.find('.scroll-button');
			var Y = $button.position().top;
			if( delta > 0 ){
				Y = Y > bound ? Y - bound : 0;
			}else{
				Y = Y < $target.height() - $button.height() - bound - margin ? Y + bound : $target.height() - $button.height() - margin;
			}
			scrollTo( $target , Y );
			try { event.preventDefault(); } catch (error) { event.returnValue = false; }
		}
		function scrollTo( $target , Y ){
			var $detail = $target.find('.scroll-detail');
			var $button = $target.find('.scroll-button');
			$button.css( 'top' , Y + 'px' );
			$detail.css( 'top' , - parseInt( ( $detail.height() - $target.height() ) / ( $target.height() - $button.height() - margin ) * $button.position().top ) + 'px' );
		}
		$('.scroll-button').live('mousedown',function(event) {
			var $button = $(this).addClass('scroll-button-down');
			var $target = $button.parents('[scroll=custom]');
			var parentY = event.clientY - $target.offset().top - $button.position().top;
			$(document).mousemove(function(e) {
				var Y = e.clientY - $target.offset().top - parentY;
				Y = Y > $target.height() - $button.height() - margin ? $target.height() - $button.height() - margin : Y;
				Y = Y < 0 ? 0 : Y;
				scrollTo( $target, Y );
				return false;
			}).mouseup(function(e) {$(document).unbind('mousemove'); $button.removeClass('scroll-button-down'); });
			return false;
		}).live('mouseover',function(e){ $(this).addClass('scroll-button-over'); }).live('mouseout',function(e){ $(this).removeClass('scroll-button-over'); });
		
		return $scrollObj.each(function() {
			$(this).html('<div class="scroll-base"><div class="scroll-detail">' + $(this).html() + '</div></div>')
				.find('.scroll-detail').resize(function(e) { addScroll( $(this) ); });
			addScroll( $(this) );
		});
	}
})(jQuery);