(function ($) {
    $.widget("ui.order", $.ui.surveyQuestionBase, {
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
            var changeEvent = $.proxy(this._orderChanged, this);
            $("#sortable", this.element).sortable({
                axis: "y",
                cursor: "move",
                placeholder: 'sortableHelper',
                forcePlaceholderSize: 'true',
                stop: changeEvent
            });
            this._loadAnswers();

        },
        _loadAnswers: function () {
            var answers = this.options.model.answers;
            console.log("order load answer");
            if (answers) {
                for (var i = 0; i < answers.length; i++) {
                    var ans = answers[i];
                    console.log(ans.optionId);
                    var item = $("#sortable li#orderItem_" + ans.optionId, this.element).clone(true);
                    $("#sortable li#orderItem_" + ans.optionId, this.element).remove();
                    $("#sortable", this.element).append(item);
                }
            }
        },
        _orderChanged: function (event, ui) {
            var curQuestion = this.options.model;
            curQuestion.answers = new Array();
            console.log("order changed");
            $("#sortable li", this.element).each(function (i) {
                var option = $(this).data("context");

                if (option) {
                    console.log(option.id + " : " + $(this).attr("id"));
                    curQuestion.answers.push({ questionId: curQuestion.id, optionId: option.id, text: "" });
                }
            });
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }


    });
})(jQuery);