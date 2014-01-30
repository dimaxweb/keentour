define(['jquery.humane','css!humaneCSS'], function (humane) {
    humane.timeout = 2000;
    var notif = function () {
        humane.log(Array.prototype.slice.call(arguments));
    }

    return notif;
});