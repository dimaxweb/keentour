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
        contentpage:'../javascripts/contentpage',
        tooltip  : '../javascripts/lib/bootstrap/bootstrap-tooltip',
        popover  : '../javascripts/lib/bootstrap/bootstrap-popover',
        carousel  : '../javascripts/lib/bootstrap/bootstrap-carousel',
        twitter_grid  :  '../javascripts/twitter-grid',
        ///requirejs plugins
        css:'../javascripts/lib/css',
        text:'../javascripts/lib/text',
        ///css resources
        paginationCSS :'css!../stylesheets/pagination',
        jQueryUICSS : 'css!../stylesheets/jquery-ui-1.8.20.custom',
        colorBoxCSS :  'css!../stylesheets/colorbox',
        wikiCSS :  'css!../stylesheets/wiki2'

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
            name:"contentpage"
        },

        {
            name:"privacy"
        },
        {
            name:"aboutUs"
        }

    ],

    wrap:
    {
        startFile: "start.frag",
        endFile: "end.frag"
    },

    dir:"../dist"


})
