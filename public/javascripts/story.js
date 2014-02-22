if (typeof(KEENTOUR) === "undefined") {
    KEENTOUR = {};
}



Array.prototype.getUnique = function(){
    var u = {}, a = [];
    for(var i = 0, l = this.length; i < l; ++i){
        if(u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}




KEENTOUR.bindEditor  = function(id) {
    try{
        // This property tells CKEditor to not activate every element with contenteditable=true element.
        CKEDITOR.disableAutoInline = true;

        CKEDITOR.inline( document.getElementById(id) );
        // This code is generally not necessary, but it is here to demonstrate
        // how to customize specific editor instances on the fly. This fits well
        // this demo because we have editable elements (like headers) that
        // require less features.

//    // The "instanceCreated" event is fired for every editor instance created.
//    CKEDITOR.on( 'instanceCreated', function( event ) {
//        var editor = event.editor,
//            element = editor.element;
//
//        // Customize editors for headers and tag list.
//        // These editors don't need features like smileys, templates, iframes etc.
//        // Customize the editor configurations on "configLoaded" event,
//        // which is fired after the configuration file loading and
//        // execution. This makes it possible to change the
//        // configurations before the editor initialization takes place.
//        editor.on( 'configLoaded', function() {
//        // Remove unnecessary plugins to make the editor simpler.
//                editor.config.removePlugins = 'colorbutton,find,flash,font,' +
//                    'forms,iframe,image,newpage,removeformat,' +
//                    'smiley,specialchar,stylescombo,templates';
//
//                // Rearrange the layout of the toolbar.
//                editor.config.toolbarGroups = [
//                    { name: 'editing',		groups: [ 'basicstyles', 'links' ] },
//                    { name: 'undo' },
//                    { name: 'clipboard',	groups: [ 'selection', 'clipboard' ] },
//                    { name: 'about' }
//                ];
//            });
//
//    });

    }
    catch(ex){
       console.log("Error occurred when rendering story");
    }


};


KEENTOUR.renderStory = function (story) {
    if ($.isEmptyObject(story)) {
        console.log("The story object is empty");
        return;
    }

    $('#txtTitle').val(story.title);

    KEENTOUR.bindEditor('description');
    CKEDITOR.instances.description.setData(story.description);

    $('#webSiteUrl').val(story.webSiteUrl);

    KEENTOUR.displayGeoItemData(story.geoItem);
    $('#geoLocation').data('geoItem',story.geoItem).val(story.geoItem  ? story.geoItem.name : '');

    $.each(story.interests,function(i,item){
        var inputSelector =  'input[value="'  + item + '"]'
        console.log(inputSelector);
        $(inputSelector).prop('checked',true);
    });

    $.each(story.items, function (i, item) {
        KEENTOUR.addStoryItem(item);
        console.log("Story item", item);
    });


};


KEENTOUR.getUniqueId  =function() {
    return Math.round(Math.random() * 9999999999);
}



KEENTOUR.getBigImageUrl = function (photo) {
    var photoUrl = photo.url_z || photo.url_l || photo.url_m  || photo.url_t || photo.url_s;
    return photoUrl;
}


KEENTOUR.addStoryItem   = function(photo){
       var storyContainer = $('.storyItems');
       var item = $("<li class='storyItemLi'><div class='storyItemContainer'><a class='storyPhoto'><img class='imgStory' src='" + KEENTOUR.getBigImageUrl(photo)  +"'/></a></div></li>").appendTo(storyContainer);
       $(item).data('item',photo);
       if(photo.storyUserText){
           var storyItemId =  "storyItemUserText_" +  KEENTOUR.getUniqueId();
           $('<div><textarea class="storyItemUserTextArea" id="' + storyItemId  + '"' + '></textarea></div>').prependTo(item);
           $('#' + storyItemId).val(photo.storyUserText);
       }
       var storyItemContainer =  $(item).find('.storyItemContainer');
        $("<div><div class='storyEdit pull-right'><a class='storyItemEdit'>Add text</a><a class='storyItemDelete'>X</a></div></div>").prependTo(item);
//       .on('click',function(e){
//            $(this).closest('li').remove();
//       });
       $(storyItemContainer).append("<div class='storyItemTitle'>" + photo.title + "</div>");
       $("<div class='storyItemLinks'></div>").appendTo(storyItemContainer).append("<a href='http://www.flickr.com/photos/" + photo.owner  + "'>" + photo.ownername + "</a>");
       if( photo.description &&  photo.description._content){
           $(storyItemContainer).append("<div class='storyItemDescription'>" + photo.description._content + "</div>");
       }

        $("html, body").animate({ scrollTop: $('.storyItemsCont').height() - 100 }, "slow");



        var $tab = $('[data-toggle="tab"][href="#story"]');

        $tab.tab('show');




}


KEENTOUR.flickrSearch = function (query) {
    //e.preventDefault();
    /*
     instansiate flickr widget
     */
    $('.photos').flickrFy({
        text:query,
        perPage:18,
        sort:'relevance',
        defaultImageThumb:'sq',
        itemsPerRow:9,
        usePaging:false,
        showTitle : false,
        showTooltip : false,
        itemCreated : function(domItem,dataItem){
           var aAppend = $("<a class='addItem'><img src='/images/plus_btn.png' /></a>").data('photo',dataItem).appendTo(domItem).on("click",function(e){
               e.preventDefault();
               var photo = $(this).data('photo');
               KEENTOUR.addStoryItem(photo);

           });
        }
    });
};

/*
  strip scripts also on client
*/
KEENTOUR.stripScripts   = function(s){
    var div = document.createElement('div');
    div.innerHTML = s;
    var scripts = div.getElementsByTagName('script');
    var i = scripts.length;
    while (i--) {
        scripts[i].parentNode.removeChild(scripts[i]);
    }
    return div.innerHTML;
}

KEENTOUR.getStory = function () {
    var story = {
        title: KEENTOUR.stripScripts($('#txtTitle').val()),
        description:KEENTOUR.stripScripts(CKEDITOR.instances.description.getData()),
        items:[],
        tags  : [],
        interests : [],
        webSiteUrl  : ''

    };

    $('.storyItemLi', '.storyItems').each(function (i, item) {

        var data  =  $(item).data('item');
        var textAreaUserText = $(this).find('.storyItemUserTextArea');
        data.storyUserText =  (textAreaUserText.length !== 0) ? $(textAreaUserText).val() : '';
        story.items.push(data);
        story.tags = story.tags.concat(data.tags.split(' '));


    });

    story.tags = story.tags.getUnique();
    story.geoItem = $('#geoLocation').data('geoItem');
    story.interests  = $.map($('input:checked ','.interests'),function(interest){
        return $(interest).val();
    });

    story.webSiteUrl = $('#webSiteUrl').val();


    story = $.extend({}, KEENTOUR.currentStory, story);

    if(!story.id){

        story.id = KEENTOUR.getUniqueId();
        console.log("Setting new id to story",story.id);

    }



    //TODO  : move validations from here

    /*

     Validations

     */
    if(story.items.length == 0){
        //TODO  : add tooltip hint to widgets may be
        alert("Please add some content to story");
        return;
    }

    if($.trim(story.title)===''){
        alert("Please enter story title");
        $('#txtTitle').focus();
        return;
    }

    if(!story.geoItem){
        alert("Please tell us where it happens...");
         var $tab = $('[data-toggle="tab"][href="#settings"]');
        $tab.tab('show');
        $('#geoLocation').focus();
        return;
    }

    KEENTOUR.currentStory = story;


    return story;
}


KEENTOUR.publishStory  = function(callback){

    var story =  KEENTOUR.getStory();
    /*
     Request to save the idea
     */
    if(!story){
        console.log("No story provided.");
        return;
    }
    var request = $.ajax('/story/publish', {
        headers:{
            'Content-type':'application/json'
        },
        data:JSON.stringify(story),
        type:'POST',
        dataType:'json',
        cache:false

    });

    request.success(function (data) {
        if (callback) {
            callback(data);
        }

    });

    request.error(function (data) {
        if (callback) {
            callback(data);
        }
    });
}

KEENTOUR.saveStory = function (story, callback) {

    if(!story){
        console.log("No story provided.Exit function");
        return;
    }


    /*
        Request to save the story
    */

    var request = $.ajax('/story/save', {
            headers:{
                'Content-type':'application/json'
            },
            data:JSON.stringify(story),
            type:'POST',
            dataType:'json',
            cache:false

        });

        request.success(function (data) {
            if (callback) {
                callback(data);
            }

        });

        request.error(function (data) {
            if (callback) {
                callback(data);
            }
        });

};


KEENTOUR.storySavedHandle = function (data) {
    if (data) {
        if (data.status === true) {
//            KEENTOUR.currentStory = data.story;
            KEENTOUR.notif("Story saved");

        }
        else {
            if(data.redirect){
                $('.modal').modal();
                return;
            }


            KEENTOUR.notif("Error occurred.Please try again");
        }

    }
};

KEENTOUR.getLastQuery = function(){
    //TODO  :load from localStorage
    return $('#searchText').val();
}

KEENTOUR.displayGeoItemData = function(geoItem){
    $('.geoPath').empty();
    $('#geoLocation').data('geoItem',geoItem);
    var countryName = geoItem.countryName;
    var itemName  = geoItem.name;

    if(itemName!=countryName){
        var countrySpan = $('<span class="geoItemPath">' + countryName  + '</span><span class="separator">-</span> ').appendTo('.geoPath');
    }

    var spanName = $('<span class="geoItemPath">' + itemName +'</span>').appendTo('.geoPath');
}

require(["storage", "search", "geonames", "flickrWidget","notification","richEditor","jQueryUI","tabs","modal","css!storyCSS"], function (storage, search, geonames, flickrWidget,notif) {

    KEENTOUR.storage = storage;
    KEENTOUR.search = search;
    KEENTOUR.geonames = geonames;
    KEENTOUR.notif = notif;


    $(document).ready(function (e) {

        $('#searchtext').hide();
        $('#searchbtn').hide();

        KEENTOUR.search.bindAutoComplete({
            container:$('#geoLocation'),
            preserveBoxWidth  : true,
            onItemSelected:function (options) {
                var geoItem = options.geoItem;
                KEENTOUR.displayGeoItemData(geoItem) ;

        }});

        $('#storyTabs').tabs();

        $('#storyTabs .tab').click(function(e) {
            e.preventDefault();
            $(this).tab('show');

        });

        $('#searchText').keypress(function(event){

            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode === 13){
               KEENTOUR.flickrSearch($('#searchText').val());
            }

        });

        /*
         Create action buttons
        */
        $('<div>' +
           '<button class="btn-save"  data-action="save">Save</button> ' +
            '<button class="btn-publish"  data-action="publish">Publish</button> </div>')
            .appendTo('.actionPanel')
            .on('click', 'button', function () {
                //TODO :refactor to smaller functions here
                var action = $(this).data('action');
                /*
                    Save story
                */
                if (action === "save") {
                    var story= KEENTOUR.getStory();
                    KEENTOUR.saveStory(story,function (data) {
                        KEENTOUR.storySavedHandle(data);
                    });

                }



                /*
                 Publish story
                */
                if (action === "publish") {


                    KEENTOUR.publishStory(function(data){

                        KEENTOUR.notif("Story published");
                    });


                }

            });

        KEENTOUR.flickrSearch(KEENTOUR.getLastQuery());




        /*
         Load story data ,which can be provided from
          login flow
          edit flow
          client side storage

        */

        /*
            check for server version and if empty  ,disable for now
        */

        //        if($.isEmptyObject(KEENTOUR.currentStory)){
//            KEENTOUR.currentStory =  KEENTOUR.storage.getObject('currentStory');
//        }

        var interestsCont = $('.interests');
        $.each(KEENTOUR.interests,function(i,item){
            $("<li><div class='interest'>" +
                "<input type='checkbox' value='"
                + item  + "' name=" + item  + "><label class='checkbox inline'>" + item + "</label> </div> </li>").appendTo(interestsCont);
        });



        if (!$.isEmptyObject(KEENTOUR.currentStory)) {
            KEENTOUR.renderStory(KEENTOUR.currentStory);
        }


        $('.storyItems').sortable();


        $('.storyItems').delegate('.storyItemDelete','click',function(e){
            $(this).closest('li').remove();
        });



        $('.storyItems').delegate('.storyItemEdit','click',function(e){

            var storyItemLi =  $(this).closest('li');
            var storyItemDescription  = $(storyItemLi).find('.storyItemUserText');
            if(storyItemDescription.length === 0){
                var storyItemId =  "storyItemUserText_" +  KEENTOUR.getUniqueId();
                storyItemDescription = $('<div><textarea class="storyItemUserTextArea" id="' + storyItemId  + '"' + '></textarea></div>').prependTo(storyItemLi);
                $(storyItemId).focus();

            }

        });



    });
});

