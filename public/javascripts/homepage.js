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
        }




    }

});


define(["storage", "search", "geonames"], function (storage, search, geonames) {

    if (typeof (KEENTOUR) == 'undefined') {
        KEENTOUR = {};
    }
    KEENTOUR.storage = storage;
    KEENTOUR.search = search;
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
    require(["youTubeLib", "jquery.colorbox-min", "swfObject"], function () {

        var homePageEntities = {};
        homePageEntities['london'] = { name:'Budapest', path:'Europe/Hungary/Budapest', countryName:'Budapest', countryPath:'Europe/Hungary' };
        homePageEntities['berlin'] = { name:'Berlin', path:'Europe/Germany/Berlin', countryName:'Germany', countryPath:'Europe/Germany' };
        homePageEntities['paris'] = { name:'Paris', path:'Europe/France/Paris', countryName:'France', countryPath:'Europe/France' };
        homePageEntities['vienna'] = { name:'Vienna', path:'Europe/Austria/Vienna', countryName:'Austria', countryPath:'Europe/Austria' };

        var trVideos = null;

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

            findCreatePlayerFrame();
            $.each(validItems, function (i, validItem) {
                if (i >= 8) {
                    return;
                }
                var item = validItem.videoEntry;
                var currentGeoItem = validItem.geoItem;
                var url = item.media$group.media$thumbnail[0].url;
                var title = item.title.$t.toLowerCase();
                if (i == 0 || i % 4 == 0) {
                    trVideos = $('<tr>').appendTo('#tblVideos');

                }

                var tdVideo = $('<td><a style="cursor: pointer;"><div class="play"></div><p><img src="' + url + '" style="width:154px;height:116px;cursor:hand;" class="thumbVideo" /></p></a><b>' + title + '</b><br><a href="' + currentGeoItem.path + '">' + currentGeoItem.name + '</a> | <a href="' + currentGeoItem.countryPath + '">' + currentGeoItem.countryName + '</a></td>');
                $(trVideos).append(tdVideo);
                var divPlay = $(tdVideo).find('a').first();
                $(divPlay).colorbox({inline:true, width:"885px", height:"600px", href:'#playerFrame', title:item.title.$t, onClosed:function () {

                    $('#playerFrame').empty();

                }});

                $(divPlay).bind('click',
                    function (e) {
                        var video = $(this).data('video');
                        showVideo(video.media$group.yt$videoid.$t);
                    })
                    .data('video', item);


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
            var names = [];
            $.each(homePageEntities, function (i, item) {
                names[names.length] = item.name;
            });
            var query = names.join('|');
            //search the youtube
            var lib = new YouTubeLib({ query:query, 'max-results':40 });
            $("<img id='imgLoading' style='margin-left:250px;margin-top:100px' src='images/ajax-loader-big.gif' />").appendTo('#newVideos');
            var photosLoading = $("<img id='phLoad' style='margin-left:250px;margin-top:100px' src='/images/ajax-loader-big.gif' />").appendTo('#popDest');
            //search for videos and update UI when done
            lib.searchVideos(function (data) {
                $('#newVideos').find('#imgLoading').hide();
                $('#tblPhotos').show();
                $('#tblVideos').show();
                $('#popDest').find('#phLoad').hide();
                var entries = data.videoResult.feed.entry;
                var filteredEntries = getValidEntries(entries, names);
                displayNewVideos(filteredEntries);
            });

            try{
                KEENTOUR.addAddThisWidget();
            }
            catch(e){
              //TODO : enable console logging
            }


        });

    });


});



