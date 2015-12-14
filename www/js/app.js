var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        $(document).bind('deviceready', app.onDeviceReady);
    },
    onDeviceReady: function() {
        $(document).bind("backbutton", app.onExitEvent);
    },
    onExitEvent:function(){
        Index.showGrayMsg();
        $(document).unbind("backbutton", app.onExitEvent);
        $(document).bind("backbutton", app.exitApp);
        var intervalID = window.setInterval(function() {  
            window.clearInterval(intervalID);  
            $(document).unbind("backbutton", app.exitApp).bind("backbutton", app.onExitEvent);
        }, 2000);  
    },
    addOneBackEvent:function(){
        $(document).unbind("backbutton", app.onExitEvent).bind("backbutton", app.onBackEvent);
    },
    onBackEvent:function(){
        $.pjax('back');
        $(document).unbind("backbutton", app.onBackEvent).bind("backbutton", app.onExitEvent);
    },
    exitApp:function(){
        navigator.app.exitApp();
    },
};
app.initialize();