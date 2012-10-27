define("search", ['jquery','jQueryUI','geonames','tooltip','css!jQueryUICSS'], function ($,jQueryUi,geonames,tooltip,css) {
        var continentNameLookUp = {};
        continentNameLookUp['EU'] = 'Europe';
        continentNameLookUp['AF'] = 'Africa';
        continentNameLookUp['AS'] = 'Asia';
        continentNameLookUp['SA'] = 'South America';
        continentNameLookUp['NA'] = 'North America';
        continentNameLookUp['OC'] = 'Oceania';
        continentNameLookUp['AN'] = 'Antarctica';
        search = {};
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
                        },
                        success:function (data) {
                            response($.map(data.geonames, function (item) {
                                return {
                                    label:geonames.getItemLabel(item),
                                    value:item.name,
                                    dataItem:item,
                                    featureClass:'A',
                                    featureClass:'P'
                                }
                            }));
                        }
                    });
                },
                minLength:1,
                select:function (event, ui) {
                    var path = geonames.getItemUrl(ui.item.dataItem);
                    $(this).trigger('itemSelected', ui.item.dataItem);
                    //TODO : move from here ,raise event instead
                    window.location = path;

                },
                open:function () {
                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                },
                close:function () {
                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                }
            });

            $(container).focusin(function (e) {
                $(this).tooltip('hide');
                $(this).animate({
                    width: "60%"
                }, 500 );
            });



            //bind tooltip
            setTimeout(function(){
                ///bind tooltip
                $(container).tooltip({
                    title:'Search something',
                    placement:'bottom',
                    trigger:'manual'

                }).tooltip('show')
            }, 2000);

            //handle enter
            $(container).keypress(function(event){

                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode === '13'){
                    window.location = 'content'  + $(container).val();
                }

            });


            $(submitControl).bind('click',function(e){
                window.location = 'content'  + $(container).val();
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












