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
            var me = this;
            if (this.options.questionIndex > -1) {
                curQuestionIndex = this.options.questionIndex;
            }


            //Handle event to expand and collaspe comment
            $("#btnComment", me.element).click(function (e) {
                e.preventDefault();
                if ($(this).hasClass("expandCmt")) {
                    $("#comment", me.element).show("fast");
                    $(this).removeClass("expandCmt").addClass("collapseCmt");
                }
                else {
                    $("#comment", me.element).hide("fast");
                    $(this).removeClass("collapseCmt").addClass("expandCmt");
                }
            });

            

        },
        _loadComment: function () {
            var curQuestion = survey.questions[curQuestionIndex];
            if (curQuestion.comment && curQuestion.comment != "") {
                $("#comment", this.element).val(curQuestion.comment);
                $("#btnComment", this.element).click();
            }
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
            this._collectComment();
            this._nextQuestionIndex = this._getNextQuestionIndex();
            if (this._nextQuestionIndex >= survey.questions.length) {
                this._nextQuestionIndex = survey.questions.length - 1;
             
             /*var save = confirm("Do you want to save your answers? To review your answers press cancel");
             if(save){
                if (isPhoneGap) {
                    filesystemHelper.getFile("Cisco/result.txt", function (file) {
                        if (file) {
                            var funcLoop = function () {
                                if (file.isWriterAvailable()) {
                                             survey.deviceId = ciscoDeviceId;
                                             file.saveText(JSON.stringify(survey) + ",");
                                    
                                             survey.questions = [];
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
             }*/
                var save = confirm("Do you want to save your answers? To review your answers press cancel");
                if (save) {
                    survey.deviceId = ciscoDeviceId;
                    if (isPhoneGap) {
                        var timestamp = (new Date()) * 1;
                        var query = 'INSERT INTO RESPONSE (surveyId , email , response , status , updatedAt) VALUES (?,?,?,?,?)';
                        if (survey.editing) {
                            query = 'UPDATE RESPONSE SET surveyId =?, email=? , response=? , status=? , updatedAt=? WHERE id=' + survey.databaseId;
                        }

                        databaseHelper.execQuery(query, [survey.id, survey.contactInfo.eMail, JSON.stringify(survey), 1, timestamp], function (result, err) {
                            if (result && result.rowsAffected) {
                                databaseHelper.execQuery("select * from RESPONSE");
                                survey.questions = [];
                                me.navigateTo("thankYou", me.options.model);
                            }
                            else {
                                alert("Some problem occured while saving response");
                            }
                        });
                    }
                }

            }
            else {
                this.showNextQuestion();
            }
        },
        _collectComment: function () {
            var curQuestion = survey.questions[curQuestionIndex];
            curQuestion.comment = $("#comment", this.element).val();
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
            var resource = $(sender).parent().data("context");
            //alert(path);
            //window.plugins.childBrowser.showWebPage(path);
            window.plugins.childBrowser.callViewIntent(path, resource.mimeType);
        },
        _onNavigationComplete: function (navInfo) {
            if (navInfo.savedData) {
                curQuestionIndex = navInfo.savedData.curQuestionIndex;
            }
            else {
                curQuestionIndex = survey.questions.indexOf(this.options.model);
            }
            //Load entered comment
            this._loadComment();
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