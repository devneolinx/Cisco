(function ($) {
    $.widget("ui.dropDown", $.ui.surveyQuestionBase, {
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
                $("select option#opt" + answers[0].optionId, this.element).get(0).selected = true;
            }
        },
        _selectionChanged: function (sender, e) {
            var curQuestion = this.options.model;
            curQuestion.answers = new Array();
            var option = $("option:selected", sender).data("context");
            if (option) {
                curQuestion.answers.push({ questionId: curQuestion.id, optionId: option.id, text: "" });
            }

        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }


    });
})(jQuery);