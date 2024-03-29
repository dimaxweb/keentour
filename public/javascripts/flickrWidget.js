//TODO  : get config parameters also for dependent modules (twiter_grid,etc..)
require(["jquery", "jQueryUI", "flickrLib", "jquery.paginate", "twitter_grid", "jquery.colorbox-min", "tooltip", "popover", "ajax-scroll", "css!paginationCSS", "css!jQueryUICSS"], function (undefined, undefined, undefined, undefined, twitter_grid, undefined) {
    (function ($) {
            $.widget("custom.flickrFy", {
            options:{
                defaultImageThumb:'t',
                itemsPerRow:4,
                usePaging:false,
                showTitle : true,
                showTooltip : true,
                itemCreated  :function(domItem,dataItem){}

            },


            /********************************Widget methods**********************************************************/////
            _init:function () {
                try {
                    this.element.empty();
                    this.runWidget();
                }
                catch (e) {
                    //TODO  : change to debug
                    if (console && console.log) {
                        console.log(e);
                    }
                }
            },


            runWidget:function () {
                this.currentPage = 0;
                this.initilaising = true;
                this.flickrLib = new FlickrLib(this.options);
                var that = this;
                var $element = this.element;
                var imgLoading = $(this.element).find('#photoLoading').first();
                if (imgLoading.length === 0) {
                    ///put image loading
                    var imgLoading = $('<img src="/images/ajax-loader-big.gif" id="photoLoading" />').appendTo(this.element);
                    $(imgLoading).position({
                            my:"center middle",
                            at:"center-5% middle",
                            of:this.element
                        }
                    );
                }


                var callback = function (result) {

                    if (result && result.flickrResult && result.flickrResult.photos && result.flickrResult.photos.photo && result.flickrResult.photos.photo.length > 0) {
                        $(imgLoading).hide();
                        $element.find('.photoFeed').empty();
                        var data = that.displayData.call(that, result);
                        $($element).removeClass('contTransperensy');
                        that.createPaging(data);
                    }
                    else {

                        $($element).removeClass('contTransperensy');
                        //TODO  : do something nice here also
                        $('<div id="noFlickrPhotos" style="margin-top: 50px;margin-left: 200px">' + 'No photos found' + '</div>').prependTo($element);
                    }

                };


                this.flickrLib.searchPhotos(callback);
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

            // Use the destroy method to clean up any modifications your widget has made to the DOM
            destroy:function () {
                // In jQuery UI 1.8, you must invoke the destroy method from the base widget
                $.Widget.prototype.destroy.call(this);
                // In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
            },
            /*************END WIDGET Functions****************/


            setImageMargin:function (_originalImage, divTitle, divPhoto) {
                var originalWidth = $(_originalImage).width();
                var containerWidth = $('#bigPhoto').width();
                var marginToLeft = (parseInt(containerWidth) - parseInt(originalWidth)) / 2;
                marginToLeft = parseInt(marginToLeft);
                if (marginToLeft > 0) {
                    $(_originalImage).css('margin-left', marginToLeft + 'px');

                }

            },

            createTitle:function (photo) {
                var flickrUrl = "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id;
//                var photoInfo = $('#photoInfo').empty();

//                //SET flickr link
//                var flickrSpan = $("<span><a href='" + flickrUrl + "' target='blank' style='text-decoration:underline'>View on Flickr</a></span>");
//                if (photo.title && $.trim(photo.title).length) {
//                    var divPhoto = $('<span style="width:150px;display:inline-block" id="spTitle"><strong>' + photo.title + '</strong></span>');
//                    $(photoInfo).append(divPhoto);
//                    var spTitle = $(divPhoto).find('#spTitle');
//                    $(flickrSpan).css({ float: 'right' });
//                } //
//
//                ///$(photoInfo).width($('#bigPhoto').width());
//                $(photoInfo).append(flickrSpan);


            },

            /*
             Todo  : look on appropriate way to upload
             */
            preloadImage:function (src, originalImage, photo, imgLoading) {
                var that = this;
                originalImage.hide();
                originalImage.attr('src', src);

                ///create fake image to understand when actual source will be loaded
                $(originalImage).load(function () {
                    that.imagesCache[src] = this;
                    $(imgLoading).hide();
                    //big image
                    if (photo) {
                        that.setImageMargin(this);
                        $(this).css('opacity', 0.5);
                        $(this).fadeTo('slow', 1);

                    } //
                    else {
                        var data = $(this).data('photo');
                        $(this).css({ width:data.width_sq || 75, height:data.height_sq || 75 });
                        $(this).show();
                    }


                });

            },

            getBigImageUrl:function (photo) {
                var photoUrl = photo.url_l || photo.url_m || photo.url_z || photo.url_t || photo.url_s;
                return photoUrl;
            },

            showBigPhoto:function (photo) {

                var urlBig = this.getBigImageUrl(photo);
                var bigHeight = photo.height_m || photo.height_z || photo.height_l || photo.height_t || photo.height_s;
                var bigImage = this.imagesCache[urlBig];
                $('#bigPhoto').empty();
                $('#bigPhoto').css({ 'height':bigHeight, border:1 });

                // image already in cache
                if (bigImage) {
                    $('#bigPhoto').append(bigImage);
                }
                //preload image
                else {
                    bigImage = $("<img id='imgBig' />").appendTo('#bigPhoto');
                    var imgLoading = this.showProgress();
                    $(bigImage).data('photo', photo);
                    this.preloadImage(urlBig, bigImage, photo, imgLoading);
                }
                //DISPLAY photo tittle and link to flickr
                this.createTitle(photo);

                ///display description
//                $('#photoTags').empty();
//                if (photo.tags && photo.tags.length > 0) {
//                    var tags = ($('#photoTags').length == 0) ? $('<div id="photoTags"></div>').appendTo(this.galleryContainer) : $('#photoTags');
//                    var tagsArr = photo.tags.split(' ');
//                    $(tags).append('<div class="tagsTitle">Tags</div>')
//                    var spanTags = $('<div class="flickrTags"></span>').appendTo(tags);
//                    tagsArr = tagsArr.splice(0, 20);
//                    $.each(tagsArr, function (i, item) {
//                        $('<a>' + item + '</a>').appendTo(spanTags);
//                    });
//
//                }

                // $('#photoDesc').empty();
                //            ///display description
                //            if(photo.description && photo.description._content && photo.description._content.length > 0 ){
                //                var descriptionCont = ($('#photoDesc').length == 0)? $('<div id="photoDesc"  style="margin:10px"></div>').appendTo('#photoInfo')  : $('#photoDesc');
                //                $(descriptionCont).append("<div>" + photo.description._content + "</div>");
                //            }

            },

            //TODO : refactor to use templates and behaviours instead
            createPaging:function (data) {
                var that = this;
                var totalPages = (data.photos.total / that.options.perPage) / 100;
                if (this.options.usePaging) {
                    var $paging = $('#photoPaging');
                    $($paging).paginate({
                        count:(totalPages < 100) ? totalPages : 100,
                        start:1,
                        display:15,
                        border_hover_color:'#ccc',
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
                }
                //default behavior innfinite scroll
                else {
                    $(window).paged_scroll({
                        handleScroll:function (page) {
                            that.goToPage(page, that.element);
                            return true;
                        },
                        targetElement:$(this.element),
                        step:'5px',
                        pagesToScroll:totalPages,
                        binderElement:this.element

                    });
                }

            },

            goToPage:function (page, container) {

                try {

                    var that = this;
                    that.currentPage = parseInt(page) + 1;
                    var $element = that.element;
                    //TODO  : implement cache when will have time
                    //if page in cache
                    //                if (that.pagesCache[that.currentPage]) {
                    //                    var data = that.pagesCache[that.currentPage];
                    //                    var result = {};
                    //                    result.status = 'ok';
                    //                    result.flickrResult = data;
                    //                    that.displayData.call(that, result);
                    //                    $(".video_viev").removeClass('contTransperensy');
                    //                }
                    //                else {

                    var callback = function (result) {
                        that.displayData.call(that, result);

                    };

                    that.flickrLib.getPage(that.currentPage, callback);
                    //   }
                }
                catch (e) {
                    //TODO  : log to console
                }

            },

            showProgress:function () {
                var imageLoading = $('#bigPhoto').find('#imgLoading');
                //
                if (!imageLoading || imageLoading.length <= 0) {
                    imageLoading = $("<img id='imgLoading' class='progressLoader' src='/images/ajax-loader-big.gif' />").prependTo('#bigPhoto');
                }
                $(imageLoading).show();
                return imageLoading;
            },

            displayData:function (result) {
                function preloadImages(_photos) {

                    try {
                        //call to download all big images
                        for (var j = 0; j < _photos.length; j++) {
                            var photo = _photos[j];
                            var src = this.getBigImageUrl(photo);
                            var imgFk = $('<img src="' + src + '" style="width:0px height:0px;display:none"  />').appendTo('body');

                        }
                    }
                    catch (e) {
                        //TODO : log here
                    }

                }

                var that = this;
                var data = {};
                var $element = this.element;
                if (that.options.usePaging) {
                    $element.empty();
                }

                if (result.status === 'ok') {
                    $($element).removeClass('contTransperensy');
                    data = result.flickrResult;
                    var _photos = data.photos.photo;
                    twitter_grid.gridify({
                        element:$element,
                        data:_photos,
                        getItemContent:function (dataItem, cell, grid) {
                            if (dataItem) {
                                var itemContainer = $('<div class="itemContainer" data-content="contentItem" />').appendTo(cell);
                                var thumbUrl = 'url_' + that.options.defaultImageThumb;
                                var aItem = $('<a class="photoItem" rel="photoItem"></a>')
                                    .attr('href', that.getBigImageUrl(dataItem))
                                    .attr('title', dataItem.title)
                                    .appendTo(itemContainer);

                                var imgItem = $('<img/>')
                                    .attr('src', dataItem[thumbUrl])
                                    .attr('rel', 'photoFeed')
                                    .attr('class', 'thumbnail')
                                    .appendTo(aItem);


                                $(imgItem).css({ width:dataItem['width_' + that.options.defaultImageThumb], height:dataItem['height_' + that.options.defaultImageThumb] });

                                /*
                                  display title or not
                                */
                                if(that.options.showTitle){
                                    var title = dataItem.title;
                                    $('<div class="widgetItemName pull-left"><a class="flickrPhotoTitle">' + title + '</a></div>').appendTo(itemContainer);
                                }


                                /*
                                 Tooltip
                                 */
                                if(that.options.showTooltip){
                                var description = (dataItem.description && dataItem.description._content) ? '<p>' + dataItem.description._content + '</p>' : '';

                                var tags = (dataItem.tags) ? '<p><h6>Tagged with:</h6>' + dataItem.tags.split(' ').slice(0, 3).join(',') + '</p>' : '';
                                var author = ( dataItem.author && dataItem.author.length > 0 && dataItem.author[0].name && dataItem.author[0].name.$t) ? '<p><b>Published by :</b>' + dataItem.author[0].name.$t + '</p>' : '';
                                var publishedAt = (dataItem.published && dataItem.published.$t) ? '<p><b>Taken on:</b>' + dataItem.published.$t + '</p>' : '';
                                var viewsCount = (dataItem.yt$statistics && dataItem.yt$statistics.viewCount) ? '<p><b>Views </b> :' + dataItem.yt$statistics.viewCount + '</p>' : '';


                                    $(imgItem).popover({
                                        title:dataItem.title,
                                        placement:'top',
                                        content:'<div>' + author + publishedAt + viewsCount + tags + '</div>'

                                    });
                                }


                            }


                            $(itemContainer).data('photo', dataItem);
                            that.options.itemCreated(itemContainer,dataItem);

                        },

                        itemsPerRow:that.options.itemsPerRow
                    });


                    $(".photoItem").colorbox({rel:'photoFeed', transition:"fade", height:"90%"});

                    //** END TO RUN OVER ALL IMAGES
                    return data;
                } //IF data return as expected


            } ////end display data

        });
    }(jQuery));
});

