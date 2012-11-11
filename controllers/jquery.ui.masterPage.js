var masterPageController = null;
(function ($) {
    $.widget("ui.masterPage", $.ui.mainController, {
        //defaul options
        options: {
            model: null //model needed by this controller/view            
        },
        //constructor
        _create: function () {
            masterPageController = this;
            $.ui.mainController.prototype._create.call(this);
            var buttons = $(".commonBtnWrap", this.element);
            var height = buttons.offset().top - this._container.offset().top;
            $(this._pageHolder, this.element).height(height);

            var me = this;
            var survey = new Survey();
            filesystemHelper.getFile("Cisco/downloads/survey.xml", function(file){
	            if(file!=null){
	            	//console.log("file available");
		            survey.loadXML(function (survey) {
		                me._survey = survey;
		
		                $(".panelDriver div.overviewCont").quickJump({
		                    model: survey
		                });
		
		                $(".panelDriver div.comments").comment({
		                    model: survey
		                });
		                me.navigateTo("contact", survey);
		                
		            }, file.getFullPath());
	            }
	            else{	            	
	            	me.navigateTo("settings", survey);
	            }
            }, true);

            

            
            
            /***************events******************/
            $("#btnBack").click(function (e) {
                e.preventDefault();
                me.triggerCustomEvent("onPrev", "prevParam");
            });
            $("#btnNext").click(function (e) {
                e.preventDefault();
                me.triggerCustomEvent("onNext", "nextParam");
            });
            $("#ciscoLogo").click(function (e) {
                e.preventDefault();
                me.navigateTo("settings");
            });
            
        },
        //called when widget is called with no parameter of only options after widget is created 
        _init: function () {
            
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        _survey: null

    });
})(jQuery);