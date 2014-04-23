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
        search.bindAutoComplete = function (options) {
            var container = options.container;
            var submitControl  = options.submitControl;
            var onItemSelected = options.onItemSelected;
            $(container).autocomplete({
                source:function (request, response) {
                    $.ajax({
                        url:"http://ws.geonames.org/searchJSON?featureClass=A&featureClass=P&username=dmitrym1978",
                        dataType:"jsonp",
                        data:{
                            style:"full",
                            maxRows:20,
                            name_startsWith:request.term

                        },
                        success:function (data) {


                            var suggestArray = $.map(data.geonames, function (item) {
                               return {
                                    label: geonames.getItemLabel(item),
                                    value:item.name,
                                    dataItem:item

                                }
                            });

                            var uniqueItems = {};
                            $.each(suggestArray, function(i, item){
                                if(uniqueItems[item.label]){
                                  var existingItem =uniqueItems[item.label];
                                  if(existingItem.population < item.population){
                                      uniqueItems[item.label] = item;
                                  }
                                }
                                else{
                                    uniqueItems[item.label] = item;
                                }

                            });


                            var arrUniqueItems = [];
                            for(var i in uniqueItems ){
                                arrUniqueItems.push(uniqueItems[i]);
                            }

                            console.log("Items  before sort",arrUniqueItems);
                            arrUniqueItems.sort(function(a,b){
                                var aPopulation = a.dataItem.population  || 0;
                                var bPopulation = b.dataItem.population  || 0;
                                return bPopulation - aPopulation;
                            });

                            response(arrUniqueItems);
                        }
                    });
                },

                minLength:1,
                select:function (event, ui) {
                    $(this).trigger('itemSelected', ui.item.dataItem);
                    onItemSelected({geoItem:ui.item.dataItem,searchText:$(container).value});

                },

                open:function () {
                    itemFound = true;
                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                },
                close:function () {
                    itemFound = false;
                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                }
            })
            .data( "autocomplete" )._renderItem = function( ul, item ) {
                var inner_html = '<a class="aucompleteOption" href="#">'  +  item.label +  '</a>';
                return $( "<li></li>" )
                    .data( "item.autocomplete", item )
                    .append(inner_html)
                    .appendTo( ul );
            };

            var originalWidth = $(container).width();
            if(!options.preserveBoxWidth){
                $(container).focusin(function (e) {
                    $(this).tooltip('hide');
                    $(this).animate({
                        width: "85vw"
                    },350 );
                });
            }
            $(container).focusin(function (e) {
                $(this).tooltip('hide');

            });

            //bind tooltip if already not bound
            if(!storage.getObject('toolTipShown')){
               setTimeout(function(){
                    ///bind tooltip
                    $(container).tooltip({
                        title:'Let us impress you !  Type you destination here...',
                        placement:'bottom',
                        trigger:'manual'

                    }).tooltip('show');

                 setTimeout(function(){$(container).tooltip('hide');},5000);
                 storage.setObject('toolTipShown',true);

                },1000);
            }



            /*
               Search submit keypress or button click
            */
            $(container).keypress(function(event){

                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode === 13 && !itemFound){
                    onItemSelected({geoItem:null,searchText:$(container).val()});

                }

            });


            $(submitControl).bind('click',function(e){
                onItemSelected({geoItem:null,searchText:$(container).val()});
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












