/**
 * jquery.galleryna.js
 *
 * Author: Helder C.
 * Url: www.punkbit.com
 * Free to use under the MIT license
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
			interval: 2, // seconds
			autoplay: true
		};

		this._init(options);

	}

	$.Galleryna.prototype = {
		
		_init: function (options) {

			var _self = this;

			this.$window = $(window);
			this.options = $.extend(true, {}, this.defaults, options);
			
			this._wrapItems();

			this.$wrapper = this.$el.find('.wrapper');
			this.$items = this.$wrapper.children('div');
			this.itemsTotal = this.$items.length;
			this.current = this.options.current;

			// on windows resize, modify the width
			this._windowResizeEventManager.queue.push(function () {
				this._setWidth();
			}.bind(this));

			// start window resize listener
			this._windowResizeEventManager.listen();

			this._setItems();

			// start slideshow
			this._slide();

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
		},

		_setItems: function () {

			// set item positions
			this.$current = this.$items.eq(this.current === this.itemsTotal ? 0 : this.current);
			this.$leftItem = this.$items.eq(this._prevPosition.call(this));
			this.$rightItem = this.$items.eq(this._nextPosition.call(this));
			console.log(this.$rightItem);

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

			this._setListener('next');
			this._setListener('previous');

		},

		_prevPosition: function () {

			if (this.current >= this.itemsTotal) {
				this.current = 0;
			}

			return this.current === 0 ? this.itemsTotal - 1 : this.current - 1;

		},

		_nextPosition: function () {

			if (this.current === this.itemsTotal) {
				this.current = 0;
			}

			console.log('this.current: ' + this.current);
			console.log(this.current === this.itemsTotal - 1 ? 0 : this.current + 1);

			return this.current === this.itemsTotal - 1 ? 0 : this.current + 1;
		},

		_setListener: function (listener) {

			if (listener === "next") {

				this.$window.on('next.galleryna', this._next.bind(this));

			} else if (listener === "previous") {

				this.$window.on('previous.galleryna', this._previous.bind(this));

			}

		},

		_next: function () {

			console.log('_next()');

			this.current += 1;

			// update items
			this._setItems();


		},

		_previous: function () {

			console.log('_previous()');
			
		},

		_slide: function () {

            var _self = this,
            	milliseconds = this.options.interval * 1000;

            this.slideshow = setTimeout(function() {

            	_self._next();

                if (_self.options.autoplay) {

                    _self._slide();

                }

            }, milliseconds);

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