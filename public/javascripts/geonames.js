define('geonames',['jquery'],function(){
    var continentNameLookUp = {};
    continentNameLookUp['EU'] = 'Europe';
    continentNameLookUp['AF'] = 'Africa';
    continentNameLookUp['AS'] = 'Asia';
    continentNameLookUp['SA'] = 'South America';
    continentNameLookUp['NA'] = 'North America';
    continentNameLookUp['OC'] = 'Oceania';
    continentNameLookUp['AN'] = 'Antarctica';

    var continentNameToCode = {};
    continentNameToCode['Europe']= 'EU';
    continentNameToCode['Africa']='AF';
    continentNameToCode['Asia']  = 'AS';
    continentNameToCode['South-America'] = 'SA';
    continentNameToCode['North-America'] = 'NA';
    continentNameToCode['Oceania'] = 'OC';
    continentNameToCode['Antarctica'] = 'AN';

    var geonames = {

        defaults:{
            style: 'full',
            maxRows:12,
            startRow : 0

        }
    };

    geonames.ITEM_TYPE = {
        CITY :  1,
        COUNTRY  : 2,
        CONTINENT  : 3
    }


   // /geonames.servicePoint = 'http://ws.geonames.org/searchJSON';

    geonames.serviceSearchPoint = '/SearchGeoNames';

    geonames.getItemType = function(item){
        var type =  {
             type: geonames.ITEM_TYPE,
             name  : "City"
        }
    }

    geonames.getItemFromUrl = function(url,callback){
        url = $.trim(url).replace(/-/g," ");
        if($.trim(url).length==0){
            callback(null);
        }
        var itemFromUrl = geonames.getItemMetaFromUrl(url);
        geonames.search({query:itemFromUrl.name,continentCode:itemFromUrl.continentCode},function(data){
            var geonameItem = geonames.findGeoNameItem(data,itemFromUrl);
            callback(geonameItem);
        });
    }

    geonames.getItemUrl  = function(item,parentItem){
        var adminCodePath = geonames.getAdminCodeName(item,'/');
        var continentPath  =  '';
        if(continentNameLookUp[item.continentCode]){
            continentPath = '/'  + continentNameLookUp[item.continentCode];
        }
        else{
            if(parentItem){
                if(continentNameLookUp[parentItem.continentCode]){
                    continentPath =  '/'  + continentNameLookUp[parentItem.continentCode];
                }
            }
        }

        var url =   continentPath;
        if($.trim(item.countryName).length!=0){
            url = url + '/' + item.countryName;
        }
        if($.trim(adminCodePath).length!=0){
            url = url  + '/' + adminCodePath;
        }
        if(url.indexOf('/', url.length - '/'.length) == -1){
            url  = url  + '/';
        }
        url = url +  item.name;

        url =  $.trim(url).replace(/ /g,"-");
        url = '/content' + url;
        url  = window.location.protocol + '//' +   window.location.host  + url;
        return url;

    }

    geonames.getItemLabel = function(item)
    {
        var label  =  item.name;
        var countryName='';
        if(item.countryName && item.countryName!=item.name){
            countryName = ',' + item.countryName;
        }
        label+= countryName;
//        label+= (item.fcodeName) ?  '---' + item.fcodeName  : '';
        return label;

    }

    geonames.getByLetter = function (params, callback) {
        if (!params) {
            callback(null);
        }
        var requestData  =  $.extend(true,this.defaults,params);
        var request = $.ajax({
            url:geonames.serviceSearchPoint,
            dataType:"jsonp",
            data:requestData
        });

        request.success(function (data) {
            callback(data);

        });

        request.error(function (data) {
            callback(null);
        });
    }

    geonames.search = function (params, callback) {
        if (!params) {
            callback(null);
        }
        var request = $.ajax({
            url:geonames.serviceSearchPoint,
            dataType:"jsonp",
            data:{
                style:params.style || 'full',
                maxRows:params.maxRows || 12,
                q:params.query,
                isNameRequired:params.isNameRequired || true,
                continentCode:params.continentCode
            }
        });

        request.success(function (data) {
            callback(data);

        });

        request.error(function (data) {
            callback(null);
        });
    }


    geonames.getAdminCodeName= function(item,separator)
    {
        if(!separator){
            separator = ',';
        }
        var adminCodePath  = '';
        for(var i=1;i<5;i++)
        {
            var adminName = item['adminName'  + i];
            //check if exists and also not a number ,don't want display numbers
            if(adminName && isNaN(adminName)){
                adminCodePath = adminCodePath  +  adminName + separator;
            }
        }

        return adminCodePath;
    }

    geonames.getItemMetaFromUrl = function (strUrl) {
        var url = strUrl.split('/');
        var itemFromUrl = {};
        itemFromUrl.continentCode = continentNameToCode[url[0]];
        itemFromUrl.countryName = url[1];
        itemFromUrl.adminName1 = url.length >= 2 ? url[2] : '';
        itemFromUrl.adminName2 = url.length >= 3 ? url[3] : '';
        itemFromUrl.adminName3 = url.length >= 4 ? url[4] : '';
        itemFromUrl.adminName4 = url.length >= 5 ? url[5] : '';
        itemFromUrl.name = url[url.length - 1];
        return itemFromUrl;
    }


    geonames.findGeoNameItem = function (data, itemFromUrl) {
        var item = null;
        if (data.totalResultsCount == 1) {
            item = data.geonames[0];
        }
        else {
            for (var i = 0; i < data.geonames.length; i++) {
                var gi = data.geonames[i];
                var itemsEqual = geonames.strEquals(gi.name, itemFromUrl.name)
                    && geonames.strEquals(gi.countryName, itemFromUrl.countryName)
                    && geonames.strEquals(gi.adminName1, itemFromUrl.adminName1)
                    && geonames.strEquals(gi.adminName2, itemFromUrl.adminName2)
                    && geonames.strEquals(gi.adminName3, itemFromUrl.adminName3)
                    && geonames.strEquals(gi.adminName4, itemFromUrl.adminName4)
                if (itemsEqual) {
                    item = gi;
                    break;
                }

            }

            //no item found ,something wen t wrong return first
            if(!item){
                item = data.geonames[0];
            }

        }

        return item;
    }

    geonames.getItemChildren=function(item,callback){
        var request = $.ajax({
            url:'/GetChildren',
            dataType: "jsonp",
            data: {
                geonameId : item.geonameId
            }
        });

        request.success(function (data) {
            callback(data);
        });

        request.error(function(data){
            callback(null);
        });

    }

    geonames.strEquals = function (str1, str2) {
        return $.trim(str1) === $.trim(str2);
    }

    return geonames;

});

