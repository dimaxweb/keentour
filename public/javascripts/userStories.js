if (typeof (KEENTOUR) == 'undefined') {
    KEENTOUR = {};
}


require(["storage", "geonames", "storiesList"], function (storage, geonames, storiesList) {
    KEENTOUR.storage = storage;
    KEENTOUR.geonames = geonames;
    KEENTOUR.storiesList = storiesList;


    $(document).ready(function (e) {
        console.log("Getting user stories.User name is : %s",KEENTOUR.username);
        KEENTOUR.storiesList.showLatest($('.latestStories'), {userName:KEENTOUR.username,editMode:KEENTOUR.editMode});
    });


});



