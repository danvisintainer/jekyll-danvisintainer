$(document).ready(calculatePhotoWidths);

$(window).resize(calculatePhotoWidths);

function calculatePhotoWidths() {
    var photosetWidth = $('.photoset').first().width();
    var margin = 10;
    console.log(photosetWidth);

    $('.photoset .row.flexible').each(function() {
        var ratios = [],
            $images = $(this).find('img'),
            effectiveWidth = photosetWidth - (margin * ($images.length - 1));

        $images.each(function() {ratios.push(parseFloat($(this).attr('ratio')));});

        var sum = ratios.reduce(function(a, b) {return a + b;}),
            max = Math.max(...ratios);
        
        $images.each(function(i) {
            $(this).width((ratios[i] / sum) * effectiveWidth);
        });
    });
}