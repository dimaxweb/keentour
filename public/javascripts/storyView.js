if (typeof(KEENTOUR) === "undefined") {
    KEENTOUR = {};
}

KEENTOUR.renderStory = function (story) {
    if ($.isEmptyObject(story)) {
        console.log("The story object is empty");
        return;
    }

    $('.title').text(story.title);
    $('.description').html(story.description);
    $.each(story.items, function (i, item) {
        KEENTOUR.addStoryItem(item);
        console.log("Story item", item);
    });

    var strTags = story.tags.join(' ');
    $('.storyTags').text(strTags);




};

KEENTOUR.addStoryItem   = function(photo){
    var storyContainer = $('.storyItems');
    var item = $("<li class='storyItemLi'><div class='storyItemContainer'><a class='storyPhoto'><img  class='imgStory' src='" + photo.url_z  +"'/></a></div></li>").appendTo(storyContainer);
    $('.imgStory',item).css({height:photo.height_z,width:photo.width_z});
    $(item).data('item',photo);
    var storyItemContainer =  $(item).find('.storyItemContainer');
    $(storyItemContainer).append("<div class='storyItemTitle'>" + photo.title + "</div>");
    $("<div class='storyItemLinks'></div>").appendTo(storyItemContainer).append("<a href='http://www.flickr.com/photos/" + photo.owner  + "'>" + photo.ownername + "</a>");
    if( photo.description &&  photo.description._content){
        $(storyItemContainer).append("<div class='storyItemDescription'>" + photo.description._content + "</div>");
    }



}

require(["jQueryUI","css!storyViewCSS"], function () {
    $(document).ready(function(e){
         KEENTOUR.renderStory(KEENTOUR.story);

     });

});




