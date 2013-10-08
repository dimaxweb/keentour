if (typeof(KEENTOUR) === "undefined") {
    KEENTOUR = {};
}

KEENTOUR.renderStory = function (story) {
    if ($.isEmptyObject(story)) {
        console.log("The story object is empty");
        return;
    }

    $('.title').text("Title:" + story.title);

    if(story.description && story.description!='undefined'){
        $('.description').html(story.description);
    }

    if(story.webSiteUrl){
        $('.webSiteUrl').append("<a target='_blank' href='" + story.webSiteUrl +"'>Web Site</a>");
    }

    $.each(story.items, function (i, item) {
        KEENTOUR.addStoryItem(item);
        console.log("Story item", item);
    });

    var strTags = (story.interests && story.interests.length > 0)  ? story.interests.join(' ') : '';
    if(strTags.length > 0){
        $('.tagItems').text(strTags);
        $('.titleTags').text("Interested for :");
    }



};

KEENTOUR.addStoryItem   = function(photo){
    var storyContainer = $('.storyItems');
    var item = $("<li class='storyItemLi'><div class='storyItemContainer'><a class='storyPhoto'><img  class='imgStory' src='" + photo.url_z  +"'/></a></div></li>").appendTo(storyContainer);
    $('.imgStory',item).css({height:photo.height_z,width:photo.width_z});
    $(item).data('item',photo);
    var storyItemContainer =  $(item).find('.storyItemContainer');
    if(photo.storyUserText){
        var storyUserText  = $("<div class='storyUserText'>"  + photo.storyUserText  + "</div>").prependTo(storyItemContainer);
    }
    $(storyItemContainer).append("<div class='storyItemTitle'>" + photo.title + "</div>");
    $("<div class='storyItemLinks'></div>").appendTo(storyItemContainer).append("<a href='http://www.flickr.com/photos/" + photo.owner  + "'>" + photo.ownername + "</a>");
    if( photo.description &&  photo.description._content && photo.description._content !=="undefined"){
        $(storyItemContainer).append("<div class='storyItemDescription'>" + photo.description._content + "</div>");
    }





}

require(["jQueryUI","css!storyViewCSS"], function () {
    $(document).ready(function(e){
         KEENTOUR.renderStory(KEENTOUR.story);

     });

});




