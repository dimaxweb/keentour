if(typeof(KEENTOUR)==='undefined'){
    KEENTOUR = {};
}


require(["storage","geonames","storiesList","css!storiesListCss"], function (storage,geonames,storiesList) {

    KEENTOUR.storage = storage;
    KEENTOUR.geonames = geonames;
    KEENTOUR.storiesList = storiesList;


    $(document).ready(function (e) {

        var newStoriesParams = {isPublished: true};
        console.log("New stories params:",newStoriesParams);
        KEENTOUR.storiesList.showLatest($('.latestStories'),newStoriesParams);

        /*
          bind click on interests
        */
        $('a','.interests').on('click',function(e){
            var interests = $(this).text();
            KEENTOUR.storiesList.showLatest($('.latestStories'),{isPublished: true,tags :interests});
            $(document).scrollTop(0);
        });


        $('.filterClose').on('click',function(e){
            $('.filterItems').hide();
            $('.filter').show();
        });

        $('.filter').on('click',function(e){
           $(this).hide();
           $('.filterItems').show();
       });

    });



});



