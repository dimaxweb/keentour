define('twitter_grid',['jquery'],function($){
    var defaults = {
        itemsPerRow : 4,
        //just empty stuff in order not to fail
        getItemContent : function(dataItem,gridCell,grid){
            $('<a class="thumbnail" href="content/South-America"><img src="/images/Main1.jpg"></a>').appendTo(gridCell);
        }
    };

   var  twitter_grid = {};
   // Collection method.
    twitter_grid.gridify = function(options) {
        options = $.extend(true,defaults, options);
        var element = options.element;
        if(options && options.data
                && options.data
                && Object.prototype.toString.call(options.data) === '[object Array]'){
                var spanNumber = 12 / options.itemsPerRow;
                var cellClass = 'span' + spanNumber;
                var data = options.data;
                var ulContainer;
                for(var i=0;i<data.length;i++){
                    var dataItem = data[i];
                    if(i % options.itemsPerRow === 0){
                        ulContainer = $('<ul class="thumbnails" />').appendTo(element);
                    }

                    var cellContainer = $('<li class="' + cellClass + '"></span>').appendTo(ulContainer);
                    options.getItemContent(dataItem,cellContainer,element);
                }

            }

   }

   return twitter_grid;

});



