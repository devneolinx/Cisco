﻿(function ($) {
    $.widget("cisco.responseList", $.ui.mainController, {
        //defaul options
        options: {
            model: null //model needed by this controller/view            
        },
        //constructor
        _create: function () {
            $.ui.mainController.prototype._create.call(this);

        },
        //called when widget is called with no parameter of only options after widget is created 
        _init: function () {
            $.ui.mainController.prototype._init.call(this);
            //masterPageController.hideNextBtn(true);
            //masterPageController.hideBackBtn(true);

        },
        _responseItemClicked: function (s, e) {
            e.preventDefault();
            var item = $(s).closest("li").data("context");
            window.location = "index.html?id=" + item.id;
        },
        onPrev: function (arg) {
            this.navigateTo("settings");
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);