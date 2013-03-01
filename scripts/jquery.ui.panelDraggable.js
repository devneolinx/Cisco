(function ($) {
    $.widget("ui.panelDraggable", {
        //defaul options
        options: {
            axis: 'x',
            containment: null,
            handle: null,
            drag: null,
            stop: null,
            slideChanging: null
        },
        //constructor
        _create: function () {
            var me = this;
            var handle = $(this.options.handle, this.element);
            var touchDown = false;
            var lastTouchX = 0;
            var dragStarted = false;
            /*handle.bind("mousedown.ui.panelDraggable touchstart.ui.panelDraggable", function (e) {
            e.preventDefault();
            lastTouchX = e.pageX;
            touchDown = true;
            });

            handle.bind("mousemove.ui.panelDraggable touchmove.ui.panelDraggable", function (e) {
            e.preventDefault();
            dragStarted = touchDown;
            if (dragStarted) {
            var diff = e.pageX - lastTouchX;
            var left = me.element.offset().left + diff;
            me.element.css({ left: left });
            }
            lastTouchX = e.pageX;
            });*/

            handle.bind("click.ui.panelDraggable", function (e) {
                e.preventDefault();
                var panelDriver = me.element.parent(".panelDriver");
                var panelWidth = panelDriver.width();
                if (me.element.offset().left == 0) {
                    me.element.animate({ left: "-650px" });
                    me._triggerSlideChanging("closing");
                }
                else if (me.element.offset().left == -650) {
                    me.element.animate({ left: "0px" });
                    $(".panelDriver div.comments").animate({ left: panelWidth + "px" });
                    me._triggerSlideChanging("opening");
                }
                if (me.element.offset().left == panelWidth) {
                    me.element.css({ left: panelWidth });
                    me.element.animate({ left: (panelWidth - 650) + "px" });
                    $(".panelDriver div.overviewCont").animate({ left: "-650px" });
                    me._triggerSlideChanging("opening");
                }
                else if (me.element.offset().left == (panelWidth - 650)) {
                    me.element.animate({ left: panelWidth + "px" });
                    me._triggerSlideChanging("closing");

                }
                /*touchDown = false;
                dragStarted = false;
                if (me.options.stop) {
                var handle = $.proxy(me.options.stop, me.element)
                handle();
                }*/
            });



        },
        _triggerSlideChanging: function (state) {
            if (this.options.slideChanging) {
                this.options.slideChanging(state);
            }
        },
        //called when widget is called with no parameter of only options after widget is created 
        _init: function () {

        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
            handle.unbind("mousedown.ui.panelDraggable");
            handle.unbind("touchstart.ui.panelDraggable");
            handle.unbind("mousemove.ui.panelDraggable");
            handle.unbind("touchmove.ui.panelDraggable");
            handle.unbind("mouseup.ui.panelDraggable");
            handle.unbind("touchend.ui.panelDraggable");
        }


    });
})(jQuery);