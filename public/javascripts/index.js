if(typeof(KEENTOUR)==='undefined'){
    KEENTOUR = {};
}





if (!window.contentData) {
    /*
        default data
    */
    window.contentData = {};
    window.contentData.wikiPage = 'Austria';
    window.contentData.flickrText = 'Austria travel';
    window.contentData.youTubeQuery = 'Austria,travel';
    window.contentData.geoItem = {
        geonameId:null
    }
    window.contentData.tags = null;

}

KEENTOUR.filterState = {
    geoItem  : {
        geonameId:null,
        name  : 'Austria'
    },
    tags : null
}

KEENTOUR.setTags = function(tags){
    if(tags){
        window.contentData.flickrText = KEENTOUR.filterState.geoItem.name + " " +  tags;
        window.contentData.wikiPage  =  KEENTOUR.filterState.geoItem.name + " " +  tags;
        window.contentData.youTubeQuery =   KEENTOUR.filterState.geoItem.name + " " +  tags;
    }
    else{
        window.contentData.flickrText = KEENTOUR.filterState.geoItem.name + " travel";
        window.contentData.wikiPage  =  KEENTOUR.filterState.geoItem.name;
        window.contentData.youTubeQuery =   KEENTOUR.filterState.geoItem.name + " travel";
    }

    KEENTOUR.filterState.tags =  window.contentData.tags =  tags;
    console.log("Setting content data from tags", window.contentData);
    $('#mainCont').contentify();

}

KEENTOUR.setGeoItem  = function(geoItem){
    if(!geoItem){
        return;
    }
    if( KEENTOUR.filterState.tags){
        window.contentData.flickrText =   geoItem.name + " " +  KEENTOUR.filterState.tags;
        window.contentData.wikiPage  =    geoItem.name + " " +  KEENTOUR.filterState.tags;
        window.contentData.youTubeQuery = geoItem.name + " " +  KEENTOUR.filterState.tags;
    }
    else{
        window.contentData.flickrText =   geoItem.name + " travel";
        window.contentData.wikiPage  =    geoItem.name;
        window.contentData.youTubeQuery = geoItem.name + " travel";
    }

    KEENTOUR.filterState.geoItem = window.contentData.geoItem = geoItem;
    console.log("Setting content data from geoItem", window.contentData);
    $('#mainCont').contentify();
}

KEENTOUR.getLastGeoItem = function(){
   var lastItem =  KEENTOUR.storage.getItem('lastGeoItem');
   if(!item){
       lastItem = KEENTOUR.DEFAULT_GEO_ITEM;
   }
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
               KEENTOUR.setGeoItem(options.geoItem);
            }});


        /*
          call the content widget
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
                tags = $(this).text();


            }


            $(this).toggleClass('filterOption filterOptionSelected');

           KEENTOUR.setTags(tags);


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



