/**
 * jquery.galleryna.js
 *
 * Author: Helder C.
 * Url: http://www.punkbit.com
 * Licensed under The MIT License.
 *
 */
(function ($, undefined) {

	/*
	 * Galleryna object
	 */
	$.Galleryna = function (options, element) {

		this.$el = $(element);

		this.defaults = {
			current: 0,
			interval: 2	, // seconds
			autoplay: true
		};

		this._init(options);

	}

	$.Galleryna.prototype = {
		
		_init: function (options) {

			var _self = this;

			this.$window = $(window);
			this.options = $.extend(true, {}, this.defaults, options);

			this._setCallbacks();
			
			this._wrapItems();

			this.$wrapper = this.$el.find('.wrapper');
			this.$items = this.$wrapper.children('div');
			this.itemsTotal = this.$items.length;
			this.current = this.options.current;
			this.$navigationBtns = this.$el.siblings('.navigation');

			this.transitionDuration = this._setTransitionDuration();

			// on windows resize, modify the width
			this._windowResizeEventManager.queue.push(function () {
				this._setWidth();
			}.bind(this));

			// start window resize listener
			this._windowResizeEventManager.listen();

			this._setListeners();

			// initial positioning
			this._switchItems();

			// start slideshow
			this._slide();

		},

		_setCallbacks: function () {

			this.callbacks = {};

			// set callbacks
			if (typeof this.options.onSlideChange === "function") {
				this.callbacks['onSlideChange'] = this.options.onSlideChange;
			}

		},

		_windowResizeEventManager: {
			queue: [],
			// Queue iterator, executes each fn
			queueCaller: function () {

                var i;

				for(i in this.queue){
					this.queue[i]();
				}

			},
			listen: function(){

				// Call at least once, when init
				this.queueCaller();
				
				// On Window resize listener
				// When triggered though, the fn call is throttled, limiting the nr of calls
				$(window).on('resize.galleryna',  this.queueCaller.bind(this));

			}
		},

		_wrapItems: function () {

			var $items = this.$el.children('div');

			$items.wrapAll('<div class="wrapper" />');

			$items.addClass('item');

		},

		_setWidth: function () {

			var width = parseInt(this.$el.outerWidth()),
				elements = [{
							el: this.$wrapper,
							width: width * this.$items.length
						}, {
							el: this.$items,
							width: width
						}];

				$.each(elements, function (k, v) {
					
					$(v.el).css({
						width: v.width
					});

				});

			// set wrapper height
			setTimeout(function() {
				var h =this.$items.eq(0).outerHeight();
				this.$wrapper.css({ height: h });
			}.bind(this), 400);
		},

		_setItems: function (navigation) {

			// set item positions
			if (navigation === "previous") {

				this.$current = this.$items.eq(this.current === this.itemsTotal ? 0 : this.current);
				this.$leftItem = this.$items.eq(this._prevPosition.apply(this, ['previous']));
				this.$rightItem = this.$items.eq(this._nextPosition.apply(this, ['previous']));

			} else {

				this.$current = this.$items.eq(this.current === this.itemsTotal ? 0 : this.current);
				this.$leftItem = this.$items.eq(this._prevPosition.apply(this, ['next']));
				this.$rightItem = this.$items.eq(this._nextPosition.apply(this, ['next']));

			}

		},

		_switchItems: function (navigation) {

			var _self = this;

			// get positioned items
			this._setItems(navigation);

			// set active
			this.$items.removeClass('active');
			this.$current.addClass('active');

			// set left
			this.$leftItem.addClass('left');

			// set right
			this.$rightItem.addClass('right');

			// remove left & right from inactive
			this.$items.not(this.$leftItem).removeClass('left');
			this.$items.not(this.$rightItem).removeClass('right');

			// set active element
			this._activeDot();

			// when slide finish positioning, execute callback if set
			setTimeout(function () {
				_self.callbacks['onSlideChange']();
			}, _self.transitionDuration);

		},

		_prevPosition: function (navigation) {

			if (this.current < 0) {

				if (Math.abs(this.current) >= this.itemsTotal) {
					this.current = 0;
				}

			} else {

				if (this.current >= this.itemsTotal) {
					this.current = 0;
				}					

			}

			result = this.current === 0 ? this.itemsTotal - 1 : this.current - 1;

			return result;

		},

		_nextPosition: function (navigation) {

			if (this.current === this.itemsTotal) {
				this.current = 0;
			}

			result = this.current === this.itemsTotal - 1 ? 0 : this.current + 1;	

			return result;
		},

		_setTransitionDuration: function () {

			var data = this.$items.eq(0).css('transition-duration').split(','),
				max = 0,
				current = 0;

			$.each(data, function (k, v ) {
				current = parseFloat(v) * 1000;
				max =  max < current ? current : max; 
			});

			return max;
		},

		_setListeners: function (listener) {

			var _self = this;

			// clear autoplay
			this.$window.on('next.galleryna previous.galleryna', function () {
				_self.options.autoplay = false;
				clearTimeout(_self.slideshow);
			});

			this.$window.on('next.galleryna', this._next.bind(this));
			this.$window.on('previous.galleryna', this._previous.bind(this));

			// set navigation listeners to handle next and previous
			var navigationLock = false;

			this.$navigationBtns.on('click', function(){

				if (!navigationLock) {

					navigationLock = true;

					_self.$window.trigger( $(this).data('navigation') + '.galleryna');

					setTimeout(function () {

						navigationLock = false;

					}, _self.transitionDuration);

				}

			});

		},

		_next: function () {

			this.current += 1;

			// update items
			this._switchItems();


		},

		_previous: function () {

			this.current -= 1;

			// update items
			this._switchItems('previous');

		},

		_slide: function () {

            var _self = this,
            	milliseconds = this.options.interval * 1000;

            if (this.options.autoplay) {
            	
	            this.slideshow = setTimeout(function() {

	            	_self._next();

	                if (_self.options.autoplay) {

	                    _self._slide();

	                }

	            }, milliseconds);

            }

		},

		_activeDot: function () {
			// work in progress, the gallery-dots will be generated dynamically
			var index = this.$current.index();

			$('.galleryna-dots li').removeClass('active');
			$('.galleryna-dots li:eq(' + index + ')').addClass('active');
		}

	}

	$.fn.galleryna = function (options) {

		this.each(function () {

			var instance = $.data(this, 'galleryna');

			if (!instance) {
				$.data(this, 'galleryna', new $.Galleryna(options, this));
			}

		});

		return this;

	}

})(jQuery);