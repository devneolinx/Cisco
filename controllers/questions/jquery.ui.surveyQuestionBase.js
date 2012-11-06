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
            curQuestionIndex++;
            if (curQuestionIndex >= survey.questions.length) {
                curQuestionIndex = survey.questions.length - 1;
                /*filesystemHelper.getFile("result.json", function (file) {
                if (file) {
                var funcLoop = function () {
                if (file.isWriterAvailable()) {
                file.saveText("This is the first text saved using phone gap");
                file.readText(function (txt) { alert(txt); });
                }
                else {
                setTimeout(funcLoop, 100);
                }
                }
                }
                });*/
                //console.log(JSON.stringify(survey));
                this.navigateTo("thankYou", null);
            }
            else {
                this.showCurQuestion("forward");
            }
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
        }


    });
})(jQuery);