(function ($) {
    $.widget("cisco.settings", $.ui.mainController, {
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
            
        },
        _upload: function(s, e){
        	FiletransferHelper.uploadTextFile("Cisco/result.txt", "http://192.168.1.5/Cisco/UploadResponse.aspx");
        },
        _download: function(s,e){
        	var me = this;
        	FiletransferHelper.downloadFile("http://192.168.1.5/Cisco/xml/survey_real.xml", "survey.xml", function(path){
        		var survey = new Survey();
        		survey.loadXML($.proxy(me._downloadResources, me), path);
        	});
        },
        _downloadResources : function(survey){
        	var allResources = new Array();
        	for(var i=0;i<survey.questions.length;i++){
        		var curQ = survey.questions[i];
        		if(curQ.resources){
	        		for(var j=0;j<curQ.resources.length; j++){
	        			var curR = curQ.resources[j];
	        			allResources.push(curR);
	        			
	        		}
        		}
        	}
        	var downloading = 0;
        	var downloaded = 0;
        	var resourceCount = allResources.length;
        	alert(resourceCount);
        	var download = function(){
        		if(allResources.length>0){
        		   if(downloading<=5){
		        		var res = allResources.splice(0, 1)[0];
		        		console.log("downloading " + res.name);
		        		downloading++;
		        		FiletransferHelper.downloadFile(res.path, res.name, function(path){
		        			 downloading--;
		        			 downloaded++;
					         console.log("downloaded " + path);
					    });
				   }
				   
			    }
			    else if(downloaded>=resourceCount){
			    	alert(downloaded);
			    	window.location = "index.html";
			    }
        		setTimeout(download, 50);
        	}
        	
        	download();
        	
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);