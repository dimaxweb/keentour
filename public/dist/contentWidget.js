define("contentWidget",["jquery","inheritance","flickrWidget","wikiPediaWidget","youtubeWidget"],function(e){var t={};t.parts=[];var n=Class.extend({container:"<div></div>",show:function(){e(this.container).show()},hide:function(){e(this.container).hide()},instance:null,wasDisplayed:!1}),r=n.extend({displayContent:function(){e(this.container).flickrFy({tags:window.contentData.flickrTags}),this.instance=e(this.container).data("flickrFy")},getIcon:function(){return"/images/photokamera.png"}});r.prototype.container=e("<div id='divContent'  class='widgetInternal'><div class='photoFeed'></div><div class='paging' id='photoPaging'></div></div>"),t.parts[t.parts.length]=r;var i=n.extend({displayContent:function(){e(this.container).wikiFy({imageLoading:"/images/ajax-loader-big.gif",page:window.contentData.wikiPage}),this.instance=e(this.container).data("wikiFy")},getIcon:function(){return"/images/wikipedia.png"}});i.prototype.container=e("<div id='wikiMain' class='widgetInternal'><div id='divBreadCrumb'></div><div class ='articles'></div></div>"),t.parts[t.parts.length]=i;var s=n.extend({displayContent:function(){e(this.container).youTubeFy({query:window.contentData.youTubeQuery}),this.instance=e(this.container).data("youTubeFy")},getIcon:function(){return"/images/kamera.png"}});s.prototype.container=e("<div id='youTubeMain'  class='widgetInternal'><div id='videos'></div><div id='videoPaging' class='paging'></div></div>");var o={article:new i,photos:new r,videos:new s};return t.getWidgetKey=function(){var t=e(".tabs").find(".selected").first().attr("rel"),n=e.trim(t).toLowerCase();if(!n||n&&n.length===0)n="videos";return n},t.getCurrentWidget=function(){var e=t.getWidgetKey(),n=o[e];return n},t.displayCurrentWidget=function(){window.contentData||(window.contentData={},window.contentData.wikiPage="Austria",window.contentData.flickrTags="Austria,travel",window.contentData.youTubeQuery="Austria,travel");var n=this.getCurrentWidget(),r=this.getWidgetKey();if(n){var i=o[t.previousWidgetKey];i&&i.hide(),n.wasDisplayed?n.show():(e("#widgetsDisplay").append(n.container),n.displayContent(),n.wasDisplayed=!0),t.previousWidgetKey=r,e(t).triggerHandler("widgetChanged",{widgetName:r})}},e(document).ready(function(n){var r=e(".tabs").find(".widgetTitle");e(r).on("click",function(n){n.preventDefault(),e(r).removeClass("selected"),e(this).addClass("selected"),t.displayCurrentWidget()})}),t})