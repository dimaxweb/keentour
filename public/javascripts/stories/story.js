require.config({
    baseUrl:'/javascripts/lib',
    paths:{
        jquery:[
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the CDN location fails, load from this location
            'jquery1.7.2.min'
        ],

        jQueryUI:[
            'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min',
            //If the CDN location fails, load from this location
            'jquery-ui.min'
        ],

        swfObject:[
            'https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject',
            //If the CDN location fails, load from this location
            'swfobject'
        ],

        youTubeLib:'/javascripts/youTubeLib',
        'jquery.colorbox-min':'/javascripts/lib/jquery.colorbox-min',
        'ajax-scroll':'/javascripts/lib/jquery-paged-scroll.min',
        storage:'/javascripts/storage',
        geonames:'/javascripts/geonames',
        search:'/javascripts/search',
        flickrWidget:'/javascripts/flickrWidget',
        youtubeWidget:'/javascripts/youtubeWidget',
        wikiPediaWidget:'/javascripts/wikiPediaWidget',
        flickrLib:'/javascripts/flickrLib',
        youTubeLib:'/javascripts//youTubeLib',
        contentWidget:'/javascripts/contentWidget',
        tooltip:'/javascripts/lib/bootstrap/bootstrap-tooltip',
        popover:'/javascripts/lib/bootstrap/bootstrap-popover',
        carousel:'/javascripts/lib/bootstrap/bootstrap-carousel',
        twitter_grid:'/javascripts/twitter-grid',
        ///css resources
        paginationCSS:'/stylesheets/pagination',
        jQueryUICSS:'/stylesheets/jquery-ui-1.8.20.custom',
        colorBoxCSS:'/stylesheets//colorBox',
        wikiCSS:'/stylesheets/wiki2',
        css:'/javascripts/lib/css'


    },
    //Order of the preferences
    shim:{
        "jQueryUI":{
            deps:["jquery"]
        },
        "youTubeLib":{
            deps:["jquery"]
        },

        "flickrLib":{
            deps:["jquery"]
        },

        "ajax-scroll":{
            deps:["jquery"]
        },

        "wikiPediaWidget":{
            deps:["jquery"]
        },

        "youtubeWidget":{
            deps:["jquery"]
        },

        "flickrWidget":{
            deps:["jquery"]
        },

        "jquery.paginate":{
            deps:["jquery"]
        },

        "jquery.colorbox-min":{
            deps:["jquery"]
        },

        "storage":{
            deps:["jquery"]
        },

        "search":{
            deps:["jquery", "jQueryUI"]
        },
        "geonames":{
            deps:["jquery"]
        },

        ///bootstrap
        "tooltip":{
            deps:["jquery"]
        },

        "popover":{
            deps:["jquery"]
        }

    }

});


function flickrSearch(e) {
    e.preventDefault();
    /*
        instansiate flickr widget
     */
    $('.photos').flickrFy({
        text:$('#searchText').val(),
        perPage:18,
        sort:'relevance',
        defaultImageThumb  :'sq',
        itemsPerRow  : 6
    });
}
require(["storage", "search", "geonames", "flickrWidget"], function (storage, search, geonames, flickrWidget) {
    $(document).ready(function (e) {
        $('#searchText').keypress(function (e) {
            if (e.which == 13) {
                flickrSearch(e);
            }
        });

        $('.storyPhotos').droppable({
            drop:function (event, ui) {
                var elem = ui.draggable;
                var ulPhotos = $(this).find('#ulPhotos');
                if (ulPhotos.length === 0) {
                    ulPhotos = $('<ul class="thumbnails"></ul>').appendTo(this);
                }
                $(ulPhotos).append(elem);
                $(elem).css({position:'static'});
                //$('.photos').remove(elem);

            }
        });


    });
});

