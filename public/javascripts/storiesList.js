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

        storiesRequestParams :{
            rowsToSkip   : 0,
            storiesToShow  : 5,
            lastPublishDate  : new Date('1978'),
            dateFormat : moment,
            userName : null,
            editMode : false
        },


        showLatest:function (element,storiesRequestParams) {
            storiesList.storiesRequestParams = $.extend(true,  storiesList.storiesRequestParams, storiesRequestParams);
            storiesList._bindInfiniteScroll(element);
            storiesList._getStories(element);
        },


        _bindInfiniteScroll:function(element) {
            $(window).paged_scroll({
                handleScroll:function (page, container, doneCallback) {
                    storiesList.storiesRequestParams.rowsToSkip = page * storiesList.storiesRequestParams.storiesToShow;
                    storiesList._getStories(element);
                    doneCallback();
                },
                startPage:1,
                targetElement:$(element),
                step:'20%',
                debug:false,
                monitorTargetChange:false

            });

        },

        _getStories:function (element){
            var callback = function (stories) {
                if (stories && stories.length > 0) {
                    storiesList.storiesRequestParams.lastPublishDate = stories[stories.length - 1].publishDate;
                }
                storiesList._render(stories, element);

            };
            storiesList._getLatestStories(callback);
        },

         _getLatestStories:function (callback) {

            var request = $.ajax({
                url:storiesList.config.LATEST_STORIES_URL,
                dataType:"json",
                data : storiesList.storiesRequestParams,
                cache : false


            });

            request.success(function (data) {
                callback(data);

            });

            request.error(function (data) {
                storiesList.render(null);
            });
        },

        _render:function (stories, element) {
            if (!stories) {
                return;
            }
            $.each(stories, function (i, story) {
                try {
                    storiesList._renderStory(story, element);
                }

                catch (e) {
                     console.log("Error occurred:",e);

                }

            });

        },

        _renderStory:function (story, element) {
            var title = story.title;
            var storyTags = story.tags;
            var mainItem = story.items[0];
            var storyUrl = story.url;
            var publishDate = moment(story.publishDate).fromNow();
            var tags = story.interests ?  story.interests.join(' ')  : '';
            var storyCont = $('<div class="storyCont"></div>').appendTo(element);
            var mainItemUrl = storiesList._getBigImageUrl(mainItem);

            if(storiesList.storiesRequestParams.editMode){
                var isPublished = story.isPublished;
                var editLinksCont = $('<div class="editLinks"><a class="editStory" href="' + story.editUrl +  '">Edit</a><a class="deleteStory">Delete<a></div>').appendTo(storyCont);
                if(isPublished){
                    $("<span>Published</span>").appendTo(editLinksCont);
                }
                else{
                    $("<span>Draft</span>").appendTo(editLinksCont);
                }

            }

            var storyHeader = $("<div class='storyHeader'></div>").appendTo(storyCont);

            $('<a class="storyContainer" href="' + storyUrl + '">' + title + '<a/>').appendTo(storyHeader);
            $('<span>' + publishDate + '</span>').appendTo(storyHeader);

            var storyImgCont = $('<div class="storyImageCont"><a class="storyContainer" href="' + storyUrl + '"><img class="imgStory" src="' + mainItemUrl + '"/></a></div>').appendTo(storyCont);
            $('.imgStory',storyCont).css({height:mainItem.height_z,width:mainItem.width_z});

            $('<div class="storyTags"><span><b>Interested for : </b></span>' + tags +'</div>').appendTo(storyCont);
            $('<div class="userLink"><span><b>All user stories: </b><a href="/stories/' + story.userName +'">' + story.userName +'</a></div>').appendTo(storyCont);



            console.log(story.geoItem);


        },

        _getBigImageUrl:function (photo) {
            var photoUrl = photo.url_z || photo.url_l || photo.url_m  || photo.url_t || photo.url_s;
            return photoUrl;
        }

    };

    return storiesList;
});