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
        storyCSS : '/stylesheets/story',
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
            deps:["jquery"]
        }

    }

});


function flickrSearch(e) {
    e.preventDefault();
    /*
        instansiate flickr widget
     */
    $('.photos').flickrFy({
        text:$('#searchText').val(),
        perPage:18,
        sort:'relevance',
        defaultImageThumb  :'sq',
        itemsPerRow  : 6,
        usePaging : true
    });
}

//TODO : think about creating in define or checking findNested dependencies in app.build.js
//TODO  : refactor move logic to some model
require(["storage", "search", "geonames", "flickrWidget","css!storyCSS"], function (storage, search, geonames, flickrWidget) {
    $(document).ready(function (e) {
        $('#searchText').keypress(function (e) {
            if (e.which == 13) {
                flickrSearch(e);
            }
        });

        $('.storyPhotos').droppable({
            activeClass: "ui-state-highlight",
            drop:function (event, ui) {
                var elem = ui.draggable;
                var photo  = $(elem).data('photo');
                $(elem).find('.thumbnail').attr('src',photo.url_s).css({width:photo.width_s,height:photo.height_s});
                $(elem).css({position:'static'} );
                var storyItem = $('<div class="storyItem"  contenteditable="false"></div>').data('item',photo).appendTo(this);
                $(storyItem).append($('<div contenteditable="true" class="storyItemText" />'));
                $(storyItem).append(elem);
                $(storyItem).append($('<div contenteditable="true" class="storyItemText" />'));

            }
        });

         $('<div><button class="btn btn-primary" data-action="preview">Preview</button> <button class="btn btn-primary" data-action="save">Save</button> <button class="btn btn-primary" data-action="publish">Publish</button> </div>')
            .appendTo('.actionPanel')
            .on('click', '.btn', function () {
                var action  = $(this).data('action');
                if(action === "save"){
                    var story  =  {
                        title : $('#txtTitle').val(),
                        description : $('#txtDescription').val(),
                        items  : []
                    };

                    $('.storyItem','.storyPhotos').each(function(i,item){
                       var data = $(item).data('item');
                       story.items.push(data);

                    });

                    //TODO  : validation before send to sever
                    //TODO : check if I can use facebook authentication here already
                    var request = $.ajax('/story/save',{
                       headers:
                       {
                           'Content-type' : 'application/json'
                       },
                       data : JSON.stringify(story),
                       type : 'POST',
                       dataType : 'json'

                    });

                    request.success(function(data){
                        if(data){
                            if(data.result){
                                console.log("Saved");
                            }
                            else{
                                window.location = data.redirect || '/';
                            }

                        }

                    });

                    request.error(function(data){
                        //TODO : change to notif or some other popular library
                        console.log("Error"+ data);
                    });
                }
            });



    });
});

