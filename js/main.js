$(function () {

	console.log('mainjs loaded!');

	$('#myGallery').galleryna({
		onSlideChange: function () {
			console.log('my onSlideChange fn()');
		}
	});

	/*
	$('.temp-helper-listener').on('click', function(){

		var navigation = $(this).data('navigation');

		$(window).trigger( navigation + '.galleryna');

	});
	*/

});