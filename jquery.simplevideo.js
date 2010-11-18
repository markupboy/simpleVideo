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
				$overlay = $(o.overlay),
				$wrapper = $(o.wrapper),
				elements = {
					overlay: $overlay,
					video: $video,
					wrapper: $wrapper
				},
				playing = false,
				playCheck = null;
				
			function init() {
				$video.wrap($wrapper).before($overlay);
				$video.bind({
					click: function() {
						$video.trigger("pause");
					},
					pause: function() {
						pause();
					},
					play: function() {
						play();
					},
					toggle: function() {
						if(isPlaying()) {
							pause();
						} else {
							play();
						}
					}
				});
				$overlay.bind({
					click: function() {
						$video.trigger("play");
					}
				});
			};
			
			function play() {
				video.play();
				playing = true;
				pingVideo();
				o.onPlay(elements);
			};
			
			function pause() {
				video.pause();
				playing = false;
				endPing();
				o.onPause(elements);
			};
			
			function isPlaying() {
				if(video.paused || video.ended) {
					return false;
				}
				return true;
			};
			
			function pingVideo() {
				playCheck = setInterval(function() {
					if(isPlaying()) {
						return;
					}
					playing = false;
					endPing();
				}, 1000);
			};
			
			function endPing() {
				clearInterval(playCheck);
				o.onStop(elements);
			};
			
			init();
		});
	};

	$.fn.simpleVideo.defaults = {
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


