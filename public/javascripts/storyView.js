if (typeof(KEENTOUR) === "undefined") {
    KEENTOUR = {};
}

KEENTOUR.displayGeoItemData = function(geoItem){
    if(geoItem){
        $('.geoPath').empty();
        $('.geoLocation').text("Location");
        var countryName = geoItem.countryName;
        var itemName  = geoItem.name;

        if(itemName!=countryName){
            $('<span class="geoItemPath">' + countryName  + '</span><span class="separator">-</span> ').appendTo('.geoPath');
        }

        $('<span class="geoItemPath">' + itemName +'</span>').appendTo('.geoPath');
    }

}

KEENTOUR.renderStory = function (story) {


    if ($.isEmptyObject(story)) {
        console.log("The story object is empty");
        return;
    }

    console.log("The story is : ",story);

    $('.storyTitle').text(story.title);

    var description = $('.description');
    if(story.description && story.description!='undefined'){
        $(description).html(story.description);
    }

    setTimeout(function(e){

        $(description).fadeIn('slow').readmore({
            speed: 500,
            maxHeight: 150,
            moreLink: '<a href="#" class="descriptionToggle pull-left">more...</a>',
            lessLink: '<a href="#" class="descriptionToggle pull-left">less...</a>'
        });
    },200);


    if(story.webSiteUrl){
        var websiteUrl  = story.webSiteUrl;
        if(websiteUrl.indexOf("http:") === -1){
            websiteUrl = "http://" + websiteUrl;
        }
        $('.webSiteUrl').append("<a target='_blank' href='" + websiteUrl +"'><img src='/images/website_btn.png'/></a>");
    }

    $.each(story.items, function (i, item) {
        KEENTOUR.addStoryItem(item);
        console.log("Story item", item);
    });


    if(story.interests.length > 0){
     $('.titleTags').text("Tags");
     $.each(story.interests,function(i,item){
       $('<div class="tag">' + item + '</div>').appendTo('.tagItems');
     });
    }

    if(story.geoItem){
        KEENTOUR.displayGeoItemData(story.geoItem);
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

require(["jQueryUI","css!storyViewCSS","jquery.readmore"], function () {
    $(document).ready(function(e){
        console.log("render story");
        KEENTOUR.renderStory(KEENTOUR.story);

     });

});




