require(["jquery","storiesList","jQueryUI","inheritance","flickrWidget","wikiPediaWidget","youtubeWidget"], function($,storiesList) {

    var contentWidget =  {
        getWidgetKey  : function() {
        var selectedTab = $('.tabs').find('.selected').first().attr('rel');
        var key =  $.trim(selectedTab).toLowerCase();
        if(!key ||  (key && key.length === 0)){
            /*
                start from videos if no one found
            */
            key = 'stories';
        }
        return key;
    },

    getCurrentWidget : function(){
        var widgetKey= contentWidget.getWidgetKey();
        var widget = contentWidgets[widgetKey];
        return widget;
    },

    displayCurrentWidget : function(options) {

        var widget = contentWidget.getCurrentWidget();

        var widgetKey  = contentWidget.getWidgetKey();
        if (widget) {
            //hide previously displayed
            var previousWidget = contentWidgets[contentWidget.previousWidgetKey];
            if (previousWidget) {
                previousWidget.hide();
            }
            ///display the widget or just unhidden the div
            if (widget.wasDisplayed) {
                widget.show();
                widget.displayContent();

            }
            else {
                $('#widgetsDisplay').append(widget.container);
                widget.displayContent();
                widget.wasDisplayed = true;
            }


            contentWidget.previousWidgetKey = widgetKey;
            //trigger widget change
            $(contentWidget).triggerHandler('widgetChanged',{widgetName:widgetKey});

        }
    }

    }

    contentWidget.parts = [];

    /*
        base for all widgets
    */
    var widgetBase = Class.extend(
        {
            container: '<div></div>',
            show: function () { $(this.container).show()},
            hide: function () { $(this.container).hide()},
            instance:null,
            wasDisplayed: false
        }
    );

    /*
        Flickr Widget
    */
    var flickrWidget = widgetBase.extend(
        {
            displayContent:function(options) {
                $(this.container).flickrFy({ text:window.contentData.flickrText,defaultImageThumb:'s',itemsPerRow:4});
                this.instance  =   $(this.container).data('flickrFy');

            },
            getIcon: function () {
                return "/images/photokamera.png";
            }

        });

    flickrWidget.prototype.container = $("<div id='divContent'><div class='photoFeed'></div><div class='paging' id='photoPaging'></div></div>");

    contentWidget.parts[contentWidget.parts.length] = flickrWidget;

    /*Wiki  Widget*/
    var wikiWidget = widgetBase.extend(
        {
            displayContent: function () {
                $(this.container).wikiFy({ imageLoading: '/images/ajax-loader-big.gif', page: window.contentData.wikiPage });
                this.instance  =   $(this.container).data('wikiFy');
            },
            getIcon: function () {
                return "/images/wikipedia.png";
            }
        });

    wikiWidget.prototype.container = $("<div id='wikiMain' ><div id='divBreadCrumb'></div><div class ='articles'></div></div>");
    contentWidget.parts[ contentWidget.parts.length] = wikiWidget;


    var youtubeWidget = widgetBase.extend(
        {
            displayContent:function () {
                $(this.container).youTubeFy({ query:window.contentData.youTubeQuery})
                this.instance  =   $(this.container).data('youTubeFy');
            },
            getIcon: function () {
                return "/images/kamera.png";
            }
        });


    youtubeWidget.prototype.container = $("<div id='youTubeMain'><div id='videos'></div><div id='videoPaging' class='paging'></div></div>");



    /*
     stories widget
     */
    var storiesWidget = widgetBase.extend(
        {
            displayContent:function () {
                this.storiesList.searchStories($(this.container),{isPublished: true,rowsToSkip:0,geoItemId:window.contentData.geoItem.geonameId,tags:window.contentData.tags});
                this.instance  =  storiesList;
            },
            getIcon: function () {
                return "/images/idea.jpg";
            }
        });

    storiesWidget.prototype.storiesList = storiesList;
    storiesWidget.prototype.container = $("<div id='divContent'></div>");
    contentWidget.parts[contentWidget.parts.length] = storiesWidget;



    var contentWidgets = { 'article': new wikiWidget(), 'photos': new flickrWidget(), 'videos': new youtubeWidget(),'stories'  : new storiesWidget()};
     /*
        widget generation function
     */
    (function ($) {
        $.widget("custom.contentify", {


            options:{


            },
            _create : function(){
               var $tabs  =  $('<div class="tabs"><span class="widgetTitle selected" rel="stories"><a rel="stories"><img style="width:80px;" src="/images/idea.jpg"></a><a class="tabTitle" rel="stories">Things To Do</a></span><span class="widgetTitle" rel="videos"><a rel="videos"><img src="/images/kamera.png"></a><a class="tabTitle" rel="videos">Videos</a></span><span class="widgetTitle" rel="photos"><a rel="photos"><img src="/images/photokamera.png"></a><a class="tabTitle" rel="photos">Photos</a></span><span class="widgetTitle" rel="article"><a rel="article"><img src="/images/wikipedia.png"></a><a class="tabTitle" rel="article">Wikipedia</a></span></div><div id="widgetsDisplay"></div>')
                            .appendTo(this.element);

                var widgetTabs = $($tabs).find('.widgetTitle');
                $(widgetTabs).on('click', function (e) {
                    e.preventDefault();
                    $(widgetTabs).removeClass('selected');
                    $(this).addClass('selected');
                    contentWidget.displayCurrentWidget();

                });


            },


            _init:function () {
                try {
                    contentWidget.displayCurrentWidget();
                }
                catch (e) {
                    if (console && console.error) {
                        console.error("Error occurred when calling content widget ",e);
                    }
                }
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
            }
            /*************END WIDGET Functions****************/





        });
    }(jQuery));
});

