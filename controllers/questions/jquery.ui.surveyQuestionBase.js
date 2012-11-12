(function ($) {
    var curQuestionIndex = -1;
    var survey = null;
    $.widget("ui.surveyQuestionBase", $.ui.mainController, {
        //defaul options
        options: {
            model: null, //model needed by this controller/view 
            questionIndex: -1
        },
        //constructor
        _create: function () {
            $.ui.mainController.prototype._create.call(this);
            if (curQuestionIndex == -1) {
                curQuestionIndex = 0;
                survey = masterPageController._survey;
                //this.showCurQuestion();
            }

        },
        //called when widget is called with no parameter of only options after widget is created 
        _init: function () {
            $.ui.mainController.prototype._init.call(this);

            if (this.options.questionIndex > -1) {
                curQuestionIndex = this.options.questionIndex;
            }

            $(".resources a.video", this.element).fancybox({
                padding: 0,
                width: '100%',
                autosize: true,
                'type': 'ajax'
            });
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        showCurQuestion: function (dir) {
            var curQuesion = survey.questions[curQuestionIndex];
            var type = curQuesion.type.substring(0, 1).toLowerCase() + curQuesion.type.substring(1);
            //type = "multiSelect";
            this.navigateTo(type, curQuesion, dir);
        },
        getCurQuestion: function () {
            return survey.questions[curQuestionIndex];
        },
        //override
        onNext: function (arg) {
            var me = this;
            curQuestionIndex++;
            if (curQuestionIndex >= survey.questions.length) {
                curQuestionIndex = survey.questions.length - 1;
                //console.log(me.getSurveyResponse());
                if (isPhoneGap) {
                    filesystemHelper.getFile("Cisco/result.txt", function (file) {
                        if (file) {
                            var funcLoop = function () {
                                if (file.isWriterAvailable()) {
                                    file.saveText(JSON.stringify(survey) + ",");
                                    //file.readText(function (txt) { alert(txt); });
                                }
                                else {
                                    setTimeout(funcLoop, 100);
                                }
                            }
                            funcLoop();
                        }
                    });
                }

                this.navigateTo("thankYou", this.options.model);
            }
            else {
                this.showCurQuestion("forward");
            }
        },
        getSurveyResponse: function () {
            var respObj = {};
            respObj.id = survey.id;
            respObj.contactInfo = survey.contactInfo;
            respObj.commentInfo = survey.commentInfo;
            respObj.answers = [];
            for (var keyQ in survey.questions) {
                var curQ = survey.questions[keyQ];
                for (var keyA in curQ.answers) {
                    var curA = curQ.answers[keyA];
                    respObj.answers.push(curA);
                }
            }

            return JSON.stringify(respObj);

        },
        onPrev: function (arg) {
            curQuestionIndex--;
            if (curQuestionIndex < 0) {
                curQuestionIndex = 0;
                alert("can't go back");
            }
            else {
                this.showCurQuestion("backward");
            }
        },
        _getClassForType: function (type, parentArray, index) {
            return (type + (type == 'video' ? " vids fancybox.ajax" : ""));
        },
        _getResourceDisplay: function (resources, parent, index) {
            var display = "none";
            if (resources && resources.length > 0) {
                display = "block";
            }
            return display;
        },
        _resourceClicked: function (sender, e) {
            e.preventDefault();
            //var strPath = window.location.href;
            //var path = strPath.substr(0,strPath.lastIndexOf('/')) + $(sender).attr("href");
            var path = localStorage[baseServerPath + $(sender).attr("href")];
            //alert(path);
            window.plugins.childBrowser.showWebPage(path);

        }


    });
})(jQuery);