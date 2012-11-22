/**
 * Created by IntelliJ IDEA.
 * User: Dmitry
 * Date: Dec 20, 2011
 * Time: 11:44:11 PM
 * To change this template use File | Settings | File Templates.
 */
function YouTubeLib(options)
{

    this.state = {};
    this.options = {};
    this.defaults  = {
        api_key: 'AI39si5fbtiJDujJFuzwahAZdov3djgXrnKETddqHqKTlNmfvIJ-jCGUen-e5ev7QjSH_qMYzqQ4DknT2ZmfbUPj7pr2dLsFOg',
        defaultQuery : 'London',
        'start-index' :   1,
        'max-results' : 5,
        alt : 'json-in-script',
        query : null,
        v:2,
        orderby:'relevance',
        category:'Travel'

    }
    ///extend defaults with provided options
    this.options = $.extend({},this.defaults,options);
    //check if required parameters are passed
    if(!this.options.query){
      this.options.query  = this.options.defaultQuery;
    }
    //validate options
    this.setOptions(this.options);
}
    //methods
    YouTubeLib.prototype.searchVideos = function(callback)
    {
        var result = {};
        result.errorMessage  = '';
        result.status = 'fail';
        var url = "https://gdata.youtube.com/feeds/api/videos"
                + "?q=" + this.options.query
                + "&key=" + this.options.api_key
                + "&start-index=" + this.options['start-index']
                + "&max-results=" + this.options['max-results']
                + "&alt="  + this.options.alt
                + "&v="  + this.options.v
                + "&orderby="  + this.options.orderby
                + "&category=" + this.options.category


        try {
            $.getJSON(url + "&callback=?", function(data) {

               
                if (data) {
                    result.status = 'ok';
                    result.videoResult = data;
                }/////if status is ok
                else {
                    result.status = 'fail';
                }

               callback(result);
            })
            .error(function(e)
            {
              result.errorMessage = e.toString();
              result.status = 'fail';

            });

        }
        catch(e) {
            result.errorMessage = e.toString();
            result.status = 'fail';

        }



    };

    YouTubeLib.prototype.setOption  =function(name,value){
            if(name==='query'){
               if($.trim(value)===''){
                this.options.query = this.options.defaultQuery;
               }
            }
            if(name==='page' && !value)
            {
                this.options['start-index']  = 1;
            }

    }
   YouTubeLib.prototype.setOptions = function(options)
    {
       for(var key in options)
       {
          this.setOption(key,options[key]);
       }
    }
    //*****Navigation functions****//
    YouTubeLib.prototype.nextPage = function(callback)
    {
        this.options['start-index'] =  this.options['start-index'] + 1;
        return this.searchVideos(callback);
    };

  YouTubeLib.prototype.previousPage = function(callback){
        this.options['start-index'] = (this.options['start-index']===1) ? 1  : this.options['start-index'] - 1;
        return this.searchVideos(callback);
    };

  YouTubeLib.prototype.getPage = function(page,callback){
        if(page && !isNaN(page)){
            this.options['start-index']  = page;
            return this.searchVideos(callback);
        }
       else
        {
            this.options['start-index'] = 1;
            return this.searchVideos(callback);

        }
    }

   YouTubeLib.getVideoTime  = function(videoItem)
   {
       try{
           var seconds = parseInt(videoItem.media$group.yt$duration.seconds);
           var minutes = parseInt(seconds/60);
           var remainingSeconds = (seconds%60);
           if(minutes < 10){
               minutes = '0' + minutes;
           }

           if(remainingSeconds < 10){
               remainingSeconds = '0' + remainingSeconds;
           }
       }
       catch(e)
       {
          //TODO : log to some window
       }

       return minutes + ':' + remainingSeconds;
   }





  //***** End navigation functions****//





