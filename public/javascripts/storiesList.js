/**
 * Created with JetBrains WebStorm.
 * User: dmitrym
 * Date: 8/22/13
 * Time: 7:18 PM
 * To change this template use File | Settings | File Templates.
 */
define(["jquery", "ajax-scroll","moment","twitter_grid","notification","css!storiesListCss"], function ($,undefined,moment,twitter_grid,notif){


    var storiesList = {

       config:{
            LATEST_STORIES_URL:"/latestStories"
        },

        notif : notif,

        storiesRequestParams :{
            rowsToSkip   : 0,
            storiesToShow  : 12,
            dateFormat : moment,
            userName : null,
            editMode : false,
            lastStoryId : null,
            itemsPerRow:3
        },


        searchStories : function(element,storiesRequestParams){
            $(element).empty();
            storiesList.showLatest(element,storiesRequestParams);
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
                step:'50%',
                debug:false,
                monitorTargetChange:false


            });

        },

        _getStories:function (element){
            var callback = function (stories) {
                console.log("User stories are :",stories);
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

            twitter_grid.gridify({
                element:element,
                data:stories,
                itemsPerRow:storiesList.storiesRequestParams.itemsPerRow,
                getItemContent:function (story, cell, grid) {
                    if (story) {
                        var itemContainer = $('<div class="storyCont" data-content="contentItem" />').appendTo(cell);
                        storiesList._renderStory(story,itemContainer);



                    }


            }});
//            $.each(stories, function (i, story) {
//                try {
//                    storiesList._renderStory(story, element);
//                }
//
//                catch (e) {
//                     console.log("Error occurred:",e);
//
//                }
//
//            });

        },

        _renderStory:function (story, storyCont) {

            var title = story.title;
            var storyTags = story.tags;
            var mainItem = story.items[0];
            var storyUrl = story.url;
            var publishDate = moment(story.publishDate).fromNow();
            var tags = story.interests ?  story.interests.join(' ')  : '';

            var mainItemUrl = storiesList._getBigImageUrl(mainItem);

            if(storiesList.storiesRequestParams.editMode === true){
                var isPublished = story.isPublished;

            }

            if(story.storyUserText){
                var storyUserText  = $("<div class='storyUserText'>" + story.storyUserText  +"</div>").appendTo(storyCont);
            }

            var storyHeader = $("<div class='storyHeader'></div>").appendTo(storyCont);

            var divWidgetName = $('<div class="widgetItemName" />').appendTo(storyHeader);
            $('<a class="storyContainer" href="' + storyUrl + '">' + title + '<a/>').appendTo(divWidgetName);


            var storyImgCont = $('<div class="storyImageCont"><a class="storyContainer" href="' + storyUrl + '"><img class="imgStory" src="' + mainItemUrl + '"/></a></div>').appendTo(storyCont);
            $('.imgStory',storyCont).css({height:mainItem.height_s,width:mainItem.width_s});

            $('<div class="tags"><div class="tagsText"> ' + tags +'</div></div>').appendTo(storyCont);
            $('<div class="userLink"><span>By : </span><a href="/stories/' + story.userName +'">' + story.userName +'</a></div>').appendTo(storyCont);
//            $('<div class="text-center"><span class="publishDate  muted">' + publishDate + '</span></div>').appendTo(storyCont);

            if(storiesList.storiesRequestParams.editMode === true){
                var editLinksCont = $('<div class="editLinks"><a class="editStory" href="' + story.editUrl +  '">Edit</a><a class="deleteStory" href="' + story.deleteUrl +'">Delete<a></div>').appendTo(storyCont);
                if(isPublished){
                    $("<span class='isPublished'>Published</span>").appendTo(editLinksCont);
                }
                else{
                    $("<span class='draft'>Draft</span>").appendTo(editLinksCont);
                }

                $('.deleteStory',editLinksCont).on('click',function(e){
                    e.preventDefault();
                    var res = confirm("Are you really want to delete this story? You can't undo this action");
                    var deleteUrl = $(this).attr('href');
                    if(res){
                        storiesList._deleteStory(deleteUrl,storyCont);
                        notif("Story deleted");
                    }

                });
            }







        },

        _deleteStory : function(deleteUrl,storyCont){
            var request = $.ajax({
                url:deleteUrl,
                dataType:"json",
                cache : false


            });

            request.success(function (data) {
               if(data.status ==="ok"){
                   $(storyCont).remove();
               }

            });

            request.error(function (data) {
              alert("Error occured deleting story.Please try again later");
            });
        },

        _getBigImageUrl:function (photo) {
            var photoUrl =   photo.url_s;
            return photoUrl;
        }

    };

    return storiesList;
});