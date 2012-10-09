require(["jquery", "jQueryUI","flickrLib", "jquery.paginate","css!paginationCSS","css!jQueryUICSS"], function () {
    (function ($) {
        $.widget("custom.flickrFy", {

            /********************************Widget methods**********************************************************/////
            // These options will be used as defaults
            options: {
                clear: null,
                tags: null,
                page: 1,
                perPage: 4

            },

            galleryContainer: null,
            thumbContainer: null,
            bigPhoto: null,
            initialTags: null,

            // Set up the widget
            _create: function () {
                try {
                    this.initialTags = this.options.tags;
                    this.galleryContainer = this.element.find('.video_viev');
                    this.thumbContainer = this.galleryContainer.find('.videolenta');
                    var imageLoading = $("<img id='imgLoading' class='progressLoader' style='margin-left: 200px;margin-top: 200px;' src='/images/ajax-loader-big.gif' />").prependTo(this.galleryContainer);
                    this.runWidget();

                }
                catch (e) {
                    if (console && console.log) {
                        console.log(e);
                    }
                }

            },

            addKeyWord: function (keyWord) {
                this.options.tags = this.initialTags + ',' + keyWord;
                this.runWidget();
            },

            backToInitialState: function () {
                this.options.tags = this.initialTags;
                this.runWidget();
            },

            runWidget: function () {
                this.imagesCache = {};
                this.pagesCache = {};
                this.currentPage = 0;
                this.initilaising = true;
                this.flickrLib = new FlickrLib({ 'tags': this.options.tags, sort: 'relevance' });
                var that = this;
                //var imgLoading = that.showProgress();
                $(this.galleryContainer).addClass('contTransperensy');
                var callback = function (result) {
                    $(that.galleryContainer).find('#imgLoading').remove();
                    if (result && result.flickrResult && result.flickrResult.photos && result.flickrResult.photos.photo && result.flickrResult.photos.photo.length > 0) {
                        $(that.galleryContainer.children()).empty();
                        $(that.galleryContainer).find('#noFlickrPhotos').remove();
                        var data = that.displayData.call(that, result);
                        $(that.galleryContainer).removeClass('contTransperensy');
                        that.createPaging(data);
                    }
                    else {
                        $(that.galleryContainer.children()).empty();
                        $(that.galleryContainer).removeClass('contTransperensy');
                        $('<div id="noFlickrPhotos" style="margin-top: 50px;margin-left: 200px">' + 'No photos found' + '</div>').prependTo(that.galleryContainer);
                    }

                };


                this.flickrLib.searchPhotos(callback);
            },


            // Use the _setOption method to respond to changes to options
            _setOption: function (key, value) {
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
            destroy: function () {
                // In jQuery UI 1.8, you must invoke the destroy method from the base widget
                $.Widget.prototype.destroy.call(this);
                // In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
            },
            /*************END WIDGET Functions****************/


            setImageMargin: function (_originalImage, divTitle, divPhoto) {
                var originalWidth = $(_originalImage).width();
                var containerWidth = $('#bigPhoto').width();
                var marginToLeft = (parseInt(containerWidth) - parseInt(originalWidth)) / 2;
                marginToLeft = parseInt(marginToLeft);
                if (marginToLeft > 0) {
                    $(_originalImage).css('margin-left', marginToLeft + 'px');

                }

            },
            createTitle: function (photo) {
                var flickrUrl = "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id;
                var photoInfo = $('#photoInfo').empty();

                //SET flickr link
                var flickrSpan = $("<span><a href='" + flickrUrl + "' target='blank' style='text-decoration:underline'>View on Flickr</a></span>");
                if (photo.title && $.trim(photo.title).length) {
                    var divPhoto = $('<span style="width:150px;display:inline-block" id="spTitle"><strong>' + photo.title + '</strong></span>');
                    $(photoInfo).append(divPhoto);
                    var spTitle = $(divPhoto).find('#spTitle');
                    $(flickrSpan).css({ float: 'right' });
                } //

                ///$(photoInfo).width($('#bigPhoto').width());
                $(photoInfo).append(flickrSpan);


            },
            preloadImage: function (src, originalImage, photo, imgLoading) {
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
                        $(this).css({ width: data.width_sq || 75, height: data.height_sq || 75 });
                        $(this).show();
                    }


                });

            },
            getBigPhotoUrl: function (photo) {
                var urlBig = photo.url_m || photo.url_z || photo.url_l || photo.url_t || photo.url_s;
                return urlBig;
            },
            showBigPhoto: function (photo) {

                var urlBig = this.getBigPhotoUrl(photo);
                var bigHeight = photo.height_m || photo.height_z || photo.height_l || photo.height_t || photo.height_s;
                var bigImage = this.imagesCache[urlBig];
                $('#bigPhoto').empty();
                $('#bigPhoto').css({ 'height': bigHeight, border: 1 });

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
                $('#photoTags').empty();
                if (photo.tags && photo.tags.length > 0) {
                    var tags = ($('#photoTags').length == 0) ? $('<div id="photoTags"></div>').appendTo(this.galleryContainer) : $('#photoTags');
                    var tagsArr = photo.tags.split(' ');
                    $(tags).append('<div class="tagsTitle">Tags</div>')
                    var spanTags = $('<div class="flickrTags"></span>').appendTo(tags);
                    tagsArr = tagsArr.splice(0, 20);
                    $.each(tagsArr, function (i, item) {
                        $('<a>' + item + '</a>').appendTo(spanTags);
                    });

                }

                // $('#photoDesc').empty();
                //            ///display description
                //            if(photo.description && photo.description._content && photo.description._content.length > 0 ){
                //                var descriptionCont = ($('#photoDesc').length == 0)? $('<div id="photoDesc"  style="margin:10px"></div>').appendTo('#photoInfo')  : $('#photoDesc');
                //                $(descriptionCont).append("<div>" + photo.description._content + "</div>");
                //            }

            },



            createPaging: function (data) {
                var that = this;
                var pagesTotal = (data.photos.total / that.options.perPage) / 100;

                $('#paging').paginate({
                    count: (pagesTotal < 100) ? pagesTotal : 100,
                    start: 1,
                    display: 15,
                    border_hover_color: '#ccc',
                    text_hover_color: '#33506E',
                    background_hover_color: '#fff',
                    background_color: '#fff',
                    text_color: '#33506E',
                    images: false,
                    mouse: 'press',
                    onChange: function (new_page_index, container) {
                        that.goToPage(new_page_index, container)
                    }
                });


            },

            goToPage: function (page, container) {

                try {

                    var that = this;
                    that.currentPage = parseInt(page) + 1;
                    //var imgLoading = that.showProgress();
                    $(this.galleryContainer).addClass('contTransperensy');
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
                        $(that.galleryContainer).removeClass('contTransperensy');
                    };

                    that.flickrLib.getPage(that.currentPage, callback);
                    //   }
                }
                catch (e) {
                    //TODO  : log to console
                }

            },

            showProgress: function () {
                var imageLoading = $('#bigPhoto').find('#imgLoading');
                //
                if (!imageLoading || imageLoading.length <= 0) {
                    imageLoading = $("<img id='imgLoading' class='progressLoader' style='margin-top: 50px;margin-left: 200px' src='/images/ajax-loader-big.gif' />").prependTo('#bigPhoto');
                }
                $(imageLoading).show();
                return imageLoading;
            },

            displayData: function (result) {
                function preloadImages(_photos) {

                    try {
                        //call to download all big images
                        for (var j = 0; j < _photos.length; j++) {
                            var photo = _photos[j];
                            var src = this.getBigPhotoUrl(photo);
                            var imgFk = $('<img src="' + src + '" style="width:0px height:0px;display:none"  />').appendTo('body');

                        }
                    }
                    catch (e) {
                        //TODO : log here
                    }

                }

                var that = this;
                var data = {};
                if (result.status == 'ok') {
                    data = result.flickrResult;
                    var _photos = data.photos.photo;

                    var photosToDisplay = $(_photos).slice(0, that.options.perPage);
                    /////remove previous items from div
                    $(that.thumbContainer).empty();

                    //** RUN over all photos and create thumbnails**//
                    $.each(photosToDisplay, function (i, item) {
                        var imgItem = that.thumbContainer.append("<li>");
                        var src = item.url_sq;

                        //** CREATE ORIGINAL IMAGE **//
                        var originalImage = $("<img/>").attr("src", 'ajax-loader.gif').addClass('image_thumb').bind('click',
                        function (e) {
                            that.thumbContainer.find('.selectedThumb').removeClass('selectedThumb');
                            $(this).addClass('selectedThumb');
                            var photo = $(this).data('photo');
                            that.showBigPhoto(photo);
                        })
                        .data('photo', item)
                        .appendTo(imgItem);
                        //preload image
                        that.preloadImage(src, originalImage);
                        //set first item as selected
                        if (i == 0) {
                            $(originalImage).addClass('selectedThumb');
                        }
                    });

                    //show big photo of first image
                    that.showBigPhoto(_photos[0]);

                    //preload images  i nnext 2000 seconds
                    setTimeout(function () { preloadImages.call(that, _photos); }, 2000);

                    //pages cache
                    //                var pageNumber = 0;
                    //                var pageStart  = that.currentPage;
                    //                var pageData = [];
                    //                ///move pages to cache
                    //                for(var i=0;i<=_photos.length;i++)
                    //                {
                    //
                    //                    pageData[pageData.length]  = _photos[i];
                    //                    pageNumber = pageNumber  + 1;
                    //                    if(i!=0 && ((i+1) % this.options.perPage)==0  || i==_photos.length )
                    //                    {
                    //                        this.pagesCache[pageStart] = pageData;
                    //                        pageData  = [];
                    //                        pageNumber  = 0;
                    //                        pageStart = pageStart  + 1;
                    //
                    //                    }
                    //
                    //
                    //                }

                    //** END TO RUN OVER ALL IMAGES
                    return data;
                } //IF data return as expected


            } ////end display data

        });
    } (jQuery));
});

