$(function () {

	console.log('mainjs loaded!');

	$('#myGallery').galleryna();

	$('.temp-helper-listener').on('click', function(){

		$(window).trigger('next.galleryna');

	}.bind(this));

});