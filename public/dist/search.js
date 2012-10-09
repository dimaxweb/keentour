define("search",["jquery","jQueryUI","geonames","css!jQueryUICSS"],function(e,t,n,r){var i={};return i.EU="Europe",i.AF="Africa",i.AS="Asia",i.SA="South America",i.NA="North America",i.OC="Oceania",i.AN="Antarctica",search={},search.bindAutoComplete=function(t,r){e(t).autocomplete({source:function(t,r){e.ajax({url:"http://ws.geonames.org/searchJSON",dataType:"jsonp",data:{style:"full",maxRows:20,name_startsWith:t.term},success:function(t){r(e.map(t.geonames,function(e){return{label:n.getItemLabel(e),value:e.name,dataItem:e,featureClass:"A",featureClass:"P"}}))}})},minLength:1,select:function(t,r){var i=n.getItemUrl(r.item.dataItem);e(this).trigger("itemSelected",r.item.dataItem),window.location=i},open:function(){e(this).removeClass("ui-corner-all").addClass("ui-corner-top")},close:function(){e(this).removeClass("ui-corner-top").addClass("ui-corner-all")}}),e(r).bind("click",function(n){window.location=e(t).val()})},search.preparePath=function(t){var n=e.trim(t);n.indexOf(",")==0&&(n=n.substring(1,n.length-1));var r=n.split(",").reverse();for(var i=0;i<r.length;i++)r[i]=e.trim(r[i]).replace(/ /g,"-");return r=r.join("/"),r},search.getItemLabel=function(e){var t=this.getAdminCodeName(e);return e.name+","+t+e.countryName+","+i[e.continentCode]},search.getAdminCodeName=function(e){var t="";for(var n=1;n<5;n++){var r=e["adminName"+n];r&&!isNaN(r)&&(t=t+r+",")}return t},search})