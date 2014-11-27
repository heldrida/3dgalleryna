## Galleryna

A 3d gallery or slideshow, targetting mobile primarily.

## How to use

	<!-- start: 3d galleryna -->
	<div id="myGallery" class="galleryna">
		<div data-index="0">
			<img src="http://dummyimage.com/500x300/444/fc0" />
		</div>
		<div data-index="1">
			<img src="http://dummyimage.com/500x300/444/0cf" />
		</div>
		<div data-index="2">
			<img src="http://dummyimage.com/500x300/444/1fb" />
		</div>
		<div data-index="3">
			<img src="http://dummyimage.com/500x300/444/aA9" />
		</div>
		<div data-index="4">
			<img src="http://dummyimage.com/500x300/444/99F" />
		</div>
	</div>
	<!-- end: 3d galleryna -->

	$('.myGalleryna').galleryna({
		onSlideChange: function () {
			// this is triggered when slide change finish
			console.log('my onSlideChange callback!');
		}
	});

## License

Licensed under The MIT License.