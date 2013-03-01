var masterPageController = null;
(function ($) {
    $.widget("cisco.comment", $.ui.mainController, {
        //defaul options
        options: {
            model: null //model needed by this controller/view            
        },
        //constructor
        _create: function () {
            $.ui.mainController.prototype._create.call(this);
            
        },
        //called when widget is called with no parameter of only options after widget is created 
        _init: function () {
            $.ui.mainController.prototype._init.call(this);
            var me = this;
            me.commentPanelDriverWidth = this.element.parent(".panelDriver").width();          

            this.element.panelDraggable({
                axis: 'x',
                containment: [me.commentPanelDriverWidth - 650, 0, me.element.parent(".panelDriver").width(), 1200],
                handle: 'a.rightPanel',
                drag: function () {
                    //$("div.overviewCont").css({ left: ($(this).offset().left - 650) + 'px'});
                }
                //,stop: onCommentDragStop
            });
            $(window).resize(function () {
                me.commentPanelDriverWidth = me.element.parent(".panelDriver").width();
                //onCommentDragStop();
            });

            var commentValid = false;

            $("#optInEmail", me.element).change(function(e){
                var checked = $("#receiveEmail", me.element)[0].checked;
                var valid = true;
                var email = this.value;
                if(checked || email !=""){
                    valid = /\w+@\w+\.\w+/.test(email);                    
                }

                if(valid){
                    $("#optInError", me.element).hide();
                }
                else{
                    $("#optInError", me.element).show();
                }

                commentValid = valid;
            });

            $(".okBtn", this.element).bind("click.cisco", function(e){
                e.preventDefault();               
                $("#optInEmail", me.element).change();
                if(commentValid){
                    var jsonObj = "{";
                    var temp = '"#name": "#value"';
                    $("input, textarea", me.element).each(function (i) {
                        var input = $(this);
                        var name = input.attr("name");
                        var val = input.val();
                        if(i>0){
                            jsonObj += ",\n\t";
                        }
                        jsonObj += temp.replace("#name", name).replace("#value", val);
                        //commentInfo[name] = val;
                    });
                    jsonObj += "}";
                    me.options.model.commentInfo = eval("(" + jsonObj + ")");
                    $("a.rightPanel", me.element).click();
                }
                else{
                    
                }
               
            });

            

            Custom.init(this.element);
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        _survey: null,
        commentPanelDriverWidth: 0

    });
})(jQuery);