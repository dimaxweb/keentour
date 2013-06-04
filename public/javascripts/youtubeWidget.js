require(["jquery","twitter_grid","jQueryUI","youTubeLib","jquery.paginate","jquery.colorbox-min","swfObject","css!paginationCSS","css!jQueryUICSS",'ajax-scroll'], function($,twitter_grid) {
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
//                $('#videos').empty();
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
                $(window).paged_scroll({
                   handleScroll:function (page) {
                        that.goToPage(page,that.element);
                        return true;
                    },
                    targetElement : $(this.element),
                    step:'20%',
                    pagesToScroll : totalPages

                });
            },

            goToPage:function (page, container) {

                try {

                    var that = this;
                    var $videos = $(this.element).find('#videos');

                    var callback = function (result) {
                        that.displayData.call(that, result)
                    };

                    that.youTubeLib.getPage(page, callback);
                }
                catch (e) {
                   //TODO : log here
                }

            },
            displayData:function (result) {

                var that = this;
                var data = {};
                //TODO  : may be remove or change to bool at least
                if (result.status === 'ok') {
                    data = result.videoResult;
                    var entries = data.feed.entry;
                    var mainVideos = that.videosContainer;
                    //** RUN OVER all photos and create thumbnails**//
                    that.findCreatePlayerFrame();
                    if(entries){
                        var $videos = $(this.element).find('#videos');
                        twitter_grid.gridify({
                            element: $(mainVideos),
                            data:entries,
                            itemsPerRow: 4,
                            getItemContent:function(dataItem,gridCell,grid){
                                var item = dataItem;
                                var url = item.media$group.media$thumbnail[0].url;
                                var title = item.title.$t.toLowerCase();
                                var videoTime = YouTubeLib.getVideoTime(dataItem);
                                var itemBox = $('<div class="video-block"><a class="video-link"><img  src="' + url + '" class="thumbnail video-thumb" /><span class="video-time">'
                                    +  videoTime
                                    +  '</span></a>'
                                    +  '<div class="widgetItemName"><a>' + title + '</a></div>');

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

                                var description  =  (dataItem.media$group && dataItem.media$group.media$description && dataItem.media$group.media$description.$t) ? '<p><h7>About:</h7>'  + dataItem.media$group.media$description.$t + '</p>' : '';
                                if(description.length > 1000){
                                    description = description.substring(0,500) +'...';
                                }
                                var author  = ( dataItem.author &&  dataItem.author.length  >0 && dataItem.author[0].name && dataItem.author[0].name.$t) ? '<p><span>Published by :<span>'  + dataItem.author[0].name.$t + '</p>': '';
                                var publishedAt  = (dataItem.published &&  dataItem.published.$tt) ? '<p><span>Taken on:<span>'  +dataItem.published.$t + '</p>': '';
                                var viewsCount  = (dataItem.yt$statistics && dataItem.yt$statistics.viewCount) ? '<p>views count :'  + dataItem.yt$statistics.viewCount + '</p>'  : '';

                                $(divPlay).popover({
                                    title:title,
                                    placement:'top',
                                    content: '<div>' +  author  + viewsCount + '</div>'

                                });

                            }


                        });
                    }

                    //** END TO RUN OVER ALL IMAGES
                    return data;
                }//IF data return as expected


            }////end display data


        });
    }(jQuery) );

});


