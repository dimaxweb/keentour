///EXAMPLE  of youtube page queries was used on old home page

var homePageEntities = {};
homePageEntities['london'] = { name:'Budapest', path:'content/Europe/Hungary/Budapest', countryName:'Budapest', countryPath:'content/Europe/Hungary' };
homePageEntities['berlin'] = { name:'Berlin', path:'content/Europe/Germany/Berlin', countryName:'Germany', countryPath:'content/Europe/Germany' };
homePageEntities['paris'] = { name:'Paris', path:'content/Europe/France/Paris', countryName:'France', countryPath:'content/Europe/France'};
homePageEntities['vienna'] = { name:'Vienna', path:'content/Europe/Austria/Vienna', countryName:'Austria', countryPath:'content/Europe/Austria' };
//      homePageEntities['new-york'] = { name:'New-York', path:'content/North-America/United-States/New-York', countryName:'United-States', countryPath:'content/North-America/United-States' };
function searchYoutube(query, names, pageNumber, callback) {

    $('.homeVideos').fadeIn('slow');
//            $('<img class="videoLoading" src="/images/ajax-loader-big.gif" />').appendTo('.homeVideos');
    var startIndex = (pageNumber == 1 ) ? 1 : 40 * (pageNumber - 1);
    //search the youtube
    var lib = new YouTubeLib({ query:query, 'max-results':40, 'start-index':startIndex });
    //search for videos and update UI when done
    lib.searchVideos(function (data) {
        if (data && data.videoResult && data.videoResult.feed && data.videoResult.feed.entry) {
            var entries = data.videoResult.feed.entry;
            var filteredEntries = getValidEntries(entries, names);
            displayNewVideos(filteredEntries);
            if (callback) {
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

    if (!validItems) {
        return;
    }
    findCreatePlayerFrame();
    var itemsToShow = validItems.length < 6 ? validItems.length : 6;
    var itemsToShow = validItems.slice(0, itemsToShow);
    KEENTOUR.twitter_grid.gridify({
        element:$('.homeVideos'),
        data:itemsToShow,
        itemsPerRow:3,
        getItemContent:function (dataItem, gridCell, grid) {
            var item = dataItem.videoEntry;
            var currentGeoItem = dataItem.geoItem;
            console.log(item.media$group.media$keywords);
            var url = item.media$group.media$thumbnail[0].url;
            var title = item.title.$t.toLowerCase();
//                   title = title.length > 30 ? title.substr(0,27) + '...' : title;
            var videoTime = YouTubeLib.getVideoTime(dataItem.videoEntry);
            var itemBox = $('<div class="video-block"><a class="video-link"><img  src="' + url + '" class="thumbnail video-thumb" /><span class="video-time">'
                + videoTime
                + '</span></a>'
                + '<div class="widgetItemName"><a>' + title + '</a></div>'
                + '<a href="' + currentGeoItem.path + '">' + currentGeoItem.name + '</a> | <a href="'
                + currentGeoItem.countryPath + '">' + currentGeoItem.countryName
                + '</a></div>');
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


            var description = (dataItem.media$group && dataItem.media$group.media$description && dataItem.media$group.media$description.$t) ? '<h6>About:</h6><p>' + dataItem.media$group.media$description.$t + '</p>' : '';
            if (description.length > 1000) {
                description = description.substring(0, 500) + '...';
            }
            var author = ( item.author && item.author.length > 0 && item.author[0].name && item.author[0].name.$t) ? '<p><span>Published by :<span>' + item.author[0].name.$t + '</p>' : '';
            var publishedAt = (item.published && item.published.$tt) ? '<p><span>Taken on:<span>' + item.published.$t + '</p>' : '';
            var viewsCount = (item.yt$statistics && item.yt$statistics.viewCount) ? '<p>views count :' + item.yt$statistics.viewCount + '</p>' : '';

            $(divPlay).popover({
                title:title,
                placement:'top',
                content:'<div>' + author + viewsCount + '</div>'

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

////display multiple queries
$('#newVideos').fadeIn('slow');
$('.homeVideos').hide();
var names = [];
$.each(homePageEntities, function (i, item) {
    names[names.length] = item.name;
});
var query = names.join('|');
searchYoutube(query, names, 1);