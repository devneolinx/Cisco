(function ($) {
    $.widget("ui.contact", $.ui.mainController, {
        //defaul options
        options: {
            model: null //model needed by this controller/view 
        },
        //constructor
        _create: function () {
            // Your code before calling the overridden method.
            $.ui.mainController.prototype._create.call(this);
            // Your code after calling the overridden method.
           

        },
        //called when widget is called with no parameter of only options after widget is created 
        _init: function () {
            $.ui.mainController.prototype._init.call(this);
            this._loadContact();
            Custom.init(this.element);
            //masterPageController.hideNextBtn(false);
            //masterPageController.hideBackBtn(true);
        },
        _loadContact: function () {
            var contactInfo = this.options.model.contactInfo;
            if (contactInfo) {
                for (var key in contactInfo) {
                    var inp = $("[name='" + key + "']", this.element);
                    var type = inp.attr("type");

                    if (type.toLowerCase() == "checkbox" || type.toLowerCase() == "radio") {
                        inp.filter("[value='" + contactInfo[key] + "']").each(function (i) { this.checked = true; });
                    }
                    else {
                        inp.val(contactInfo[key]);
                    }

                }
            }
        },
        _captureCardClicked: function(s, e){
        	navigator.camera.getPicture( $.proxy(this._cameraSuccess, this), $.proxy(this._cameraError, this), {quality : 75, 
        			  destinationType : Camera.DestinationType.DATA_FILE });
        },
        _cameraSuccess: function(imageUri){
        	console.log("camera success: " + imageUri);        	
        	filesystemHelper.getFile(imageUri, function(file){
        		console.log("got image file");
        		setTimeout(function(){
	        		file.moveTo("Cisco/pictures/capturedImage.jpeg", function(){
	        			alert("Image saved.")
	        		});
        		},200);
        	}, true, true)
        },
        _cameraError: function(message){
        	setTimeout(function(){
        		alert("Failed: " + message);
        	}, 10);
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        //override
        onNext: function (arg) {
            var jsonObj = "{";
            var temp = '"#name": "#value"';
            $("#entryForm input:not(:checkbox, :radio), #entryForm input:checked", this.element).each(function (i) {
                var input = $(this);
                var name = input.attr("name");
                var val = input.val();
                if (i > 0) {
                    jsonObj += ",\n\t";
                }
                jsonObj += temp.replace("#name", name).replace("#value", val);
                //contactInfo[name] = val;
            });

            jsonObj += "}";
            this.options.model.contactInfo = eval("(" + jsonObj + ")");

            var type = masterPageController._survey.questions[0].type;
            type = type.substring(0, 1).toLowerCase() + type.substring(1);
            this.navigateTo(type, masterPageController._survey.questions[0]);
        },
        onPrev: function (arg) {

        }


    });
})(jQuery);