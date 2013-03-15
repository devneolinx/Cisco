var masterPageController = null;
(function ($) {
    var queryObj = function () {
        var result = {}, queryString = location.search.slice(1),
            re = /([^&=]+)=([^&]*)/g, m;

        while (m = re.exec(queryString)) {
            result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }

        return result;
    }
    $.widget("ui.masterPage", $.ui.mainController, {
        //defaul options
        options: {
            model: null, //model needed by this controller/view            
            pushInHistoryStack: false
        },
        //constructor
        _create: function () {
            masterPageController = this;
            $.ui.mainController.prototype._create.call(this);
            var buttons = $(".commonBtnWrap", this.element);
            var height = buttons.offset().top - this._container.offset().top;
            $(this._pageHolder, this.element).height(height);
            //loadingWidget = $("#loadingDiv").loading().data("loading");            
            var me = this;
            var survey = new Survey();
            if(isPhoneGap)
            {
                var id = queryObj()["id"];
                var gotSurvey = function (survey) {
                    me._survey = survey;

                    $(".panelDriver div.overviewCont").quickJump({
                        model: survey
                    });

                    $(".panelDriver div.comments").comment({
                        model: survey
                    });
                    me.navigateTo("contact", survey);
                    loadingWidget.hide();

                };
                if (id) {
                    databaseHelper.execQuery("select * from RESPONSE where id=?", [id], function (results, err) {
                        if (results) {
                            var survey = eval("(" + results.rows.item(0).response + ")");
                            survey.editing = true;
                            survey.databaseId = id;
                            gotSurvey(survey);
                        }
                    });
                }
                else {
                    filesystemHelper.getFile("Cisco/downloads/survey.xml", function (file) {
                        if (file != null) {
                            //console.log("file available");
                            survey.loadXML(gotSurvey, file.getFullPath());
                        }
                        else {
                            me.navigateTo("settings", survey);
                            loadingWidget.hide();
                        }
                    }, true);
                }
            }
            else{
                 survey.loadXML(function (survey) {
		                    me._survey = survey;
		
		                    $(".panelDriver div.overviewCont").quickJump({
		                        model: survey
		                    });
		
		                    $(".panelDriver div.comments").comment({
		                        model: survey
		                    });
		                    me.navigateTo("contact", survey);
		                    loadingWidget.hide();
		                
		          }, "xml/survey.xml");
                
            }


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
        hideNextBtn: function(hide){
            if(hide){
                $("#btnNext", this.element).hide();
            }
            else{
                $("#btnNext", this.element).show();
            }
        },
        hideBackBtn: function(hide){
                if(hide){
                $("#btnBack", this.element).hide();
            }
            else{
                $("#btnBack", this.element).show();
            }
        },       
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        _survey: null

    });
})(jQuery);