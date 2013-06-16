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
        ///css resources
        paginationCSS:'/stylesheets/pagination',
        storyCSS:'/stylesheets/story',
        jQueryUICSS:'/stylesheets/jquery-ui-1.8.20.custom',
        colorBoxCSS:'/stylesheets/colorBox',
        wikiCSS:'/stylesheets/wiki2',
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
        itemsPerRow:6,
        usePaging:true
    });
};

KEENTOUR.getStory = function () {
    var story = {
        title:$('#txtTitle').val(),
        description:$('#txtDescription').val(),
        items:[]
    };

    $('.storyItem', '.storyPhotos').each(function (i, item) {
        var data = $(item).data('item');
        story.items.push(data);

    });


    story = $.extend({}, KEENTOUR.currentStory, story);
    return story;
}
KEENTOUR.saveStory = function (currentStory, callback) {

    var story = currentStory || KEENTOUR.getStory();
    //TODO  : validation before send to sever
    //TODO : check if I can use facebook authentication here already
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
        }
        else {
            window.location = data.redirect || '/';
        }

    }
};

require(["storage", "search", "geonames", "flickrWidget", "css!storyCSS"], function (storage, search, geonames, flickrWidget) {

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

        $('.storyPhotos').droppable({
            activeClass:"ui-state-highlight",
            drop:function (event, ui) {
                var elem = ui.draggable;
                var photo = $(elem).data('photo');
                $(elem).find('.thumbnail').attr('src', photo.url_m).css({width:photo.width_m, height:photo.height_m});
                $(elem).css({position:'static'});
                var storyItem = $('<div class="storyItem"  contenteditable="false"></div>').data('item', photo).appendTo(this);
//                $(storyItem).append($('<div contenteditable="true" class="storyItemText" />'));
                $(storyItem).append(elem);
//                $(storyItem).append($('<div contenteditable="true" class="storyItemText" />'));

            }
        });

        $('<div><button class="btn btn-primary" data-action="preview">Preview</button> <button class="btn btn-primary" data-action="save">Save</button> <button class="btn btn-primary" data-action="publish">Publish</button> </div>')
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
                            window.location = '/stories/preview/' + data.story.url;
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


        KEENTOUR.flickrSearch();

        var story = {};
        /*
         Load story data ,which can be provided from login or edit flow
         */
        if (!$.isEmptyObject(KEENTOUR.lastStory)) {
            //TODO  : change to notification
            alert("story saved!");
            story = KEENTOUR.currentStory = KEENTOUR.lastStory;

        }

        KEENTOUR.renderStory(story);


    });
});

