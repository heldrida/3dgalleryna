$(function () {

	console.log('mainjs loaded!');

	$('#myGallery').galleryna();

	$('.temp-helper-listener').on('click', function(){

		var navigation = $(this).data('navigation');

		$(window).trigger( navigation + '.galleryna');

	});

});