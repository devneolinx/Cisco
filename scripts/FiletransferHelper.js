var FiletransferHelper = {};

FiletransferHelper.uploadTextFile = function (filePath, uploadUrl, callback){
	var options = new FileUploadOptions();
    options.fileKey="file";
    //options.fileName = ciscoDeviceId + "_" + ((new Date()) * 1) + ".txt";
    options.mimeType="text";
    FiletransferHelper.uploadFile(filePath, uploadUrl, options, callback, false);
}

FiletransferHelper.uploadImageFile = function (filePath, uploadUrl, callback){
	var options = new FileUploadOptions();
    options.fileKey="file";
    //options.fileName="CiscoResponse.txt";
    options.mimeType="image/jpeg";
    FiletransferHelper.uploadFile(filePath, uploadUrl, options, callback, true);
}

FiletransferHelper.uploadFile= function(filePath, uploadUrl,options, callback, isFullUrl){
	    
	var curFile = null;
    filesystemHelper.getFile(filePath,/*sucess*/ function(file){
    	if(file){
	    	var fullPath = file.getFullPath();
	    	var ft = new FileTransfer();
	    	console.log("File Name: " + file.getName());
	    	console.log("Upload url: " + encodeURI(uploadUrl));
	    	options.fileName = file.getName();
	    	curFile = file;
	        ft.upload(fullPath, encodeURI(uploadUrl), win, fail, options);
    	}
    	else{
    		if(callback){
    			callback(false);
    		}
    	}
    }, true,  isFullUrl);
    
    
    
    function win(r) {
    	//alert("file uploaded sucessfully");
    	
    	
    	try{
    		var response = eval("(" + r.response + ")");   
    		console.log("response: " + r.response);
    		if(response.result.code==200){
    			curFile.deleteFile();
	    		if(callback){
	        		callback(true);	        		
	        	}
	    		return;
    		}
    		
    	}
    	catch(ex){
    		console.log(ex.message);
    	}
    	
    	if(callback){
    		callback(false);
    	}
    	
        //console.log("Code = " + r.responseCode);
        //console.log("Response = " + r.response);
        //console.log("Sent = " + r.bytesSent);
    }

    function fail(error) {
        //alert("An error has occurred: Code = " + error.code);
        if(callback){
    		callback(false);
    	}
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }
    
};

FiletransferHelper.getLocalPath = function(url){
	return localStorage[url];
};

FiletransferHelper.downloadFile = function(url, targetName, complete){
	var filePath = "Cisco/downloads/" + targetName;
	filesystemHelper.getFile(filePath, function(file){
		var fullPath = file.getFullPath();
		file.deleteFile();
		var fileTransfer = new FileTransfer();
		var uri = encodeURI(url);

		fileTransfer.download(
		    uri,
		    fullPath,
		    function(entry) {	
		    	console.log("file Downloaded");
		        localStorage[url] = entry.fullPath;
		        //alert(localStorage[url]);
		        if(complete){
		        	complete(entry.fullPath);
		        }
		    },
		    function(error) {		    	
		        console.log("download error source " + error.source);
		        console.log("download error target " + error.target);
		        console.log("download error code" + error.code);
		        if(complete){
		        	complete(null);
		        }
		    }
		);
	});
}
