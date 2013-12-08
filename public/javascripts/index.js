if(typeof(KEENTOUR)==='undefined'){
    KEENTOUR = {};
}


require(["storage","geonames","search","contentWidget"], function (storage,geonames,search,contentWidget) {

    KEENTOUR.storage = storage;
    KEENTOUR.geonames = geonames;
    KEENTOUR.contentWidget = contentWidget;
    KEENTOUR.search = search;

    $(document).ready(function (e) {


        KEENTOUR.search.bindAutoComplete({
            container:$('#searchtext'),
            submitControl:$('#searchbtn'),
            onItemSelected:function (options) {
               console.log("Search done:",options);

        }});

        var newStoriesParams = {isPublished: true};
        console.log("New stories params:",newStoriesParams);
        KEENTOUR.contentWidget.displayCurrentWidget();

        var filterOptions = $('.interests');
        $.each(KEENTOUR.interests,function(i,item){
           $("<li><a class='filterOption'>" + item +"</a></li>").appendTo(filterOptions);
        });

        /*
         bind click on interests
         */
        $('.filterOption').on('click',function(e){


            var tags  = null;
            if($(this).data('checked')===true){
                $(this).data('checked',false);


            } else{

                $('.filterOptionSelected').attr('class','filterOption');
                $(this).data('checked',true);
                var interests = $(this).text();
                tags = interests;

            }


            $(this).toggleClass('filterOption filterOptionSelected');
            $('.latestStories').empty();
            KEENTOUR.storiesList.showLatest($('.latestStories'),{isPublished: true,tags :tags,rowsToSkip:0});
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



