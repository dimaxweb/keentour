define("twitter_grid",["jquery"],function(e){var t={itemsPerRow:4,getItemContent:function(t,n,r){e('<a class="thumbnail" href="content/South-America"><img src="/images/Main1.jpg"></a>').appendTo(n)}},n={};return n.gridify=function(n){n=e.extend({},t,n);var r=n.element;if(n&&n.data&&n.data&&Object.prototype.toString.call(n.data)==="[object Array]"){var i=12/n.itemsPerRow,s="span"+i,o=n.data,u;for(var a=0;a<o.length;a++){var f=o[a];a%n.itemsPerRow===0&&(u=e('<ul class="thumbnails" />').appendTo(r));var l=e('<li class="'+s+'"></span>').appendTo(u);n.getItemContent(f,l,r)}}},n})