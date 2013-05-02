define("search",["jquery","jQueryUI","geonames","tooltip","css!jQueryUICSS","storage"],function(e,t,n,r,i,s){var o={};o.EU="Europe",o.AF="Africa",o.AS="Asia",o.SA="South America",o.NA="North America",o.OC="Oceania",o.AN="Antarctica";var u=!1,a={};return a.bindAutoComplete=function(t,r){e(t).autocomplete({source:function(t,r){e.ajax({url:"http://ws.geonames.org/searchJSON",dataType:"jsonp",data:{style:"full",maxRows:20,name_startsWith:t.term},success:function(t){r(e.map(t.geonames,function(e){return{label:n.getItemLabel(e),value:e.name,dataItem:e}}))}})},minLength:1,select:function(t,r){var i=n.getItemUrl(r.item.dataItem);e(this).trigger("itemSelected",r.item.dataItem),console.log("Item path"+i),window.location=i},open:function(){u=!0,e(this).removeClass("ui-corner-all").addClass("ui-corner-top")},close:function(){u=!1,e(this).removeClass("ui-corner-top").addClass("ui-corner-all")}});var i=e(t).width();e(t).focusin(function(t){e(this).tooltip("hide"),e(this).animate({width:"40%"},350)}),s.getObject("toolTipShown")||setTimeout(function(){e(t).tooltip({title:'Let us impress you !  Type country,city,street name,"Berlin nightlife",...anything interesting you about travel',placement:"left",trigger:"manual"}).tooltip("show"),setTimeout(function(){e(t).tooltip("hide")},3e3),s.setObject("toolTipShown",!0)},2e3),e(t).keypress(function(n){var r=n.keyCode?n.keyCode:n.which;r===13&&!u&&(window.location="/content/"+e(t).val())}),e(r).bind("click",function(n){window.location="/content/"+e(t).val()})},a.preparePath=function(t){var n=e.trim(t);n.indexOf(",")===0&&(n=n.substring(1,n.length-1));var r=n.split(",").reverse();for(var i=0;i<r.length;i++)r[i]=e.trim(r[i]).replace(/ /g,"-");return r=r.join("/"),r},a.getItemLabel=function(e){var t=this.getAdminCodeName(e);return e.name+","+t+e.countryName+","+o[e.continentCode]},a.getAdminCodeName=function(e){var t="";for(var n=1;n<5;n++){var r=e["adminName"+n];r&&!isNaN(r)&&(t=t+r+",")}return t},a})