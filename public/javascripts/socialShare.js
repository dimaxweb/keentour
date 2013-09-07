define(['jquery','sharePlugin'],function($){
    var socialShare= {
        displayShare : function(element){
            $(element).sharrre({
                share: {
                    googlePlus: true,
                    facebook: true,
                    twitter: true,
                    pinterest: true
                },
                buttons: {
                    googlePlus: {size: 'tall', annotation:'bubble'},
                    facebook: {layout: 'box_count'},
                    twitter: {count: 'vertical'},
                    pinterest: {layout: 'vertical'}
                },
                enableHover: false,
                enableCounter: false,
                enableTracking: true
            });

        }
    }
    return socialShare;


});
