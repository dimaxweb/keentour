function YouTubeLib(e){this.state={},this.options={},this.defaults={api_key:"AI39si5fbtiJDujJFuzwahAZdov3djgXrnKETddqHqKTlNmfvIJ-jCGUen-e5ev7QjSH_qMYzqQ4DknT2ZmfbUPj7pr2dLsFOg",defaultQuery:"London","start-index":1,"max-results":5,alt:"json-in-script",query:null,v:2,orderby:"relevance",category:"Travel"},this.options=$.extend({},this.defaults,e),this.options.query||(this.options.query=this.options.defaultQuery),this.setOptions(this.options)}YouTubeLib.prototype.searchVideos=function(e){var t={};t.errorMessage="",t.status="fail";var n="https://gdata.youtube.com/feeds/api/videos?q="+this.options.query+"&key="+this.options.api_key+"&start-index="+this.options["start-index"]+"&max-results="+this.options["max-results"]+"&alt="+this.options.alt+"&v="+this.options.v+"&orderby="+this.options.orderby+"&category="+this.options.category;try{$.getJSON(n+"&callback=?",function(n){n?(t.status="ok",t.videoResult=n):t.status="fail",e(t)}).error(function(e){t.errorMessage=e.toString(),t.status="fail"})}catch(r){t.errorMessage=r.toString(),t.status="fail"}},YouTubeLib.prototype.setOption=function(e,t){e==="query"&&$.trim(t)===""&&(this.options.query=this.options.defaultQuery),e==="page"&&!t&&(this.options["start-index"]=1)},YouTubeLib.prototype.setOptions=function(e){for(var t in e)this.setOption(t,e[t])},YouTubeLib.prototype.nextPage=function(e){return this.options["start-index"]=this.options["start-index"]+1,this.searchVideos(e)},YouTubeLib.prototype.previousPage=function(e){return this.options["start-index"]=this.options["start-index"]===1?1:this.options["start-index"]-1,this.searchVideos(e)},YouTubeLib.prototype.getPage=function(e,t){return e&&!isNaN(e)?(this.options["start-index"]=e,this.searchVideos(t)):(this.options["start-index"]=1,this.searchVideos(t))},YouTubeLib.getVideoTime=function(e){try{var t=parseInt(e.media$group.yt$duration.seconds),n=parseInt(t/60),r=t%60;n<10&&(n="0"+n),r<10&&(r="0"+r)}catch(i){}return n+":"+r}