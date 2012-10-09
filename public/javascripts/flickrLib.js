function FlickrLib(options) {

    this.state = {};
    this.logBag = {};
    this.pagesCache = {};

    this.options = {
        api_key:'8e4a571bd31e66694d7d66b4b6786761',
        defaultQuery:'London',
        perPage:12,
        page:1,
        accuracy:12,
        //additional values can be : date_upload,date_taken,owner_name,icon_server,original_format,last_update,geo,machine_tags,o_dims,views, media,path_alias
        photoInfo:'tags,url_sq,url_t,url_s,url_m,url_z,url_l,url_o,description',
        sort:'interestingness-asc',
        tagsMode:'all',
        tags:'London',
        format:'json',
        query:null,
        geo_context:1,
        text:''

    }


    ///
    this.options = $.extend(true, this.options, options);
    //check if required parameters are passed
    if (!this.options.query) {
        this.options.query = this.options.defaultQuery;
    }
    //validate options
    this.setOptions(this.options);
}
//methods
FlickrLib.prototype.searchPhotos = function (callback) {
    var result = {};
    result.errorMessage = '';
    result.status = 'fail';
    var url = "http://api.flickr.com/services/rest/?method=flickr.photos.search"
        + "&api_key=" + this.options.api_key
        + "&page=" + this.options.page
        + "&sort=" + this.options.sort
        + "&accuracy=" + this.options.accuracy;
    if (this.options.tags != '') {
        url += "&tags=" + this.options.tags;
    }

    if (this.options.text != '') {
        url += "&text=" + this.options.text;
    }

    url = url + "&tag_mode=" + this.options.tagsMode
        + "&per_page=" + this.options.perPage
        + "&extras=" + this.options.photoInfo
        + "&format=" + this.options.format


    try {
        $.getJSON(url + "&jsoncallback=?",
            function (data) {

                if (data && data.stat === 'ok') {
                    if (data && data.photos && data.photos.photo) {
                        result.status = 'ok';
                        result.flickrResult = data;

                    }
                    else {
                        result.status = 'fail';
                    }////if we have photos returned
                }/////if status is ok
                else {
                    result.status = 'fail';
                }
                callback(result);
            }).error(function () {
                callback(result)
            });

    }
    catch (e) {
        result.errorMessage = e.toString();
        result.status = 'fail';
        callback(result);
    }


};

FlickrLib.prototype.setOption = function (name, value) {
    if (name === 'query') {
        if ($.trim(value) === '') {
            this.options.query = this.options.defaultQuery;
        }
    }
    if (name === 'page' && !value) {
        this.options.page = 1;
    }

}
FlickrLib.prototype.setOptions = function (options) {
    for (var key in options) {
        this.setOption(key, options[key]);
    }
}
//*****Navigation functions****//
FlickrLib.prototype.nextPage = function (callback) {
    this.options.page = this.options.page + 1;
    return this.searchPhotos(callback);
};

FlickrLib.prototype.previousPage = function (callback) {
    this.options.page = (this.options.page === 1) ? 1 : this.options.page - 1;
    return this.searchPhotos(callback);
};

FlickrLib.prototype.getPage = function (page, callback) {
    if (page && !isNaN(page)) {
        this.options.page = page;
        return this.searchPhotos(callback);
    }
    else {
        this.options.page = 1;
        return this.searchPhotos(callback);

    }
}
//***** End navigation functions****//




