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
                $(this.container).flickrFy({ tags:window.contentData.flickrTags});
                this.instance  =   $(this.container).data('flickrFy');

            },
            getIcon: function () {
                return "/images/photokamera.png";
            }

        });

    flickrWidget.prototype.container = $("<div id='divContent'><div class='video_viev'><div id='paging'></div><div id='photoInfo' style='margin-top:10px;margin-bottom:10px'></div><ul class='videolenta'></ul><span id='bigPhoto' style='width:500px;display:inline-block'></span></div></div>");
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

    wikiWidget.prototype.container = $("<div id='wikiMain'><div id='divBreadCrumb'></div><div class ='articles' style='padding:10px;margin-bottom: 50px;'></div></div>");
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


    youtubeWidget.prototype.container = $("<div id='youTubeMain'><div id='videoPaging'></div><div id='videos' style='width:100%;padding:10px;margin-bottom: 50px;'></div></div>");
    var contentWidgets = { 'article': new wikiWidget(), 'photos': new flickrWidget(), 'videos': new youtubeWidget() };


    contentWidget.getWidgetKey = function() {
        var selectedTab = $('.tabs1_link').find('.selekted');
        return $.trim($(selectedTab).text()).toLowerCase();
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
            window.contentData.flickrTags = 'Austria,travel';
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
            ///display the widget or just unhide the div
            if (widget.wasDisplayed) {
                widget.show();

            }
            else {
                $('#widgetsDisplay').append(widget.container);
                widget.displayContent();
                widget.wasDisplayed = true;
            }
            contentWidget.previousWidgetKey = widgetKey;
            $('#widgetIcon').attr('src', widget.getIcon());

            //trigger widget change
            $(contentWidget).triggerHandler('widgetChanged',{widgetName:widgetKey});

        } ///
    }

    $(document).ready(function (e) {
        $('.tabs1_link li').bind('click', function (e) {
            e.preventDefault();
            //remove selected class
            $('.tabs1_link li').removeClass('selekted');
            $(this).addClass('selekted');
            contentWidget.displayCurrentWidget();


        });


    });

    return contentWidget;


});
