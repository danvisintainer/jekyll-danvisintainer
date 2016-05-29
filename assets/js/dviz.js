;(function($) {

    var allImages = [];
    var lightboxIndex = 0;

    $(window).resize(calculatePhotoWidths);

    $(document).ready(function() {
        var pswpElement = document.querySelectorAll('.pswp')[0];
        allImages = buildPswpArray('.photoset img');
        calculatePhotoWidths();

        // Initializes and opens PhotoSwipe
        
        $("img").unveil();

        // $('.photoset img').click(function(){
        //     console.log($(this).attr('data-index'));
        //     openPhotoSwipe($(this).attr('data-index'));
        // });

        $('.photoset img').click(onThumbnailsClick);

        // $(".page-content img").click(showLightbox);
        // $('#lightbox .close-button').click(hideLightbox);
        // $('#lightbox-back-button').click(previousPhoto);
        // $('#lightbox-next-button').click(nextPhoto);
        // $('body').keydown(keyHandler);

        // allImages = $('.page-content img');
    });

    function calculatePhotoWidths() {
        var photosetWidth = $('.photoset').first().width();
        var margin = getPhotoMargin();

        $('.photoset .row-flexible').each(function() {
            var ratios = [],
                $images = $(this).find('img'),
                effectiveWidth = photosetWidth - (margin * ($images.length - 1));

            $images.each(function() {ratios.push(parseFloat($(this).attr('data-ratio')));});

            var sum = ratios.reduce(function(a, b) {return a + b;}),
                max = Math.max(...ratios);
            
            $images.each(function(i) {
                var width = (ratios[i] / sum) * effectiveWidth;
                $(this).width(width);
                $(this).height(width / ratios[i]);
            });
        });
    }


    // function showLightbox() {
    //     lightboxIndex = allImages.index(this);
    //     setLightboxImage();
    //     $('#lightbox').addClass("visible");
    // }

    // function hideLightbox() {
    //     $('#lightbox').removeClass("visible");
    // }

    // function previousPhoto() {
    //     lightboxIndex = lightboxIndex == 0 ? allImages.length - 1 : lightboxIndex - 1;
    //     setLightboxImage();
    // }

    // function nextPhoto() {
    //     lightboxIndex = lightboxIndex == (allImages.length - 1) ? 0 : lightboxIndex + 1;
    //     setLightboxImage();
    // }

    // function setLightboxImage() {
    //     if (!$('#lightbox').hasClass('hidden')) {
    //         var src = $(allImages[lightboxIndex]).attr('src');
    //         $('#lightbox-image-holder').css('background-image', 'url(' + src + ')');
    //         console.log(lightboxIndex);
    //     }
    // }

    function getPhotoMargin() {
        var screenWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        if (screenWidth < 600) {
            return 2;
        } else {
            return 10;
        }
    }

    // function keyHandler(e) {
    //     if (!$('#lightbox').hasClass('hidden')) {
    //         if (e.keyCode == 37) {
    //             previousPhoto();
    //         } else if (e.keyCode == 39) {
    //             nextPhoto();
    //         } else if (e.keyCode == 27) {
    //             hideLightbox();
    //         }
    //     }
    // }

    function buildPswpArray(selector) {
        var values = [];
        $(selector).each(function(i){
            values.push({
                src: $(this).attr('data-src') || $(this).attr('src'),
                msrc: $(this).attr('data-src') || $(this).attr('src'),
                w: $(this).attr('data-width'),
                h: $(this).attr('data-height'),
                jq: $(this)
            })
        });

        return values;
    }

    var onThumbnailsClick = function(e) {
        // e = e || window.event;
        // e.preventDefault ? e.preventDefault() : e.returnValue = false;

        // var eTarget = e.target || e.srcElement;

        // var clickedListItem = closest(eTarget, function(el) {
        //     return el.tagName === 'A';
        // });

        // if(!clickedListItem) {
        //     return;
        // }

        // var clickedGallery = clickedListItem.parentNode;

        // var childNodes = clickedListItem.parentNode.childNodes,
        //     numChildNodes = childNodes.length,
        //     nodeIndex = 0,
        //     index;

        // for (var i = 0; i < numChildNodes; i++) {
        //     if(childNodes[i].nodeType !== 1) { 
        //         continue; 
        //     }

        //     if(childNodes[i] === clickedListItem) {
        //         index = nodeIndex;
        //         break;
        //     }
        //     nodeIndex++;
        // }

        // if(index >= 0) {
        //     openPhotoSwipe( index, clickedGallery );
        // }

        var index = $(this).attr('data-index');

        if(index && index >= 0) {
            openPhotoSwipe(index);
        }

        return false;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        console.log(index);
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        // items = parseThumbnailElements(galleryElement);
        items = buildPswpArray('.photoset img');

        // define options (if needed)
        options = {
            // define gallery index (for URL)
            // galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].jq[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

})(window.jQuery);