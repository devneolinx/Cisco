function Survey() {
    var $ = jQuery;
    this.questions = new Array();
    this.salesmen = new Array();
    this.loadXML = function (loadedCallback, fullpath) {
    	alert(fullpath);
        $.ajax({
            url: fullpath,
            type: "GET",
            dataType: "text",
            context: this,
            success: function (resp) {
                this.parseSurveyXml(resp, loadedCallback);
            },
            error: function (e, m) {
                alert("loadXml: " + m);
            }
        });
    }

    this.parseSurveyXml = function (resp, loadedCallback) {
        var surveyXmlObj = $(resp);
        var me = this;

        me.id = surveyXmlObj.filter("survey").attr("id");
        surveyXmlObj.find("salesmen>salesman").each(function () {
            var salesman = {};
            salesman.id = $(this).attr("id");
            salesman.name = $(this).text();
            me.salesmen.push(salesman);
        });

        surveyXmlObj.find("questions>question").each(function () {
            var newQuestion = {};
            var objQ = $(this);
            newQuestion.id = objQ.attr("id") * 1;
            newQuestion.type = objQ.children("type").text();
            newQuestion.subType = objQ.children("subType").text();
            newQuestion.text = objQ.children("text").text();

            newQuestion.options = new Array();
            objQ.find("options:not([type='horizontal'])>option").each(function () {
                var newOption = {};
                var objO = $(this);
                newOption.id = objO.attr("id") * 1;
                newOption.type = objO.attr("type");
                newOption.text = objO.text();
                newQuestion.options.push(newOption);
            });
            newQuestion.horizontalOptions = new Array();
            objQ.find("options[type='horizontal']>option").each(function () {
                var newOption = {};
                var objO = $(this);
                newOption.id = objO.attr("id") * 1;
                newOption.type = objO.attr("type");
                newOption.text = objO.text();
                newQuestion.horizontalOptions.push(newOption);
            });


            newQuestion.resources = new Array();
            objQ.find("resources>resource").each(function () {
                var newResource = {};
                var objO = $(this);
                newResource.id = objO.attr("id") * 1;
                newResource.type = objO.children("type").text();
                newResource.title = objO.children("title").text();
                newResource.name = objO.children("name").text();
                newResource.path = objO.children("path").text();
                newQuestion.resources.push(newResource);
            });

            me.questions.push(newQuestion);

        });
        loadedCallback(this);
    }

}