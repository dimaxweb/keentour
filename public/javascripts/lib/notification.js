define(['jquery.humane','css!humaneCSS'], function (humane) {
    humane.timeout = 1500;
    var notif = function () {
        humane.log(Array.prototype.slice.call(arguments));
    }

    return notif;
});