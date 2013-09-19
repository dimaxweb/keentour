if(typeof(KEENTOUR)==='undefined'){
    KEENTOUR = {};
}


require(["storage","geonames","storiesList","css!storiesListCss"], function (storage,geonames,storiesList) {

    KEENTOUR.storage = storage;
    KEENTOUR.geonames = geonames;
    KEENTOUR.storiesList = storiesList;


    $(document).ready(function (e) {

        KEENTOUR.storiesList.showLatest($('.latestStories'));


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



