(function ($) {
    $.widget("ui.textInput", $.ui.surveyQuestionBase, {
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
        },
        _loadAnswers: function () {
            var answers = this.options.model.answers;
            if (answers && answers.length > 0) {
                $("input#txtUserInput", this.element).val(answers[0].text);
            }
        },
        _textChanged: function (sender, e) {
            var curQuestion = this.options.model;
            curQuestion.answers = new Array();

            curQuestion.answers.push({ questionId: curQuestion.id, optionId: null, text: sender.value });

        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }


    });
})(jQuery);