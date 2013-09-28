define(["jquery","ajax-scroll","moment"],function(e,t,n){var r={config:{LATEST_STORIES_URL:"/latestStories"},storiesRequestParams:{rowsToSkip:0,storiesToShow:5,lastPublishDate:new Date("1978"),dateFormat:n,userName:null},showLatest:function(t,n){r.storiesRequestParams=e.extend(!0,r.storiesRequestParams,n),r._bindInfiniteScroll(t),r._getStories(t)},_bindInfiniteScroll:function(t){e(window).paged_scroll({handleScroll:function(e,n,i){r.storiesRequestParams.rowsToSkip=e*r.storiesRequestParams.storiesToShow,r._getStories(t),i()},startPage:1,targetElement:e(t),step:"20%",debug:!1,monitorTargetChange:!1})},_getStories:function(e){var t=function(t){t&&t.length>0&&(r.storiesRequestParams.lastPublishDate=t[t.length-1].publishDate),r._render(t,e)};r._getLatestStories(t)},_getLatestStories:function(t){var n=e.ajax({url:r.config.LATEST_STORIES_URL,dataType:"json",data:r.storiesRequestParams,cache:!1});n.success(function(e){t(e)}),n.error(function(e){r.render(null)})},_render:function(t,n){if(!t)return;e.each(t,function(e,t){try{r._renderStory(t,n)}catch(i){console.log("Error occured.",i)}})},_renderStory:function(t,i){var s=t.title,o=t.tags,u=t.items[0],a=t.url,f=n(t.publishDate).fromNow(),l=t.interests?t.interests.join(" "):"",c=e('<div class="storyCont"></div>').appendTo(i),h=r._getBigImageUrl(u),p=e("<div class='storyHeader'></div>").appendTo(c);e('<a class="storyContainer" href="'+a+'">'+s+"<a/>").appendTo(p),e("<span>"+f+"</span>").appendTo(p);var d=e('<div class="storyImageCont"><a class="storyContainer" href="'+a+'"><img class="imgStory" src="'+h+'"/></a></div>').appendTo(c);e(".imgStory",c).css({height:u.height_z,width:u.width_z}),e('<div class="storyTags"><span><b>Interested for : </b></span>'+l+"</div>").appendTo(c),e('<div class="userLink"><span><b>All user stories: </b><a href="/stories/'+t.userName+'">'+t.userName+"</a></div>").appendTo(c),console.log(t.geoItem)},_getBigImageUrl:function(e){var t=e.url_z||e.url_l||e.url_m||e.url_t||e.url_s;return t}};return r})