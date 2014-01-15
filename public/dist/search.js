define("search",["jquery","jQueryUI","geonames","tooltip","css!jQueryUICSS","storage"],function(e,t,n,r,i,s){var o={};o.EU="Europe",o.AF="Africa",o.AS="Asia",o.SA="South America",o.NA="North America",o.OC="Oceania",o.AN="Antarctica";var u=!1,a={};return a.bindAutoComplete=function(t){var r=t.container,i=t.submitControl,o=t.onItemSelected;e(r).autocomplete({source:function(t,r){e.ajax({url:"http://ws.geonames.org/searchJSON?featureClass=A&featureClass=P",dataType:"jsonp",data:{style:"full",maxRows:20,name_startsWith:t.term},success:function(t){var i=e.map(t.geonames,function(e){return{label:n.getItemLabel(e),value:e.name,dataItem:e}}),s={};e.each(i,function(e,t){if(s[t.label]){var n=s[t.label];n.population<t.population&&(s[t.label]=t)}else s[t.label]=t});var o=[];for(var u in s)o.push(s[u]);console.log("Items  before sort",o),o.sort(function(e,t){var n=e.dataItem.population||0,r=t.dataItem.population||0;return r-n}),r(o)}})},minLength:1,select:function(t,n){e(this).trigger("itemSelected",n.item.dataItem),o({geoItem:n.item.dataItem,searchText:e(r).value})},open:function(){u=!0,e(this).removeClass("ui-corner-all").addClass("ui-corner-top")},close:function(){u=!1,e(this).removeClass("ui-corner-top").addClass("ui-corner-all")}}).data("autocomplete")._renderItem=function(t,n){var r='<a class="aucompleteOption" href="#">'+n.label+"</a>";return e("<li></li>").data("item.autocomplete",n).append(r).appendTo(t)};var a=e(r).width();e(r).focusin(function(t){e(this).tooltip("hide"),e(this).animate({width:"350px"},350)}),s.getObject("toolTipShown")||setTimeout(function(){e(r).tooltip({title:"Let us impress you !  Type you destination here...",placement:"bottom",trigger:"manual"}).tooltip("show"),setTimeout(function(){e(r).tooltip("hide")},5e3),s.setObject("toolTipShown",!0)},1e3),e(r).keypress(function(t){var n=t.keyCode?t.keyCode:t.which;n===13&&!u&&o({geoItem:null,searchText:e(r).val()})}),e(i).bind("click",function(t){o({geoItem:null,searchText:e(r).val()})})},a.preparePath=function(t){var n=e.trim(t);n.indexOf(",")===0&&(n=n.substring(1,n.length-1));var r=n.split(",").reverse();for(var i=0;i<r.length;i++)r[i]=e.trim(r[i]).replace(/ /g,"-");return r=r.join("/"),r},a.getItemLabel=function(e){var t=this.getAdminCodeName(e);return e.name+","+t+e.countryName+","+o[e.continentCode]},a.getAdminCodeName=function(e){var t="";for(var n=1;n<5;n++){var r=e["adminName"+n];r&&!isNaN(r)&&(t=t+r+",")}return t},a})