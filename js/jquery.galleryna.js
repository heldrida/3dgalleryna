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
			current: 0
		};
		this._init(options);

	}

	$.Galleryna.prototype = {
		
		_init: function (options) {

			this.$window = $(window);
			this.options = $.extend(true, {}, this.defaults, options);
			
			this._wrapItems();

			this.$wrapper = this.$el.find('.wrapper');
			this.$items = this.$wrapper.children('div');
			this.itemsTotal = this.$items.length;
			this.current = this.options.current;

			this._setWidth();

			this._layout();

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

		_layout: function () {

			// set item positions
			this.$leftItem = this.$items[this._lastPosition.call(this)];
			console.log(this.$leftItem);

			$('.temp-helper-listener').on('click', function(){

				$(window).trigger('next.galleryna');

			}.bind(this));

			this._setListener('next');
			this._setListener('previous');

		},

		_lastPosition: function () {

			if (this.current === this.itemsTotal) {
				this.current = 0;
			}

			return (this.itemsTotal - 1) - this.current;
		},

		_setListener: function (listener) {

			if (listener === "next") {

				this.$window.on('next.galleryna', this._next.bind(this));

			} else if (listener === "previous") {

				this.$window.on('previous.galleryna', this._previous.bind(this));

			}

		},

		_next: function () {

			this.current += 1;

			// set item positions
			this.$leftItem = this.$items[this._lastPosition()];
			console.log(this.$leftItem);

		},

		_previous: function () {

			console.log('previous');
			
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