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
        'ajax-scroll' : '/javascripts/lib/jquery-paged-scroll.min',
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

        "ajax-scroll":{
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


define(["storage", "search", "geonames","twitter_grid","ajax-scroll"], function (storage, search, geonames,twitter_grid) {

    if (typeof (KEENTOUR) == 'undefined') {
        KEENTOUR = {};
    }
    KEENTOUR.storage = storage;
    KEENTOUR.search = search;
    KEENTOUR.twitter_grid = twitter_grid;
    $(document).ready(function (e) {
        KEENTOUR.search.bindAutoComplete($('#searchtext'), $('#searchbtn'));
    });

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

    ///////////////////////////////////////require page dependencies and run the page
    require(["jQueryUI","youTubeLib", "jquery.colorbox-min", "swfObject",'popover'], function () {

        var homePageEntities = {};
        homePageEntities['london'] = { name:'Budapest', path:'content/Europe/Hungary/Budapest', countryName:'Budapest', countryPath:'content/Europe/Hungary' };
        homePageEntities['berlin'] = { name:'Berlin', path:'content/Europe/Germany/Berlin', countryName:'Germany', countryPath:'content/Europe/Germany' };
        homePageEntities['paris'] = { name:'Paris', path:'content/Europe/France/Paris', countryName:'France', countryPath:'content/Europe/France'};
        homePageEntities['vienna'] = { name:'Vienna', path:'content/Europe/Austria/Vienna', countryName:'Austria', countryPath:'content/Europe/Austria' };
//      homePageEntities['new-york'] = { name:'New-York', path:'content/North-America/United-States/New-York', countryName:'United-States', countryPath:'content/North-America/United-States' };
        function searchYoutube(query, names,pageNumber,callback) {

            $('.homeVideos').fadeIn('slow');
//            $('<img class="videoLoading" src="/images/ajax-loader-big.gif" />').appendTo('.homeVideos');
            var startIndex = (pageNumber == 1 ) ? 1 :  40 * (pageNumber - 1);
                //search the youtube
                var lib = new YouTubeLib({ query:query, 'max-results':40,'start-index' :startIndex });
                //search for videos and update UI when done
                lib.searchVideos(function (data) {
                    if(data && data.videoResult && data.videoResult.feed && data.videoResult.feed.entry){
                        var entries = data.videoResult.feed.entry;
                        var filteredEntries = getValidEntries(entries, names);
                        displayNewVideos(filteredEntries);
                        if(callback){
                            callback();
                        }


                    }
                    $('.videoLoading').hide();


                });



        };


        function showVideo(videoID) {
            swfobject.switchOffAutoHideShow();
            $('#playerFrame').empty();
            $('#playerFrame').append('<div id="playerArea"></div>');
            emmbedPlayer((videoID));

        }

        function emmbedPlayer(videoID) {
            var params = { allowScriptAccess:"always" };
            // The element id of the Flash embed
            var atts = { id:"myPlayer" };
            var swfUrl = "http://www.youtube.com/v/" + videoID;
            // All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
            swfobject.embedSWF(swfUrl + "?version=3&enablejsapi=1&playerapiid=player1&autoplay=1&color=#96B512", "playerArea", "840", "500", "8", null, null, params, atts);
        }

        function displayNewVideos(validItems) {

            if(!validItems)
            {
               return;
            }
            findCreatePlayerFrame();
            var itemsToShow = validItems.length < 6 ? validItems.length  : 6;
            var itemsToShow = validItems.slice(0,itemsToShow);
            KEENTOUR.twitter_grid.gridify({
               element: $('.homeVideos'),
               data:itemsToShow,
               itemsPerRow: 3,
               getItemContent:function(dataItem,gridCell,grid){
                   var item = dataItem.videoEntry;
                   var currentGeoItem = dataItem.geoItem;
                   console.log(item.media$group.media$keywords);
                   var url = item.media$group.media$thumbnail[0].url;
                   var title = item.title.$t.toLowerCase();
//                   title = title.length > 30 ? title.substr(0,27) + '...' : title;
                   var videoTime = YouTubeLib.getVideoTime(dataItem.videoEntry);
                   var itemBox = $('<div class="video-block"><a class="video-link"><img  src="' + url + '" class="thumbnail video-thumb" /><span class="video-time">'
                                                                       +  videoTime
                                                                       +  '</span></a>'
                                                                       +  '<div class="widgetItemName"><a>' + title + '</a></div>'
                                                                       +  '<a href="' + currentGeoItem.path + '">' + currentGeoItem.name + '</a> | <a href="'
                                                                       +   currentGeoItem.countryPath + '">' + currentGeoItem.countryName
                                                                       +   '</a></div>');
                   $(gridCell).append(itemBox);
                   var divPlay = $(gridCell).find('a').first();
                   $(divPlay).colorbox({inline:true, width:"885px", height:"600px", href:'#playerFrame', title:item.title.$t, onClosed:function () {

                       $('#playerFrame').empty();

                   }});

                   $(divPlay).bind('click',
                       function (e) {
                           var video = $(this).data('video');
                           showVideo(video.media$group.yt$videoid.$t);
                       })
                       .data('video', item);


                   var description  =  (dataItem.media$group && dataItem.media$group.media$description && dataItem.media$group.media$description.$t) ? '<h6>About:</h6><p>'  + dataItem.media$group.media$description.$t + '</p>' : '';
                   if(description.length > 1000){
                       description = description.substring(0,500) +'...';
                   }
                   var author  = ( item.author &&  item.author.length  >0 && item.author[0].name && item.author[0].name.$t) ? '<p><span>Published by :<span>'  + item.author[0].name.$t + '</p>': '';
                   var publishedAt  = (item.published &&  item.published.$tt) ? '<p><span>Taken on:<span>'  +item.published.$t + '</p>': '';
                   var viewsCount  = (item.yt$statistics && item.yt$statistics.viewCount) ? '<p>views count :'  + item.yt$statistics.viewCount + '</p>'  : '';

                   $(divPlay).popover({
                       title:title,
                       placement:'top',
                       content: '<div>' +  author  + viewsCount +  '</div>'

                   });

               }


            });



        }

        function getValidEntries(entries, names) {
            var filteredEntries = [];
            $.each(entries, function (i, item) {
                try {
                    var url = item.media$group.media$thumbnail[0].url;
                    var title = item.title.$t.toLowerCase();
                    var keywords = (item.media$group.media$keywords && item.media$group.media$keywords.$t) ? item.media$group.media$keywords.$t : item.title.$t.toLowerCase();
                    var currentGeoItem = null;
                    for (var j = 0; j < names.length; j++) {
                        var itemTitle = names[j].toLowerCase();
                        if (keywords.indexOf(itemTitle) > 0) {
                            currentGeoItem = homePageEntities[itemTitle];
                            break;

                        }
                        if (title.indexOf(itemTitle) > 0) {
                            currentGeoItem = homePageEntities[itemTitle];
                            break;

                        }

                    }

                    if (currentGeoItem) {
                        filteredEntries[filteredEntries.length] = {videoEntry:item, geoItem:currentGeoItem};
                    }
                }
                catch (e) {
                    console.log(e.message);
                }

            });

            return filteredEntries;
        }


        function findCreatePlayerFrame() {
            var playerFrame = $('#playerFrame');
            return (playerFrame.length == 0) ? $('<div id="playerFrame"><div id="playerArea"></div></div>').appendTo('body') : playerFrame;
        }


        $(document).ready(function (e) {
            $('#newVideos').fadeIn('slow');
            $('.homeVideos').hide();
            var names = [];
            $.each(homePageEntities, function (i, item) {
                names[names.length] = item.name;
            });
            var query = names.join('|');
            searchYoutube(query, names,1);


            $(window).paged_scroll({
                handleScroll:function (page,container,doneCallback) {
                    searchYoutube(query, names,page);

                },
                startPage : 1,
                targetElement : $('.homeVideos'),
                step:'20%',
                pagesToScroll : 3

            });

            /*
                Add this widget
            */



            try {
                KEENTOUR.addAddThisWidget();
            }
            catch (e) {
                //TODO : enable console logging
            }
            var addSenceBottom = $('<script type="text/javascript"><!-- google_ad_client = "ca-pub-4780158497290031"; /* BeetwenRowsLinks */ google_ad_slot = "7565752583"; google_ad_width = 728; google_ad_height = 15; //--> </script> <script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"> </script>')
                                .appendTo('.homeVideos');


        });





    });


});



