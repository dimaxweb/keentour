(function(e){e.fn.paginate=function(t){var n=e.extend({},e.fn.paginate.defaults,t);return this.each(function(){$this=e(this);var t=e.meta?e.extend({},n,$this.data()):n,r=t.start;e.fn.draw(t,$this,r)})};var t=0,n=0,r=navigator.appName,i=navigator.appVersion;if(i.indexOf("MSIE 7.0")>0)var s="ie7";e.fn.paginate.defaults={count:5,start:12,display:5,border:!0,border_color:"#fff",text_color:"#8cc59d",background_color:"black",border_hover_color:"#fff",text_hover_color:"#fff",background_hover_color:"#fff",rotate:!0,images:!0,mouse:"slide",onChange:function(){return!1}},e.fn.draw=function(r,i,o){var u=!1;r.display>r.count&&(r.display=r.count,u=!0),$this.empty();if(r.images)var a="jPag-sprevious-img",f="jPag-previous-img",l="jPag-snext-img",c="jPag-next-img";else var a="jPag-sprevious",f="jPag-previous",l="jPag-snext",c="jPag-next";var h=e(document.createElement("a")).addClass("jPag-first").html("First");if(r.rotate)if(r.images)var p=e(document.createElement("span")).addClass(a);else var p=e(document.createElement("span")).addClass(a).html("&laquo;");var d=e(document.createElement("div")).addClass("jPag-control-back");d.append(h).append(p);var v=e(document.createElement("div")).css("overflow","hidden"),m=e(document.createElement("ul")).addClass("jPag-pages"),g=(r.display-1)/2,y=o-g,b;for(var w=0;w<r.count;w++){var E=w+1;if(E==o){var S=e(document.createElement("li")).html('<span class="jPag-current">'+E+"</span>");b=S,m.append(S)}else{var S=e(document.createElement("li")).html("<a>"+E+"</a>");m.append(S)}}v.append(m);if(r.rotate)if(r.images)var x=e(document.createElement("span")).addClass(l);else var x=e(document.createElement("span")).addClass(l).html("&raquo;");var T=e(document.createElement("a")).addClass("jPag-last").html("Last"),N=e(document.createElement("div")).addClass("jPag-control-front");N.append(x).append(T),$this.addClass("jPaginate").append(d).append(v).append(N);if(!r.border){if(r.background_color=="none")var C={color:r.text_color};else var C={color:r.text_color,"background-color":r.background_color};if(r.background_hover_color=="none")var k={color:r.text_hover_color};else var k={color:r.text_hover_color,"background-color":r.background_hover_color}}else{if(r.background_color=="none")var C={color:r.text_color,border:"1px solid "+r.border_color};else var C={color:r.text_color,"background-color":r.background_color,border:"1px solid "+r.border_color};if(r.background_hover_color=="none")var k={color:r.text_hover_color,border:"1px solid "+r.border_hover_color};else var k={color:r.text_hover_color,"background-color":r.background_hover_color,border:"1px solid "+r.border_hover_color}}e.fn.applystyle(r,$this,C,k,h,m,v,N);var L=t-h.parent().width()-3;s=="ie7"?(v.css("width",L+72+"px"),N.css("left",t+6+72+"px")):(v.css("width",L+"px"),N.css("left",t+6+"px")),r.rotate&&(x.hover(function(){thumbs_scroll_interval=setInterval(function(){var e=v.scrollLeft()+1;v.scrollLeft(e)},20)},function(){clearInterval(thumbs_scroll_interval)}),p.hover(function(){thumbs_scroll_interval=setInterval(function(){var e=v.scrollLeft()-1;v.scrollLeft(e)},20)},function(){clearInterval(thumbs_scroll_interval)}),r.mouse=="press"?(x.mousedown(function(){thumbs_mouse_interval=setInterval(function(){var e=v.scrollLeft()+5;v.scrollLeft(e)},20)}).mouseup(function(){clearInterval(thumbs_mouse_interval)}),p.mousedown(function(){thumbs_mouse_interval=setInterval(function(){var e=v.scrollLeft()-5;v.scrollLeft(e)},20)}).mouseup(function(){clearInterval(thumbs_mouse_interval)})):(p.click(function(e){var t=L-10,n=v.scrollLeft()-t;v.animate({scrollLeft:n+"px"})}),x.click(function(e){var t=L-10,n=v.scrollLeft()+t;v.animate({scrollLeft:n+"px"})}))),h.click(function(e){v.animate({scrollLeft:"0px"}),v.find("li").eq(0).click()}),T.click(function(e){v.animate({scrollLeft:n+"px"}),v.find("li").eq(r.count-1).click()}),v.find("li").click(function(t){b.html("<a>"+b.find(".jPag-current").html()+"</a>");var n=e(this).find("a").html();e(this).html('<span class="jPag-current">'+n+"</span>"),b=e(this),e.fn.applystyle(r,e(this).parent().parent().parent(),C,k,h,m,v,N);var i=this.offsetLeft/2,o=v.scrollLeft()+i,u=i-L/2;s=="ie7"?v.animate({scrollLeft:i+u-h.parent().width()+52+"px"}):v.animate({scrollLeft:i+u-h.parent().width()+"px"}),r.onChange(n)});var A=v.find("li").eq(r.start-1);A.attr("id","tmp");var O=document.getElementById("tmp").offsetLeft/2;A.removeAttr("id");var M=O-L/2;s=="ie7"?v.animate({scrollLeft:O+M-h.parent().width()+52+"px"}):v.animate({scrollLeft:O+M-h.parent().width()+"px"}),u?(e(h).hide(),e(T).hide(),e(".jPag-snext").hide(),e(".jPag-sprevious").hide()):(e(h).show(),e(T).show(),e(".jPag-snext").show(),e(".jPag-sprevious").show())},e.fn.applystyle=function(r,i,s,o,u,a,f,l){i.find("a").css(s),i.find("span.jPag-current").css(o),i.find("a").hover(function(){e(this).css(o)},function(){e(this).css(s)}),i.css("padding-left",u.parent().width()+5+"px"),n=0,i.find("li").each(function(e,i){e==r.display-1&&(t=this.offsetLeft+this.offsetWidth),n+=this.offsetWidth}),a.css("width",n+"px")}})(jQuery)