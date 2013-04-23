define("search", ['jquery','jQueryUI','geonames','tooltip','css!jQueryUICSS','storage'], function ($,jQueryUi,geonames,tooltip,css,storage) {
        var continentNameLookUp = {};
        continentNameLookUp['EU'] = 'Europe';
        continentNameLookUp['AF'] = 'Africa';
        continentNameLookUp['AS'] = 'Asia';
        continentNameLookUp['SA'] = 'South America';
        continentNameLookUp['NA'] = 'North America';
        continentNameLookUp['OC'] = 'Oceania';
        continentNameLookUp['AN'] = 'Antarctica';
        var itemFound = false;
        var search = {};
        search.bindAutoComplete = function (container,submitControl) {
            $(container).autocomplete({
                source:function (request, response) {
                    $.ajax({
                        url:"http://ws.geonames.org/searchJSON",
                        dataType:"jsonp",
                        data:{
                            style:"full",
                            maxRows:20,
                            name_startsWith:request.term
//                            featureClass:'P',
//                            featureClass: 'A'
                        },
                        success:function (data) {
                            response($.map(data.geonames, function (item) {
                                return {
                                    label:geonames.getItemLabel(item),
                                    value:item.name,
                                    dataItem:item

                                }
                            }));
                        }
                    });
                },
                minLength:1,
                select:function (event, ui) {
                    var path = geonames.getItemUrl(ui.item.dataItem);
                    $(this).trigger('itemSelected', ui.item.dataItem);
                    console.log('Item path' + path);
                    //TODO : move from here ,raise event instead
                    window.location = path;

                },



                open:function () {
                    itemFound = true;
                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                },
                close:function () {
                    itemFound = false;
                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                }
            });

            var originalWidth = $(container).width();
            $(container).focusin(function (e) {
                $(this).tooltip('hide');
                $(this).animate({
                    width: "40%"
                },350 );
            });

            //bind tooltip if already not bound
            if(!storage.getObject('toolTipShown')){
               setTimeout(function(){
                    ///bind tooltip
                    $(container).tooltip({
                        title:'Let us impress you !  Type country,city,street name,"Berlin nightlife",...anything interesting you about travel',
                        placement:'bottom',
                        trigger:'manual'

                    }).tooltip('show');

                    setTimeout(function(){$(container).tooltip('hide');},5000);
                 storage.setObject('toolTipShown',true);

                },2000);
            }


            //TODO : handle enter
            $(container).keypress(function(event){

                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode === 13 && !itemFound){
                    window.location = '/content/'  + $(container).val();
                }

            });





            $(submitControl).bind('click',function(e){
                window.location = '/content/'  + $(container).val();
            });

        };

        search.preparePath = function (geoNamesLabel) {
            var label = $.trim(geoNamesLabel);
            if (label.indexOf(',') === 0) {
                label = label.substring(1, label.length - 1);
            }
            var path = label.split(',').reverse();
            for (var i = 0; i < path.length; i++) {
                path[i] = $.trim(path[i]).replace(/ /g, "-");
            }
            path = path.join('/');
            return path;

        }

        search.getItemLabel = function (item) {
            var adminCodePath = this.getAdminCodeName(item);
            return item.name + ',' + adminCodePath + item.countryName + ',' + continentNameLookUp[item.continentCode];
        }

        search.getAdminCodeName = function (item) {
            var adminCodePath = '';
            for (var i = 1; i < 5; i++) {
                var adminName = item['adminName' + i];
                //check if exists and also not a number ,don't want display numbers
                if (adminName && !isNaN(adminName)) {
                    adminCodePath = adminCodePath + adminName + ',';
                }
            }

            return adminCodePath;
        }

        return search;
    }
);












