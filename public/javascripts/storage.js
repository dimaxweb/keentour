//if defined amd cal define ,else just return the value
(function(){
    var storage =
    {
        getObject:function (key) {
            var item = null;
            try {
                if (window.localStorage) {
                    if (typeof(JSON) != "undefined") {
                        var itemStr = window.localStorage.getItem(key);
                        item = JSON.parse(itemStr);
                    }
                }
            }
            catch (e) {
                //TODO : log or rethrow here
            }
            return item;
        },
        setObject:function (key, item) {

            try {
                if (window.localStorage) {
                    if (typeof(item) !== "object") {
                        window.localStorage.setItem(key, item);
                        return;
                    }
                     if (typeof(JSON) != "undefined") {
                            var itemStr = JSON.stringify(item);
                            window.localStorage.setItem(key, itemStr);
                     }

                }
            }
            catch (e) {
                //TODO : log or rethrow here
            }
        }

    };



    if ( typeof define === "function" && define.amd ) {
        define( "storage", [], function () { return storage; });
    }
    else{
        return storage;
    }

})();







