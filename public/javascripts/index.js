if(typeof(KEENTOUR)==='undefined'){
    KEENTOUR = {};
}


require(["storage","geonames","search","contentWidget"], function (storage,geonames,search) {

    KEENTOUR.storage = storage;
    KEENTOUR.geonames = geonames;
    KEENTOUR.search = search;

    $(document).ready(function (e) {


        KEENTOUR.search.bindAutoComplete({
            container:$('#searchtext'),
            submitControl:$('#searchbtn'),
            onItemSelected:function (options) {
               console.log("Search done:",options);
               window.contentData.flickrText = options.geoItem.name + " travel";
               window.contentData.wikiPage  = options.geoItem.name;
               window.contentData.youTubeQuery =  options.geoItem.name +  " travel";
               window.contentData.geoItem = options.geoItem;
               $('#mainCont').contentify();

        }});

        var newStoriesParams = {isPublished: true};
        /*

        */

        $('#mainCont').contentify();



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



