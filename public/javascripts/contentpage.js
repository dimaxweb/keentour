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
        storage:'/javascripts/storage',
        geonames:'/javascripts/geonames',
        search:'/javascripts/search',
        flickrWidget  :'/javascripts/flickrWidget',
        youtubeWidget : '/javascripts/youtubeWidget',
        wikiPediaWidget : '/javascripts/wikiPediaWidget',
        flickrLib : '/javascripts/flickrLib',
        youTubeLib : '/javascripts//youTubeLib',
        contentWidget : '/javascripts/contentWidget',
        tooltip  : '/javascripts/lib/bootstrap/bootstrap-tooltip',
        popover  : '/javascripts/lib/bootstrap/bootstrap-popover',
        carousel  : '/javascripts/lib/bootstrap/bootstrap-carousel',
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

        "flickrLib":{
            deps:["jquery"]
        },

        "wikiPediaWidget" :{
            deps:["jquery"]
        },

        "youtubeWidget" :{
            deps:["jquery"]
        },

       "flickrWidget" :{
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


require(["storage", "search", "geonames", "contentWidget"], function (storage, search, geonames, contentWidget) {


    if (typeof (KEENTOUR) == 'undefined') {
        KEENTOUR = {};
    }


    KEENTOUR.storage = storage;
    KEENTOUR.search = search;
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
        KEENTOUR.search.bindAutoComplete($('#searchtext'), $('#searchbtn'));
        KEENTOUR.addAddThisWidget();
    });

    KEENTOUR.geonames = geonames;



    function createContentContext(item) {
        window.contentData = {};
        //default context
        var arrUrlSegments = window.location.pathname.substr(1).split('/');
        var strDefault = arrUrlSegments[arrUrlSegments.length - 1];
        window.contentData.flickrTags = window.contentData.youTubeQuery = window.contentData.wikiPage = strDefault;
//        window.contentData.flickrTags+=',travel';
        if (item) {
            window.contentData.wikiPage = item.name;
            ///add travel keyword only if geo item is found
            window.contentData.flickrTags =  item.name + ',travel';
            window.contentData.youTubeQuery = item.name;
            window.contentData.currentItem = item;
        }

    }

    function displayItemChildren(parentItem) {
        if (parentItem) {
            //get children of the item
            geonames.getItemChildren(parentItem, function (data) {
                var entries = data.geonames || [];
                if (entries.length == 0) {
                    $('.popular_places').hide();
                }
                else {
                    $('.popular_places').show();
                }
                var ulChildren = $('#children');
                $.each(entries, function (i, item) {
                    var url = geonames.getItemUrl(item, parentItem);
                    var name = item.name;

                    var liChild = $('<li><a href="' + url + '">' + name + '</a></li>').appendTo(ulChildren);
                    $(liChild).bind('click', function (e) {
                        e.preventDefault();
                        item.KeenTourUrl = url;
                        KEENTOUR.storage.setObject('lastItem', item);
                        window.location = url;
                    });
                });
            });
        }
    }

    function displayContentPage(parentItem) {
        //createContentContext(parentItem);
        createContentContext();
        try {
            //TODO  : implement proxy in request
            //displayItemChildren(parentItem);
        }
        catch (e) {
            //TODO: log here
        }


    }


    $(document).ready(function (e) {
      $('#attractionMenu li').bind('click', function (e) {
                $('#attractionMenu').find('.selectedLi').removeClass('selectedLi');
                $(this).addClass('selectedLi');
                var txt = $(this).text().replace(/•/g, '').trim();
                var currentWidget = contentWidget.getCurrentWidget().instance;
                if (txt === 'Everything') {
                    currentWidget.backToInitialState();
                }
                else {
                    currentWidget.addKeyWord(txt);
                }

            });

           ///display current widget
           $(contentWidget).bind('widgetChanged', function (e, data) {
               $('#attractionMenu').find('.selectedLi').removeClass('selectedLi');
               $('#attractionMenu li').first().addClass('selectedLi');
               if (data && data.widgetName === 'article') {
                   $('#attractionMenu').css({opacity:0.5});

               }
               else {
                   $('#attractionMenu').css({opacity:1});
               }
           });

            createContentContext();
            contentWidget.displayCurrentWidget();


           //display item
           var url = window.location.pathname.substring(1);
           var lastItem = KEENTOUR.storage.getObject('lastItem');
           if (lastItem && lastItem.KeenTourUrl == url) {
               displayContentPage(lastItem);
           }
           else {
               //TODO : get item some how fromn url
//               geonames.getItemFromUrl(url, function (item) {
//                   displayContentPage(item);
//               });
               displayContentPage(null);
           }
       });




});











