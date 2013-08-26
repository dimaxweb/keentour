/**
 * Created with JetBrains WebStorm.
 * User: dmitrym
 * Date: 8/22/13
 * Time: 7:18 PM
 * To change this template use File | Settings | File Templates.
 */
define(["jquery", "ajax-scroll"], function ($) {
    var storiesList = {
        config:{
            LATEST_STORIES_URL:"/latestStories"
        },

        showLatest:function (element) {
            $(window).paged_scroll({
                handleScroll:function (page, container, doneCallback) {
                    console.log(page);
                    doneCallback();
                },
                startPage:1,
                targetElement:$(element),
                step:'20%',
                debug : false,
                monitorTargetChange:false

            });
            var callback = function (stories) {
                storiesList.render(stories, element);
            };
            storiesList._getLatestStories(callback);
        },

        _getLatestStories:function (callback) {

            var request = $.ajax({
                url:storiesList.config.LATEST_STORIES_URL,
                dataType:"json"

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
                    throw e
                }

            });

        },

        renderStory:function (story, element) {
            var storyCont = $("<div class='storyCont'></div>").appendTo(element);
            var title = story.title;
            var storyTags = story.tags;
            var mainItem = story.items[0];
            var storyUrl = story.url;
            var mainItemUrl = storiesList.getBigImageUrl(mainItem);
            $('<h5>' + title + '</h5>').appendTo(storyCont);
            $('<div class="storyImageCont"><img src="' + mainItemUrl + '"/></div>').appendTo(storyCont);
            $('<a href="' + storyUrl + '">Explore ...</a>').appendTo(storyCont);

        },

        getBigImageUrl:function (photo) {
            var photoUrl = photo.url_m || photo.url_l || photo.url_z || photo.url_t || photo.url_s;
            return photoUrl;
        }

    };

    return storiesList;
});