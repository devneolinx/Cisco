(function ($) {
    var curActivePage = null;
    var historyStack = new Array();
    $.widget("ui.mainController", {
        //defaul options
        options: {
            container: ".main[data-role='MasterPage']", //container of all pages
            holder: "#dynamicContent",
            model: null, //model needed by this controller/view 
            pushInHistoryStack: true
        },
        //constructor
        _create: function () {
            this._container = $(this.options.container);
            this._pageHolder = $(this.options.holder + ">#transitionHolder");
            if (this._pageHolder.length == 0) {
                $(this.options.holder).html('<div id="transitionHolder"></div>')
                this._pageHolder = $(this.options.holder + ">#transitionHolder");
            }
            if (this.element.is("[data-role='Page']")) {
                this.element.data("innerHtml", this.element.html())
            }
        },
        //called when widget is called with no parameter of only options after widget is created 
        _init: function () {
            this._initForDataBind();
            this._bindEvents();
        },
        _initForDataBind: function () {
            var me = this;
            //this.element.empty();
            var innHtml = this.element.data("innerHtml");
            if (!innHtml) {
                innHtml = this.element.html();
            }
            this.element.html(innHtml);
            this._dataBoundElementsPerLevel = new Array();
            var selector = "[data-bind]";
            level = 0;
            while (true) {
                var elements = $(selector, this.element);
                if (elements.length > 0) {
                    this._dataBoundElementsPerLevel.push(elements);
                    if (level > 0) {
                        this._dataBoundElementsPerLevel[level - 1] = this._dataBoundElementsPerLevel[level - 1].not(this._dataBoundElementsPerLevel[level]);
                    }
                    selector += " [data-bind]";
                    level++;
                }
                else {
                    break;
                }
            }


            for (var i = this._dataBoundElementsPerLevel.length - 1; i >= 0; i--) {
                this._dataBoundElementsPerLevel[i].each(recursiveBind);
            }
            function recursiveBind(i) {
                var bindStr = $(this).attr('data-bind');
                var bind = eval("(" + bindStr + ")");
                var data = me.options.model;
                if (bind.context && "" != bind.context && "this" != bind.context) {
                    try {
                        data = eval("me.options.model." + bind.context);
                    }
                    catch (e) {
                        console.log("could not evaluate \"" + bind.context + "\"of the model");
                    }
                }

                if (data) {
                    if ($.isArray(data)) {
                        /*var outerHtml = $(this).data("outerHTML");

                        if (outerHtml) {
                        $(this).html($(outerHtml).html());
                        }
                        else {
                        outerHtml = this.outerHTML;
                        $(this).data("outerHTML", outerHtml);
                        }*/
                        var item = $(this).children("[data-item]")
                        me.bindData(item.get(0), data);
                    }
                    else {
                        me.bindData(this, data);

                    }
                }
                else {
                    console.log("data is undefined");
                }

            }
        },
        _bindEvents: function () {
            var me = this;
            this._elementsWithEvents = $("[data-events]", this.element);
            this._elementsWithEvents.each(function () {
                var curElement = $(this);
                var events = eval("(" + curElement.attr("data-events") + ")");
                for (var event in events) {
                    var handlerName = events[event];
                    var handler = me[handlerName];
                    if (handler) {
                        curElement.unbind(event + "." + me.widgetName);
                        curElement.bind(event + "." + me.widgetName, function (e) {
                            var proxyFunc = $.proxy(handler, me)
                            proxyFunc(this, e);
                        });
                    }
                }
            });
        },
        _unbindEvents: function () {
            var me = this;
            if (this._elementsWithEvents) {
                this._elementsWithEvents.each(function () {
                    var curElement = $(this);
                    var events = eval("(" + curElement.attr("data-events") + ")");
                    for (var event in events) {
                        curElement.unbind(event + "." + me.widgetName);
                    }
                });
            }
        },
        bindData: function (domObj, data) {
            var me = this;
            var arrayData = data;
            if (!$.isArray(data)) {
                arrayData = new Array(data);
            }

            for (var key in arrayData) {
                var itemData = arrayData[key];

                /*var outerHtml = $(domObj).data("outerHTML");
                if (!outerHtml || $.isArray(data)) {
                outerHtml = domObj.outerHTML;

                }*/
                var outerHtml = domObj.outerHTML;
                var newHtml = outerHtml.replace(/\{\s*path\s*:\s*'(.*?)'(\s*,\s*func\s*:\s*'(\w+(\w\d)?)')?\s*\}/g, function (match, $1, $2, $3, offset, original) {
                    var bindValue = eval("itemData." + $1);
                    if ($3) {
                        var bindFunc = me[$3];
                        var proxyFunc = $.proxy(bindFunc, me);
                        bindValue = proxyFunc(bindValue, data, key);
                    }
                    return bindValue;
                });
                var newElement = $(newHtml);

                //TODO: assumed that order of the elements on two jquery selector result will be same, should find a better way
                var boundObjs = $("[data-item], [data-bind]", domObj);
                $("[data-item], [data-bind]", newElement).each(function (i) {
                    $(this).data("context", boundObjs.eq(i).data("context"));
                });
                $(domObj).before(newElement)
                /*if (newElement.is("[data-bind]")) {
                newElement.data("outerHTML", outerHtml);
                }*/
                newElement.data("context", itemData);
            }

            $(domObj).remove();
            return newHtml;
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
            this._unbindEvents();
        },
        navigateTo: function (pageName, model) {
            //console.log("navigating to " + pageName)
            var page = this._pageHolder.find("#view_" + pageName + "[data-role='Page']")
            var me = this;
            if (curActivePage) {
                this._prevPageInfo = curActivePage._pageInfo;
                this._prevPageInfo.savedData = curActivePage._onSaveData();
            }
            if (page.length > 0) {
                me.showPage(pageName, model, "forward");
            }
            else {
                $.ajax({
                    url: "views/" + pageName + ".html",
                    type: "GET",
                    dataType: "text",
                    success: function (response) {
                        me._pageHolder.append(response);
                        //console.log("page appended")
                        var page = me._pageHolder.find("#view_" + pageName + "[data-role='Page']");
                        var widget = $.proxy(page[pageName], page);

                        curActivePage = widget({
                            model: model
                        });
                        me.showPage(pageName, model, "forward");
                    },
                    error: function (e, msg) {
                        console.log(msg);
                    }
                });
            }
        },
        goBack: function () {
            var pageInfo = historyStack.pop();
            if (pageInfo) {
                this.showPage(pageInfo.page, pageInfo.model, "backward", pageInfo.savedData);
            }
        },
        showPage: function (pageName, model, dir, savedData) {
            var page = this._pageHolder.find("#view_" + pageName + "[data-role='Page']");
            var widget = $.proxy(page[pageName], page);
            curActivePage = widget({
                model: model
            }).show('fast').data(pageName);
            $("[data-role='Page']").not(page).hide('fast');
            curActivePage._pageInfo = { page: pageName, model: model, savedData: savedData, pushInHistoryStack: curActivePage.options.pushInHistoryStack };
            if (this._prevPageInfo && this._prevPageInfo.pushInHistoryStack && dir == "forward") {
                historyStack.push(this._prevPageInfo);
            }
            
            curActivePage._onNavigationComplete({ direction: dir, savedData: savedData });

        },
        triggerCustomEvent: function (eventName, params) {
            if (curActivePage[eventName]) {
                var evnt = $.proxy(curActivePage[eventName], curActivePage)
                evnt(params);
            }
        },
        _onSaveData: function () {
            return null;
        },
        _onNavigationComplete: function () {
        },
        //custom events will be implemented by subclass
        onNext: function () { },
        onPrev: function () { },

        /*******************Member fields****************/
        _container: null,
        _pageHolder: null,
        _dataBoundElementsPerLevel: null,
        _elementsWithEvents: null,
        _pageInfo: null,
        _prevPageInfo: null


    });
})(jQuery);