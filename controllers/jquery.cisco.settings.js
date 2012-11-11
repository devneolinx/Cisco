(function ($) {
    $.widget("cisco.settings", $.ui.mainController, {
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
            
        },
        _upload: function(s, e){
        	FiletransferHelper.uploadTextFile("Cisco/result.txt", "http://192.168.1.5/Cisco/UploadResponse.aspx");
        },
        _download: function(s,e){
        	FiletransferHelper.downloadFile("http://192.168.1.5/Cisco/xml/survey_real.xml", "survey.xml");
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);