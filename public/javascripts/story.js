require.config({
    baseUrl:'/javascripts/lib',

    paths:{
        jquery:[
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the CDN location fails, load from this location
            'jquery1.7.2.min'
        ],

        jQueryUI:[
            'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min',
            //If the CDN location fails, load from this location
            'jquery-ui.min'
        ],

        swfObject:[
            'https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject',
            //If the CDN location fails, load from this location
            'swfobject'
        ],

        youTubeLib:'/javascripts/youTubeLib',
        'jquery.colorbox-min':'/javascripts/lib/jquery.colorbox-min',
        'ajax-scroll':'/javascripts/lib/jquery-paged-scroll.min',
        storage:'/javascripts/storage',
        geonames:'/javascripts/geonames',
        search:'/javascripts/search',
        flickrWidget:'/javascripts/flickrWidget',
        youtubeWidget:'/javascripts/youtubeWidget',
        wikiPediaWidget:'/javascripts/wikiPediaWidget',
        flickrLib:'/javascripts/flickrLib',
        youTubeLib:'/javascripts//youTubeLib',
        contentWidget:'/javascripts/contentWidget',
        tooltip:'/javascripts/lib/bootstrap/bootstrap-tooltip',
        popover:'/javascripts/lib/bootstrap/bootstrap-popover',
        carousel:'/javascripts/lib/bootstrap/bootstrap-carousel',
        twitter_grid:'/javascripts/twitter-grid',
        richEditorSource  : '/javascripts/lib/wysihtml5/wysihtml5-0.3.0.min',
        richEditor  : '/javascripts/lib/wysihtml5/wysihtml5-AMD',
        /*
            css resources
        */
        paginationCSS:'/stylesheets/pagination',
        storyCSS:'/stylesheets/story',
        jQueryUICSS:'/stylesheets/jquery-ui-1.8.20.custom',
        colorBoxCSS:'/stylesheets/colorBox',
        wikiCSS:'/stylesheets/wiki2',
        richEditorCSS : '/stylesheets/wysihtml',
        css:'/javascripts/lib/css'




    },

    //Order of the loaded files
    shim:{
        "jQueryUI":{
            deps:["jquery"]
        },
        "youTubeLib":{
            deps:["jquery"]
        },

        "flickrLib":{
            deps:["jquery"]
        },

        "ajax-scroll":{
            deps:["jquery"]
        },

        "wikiPediaWidget":{
            deps:["jquery"]
        },

        "youtubeWidget":{
            deps:["jquery"]
        },

        "flickrWidget":{
            deps:["jquery"]
        },

        "jquery.paginate":{
            deps:["jquery"]
        },

        "jquery.colorbox-min":{
            deps:["jquery"]
        },

        "storage":{
            deps:["jquery"]
        },

        "search":{
            deps:["jquery", "jQueryUI"]
        },
        "geonames":{
            deps:["jquery"]
        },

        ///bootstrap
        "tooltip":{
            deps:["jquery"]
        },

        "popover":{
            deps:["jquery","tooltip"]
        }

    }

});


//TODO : think about creating in define or checking findNested dependencies in app.build.js
//TODO  : refactor move logic to some model
//TODO  : refactor method get functions
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


KEENTOUR.bindEditor  = function() {

    /*
        Toolbar template
    */

   var toolbarTemplate = $('<div id="wysihtml5-editor-toolbar"><header><ul class="commands"><li data-wysihtml5-command="bold" title="Make text bold (CTRL + B)" class="command"></li><li data-wysihtml5-command="italic" title="Make text italic (CTRL + I)" class="command"></li><li data-wysihtml5-command="insertUnorderedList" title="Insert an unordered list" class="command"></li><li data-wysihtml5-command="insertOrderedList" title="Insert an ordered list" class="command"></li><li data-wysihtml5-command="createLink" title="Insert a link" class="command"></li><li data-wysihtml5-command="insertImage" title="Insert an image" class="command"></li><li data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1" title="Insert headline 1" class="command"></li><li data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h2" title="Insert headline 2" class="command"></li><li data-wysihtml5-command-group="foreColor" class="fore-color" title="Color the selected text" class="command"><ul> <li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="silver"></li>               <li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="gray"></li><li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="maroon"></li><li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="red"></li><li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="purple"></li>               <li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="green"></li>               <li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="olive"></li>               <li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="navy"></li>               <li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="blue"></li>             </ul>           </li>           <li data-wysihtml5-command="insertSpeech" title="Insert speech" class="command"></li><li data-wysihtml5-action="change_view" title="Show HTML" class="action"></li></ul></header><div data-wysihtml5-dialog="createLink" style="display: none;"><label>Link:<input data-wysihtml5-dialog-field="href" value="http://">         </label>         <a data-wysihtml5-dialog-action="save">OK</a>&nbsp;<a data-wysihtml5-dialog-action="cancel">Cancel</a></div><div data-wysihtml5-dialog="insertImage" style="display: none;">Image:<input data-wysihtml5-dialog-field="src" value="http://"> </label><a data-wysihtml5-dialog-action="save">OK</a>&nbsp;<a data-wysihtml5-dialog-action="cancel">Cancel</a></div></div>')
                            .prependTo('.storyText');


    var editor = new wysihtml5.Editor("wysihtml5-editor", {
        toolbar: "wysihtml5-editor-toolbar",
        parserRules: wysihtml5ParserRules
    });

//    var log = document.getElementById("log");
//
//    editor
//        .on("load", function() {
//            log.innerHTML += "<div>load</div>";
//        })
//        .on("focus", function() {
//            log.innerHTML += "<div>focus</div>";
//        })
//        .on("blur", function() {
//            log.innerHTML += "<div>blur</div>";
//        })
//        .on("change", function() {
//            log.innerHTML += "<div>change</div>";
//        })
//        .on("paste", function() {
//            log.innerHTML += "<div>paste</div>";
//        })
//        .on("newword:composer", function() {
//            log.innerHTML += "<div>newword:composer</div>";
//        })
//        .on("undo:composer", function() {
//            log.innerHTML += "<div>undo:composer</div>";
//        })
//        .on("redo:composer", function() {
//            log.innerHTML += "<div>redo:composer</div>";
//        });
};


KEENTOUR.renderStory = function (story) {
    if ($.isEmptyObject(story)) {
        console.log("The story object is empty");
        return;
    }

    $('#txtTitle').val(story.title);
    $('#txtDescription').html(story.description);
    $.each(story.items, function (i, item) {
        KEENTOUR.addStoryItem(item);
        console.log("Story item", item);
    });


};


KEENTOUR.getBigImageUrl = function (photo) {
    var photoUrl = photo.url_z || photo.url_l || photo.url_m  || photo.url_t || photo.url_s;
    return photoUrl;
}


    KEENTOUR.addStoryItem   = function(photo){
       var storyContainer = $('.storyItems');
       var item = $("<li class='storyItemLi'><div class='storyItemContainer'><a class='storyPhoto'><img class='imgStory' src='" + KEENTOUR.getBigImageUrl(photo)  +"'/></a></div></li>").appendTo(storyContainer);
       $(item).data('item',photo);
       var storyItemContainer =  $(item).find('.storyItemContainer');
        $("<div><a class='storyItemDelete pull-right'>x</a></div>").prependTo(item).on('click',function(e){
            $(this).closest('li').remove();
       });
       $(storyItemContainer).append("<div class='storyItemTitle'>" + photo.title + "</div>");
       $("<div class='storyItemLinks'></div>").appendTo(storyItemContainer).append("<a href='http://www.flickr.com/photos/" + photo.owner  + "'>" + photo.ownername + "</a>");
       if( photo.description &&  photo.description._content){
           $(storyItemContainer).append("<div class='storyItemDescription'>" + photo.description._content + "</div>");
       }


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
        itemCreated : function(domItem,dataItem){
           var aAppend = $("<a class='addItem'>+</a>").data('photo',dataItem).appendTo(domItem).on("click",function(e){
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
        description:KEENTOUR.stripScripts($('#wysihtml5-editor').val()),
        items:[],
        tags  : []

    };

    $('.storyItemLi', '.storyItems').each(function (i, item) {
        var data = $(item).data('item');
        story.items.push(data);
        story.tags = story.tags.concat(data.tags.split(' '));


    });

    story.tags = story.tags.getUnique();
    story = $.extend({}, KEENTOUR.currentStory, story);
    return story;
}

KEENTOUR.saveStory = function (currentStory, callback) {

    var story = currentStory || KEENTOUR.getStory();

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

    /*
        Request to save the idea
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
            KEENTOUR.currentStory = data.story;
            //KEENTOUR.storage.setObject('currentStory',KEENTOUR.currentStory);
            console.log("Story saved...",KEENTOUR.currentStory);
        }
        else {
            window.location = data.redirect || '/';
        }

    }
};

KEENTOUR.getLastQuery = function(){
    //TODO  :load from localStorage
    return $('#searchText').val();
}

require(["storage", "search", "geonames", "flickrWidget","richEditor","jQueryUI","css!storyCSS"], function (storage, search, geonames, flickrWidget) {

    KEENTOUR.storage = storage;
    KEENTOUR.search = search;
    KEENTOUR.geonames = geonames;

    $(document).ready(function (e) {

         /*
           bind this to another place,when editing geo loacation
         */
//        KEENTOUR.search.bindAutoComplete({
//            container:$('#searchText'),
//            onItemSelected:function (options) {
//                var query = $(options.searchText).val();
//                KEENTOUR.flickrSearch(query);
//
//
//        }});

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
            '<button class="btn btn-primary" data-action="preview">Preview</button> ' +
            '<button class="btn btn-primary" data-action="save">Save</button> ' +
            '<button class="btn btn-primary" data-action="publish">Publish</button> </div>')
            .appendTo('.actionPanel')
            .on('click', '.btn', function () {
                //TODO :refactor to smaller functions here
                var action = $(this).data('action');
                /*
                    Save story
                */
                if (action === "save") {
                    KEENTOUR.saveStory(null,function (data) {
                        KEENTOUR.storySavedHandle(data);
                    });

                }

                /*
                    Preview story
                */
                if (action === "preview") {
                    KEENTOUR.saveStory(null,function (data) {
                        KEENTOUR.storySavedHandle(data);
                        if (data && data.story && data.story.url) {
                            window.open(data.story.url);

                        }

                    });

                }

                /*
                 Publish story
                */
                if (action === "publish") {

                    var story = KEENTOUR.getStory();
                    story.publishedVersion = KEENTOUR.getStory();
                    story.isPublished = true;
                    story.isPublishedDate = new Date();
                    KEENTOUR.saveStory(story, function (data) {
                        KEENTOUR.storySavedHandle(data);
                        if (data && data.status === true) {
                            //TODO : add notification here
                            alert("Story published");
                            ///window.location = '/stories/preview/' + data.story.url;
                        }

                    });

                }

            });

        KEENTOUR.flickrSearch(KEENTOUR.getLastQuery());

        KEENTOUR.bindEditor();

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

        if (!$.isEmptyObject(KEENTOUR.currentStory)) {
            //TODO  : change to notification
            console.log("story saved!");
            KEENTOUR.renderStory(KEENTOUR.currentStory);

        }


        $('.storyItems').sortable();


    });
});

