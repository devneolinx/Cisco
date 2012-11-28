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
                //this.showNextQuestion();
            }

        },
        //called when widget is called with no parameter of only options after widget is created 
        _init: function () {
            $.ui.mainController.prototype._init.call(this);

            if (this.options.questionIndex > -1) {
                curQuestionIndex = this.options.questionIndex;
            }

            /*$(".resources a.video", this.element).fancybox({
            padding: 0,
            width: '100%',
            autosize: true,
            'type': 'ajax'
            });*/
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        showNextQuestion: function () {
            var curQuesion = survey.questions[this._nextQuestionIndex];
            var type = curQuesion.type.substring(0, 1).toLowerCase() + curQuesion.type.substring(1);
            //type = "multiSelect";
            this.navigateTo(type, curQuesion);
        },
        getCurQuestion: function () {
            return survey.questions[curQuestionIndex];
        },
        //override
        onNext: function (arg) {
            var me = this;
            this._nextQuestionIndex = this._getNextQuestionIndex();
            if (this._nextQuestionIndex >= survey.questions.length) {
                this._nextQuestionIndex = survey.questions.length - 1;
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
                this.showNextQuestion();
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
            /*curQuestionIndex--;
            if (curQuestionIndex < 0) {
            curQuestionIndex = 0;
            alert("can't go back");
            }
            else {
            this.showNextQuestion("backward");
            }*/
            this.goBack();
        },
        _getNextQuestionIndex: function () {
            var curQuesion = survey.questions[curQuestionIndex];
            var answers = curQuesion.answers;
            for (var i = 0; i < curQuesion.logics.length; i++) {
                var logic = curQuesion.logics[i];
                if (this._checkLogic(answers, logic)) {
                    return logic.jumpTo * 1;
                }
            }
            return (curQuestionIndex + 1);
        },
        _checkLogic: function (answers, logic) {
            var logicPassed = false;
            for (var i = 0; i < logic.conditions.length; i++) {
                var condition = logic.conditions[i];
                var meetsCondition = this._checkCondition(answers, condition);
                if (i == 0) {
                    logicPassed = meetsCondition;
                }
                else {
                    logicPassed = this._joinConditions(logicPassed, meetsCondition, condition.groupLogic);
                }
            }
            return logicPassed;
        },
        _checkCondition: function (answers, condition) {
            if (!answers) {
                return false;
            }
            var indx = this._getAnswerIndexById(answers, condition.value * 1);
            var hasValue = (indx != -1);
            if (condition.operator == "isNot") {
                return !hasValue;
            }
            else {
                return hasValue;
            }
        },
        _joinConditions: function (accResult, curResult, op) {
            if (op == "and") {
                return accResult && curResult;
            }
            else {
                return accResult || curResult;
            }
        },
        _getAnswerIndexById: function (array, id) {
            var indx = -1;
            for (var i = 0; i < array.length; i++) {
                if (array[i].optionId == id) {
                    indx = i;
                    break;
                }
            }
            return indx;
        },
        _getClassForType: function (type, parentArray, index) {
            return (type);
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
        },
        _onNavigationComplete: function (navInfo) {
            if (navInfo.savedData) {
                curQuestionIndex = navInfo.savedData.curQuestionIndex;
            }
        },
        _onSaveData: function () {
            var savedData = {};
            savedData.curQuestionIndex = curQuestionIndex;
            curQuestionIndex = this._nextQuestionIndex;
            return savedData;
        },
        _nextQuestionIndex: -1

    });
})(jQuery);