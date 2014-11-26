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

			this.options = $.extend(true, {}, $.Galleryna.defaults, options);
			
			this._wrapItems();

			this.$wrapper = this.$el.find('.wrapper');
			this.$items = this.$wrapper.children('div');
			this.itemsTotal = this.$items.length;

			this._setWidth();

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