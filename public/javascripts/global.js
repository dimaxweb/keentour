// Avoid `console` errors in browsers that lack a console.
(function() {
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = window.console || {};

    while (length--) {
        // Only stub undefined methods.
        console[methods[length]] = console[methods[length]] || noop;
    }
}());

// Place any jQuery/helper plugins in here.



require.config({
    baseUrl:'/javascripts',
    map: {
        '*': {
            css: '../javascripts/lib/css'
        }
    },

    paths:{
        jquery:'../javascripts/lib/jquery1.7.2.min',
        jQueryUI:'../javascripts/lib/jquery-ui.min',
        swfObject:'../javascripts/lib/swfobject',
        inheritance:'../javascripts/lib/inheritance',
        'jquery.paginate':'../javascripts/lib/jquery.paginate',
        'jquery.colorbox-min':'../javascripts/lib/jquery.colorbox-min',
        storage:'../javascripts/storage',
        search:'../javascripts/search',
        geonames:'../javascripts/geonames',
        contentWidget:'../javascripts/contentWidget',
        flickrWidget:'../javascripts/flickrWidget',
        wikiPediaWidget:'../javascripts/wikiPediaWidget',
        flickrLib:'../javascripts/flickrLib',
        youTubeLib:'../javascripts/youTubeLib',
        youtubeWidget:'../javascripts/youtubeWidget',
        homepage:'../javascripts/homepage',
        privacy:'../javascripts/aboutUs',
        aboutUs:'../javascripts/homepage',
        story:'../javascripts/story',
        storyView:'../javascripts/storyView',
        index:'../javascripts/index',
        userStories:'../javascripts/userStories',
        contentpage:'../javascripts/contentpage',
        carousel  : '../javascripts/lib/bootstrap/bootstrap-carousel',
        twitter_grid  :  '../javascripts/twitter-grid',
        'ajax-scroll' : '../javascripts/lib/jquery-paged-scroll.min',
        sharePlugin  : '../javascripts/lib/jquery.sharrre-1.3.4.min',
        socialShare  : '../javascripts/socialShare',
        storiesList : '../javascripts/storiesList',
        richEditorSource  : '../javascripts/lib/wysihtml5/wysihtml5-0.3.0.min',
        richEditor  : '../javascripts/lib/ckeditor/ckeditor',
        tabs  :  '../javascripts/lib/bootstrap/bootstrap-tab',
        moment : '../javascripts/lib/moment',
        scrollUp: '../javascripts/lib/jquery.scrollUp',
        'jquery.humane' : '../javascripts/lib/humane/humane.min',
        notification : '../javascripts/lib/notification',
        'autosize' : '../javascripts/lib/autosize-master/jquery.autosize.min',
        'jquery.readmore' : '../javascripts/lib/jquery.readmore',



        /*
            ================= bootstrap

        */
        tooltip  : '../javascripts/lib/bootstrap/bootstrap-tooltip',
        popover  : '../javascripts/lib/bootstrap/bootstrap-popover',
        dropdown  : '../javascripts/lib/bootstrap/bootstrap-dropdown',
        modal : '../javascripts/lib/bootstrap/bootstrap-modal',


        /*
            requirejs plugins
        */
        css:'../javascripts/lib/css',
        text:'../javascripts/lib/text',

        /*
            css resources
        */

        paginationCSS :'/stylesheets/pagination',
        jQueryUICSS : '/stylesheets/jquery-ui-1.8.20.custom',
        colorBoxCSS :  '/stylesheets/colorbox',
        wikiCSS :  '/stylesheets/wiki2',
        richEditorCSS : '/stylesheets/wysihtml',
        storyCSS:'/stylesheets/story',
        storiesListCss : '/stylesheets/storiesList',
        storyViewCSS : '/stylesheets/storyView',
        humaneCSS : '../javascripts/lib/humane/themes/bigbox'


    },


    /*
     ============== Order you dependencies

    */

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
            deps:["jquery","tooltip"]
        },

        "tabs":{
            deps:["jquery"]
        },

        "moment"  : {
            deps : ["jquery"]
        },

        "scrollUp"  : {
            deps : ["jquery"]
        },

        "sharePlugin"  : {
            deps : ["jquery"]
        },

        "socialShare" : {
            deps  : ["jquery","sharePlugin"]
        },

        dropdown : {
            deps : ["jquery"]
        },

        modal :{
            deps : ["jquery"]
        },

        contentWidget:{
          deps : ["jquery","jQueryUI"]

        },
        "jquery.humane" : {
            deps : ["jquery"]
        },

        'autosize': {
          deps   : ['jquery']
        },

        'jquery.readmore':  {
         deps : ['jquery']
       }





    }



});
if (typeof (KEENTOUR) == 'undefined') {
    KEENTOUR = {};
}
KEENTOUR.interests = ["Art & Culture","Family","Romance","Food & Wine","Nightlife","Hotel","Event","History","Shopping","Skiing","Adventure","Spa"].sort();

require(["jquery","socialShare","dropdown","modal","scrollUp"], function ($,socialShare) {

    KEENTOUR.socialShare  = socialShare;
    $(document).ready(function(e){
//      KEENTOUR.socialShare.displayShare('.shareStory');
      $('.dropdown-toggle').dropdown();
      $('#loginBtn').on('click',function(e){
          e.preventDefault();
          var modalLogin  = $('.modal');
          if(modalLogin.length == 0){
              modalLogin  = $('<div id="modal" class="modal" style="position: relative; top: auto; left: auto; right: auto; margin: 0 auto 20px; z-index: 1; max-width: 100%;"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button> <h3>Modal header</h3> </div> <div class="modal-body"> <p><a href="/login">Login with Facebook</a></p> </div> <div class="modal-footer"> <a href="#" class="btn">Close</a> <a href="#" class="btn btn-primary">Save changes</a> </div> </div>')
                            .appendTo('body');
          }
          $(modalLogin).modal();
      });

        $(function () {
            $.scrollUp();
        });

        /*
            render google analytics
        */
        setTimeout(function(){
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-10410520-2']);
            _gaq.push(['_trackPageview']);
            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();

        },500);


    });

});
