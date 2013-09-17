({

    baseUrl:"./",
    //file should be skipped because it has no dependencies.
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
        tooltip  : '../javascripts/lib/bootstrap/bootstrap-tooltip',
        popover  : '../javascripts/lib/bootstrap/bootstrap-popover',
        carousel  : '../javascripts/lib/bootstrap/bootstrap-carousel',
        twitter_grid  :  '../javascripts/twitter-grid',
        'ajax-scroll' : '../javascripts/lib/jquery-paged-scroll.min',
        sharePlugin  : '../javascripts/lib/jquery.sharrre-1.3.4.min',
        socialShare  : '../javascripts/socialShare',
        storiesList : '../javascripts/storiesList',
        richEditorSource  : '../javascripts/lib/wysihtml5/wysihtml5-0.3.0.min',
        richEditor  : '../javascripts/lib/wysihtml5/wysihtml5-AMD',
        tabs  :  '../javascripts/lib/bootstrap/bootstrap-tab',
        moment : '../javascripts/lib/moment',




        ///requirejs plugins
        css:'../javascripts/lib/css',
        text:'../javascripts/lib/text',
        ///css resources
        paginationCSS :'css!../stylesheets/pagination',
        jQueryUICSS : 'css!../stylesheets/jquery-ui-1.8.20.custom',
        colorBoxCSS :  'css!../stylesheets/colorbox',
        wikiCSS :  'css!../stylesheets/wiki2',
        richEditorCSS : 'css!../stylesheets/wysihtml',
        storyCSS:'css!../stylesheets/story',
        storiesListCss : 'css../stylesheets/storiesList'

    },

    removeCombined: false,

    //No files are loaded on demand,so we wan to nest also the recources from require calls
    findNestedDependencies: true,
    //List the modules that will be optimized. All their immediate and deep
    //dependencies will be included in the module's file when the build is
    //done. If that module or any of its dependencies includes i18n bundles,
    //only the root bundles will be included unless the locale: section is set above.
    modules:[
        {
            name:"homepage"


        },

        {
            name : "story"
        },

        {
            name : "storyView"
        },

        {
            name  : "userStories"
        },

        {
            name:"contentpage"
        },

        {
            name:"privacy"
        },

        {
            name:"aboutUs"
        },

        {
            name : "index"
        }

    ],

    wrap:
    {
        startFile: "start.frag",
        endFile: "end.frag"
    },

    dir:"../dist"


})
