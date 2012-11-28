(function ($) {
    $.widget("ui.quickJump", $.ui.mainController, {
        //defaul options
        options: {
            model: null, //model needed by this controller/view 
            pushInHistoryStack: false
        },
        //constructor
        _create: function () {
            // Your code before calling the overridden method.
            $.ui.mainController.prototype._create.call(this);
            var me = this;

            
            /*var onCommentDragStop = function(){
            var left = 0;
            var curLeft = $(commentPanel).offset().left;
            if($(commentPanel).data("opened")){
            left = curLeft>(me.commentPanelDriverWidth-650 * 1/4)?me.commentPanelDriverWidth: me.commentPanelDriverWidth-650;
            }
            else{
            left = curLeft>me.commentPanelDriverWidth-650 * 3/4?me.commentPanelDriverWidth:me.commentPanelDriverWidth-650;
            }
            $(commentPanel).animate({left: left}, 'fast', function(){
            if($(commentPanel).offset().left<me.commentPanelDriverWidth){
            $(commentPanel).data("opened",false);
            }
            else{
            $(commentPanel).data("opened",true);
            }
            });                
            }*/          

        },
        //called when widget is called with no parameter of only options after widget is created 
        _init: function () {
            $.ui.mainController.prototype._init.call(this);
            var slideChanging = $.proxy(this._slideChanging, this);
            $(".panelDriver div.overviewCont").panelDraggable({
                axis: 'x',
                containment: [-650, 0, 0, 1200],
                handle: 'a.leftPanel, div.overviewCont>ul>li>a',
                slideChanging: slideChanging,
                drag: function () {
                    //$("div.overviewCont").css({ left: ($(this).offset().left - 650) + 'px'});
                } /*,
                stop: function(){
                    var left = 0;
                    var curLeft = $(this).offset().left;
                    if($(this).data("opened")){
                        left = curLeft>(-650 * 1/4)?0: -650;
                    }
                    else{
                        left = curLeft>-650 * 3/4?0:-650;
                    }
                    $(this).animate({left: left}, 'fast', function(){
                        if($(this).offset().left<0){
                            $(this).data("opened",false);
                        }
                        else{
                            $(this).data("opened",true);
                        }
                    });
                }*/
            });
        },
        setAnswered: function (questionId, answered) {
            if (answered) {
                $("#quickJump" + questionId + " a", this.element).addClass("active");
            }
            else {
                $("#quickJump" + questionId + " a", this.element).removeClass("active");
            }
        },
        _goToContact: function (sender, e) {
            this.navigateTo('contact', this.options.model);
        },
        _goToQuestion: function (sender, e) {
            var qIndex = $("li", this.element).index($(sender).parent()) - 1;
            var questions = this.options.model.questions;
            if (qIndex >= 0 && qIndex < questions.length) {
                var curQuestion = questions[qIndex];
                var type = curQuestion.type.substring(0, 1).toLowerCase() + curQuestion.type.substring(1);
                //type = "multiSelect";
                this.navigateTo(type, curQuestion);
            }
        },
        _slideChanging: function () {
            var questions = this.options.model.questions;
            for (var key in questions) {
                var question = questions[key];
                var answered = (question.answers && question.answers.length > 0);
                this.setAnswered(question.id, answered);
            }
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
        

    });
})(jQuery);