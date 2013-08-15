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
    //Order of the preferences
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


KEENTOUR.bindEditor  = function() {

    /*
        Toolbar template
    */

   var toolbarTemplate = $('<div id="wysihtml5-editor-toolbar"><header><ul class="commands"><li data-wysihtml5-command="bold" title="Make text bold (CTRL + B)" class="command"></li><li data-wysihtml5-command="italic" title="Make text italic (CTRL + I)" class="command"></li><li data-wysihtml5-command="insertUnorderedList" title="Insert an unordered list" class="command"></li><li data-wysihtml5-command="insertOrderedList" title="Insert an ordered list" class="command"></li><li data-wysihtml5-command="createLink" title="Insert a link" class="command"></li><li data-wysihtml5-command="insertImage" title="Insert an image" class="command"></li><li data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1" title="Insert headline 1" class="command"></li><li data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h2" title="Insert headline 2" class="command"></li><li data-wysihtml5-command-group="foreColor" class="fore-color" title="Color the selected text" class="command"><ul> <li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="silver"></li>               <li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="gray"></li><li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="maroon"></li><li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="red"></li><li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="purple"></li>               <li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="green"></li>               <li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="olive"></li>               <li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="navy"></li>               <li data-wysihtml5-command="foreColor" data-wysihtml5-command-value="blue"></li>             </ul>           </li>           <li data-wysihtml5-command="insertSpeech" title="Insert speech" class="command"></li><li data-wysihtml5-action="change_view" title="Show HTML" class="action"></li></ul></header><div data-wysihtml5-dialog="createLink" style="display: none;"><label>Link:<input data-wysihtml5-dialog-field="href" value="http://">         </label>         <a data-wysihtml5-dialog-action="save">OK</a>&nbsp;<a data-wysihtml5-dialog-action="cancel">Cancel</a></div><div data-wysihtml5-dialog="insertImage" style="display: none;">Image:<input data-wysihtml5-dialog-field="src" value="http://"> </label><a data-wysihtml5-dialog-action="save">OK</a>&nbsp;<a data-wysihtml5-dialog-action="cancel">Cancel</a></div></div>')
                            .prependTo('.storyText');


    var editor = new wysihtml5.Editor("description", {
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
        console.log("No story in state");
        return;
    }

    $('#txtTitle').val(story.title);
    $('#txtDescription').val(story.description);
    $.each(story.items, function (i, item) {
        console.log("Story item", item);
    });


};

KEENTOUR.addStoryItem   = function(photo){
       var storyContainer = $('.storyItems');
       var item = $("<li class='storyItemLi'><div class='storyItemContainer'><a class='storyPhoto'><img class='imgStory' src='" + photo.url_m  +"'/></a></div></li>").appendTo(storyContainer);
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

KEENTOUR.flickrSearch = function () {
    //e.preventDefault();
    /*
     instansiate flickr widget
     */
    $('.photos').flickrFy({
        text:$('#searchText').val(),
        perPage:18,
        sort:'relevance',
        defaultImageThumb:'sq',
        itemsPerRow:1,
        usePaging:true,
        itemCreated : function(domItem,dataItem){
           var aAppend = $("<a class='addItem'>+</a>").data('photo',dataItem).appendTo(domItem).on("click",function(e){
               e.preventDefault();
               var photo = $(this).data('photo');
               KEENTOUR.addStoryItem(photo);

           });
        }
    });
};

KEENTOUR.getStory = function () {
    var story = {
        title:$('#txtTitle').val(),
        description:$('#txtDescription').val(),
        items:[],
        innerHtml  : $('.storyItems').html()
    };

    $('.storyItemLi', '.storyItems').each(function (i, item) {
        var data = $(item).data('item');
        story.items.push(data);

    });


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
            alert("Story saved...");
        }
        else {
            window.location = data.redirect || '/';
        }

    }
};


require(["storage", "search", "geonames", "flickrWidget","richEditor","jQueryUI","css!storyCSS"], function (storage, search, geonames, flickrWidget) {

    KEENTOUR.storage = storage;
    KEENTOUR.search = search;
    KEENTOUR.geonames = geonames;

    $(document).ready(function (e) {



        $('#searchText').keypress(function (e) {
            /*
             Handle enter
             */
            if (e.which == 13) {
                KEENTOUR.flickrSearch();
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
                            window.location = '/storyView/' + data.story.url;
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





        //TODO  :load from localStorage
        KEENTOUR.flickrSearch();

        KEENTOUR.bindEditor();

        var story = {};
        /*
         Load story data ,which can be provided from login or edit flow
         */
        if (!$.isEmptyObject(KEENTOUR.lastStory)) {
            //TODO  : change to notification
            alert("story saved!");
            story = KEENTOUR.currentStory = KEENTOUR.lastStory;
            $('.storyHtml').html(story.innerHtml);

        }

        KEENTOUR.renderStory(story);
        $('.storyItems').sortable();


    });
});

