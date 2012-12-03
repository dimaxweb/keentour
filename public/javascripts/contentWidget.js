define('contentWidget',["jquery","inheritance","flickrWidget","wikiPediaWidget","youtubeWidget"], function($) {
    var contentWidget =  {};
    contentWidget.parts = [];

//base for all widgets
    var widgetBase = Class.extend(
        {
            container: '<div></div>',
            show: function () { $(this.container).show()},
            hide: function () { $(this.container).hide()},
            instance:null,
            wasDisplayed: false
        }
    );

    /*Flickr Widget*/
    var flickrWidget = widgetBase.extend(
        {
            displayContent:function () {
                $(this.container).flickrFy({ text:window.contentData.flickrText});
                this.instance  =   $(this.container).data('flickrFy');

            },
            getIcon: function () {
                return "/images/photokamera.png";
            }

        });

    flickrWidget.prototype.container = $("<div id='divContent'  class='widgetInternal'><div class='photoFeed'></div><div class='paging' id='photoPaging'></div></div>");

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

    wikiWidget.prototype.container = $("<div id='wikiMain' class='widgetInternal'><div id='divBreadCrumb'></div><div class ='articles'></div></div>");
    contentWidget.parts[ contentWidget.parts.length] = wikiWidget;

//youtube widget
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


    youtubeWidget.prototype.container = $("<div id='youTubeMain'  class='widgetInternal'><div id='videos'></div><div id='videoPaging' class='paging'></div></div>");
    var contentWidgets = { 'article': new wikiWidget(), 'photos': new flickrWidget(), 'videos': new youtubeWidget() };


    contentWidget.getWidgetKey = function() {
        var selectedTab = $('.tabs').find('.selected').first().attr('rel');
        var key =  $.trim(selectedTab).toLowerCase();
        if(!key ||  (key && key.length === 0)){
            ///start from videos if no one found
            key = 'videos';
        }
        return key;
    }

    contentWidget.getCurrentWidget=function(){
        var widgetKey= contentWidget.getWidgetKey();
        var widget = contentWidgets[widgetKey];
        return widget;
    }

    contentWidget.displayCurrentWidget = function() {
        ///load defaults
        if (!window.contentData) {
            //default data
            window.contentData = {};
            window.contentData.wikiPage = 'Austria';
            window.contentData.flickrText = 'Austria travel';
            window.contentData.youTubeQuery = 'Austria,travel';
        }
        var widget = this.getCurrentWidget();
        var widgetKey  = this.getWidgetKey();
        if (widget) {
            //hide previously displayed
            var previousWidget = contentWidgets[contentWidget.previousWidgetKey];
            if (previousWidget) {
                previousWidget.hide();
            }
            ///display the widget or just unhidden the div
            if (widget.wasDisplayed) {
                widget.show();

            }
            else {
                $('#widgetsDisplay').append(widget.container);
                widget.displayContent();
                widget.wasDisplayed = true;
            }
            contentWidget.previousWidgetKey = widgetKey;
            //trigger widget change
            $(contentWidget).triggerHandler('widgetChanged',{widgetName:widgetKey});

        } ///
    }

    $(document).ready(function (e) {

        var widgetTabs = $('.tabs').find('.widgetTitle');
        $(widgetTabs).on('click', function (e) {
            e.preventDefault();
            $(widgetTabs).removeClass('selected');
            $(this).addClass('selected');
            contentWidget.displayCurrentWidget();
        });


    });

    return contentWidget;


});


