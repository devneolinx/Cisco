(function ($) {
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
            var curQuestion = this.options.model;

            $("#question", this.element).text(curQuestion.text);
            var temp = '<div>' +
		                  	'<input type="checkbox" name="enterprise" class="styled">' +
		                    '<label for="enterprice">#questionText</label>' +
                        '</div>';
            $(".wrapCol", this.element).empty();
            for (var i = 0; i < curQuestion.options.length; i++) {
                var html = temp.replace("#questionText", curQuestion.options[i].text);
                $(".wrapCol", this.element).append(html);
            }

            if (curQuestion.resources && curQuestion.resources.length>0) {
                $(".resources ul").empty();
                var temp = '<li><a href="#url">#name</a></li>';
                for (var i = 0; i < curQuestion.resources.length; i++) {
                    var res = curQuestion.resources[i];
                    var html = temp.replace("#url", res.path).replace("#name", res.name);
                    var item = $(html);
                    $("a", item).addClass(res.type);
                    if (res.type == "video") {
                        $(".video", item).fancybox({
                            padding: 0,
                            width: '100%',
                            autosize: false,
                            'type': 'ajax'
                        });
                    }
                    $(".resources ul").append(item);
                }
                $(".resources").show();
            }
            else {
                $(".resources").hide();
            }

            Custom.init(this.element);
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }


    });
})(jQuery);