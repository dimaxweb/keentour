/**
 * Created with JetBrains WebStorm.
 * User: dmitrym
 * Date: 8/22/13
 * Time: 7:18 PM
 * To change this template use File | Settings | File Templates.
 */
define(["jquery", "ajax-scroll","moment"], function ($,undefined,moment){
    var storiesList = {
        config:{
            LATEST_STORIES_URL:"/latestStories"
        },

        rowsToSkip   : 0,
        storiesToShow  : 5,
        lastPublishDate  : new Date('1978'),
        dateFormat : moment,

        getStories:function (element){
            var callback = function (stories) {
                if (stories && stories.length > 0) {
                    storiesList.lastPublishDate = stories[stories.length - 1].publishDate;
                }
                storiesList.render(stories, element);

            };
            storiesList._getLatestStories(callback);
        },
        showLatest:function (element) {
            $(window).paged_scroll({
                handleScroll:function (page, container, doneCallback) {
                    storiesList.rowsToSkip = page * storiesList.storiesToShow;
                    storiesList.getStories(element);
                    doneCallback();
                },
                startPage:1,
                targetElement:$(element),
                step:'20%',
                debug : false,
                monitorTargetChange:false

            });
            storiesList.getStories(element);
        },

        _getLatestStories:function (callback) {

            var request = $.ajax({
                url:storiesList.config.LATEST_STORIES_URL,
                dataType:"json",
                data :{
                    rowsToSkip : storiesList.rowsToSkip,
                    storiesToShow : storiesList.storiesToShow,
                    lastPublishDate : storiesList.lastPublishDate
                },
                cache : false


            });

            request.success(function (data) {
                callback(data);

            });

            request.error(function (data) {
                storiesList.render(null);
            });
        },

        render:function (stories, element) {
            if (!stories) {
                return;
            }
            $.each(stories, function (i, story) {
                try {
                    storiesList.renderStory(story, element);
                }

                catch (e) {
                     throw e;
                    /// /console.log("Error occured when rendering story:%j.Error is  : %j",story,e);
                }

            });

        },

        renderStory:function (story, element) {
            var title = story.title;
            var storyTags = story.tags;
            var mainItem = story.items[0];
            var storyUrl = story.url;
            var publishDate = moment(story.publishDate).fromNow();
            var tags = story.tags ?  story.tags.join(' ')  : '';
            var storyCont = $('<a class="storyContainer" href="' + storyUrl + '"><div class="storyCont"></div></a>').appendTo(element);
            var mainItemUrl = storiesList.getBigImageUrl(mainItem);
            var storyHeader = $("<div class='storyHeader'></div>").appendTo(storyCont);

            $('<span>' + title + '</span>').appendTo(storyHeader);
            $('<span>' + publishDate + '</span>').appendTo(storyHeader);

            $('<div class="storyImageCont"><img src="' + mainItemUrl + '"/></div>').appendTo(storyCont);
            $('<div class="storyTags">' + tags +'</div>').appendTo(storyCont);
            console.log(story.geoItem);


        },

        getBigImageUrl:function (photo) {
            var photoUrl = photo.url_z || photo.url_l || photo.url_m  || photo.url_t || photo.url_s;
            return photoUrl;
        }

    };

    return storiesList;
});