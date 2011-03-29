/* 
 simpleVideo jQuery plugin
 http://www.viget.com/inspire

 Copyright 2010, Viget Labs
 Licensed under GPL

 This program is free software; you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation; version 2 of the License.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
*/

(function() {

	$.fn.simpleVideo = function(options) {
		var opts = $.extend({}, $.fn.simpleVideo.defaults, options);

		return this.each(function() {
			var video = this,
				o = $.meta ? $.extend({}, opts, $video.data()) : opts,
				$video = $(this),

				elements = {
					overlay: $(o.overlay),
					video: $video,
					wrapper: $(o.wrapper)
				},
				playing = false,
				playCheck = null;
				
			function init() {
				var agent = navigator.userAgent.toLowerCase(), 
					is_ios = agent.indexOf('iphone') !== -1 || agent.indexOf('ipad') !== -1;
				if(is_ios) {
					video.controls = true;
				}	
				
				if(video.play && typeof(video.play) === "function" && !is_ios) {
					$video.wrap(elements.wrapper).before(elements.overlay);
					$video.bind({
						click: function() {
							$video.trigger("toggle");
						},
						pause: function() {
							pause();
						},
						play: function() {
							play();
						},
						stop: function() {
							stop();
						},
						toggle: function() {
							if(isPlaying()) {
								pause();
							} else {
								play();
							}
						}
					});
					elements.overlay.bind({
						click: function() {
							$video.trigger("toggle");
						}
					});
				} else {
					if(o.isNotSupported && typeof(o.isNotSupported) === "function")
						o.isNotSupported();
				}
			};
			
			function play() {
				video.play();
				pingVideo();
				if(o.onPlay && typeof(o.onPlay) === "function")
					o.onPlay(elements);
			};
			
			function pause() {
				video.pause();
				endPing();
				if(o.onPause && typeof(o.onPause) === "function")
					o.onPause(elements);
			};
			
			function stop() {
				video.pause();
				video.currentTime = 0;
				if(o.onStop && typeof(o.onStop) === "function")
					o.onStop(elements);
			}
			
			function isPlaying() {
				if(video.paused || video.ended) {
					return false;
				}
				return true;
			};
			
			function pingVideo() {
				playing = true;
				playCheck = setInterval(function() {
					if(isPlaying()) {
						return;
					}
					endPing();
				}, 1000);
			};
			
			function endPing() {
				playing = false;
				clearInterval(playCheck);
				o.onStop(elements);
			};
			
			init();
		});
	};

	$.fn.simpleVideo.defaults = {
		isNotSupported: function() {},
		onPause: function(elements) {
			elements.overlay.fadeIn();
		},
		onPlay: function(elements) {
			elements.overlay.fadeOut();
		},
		onStop: function(elements) {
			elements.overlay.fadeIn();
		},
		overlay: '<span class="simple-video-overlay"></span>',
		wrapper: '<div class="simple-video-wrapper"></div>'
	};
	
})(jQuery);


