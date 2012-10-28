(function ($) {
    $.widget("ui.contingency", $.ui.surveyQuestionBase, {
        //defaul options
        options: {
            model: null //model needed by this controller/view 
        },
        //constructor
        _create: function () {
            $.ui.surveyQuestionBase.prototype._create.call(this);

        },
        //called when widget is called with no parameter of only options after widget is created 
        _init: function () {
            $.ui.surveyQuestionBase.prototype._init.call(this);
            this._loadAnswers();
            Custom.init(this.element);
        },
        _loadAnswers: function () {
            var answers = this.options.model.answers;
            if (answers) {
                for (var key in answers) {
                    var ans = answers[key];
                    $("input[type='text']#txt" + ans.optionId, this.element).val(ans.text);
                    for (var i = 0; i < ans.hOptionIds.length; i++) {
                        $("input#gContingency" + ans.optionId + "_" + ans.hOptionIds[i], this.element).get(0).checked = true;
                    }
                }
            }
        },
        _textChanged: function (sender, e) {
            this._setAnswer($(sender).parent().parent());
        },
        _checkChanged: function (sender, e) {
            this._setAnswer($(sender).parent().parent());
            var abc = 1;
        },
        _setAnswer: function (item) {

            var option = item.data("context");
            var curQuestion = this.options.model;

            var text = $("input:text", item).get(0).value;
            var hOptions = new Array();
            atLeastOneChecked = false;
            $("input:checkbox, input:radio", item).each(function () {
                var hOption = $(this).parent().data("context");
                var isChecked = this.checked;
                if (isChecked) {
                    hOptions.push(hOption.id);
                    atLeastOneChecked = true;
                }
            });


            if (!curQuestion.answers) {
                curQuestion.answers = new Array();
            }

            for (var i = 0; i < curQuestion.answers.length; i++) {
                var curAnswer = curQuestion.answers[i];
                if (curAnswer.optionId == option.id) {
                    curQuestion.answers.splice(i, 1); ;
                }
            }
            if (atLeastOneChecked || text != "") {
                curQuestion.answers.push({ questionId: curQuestion.id, optionId: option.id, hOptionIds: hOptions, text: text });
            }
        },
        _getChainedBindText: function (val) {
            return "{path: 'text'}";
        },
        _getChainedBindId: function (val) {
            return "{path: 'id'}";
        },
        _getChainedUniqueBindId: function (val) {
            return "{path: 'id'}_" + val;
        },
        _getRadioOrCheck: function () {
            if (this.options.model.subType == "MultiSelect") {
                return "checkbox";
            }
            else {
                return "radio";
            }
        },

        _getOtherDisplay: function (val) {
            if (val == "other") {
                return "block";
            }
            else {
                return "none";
            }
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }


    });
})(jQuery);