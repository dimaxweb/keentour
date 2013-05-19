/**
 * Created by IntelliJ IDEA.
 * User: Dmitry
 * Date: Dec 4, 2011
 * Time: 8:10:34 AM
 * To change this template use File | Settings | File Templates.
 */

require(["jquery","jQueryUI","css!wikiCSS","css!jQueryUICSS"], function() {
    $(function () {
       // the widget definition, where "custom" is the namespace,
        $.widget("custom.wikiFy", {

            // default options
            options: {
                imageLoading: 'image/ajax-loader-big.gif',
                wikApiUrl: 'http://en.wikipedia.org/w/api.php?callback=?',
                wikiApiParams: {
                    action: 'parse',
                    prop: 'text',
                    format: 'json'
                },
                wikiUrl: 'http://en.wikipedia.org',
                page: 'London'

            },

            breadCrumb: [],

            wikiCache: {},

            _isImageLink: function (href) {
                return href.indexOf('.png') != -1 || href.indexOf('.svg') != -1 || href.indexOf('.jpg') != -1 || href.indexOf('File:') != -1;
            },

            _isSoundFile: function (href) {
                return href.indexOf('.ogg') != -1;
            },

            _wantToBind: function (linkUrl) {
                var wantToBindThisLink = linkUrl.indexOf('.php') == -1 && linkUrl.indexOf('http:') == -1 && linkUrl.indexOf('#') == -1;
                return wantToBindThisLink;
            },

            _addToBreadCrumb: function (newItem) {
                var exists = false;

                for (var i = 0; i < this.breadCrumb.length; i++) {
                    var item = this.breadCrumb[i];
                    if (item.text === newItem.text) {
                        exists = true
                    }
                }
                if (!exists) {
                    this.breadCrumb[this.breadCrumb.length] = newItem;
                }

            },

            _bindModalPopup: function (linkItem) {
                $(linkItem).colorbox({ iframe: true, width: "95%", height: "95%" });
            },

            _createBreadCrumb: function (query, linkText) {
                var bItem = { link: query, text: linkText, index: this.breadCrumb.length };
                this._addToBreadCrumb(bItem);
                var divBreadCrumb = this.element.find('#divBreadCrumb').first();
                ///
                $(divBreadCrumb).html('');
//                var spanTitle = $("<span class='breadTitle'>Your are here : </span>");
//                $(divBreadCrumb).prepend(spanTitle);
                var that = this;
                //draw bread crumb
                $.each(this.breadCrumb, function (i, item) {
                    var bLink = $("<a style='color:#33506E;font-size:16px;font-weight:bold'></a>");
                    $(bLink).attr('href', item.link);
                    $(bLink).text(item.text);
                    $(bLink).bind('click', function (e) {
                        that.breadCrumb.splice(-that.breadCrumb.length + item.index);
                        //TODO : take from cache
                        that._processWikiPage(item.link, item.text);
                        e.preventDefault();


                    });

                    $(bLink).appendTo($(divBreadCrumb));
                    if (i < that.breadCrumb.length - 1) {
                        $("<span class='breadSeparator'> >> </span>").appendTo($(divBreadCrumb));
                    }

                });



            },

            _search :function(query,callback){
                var searchUrl =   'http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + query + '+&srprop=timestamp&rvprop=content&format=json';
                var request = $.ajax({
                    url:searchUrl,
                    dataType:"jsonp"

                });

                request.success(function (data) {
                    callback(data);


                });

                request.error(function (data) {
                    console.log('error is here');
                });

            },

           _processWikiPage: function (query, linkText) {
                //empty container and add the loading image
                this.wikiContainer.html("<img id='imgWikiLoading' src='" + this.options.imageLoading + "'/>");
                //get reference
                var that = this;
                var url = that.options.wikApiUrl + '&page=' + query;
                if (that.wikiCache[url]) {
                    that._handleWikiResult.call(that, that.wikiCache[url]);
                }
                else {
                    $.getJSON(url, that.options.wikiApiParams, function (data) {
                        if(data.error){
                           that._search(query,function(data){
                                if(data && data.query && data.query.search && data.query.search.length > 0 ){
                                    that.wikiContainer.append('<div style="color:#33506E;font-size:16px;font-weight:bold;margin-bottom:8px">Multiple results returned from Wikipedia.Please use the appropriate one:</div>');
                                    $.each(data.query.search ,function(i,item){
                                        var articleUrl =  item.title.replace(' ','_');
                                        var divOptionLink = $('<div><a class="wikiOption">'  + item.title  + '</a></div>').appendTo(that.wikiContainer);
                                        $(divOptionLink).find('a').bind('click',function(){
                                           that._processWikiPage(articleUrl,item.title);
                                        });
                                    });


                                }////
                               else{
                                    that.wikiContainer.append('<div style="color:#33506E;font-size:16px;font-weight:bold;margin-bottom:8px">No data found</div>');
                                }

                            });
                            that.wikiContainer.find('#imgWikiLoading').hide();
                            return;

                        }
                        else{
                            that._handleWikiResult.call(that, data);
                            that.wikiCache[url] = data;
                            that._createBreadCrumb.call(that, query, linkText);
                        }

                    });

                }


            },

            _handleWikiResult: function (data) {
                if (data && data.parse) {
                    var that = this;
                    var html = data.parse.text['*'];
                    //insert results to DOM
                    this.wikiContainer.html(html);
                    ///get the links inside wiki article
                    var items = $(that.wikiContainer).find('a');
                    //iterate over all links and bind appropriate event handlers
                    $.each(items, function (i, item) {
                        var linkUrl = $(item).attr('href');
                        var linText = $(item).text();
                        if (that._isImageLink(linkUrl)) {
                            that._bindModalPopup(item);
                            $(item).attr('href', that.options.wikiUrl + linkUrl);
                            return;
                        }
                        if (that._isSoundFile(linkUrl)) {
                            return;
                        }
                        if (that._wantToBind(linkUrl)) {
                            $(item).bind('click', function (e) {
                                try {

                                    var arrParts = linkUrl.split('/');
                                    linkUrl = arrParts[arrParts.length - 1];
                                    that._processWikiPage(linkUrl, $(item).text());
                                    e.preventDefault();
                                }
                                catch (ex) {
                                    e.preventDefault();
                                    //console.log(ex);

                                }
                            });


                            return;

                        } ///if we want to bind link to make ajax calls

                        //if not fully qualified already and not hash link
                        if (linkUrl.indexOf('http:') == -1 && linkUrl.indexOf('#') == -1) {
                            $(item).attr('href', that.options.wikiUrl + linkUrl);
                        } //


                    });


                }
                else {
                    this.element.html('<div style="margin-top: 50px;margin-left: 200px">' + 'No article found in Wikipedia'  + '</div>');
                }


            },
            // the constructor
            _create: function () {
                this.wikiContainer = this.element.find('.articles');
                this._processWikiPage(this.options.page, this.options.page);
            },

            // called when created, and later when changing options
            _refresh: function () {
                this._trigger("change");
            },

            // revert other modifications here
            _destroy: function () {

            },

            // _setOptions is called with a hash of all options that are changing
            // always refresh when changing options
            _setOptions: function () {
                //				// in 1.9 would use _superApply
                $.Widget.prototype._setOptions.apply(this, arguments);
                this._refresh();
            },

            // _setOption is called for each individual option that is changing
            _setOption: function (key, value) {
                // in 1.9 would use _super
                $.Widget.prototype._setOption.call(this, key, value);
            },

            addKeyWord:function(keyWord){
                return;
            },

            backToInitialState : function(){
                return;
            }
        });
    });

});




