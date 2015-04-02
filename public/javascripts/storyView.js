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

KEENTOUR.renderItems=function(story,page){


    //var items = story.items.slice(page,1 + page);
    var items = story.items;
    $.each(items, function (i, item) {
        KEENTOUR.addStoryItem(item);
        console.log("Story item", item);
    });
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

//    setTimeout(function(e){
//
//        $(description).fadeIn('slow').readmore({
//            speed: 500,
//            maxHeight: 150,
//            moreLink: '<a href="#" class="descriptionToggle pull-left">more...</a>',
//            lessLink: '<a href="#" class="descriptionToggle pull-left">less...</a>'
//        });
//    },200);


    if(story.webSiteUrl){
        var websiteUrl  = story.webSiteUrl;
        if(websiteUrl.indexOf("http:") === -1){
            websiteUrl = "http://" + websiteUrl;
        }
        $('.webSiteUrl').append("<a target='_blank' href='" + websiteUrl +"'><img src='/images/website_btn.png'/></a>");
    }


    KEENTOUR.renderItems(story,0);

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
    var photoSrc  = photo.url_z;
    var photo_h = photo.height_z;
    var photo_w =  photo.width_z;
    if(window.matchMedia){
        //target the phones
        if(window.matchMedia("max-width: 767px)")){
            photoSrc = photo.url_m;
            photo_h = photo.height_m;
            photo_w = photo.width_m;
        }
    }

    var item = $("<li class='storyItemLi'><div class='storyItemContainer'><a class='storyPhoto'><img  class='imgStory' src='" + photoSrc  +"'/></a></div></li>").appendTo(storyContainer);
    $('.imgStory',item).css({height:photo_h,width:photo_w});
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

require(["ajax-scroll","jQueryUI","css!storyViewCSS","jquery.readmore"], function () {
    $(document).ready(function(e){
        $('#searchtext').hide();
        KEENTOUR.renderStory(KEENTOUR.story);
        //$(window).paged_scroll({
        //    handleScroll:function (page,container,done) {
        //        KEENTOUR.renderItems(KEENTOUR.story,page);
        //        done();
        //    },
        //    targetElement:$('.story'),
        //    step:'20px',
        //    pagesToScroll:KEENTOUR.story.items.length,
        //    monitorTargetChange : false,
        //    startPage : 0,
        //    binderElement  :$('.story'),
        //    debug : true
        //
        //});

     });

});




