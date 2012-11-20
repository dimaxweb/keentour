require(["jquery","twitter_grid","jQueryUI","youTubeLib","jquery.paginate","jquery.colorbox-min","swfObject","css!paginationCSS","css!jQueryUICSS"], function($,twitter_grid) {
    (function ($) {
        $.widget("custom.youTubeFy", {

            /********************************Widget methods**********************************************************/////
            // These options will be used as defaults
            options:{
                clear:null,
                tags:null,
                page:1,
                'max-results':20,
                query:'London travel'
            },

            videosContainer:null,
            initialQuery:null,

            // Set up the widget
            _create:function () {
                try {
                    this.initialQuery = this.options.query;
                    this.runWidget();
                }
                catch (e) {
                    if (console && console.log) {
                        console.log(e);
                    }
                }

            },

            addKeyWord:function (keyWord) {
                this.options.query = this.initialQuery + ' ' + keyWord;
                this.runWidget();
            },

            backToInitialState:function () {
                this.options.tags = this.initialQuery;
                this.runWidget();
            },

            // Use the _setOption method to respond to changes to options
            _setOption:function (key, value) {
                switch (key) {
                    case "clear":
                        // handle changes to clear option
                        break;
                }

                // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
                $.Widget.prototype._setOption.apply(this, arguments);
                // In jQuery UI 1.9 and above, you use the _super method instead
                //this._super( "_setOption", key, value );
            },


            runWidget:function () {
                $('#videos').empty();
                this.imagesCache = {};
                this.initilaising = true;
                this.youTubeLib = new YouTubeLib(this.options);
                var that = this;
                that.videosContainer = this.element.find('#videos');

                var callback = function (result) {
                    $(that.videosContainer).find('#noVideosFound').remove();
                    if (result && result.videoResult && result.videoResult.feed && result.videoResult.feed.entry && result.videoResult.feed.entry.length > 0) {
                        var data = that.displayData.call(that, result);
                        that.createPaging(data);
                    }
                    else {
                        $(that.videosContainer.children()).empty();
                        var noVideosFound = $('<div id="#noVideosFound" style="margin-top: 50px;margin-left: 200px">' + 'No videos found' + '</div>').prependTo(that.videosContainer);
                    }
                };

                this.findCreatePlayerFrame();
                this.youTubeLib.searchVideos(callback);
            },

            // Use the destroy method to clean up any modifications your widget has made to the DOM
            destroy:function () {
                // In jQuery UI 1.8, you must invoke the destroy method from the base widget
                $.Widget.prototype.destroy.call(this);
                // In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
            },
            /*************END WIDGET Functions****************/
            preloadVideoThumb:function (thumb, originalImage, imgLoading, callback) {
                var that = this;
                var src = thumb.url
                originalImage.hide();
                originalImage.attr('src', src);
                originalImage.css({width:thumb.width, height:thumb.height});
                ///create fake image to understand when actual source will be loaded
                $(originalImage).load(function () {
                    that.imagesCache[src] = this;
                    $(imgLoading).hide();
                    $(this).fadeIn('slow');
                    callback();

                });

            },
            playVideo:function (video) {
                this.showVideo(video.media$group.yt$videoid.$t);
            },

            showVideo:function (videoID) {
                swfobject.switchOffAutoHideShow();
                $('#playerFrame').empty();
                $('#playerFrame').append('<div id="playerArea"></div>');
                this.emmbedPlayer((videoID));


            },
            emmbedPlayer:function (videoID) {
                var params = { allowScriptAccess:"always" };
                // The element id of the Flash embed
                var atts = { id:"myPlayer" };
                var swfUrl = "http://www.youtube.com/v/" + videoID;
                // All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
                swfobject.embedSWF(swfUrl + "?version=3&enablejsapi=1&playerapiid=player1&autoplay=1&color=#96B512", "playerArea", "840", "500", "8", null, null, params, atts);
            },

            findCreatePlayerFrame:function () {
                var playerFrame = $('#playerFrame');
                return (playerFrame.length == 0) ? $('<div id="playerFrame"><div id="playerArea"></div></div>').appendTo('body') : playerFrame;
            },


            createPaging:function (data) {
                var that = this;
                var totalPages = data.feed.openSearch$totalResults.$t / this.options['max-results'];
                var $paging = this.element.find('#videoPaging');
               $($paging).paginate({
                    count:(totalPages < 100) ? totalPages : 100,
                    start:1,
                    display:15,
                    border:true,
                    text_hover_color:'#33506E',
                    background_hover_color:'#fff',
                    background_color:'#fff',
                    text_color:'#33506E',
                    images:false,
                    mouse:'press',
                    onChange:function (new_page_index, container) {
                        that.goToPage(new_page_index, container)
                    }
                });


            },

            goToPage:function (page, container) {

                try {

                    var that = this;
                    var $videos = $(this.element).find('#videos');
                    $($videos).addClass('contTransperensy');
                    var callback = function (result) {
                        that.displayData.call(that, result)
                    };


                    that.youTubeLib.getPage(page, callback);
                }
                catch (e) {

                }

            },
            displayData:function (result) {

                var that = this;
                var data = {};
                if (result.status == 'ok') {
                    data = result.videoResult;
                    var entries = data.feed.entry;
                    var mainVideos = that.videosContainer;
                    //** RUN OVER all photos and create thumbnails**//
                    that.findCreatePlayerFrame();
                    if(entries){
                        var $videos = $(this.element).find('#videos');
                        $($videos).removeClass('contTransperensy');
                        $($videos).empty();
                        twitter_grid.gridify({
                            element: $(mainVideos),
                            data:entries,
                            itemsPerRow: 4,
                            getItemContent:function(dataItem,gridCell,grid){
                                var item = dataItem;
                                var url = item.media$group.media$thumbnail[0].url;
                                var title = item.title.$t.toLowerCase();
                                title = title.length > 30 ? title.substr(0,27) + '...' : title;
                                var itemBox = $('<a style="cursor: pointer;"><img class="thumbnail video-thumb" src="' + url + '" /></a><h6 class="align-left">' + title + '</h6>');
                                $(gridCell).append(itemBox);
                                var divPlay = $(gridCell).find('a').first();
                                $(divPlay).colorbox({inline:true, width:"885px", height:"600px", href:'#playerFrame', title:item.title.$t, onClosed:function () {

                                    $('#playerFrame').empty();

                                }});

                                $(divPlay).bind('click',
                                    function (e) {
                                        var video = $(this).data('video');
                                        that.showVideo(video.media$group.yt$videoid.$t);
                                    })
                                    .data('video', item);

                            }
                        });
                    }

//                    if (entries) {
//                        $.each(entries, function (i, item) {
//                            var mainLi = $('<li class="feed-item-container">').appendTo(listContainer);
//                            var videoItem = $("<div class='feed-item'></span>").appendTo(mainLi);
//                            var videoItemDiv = $(' <div class="feed-item-content">').appendTo(videoItem);
//                            var feedItemTitle = $('<h3 class="feed-item-title"><span class="feed-item-author"><span class="clip"> <span class="clip-inner"><span class="vertical-align"></span> </span> </span> </span><span class="feed-item-owner">' + item.title.$t + '</span></h3>').appendTo(videoItemDiv);
//                            if (item.yt$statistics && item.yt$statistics.viewCount) {
//                                $(feedItemTitle).append('<span class="view-count">' + item.yt$statistics.viewCount + ' views </span>');
//                            }
//
//                            var itemVisual = $('<div class="feed-item-visual">').appendTo(videoItemDiv);
//                            var itemImageBox = $('<div class="feed-item-visual-thumb">').appendTo(itemVisual);
//                            var itemContentBox = $('<div class="feed-item-visual-content">').appendTo(itemVisual);
//
//                            $(itemImageBox).append('<a class="ux-thumb-wrap contains-addto yt-uix-sessionlink"> <span class="video-thumb ux-thumb ux-thumb-288 "> <span class="clip"> <span class="clip-inner"> <img id="imgVideoThumb" ><span class="vertical-align"></span> </span></span> </span> <span class="video-time">' + that.youTubeLib.getVideoTime(item) + '</span> </a>');
//                            //bind the image
//                            var originalImage = $(itemImageBox).find('#imgVideoThumb').first();
//
//                            $(originalImage).colorbox({inline:true, width:"885px", height:"600px", href:'#playerFrame', title:item.title.$t, onClosed:function () {
//
//                                $('#playerFrame').empty();
//
//                            }});
//                            var thumb = item.media$group.media$thumbnail[0];
//                            $(originalImage).bind('click',
//                                function (e) {
//
//                                    var video = $(this).data('video');
//                                    that.playVideo(video);
//                                })
//                                .data('video', item)
//                                .css({width:thumb.width, height:thumb.height, cursor:'pointer'})
//                                .attr('src', thumb.url);
//
//                            var itemDescriptionBox = $(' <div class="feed-item-visual-content">').appendTo(itemContentBox);
//                            var description  = item.media$group.media$description.$t.length > 150  ?  item.media$group.media$description.$t.substring(0,250) + '...' : item.media$group.media$description.$t;
//                            $(itemContentBox).append('<div class="feed-item-visual-description"><div class="description"> <p>' + description + '</p> </div> </div>');
//
//
//                        });
//                    }


                    //** END TO RUN OVER ALL IMAGES
                    return data;
                }//IF data return as expected


            }////end display data


        });
    }(jQuery) );

});


