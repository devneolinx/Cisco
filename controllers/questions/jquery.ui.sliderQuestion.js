(function ($) {
    $.widget("ui.sliderQuestion", $.ui.surveyQuestionBase, {
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
            var changeEvent = $.proxy(this._sliderChanged, this);
            $("#sliderTest", this.element).slider({
                change: changeEvent
            });
            this._loadAnswers();
        },
        _loadAnswers: function () {
            var answers = this.options.model.answers;
            if (answers && answers.length > 0) {
                $("#sliderTest", this.element).slider("value", answers[0].text);
            }
        },
        _sliderChanged: function (event, ui) {
            var curQuestion = this.options.model;
            curQuestion.answers = new Array();
            curQuestion.answers.push({ questionId: curQuestion.id, optionId: null, text: ui.value });
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }


    });
})(jQuery);