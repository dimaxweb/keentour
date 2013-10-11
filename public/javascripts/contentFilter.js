define(['jquery','css!contentFilterCss'],function($){
    var interests = ["Art & Culture,Romance,Food & Wine,Nightlife,Hotel,Event,History,Culture,Shopping,Skiing,Adventure,Spa"].sort();
    var contentFilter = {
       showFilter : function(){
           $('<div class="filter" style="display: none;">Filter</div>')

           $.each(interests,function(i,item){
             $('')
          });
       }
   }
   return contentFilter;
});
