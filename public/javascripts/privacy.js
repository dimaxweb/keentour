require.config({
    //baseUrl:'/javascripts/lib',
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
        storage:'/javascripts/storage',
        geonames:'/javascripts/geonames',
        search:'/javascripts/search',
        flickrWidget  :'/javascripts/flickrWidget',
        youtubeWidget : '/javascripts/youtubeWidget',
        wikiPediaWidget : '/javascripts/wikiPediaWidget',
        flickrLib : '/javascripts/flickrLib',
        youTubeLib : '/javascripts/youTubeLib',
        contentWidget : '/javascripts/contentWidget',
        tooltip  : '/javascripts/lib/bootstrap/bootstrap-tooltip',
        carousel  : '/javascripts/lib/bootstrap/bootstrap-carousel',
        scrollspy : '/javascripts/lib/bootstrap/bootstrap-scrollspy',
        twitter_grid  :  '/javascripts/twitter-grid',
        ///css resources
        paginationCSS:'/stylesheets/pagination',
        jQueryUICSS:'/stylesheets/jquery-ui-1.8.20.custom',
        colorBoxCSS :  '/stylesheets//colorBox',
        wikiCSS :  '/stylesheets/wiki2',
        css : '/javascripts/lib/css'


    },
    //Order of the preferences
    shim:{
        "jQueryUI":{
            deps:["jquery"]
        },
        "youTubeLib":{
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

        "tooltip":{
            deps:["jquery"]
        },

        "scrollspy":{
            deps:["jquery"]
        },

        "twitter_grid" : {
            deps:["jquery"]
        }




    }

});


define(['jquery','search','geonames'],function($,search,geonames){
    if (typeof (KEENTOUR) == 'undefined') {
        KEENTOUR = {};
    }

    KEENTOUR.search = search;
    KEENTOUR.geonames = geonames;

    KEENTOUR.addAddThisWidget = function () {
        try {
            window.addthis_config = {};
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = 'http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4fe311c477d4f11b';
            var x = document.getElementsByTagName('head')[0];
            x.appendChild(s);
        }
        catch (e) {
            //TODO : log here
        }

    }

    $(document).ready(function (e) {
        KEENTOUR.search.bindAutoComplete({
            container:$('#searchtext'),
            submitControl:$('#searchbtn'),
            onItemSelected:function (options) {
                if(options.geoItem){
                    var path = KEENTOUR.geonames.getItemUrl(options.geoItem);
                    window.location = path;
                }
                else{
                    window.location  = "/content/"  + options.searchText;
                }

            }});
        KEENTOUR.addAddThisWidget();

    });
});



