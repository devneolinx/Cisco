﻿(function ($) {
    $.widget("ui.multiSelect", $.ui.surveyQuestionBase, {
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


            var answers = this.options.model.answers;
            if (answers) {
                for (var key in answers) {
                    var ans = answers[key];
                    $("#chk" + ans.optionId, this.element).get(0).checked = true;
                    //$("#chk" + ans.optionId, this.element).change();
                    $("#txt" + ans.optionId, this.element).removeAttr("disabled");
                    $("#txt" + ans.optionId, this.element).val(ans.text);
                }
            }
            Custom.init(this.element);

        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        _checkChanged: function (sender, e) {
            var item = $(sender).parent("[data-item]");
            $("input:text", item).get(0).disabled = !sender.checked;
            this._setAnswer(item);
            if (sender.checked) {
                $("input:text", item).focus();
            }
        },
        _optionClicked: function (sender, e) {
             if(!$(e.target).is("span.checkbox")){
                $(":checkbox", sender).each(function () {
                    this.checked = !this.checked;
                    $(this).change();
                });
             }
        },
        _textChanged: function (sender, e) {
            this._setAnswer($(sender).parent("[data-item]"));
        },
        _setAnswer: function (item) {
            var option = item.data("context");
            var curQuestion = this.options.model;
            var isChecked = $("input:checkbox", item).get(0).checked;
            var text = $("input:text", item).get(0).value;

            if (!curQuestion.answers) {
                curQuestion.answers = new Array();
            }

            for (var i = 0; i < curQuestion.answers.length; i++) {
                var curAnswer = curQuestion.answers[i];
                if (curAnswer.optionId == option.id) {
                    curQuestion.answers.splice(i, 1);
                }
            }
            if (isChecked) {
                curQuestion.answers.push({ questionId: curQuestion.id, optionId: option.id, text: text });
            }
        },
        _getOtherDisplay: function (val) {
            if (val == "other") {
                return "block";
            }
            else {
                return "none";
            }
        }

    });
})(jQuery);