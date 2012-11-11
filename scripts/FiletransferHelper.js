var FiletransferHelper = {};
FiletransferHelper.uploadTextFile= function(filePath, uploadUrl){
	var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName="CiscoResponse.txt";
    options.mimeType="text";    

    filesystemHelper.getFile(filePath,/*sucess*/ function(file){
    	var fullPath = file.getFullPath();
    	var ft = new FileTransfer();
        ft.upload(fullPath, encodeURI(uploadUrl), win, fail, options);
    },
    /*fail*/
    function(){
    	
    }
    )
    
    
    
    function win(r) {
    	alert("file uploaded sucessfully")
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    }

    function fail(error) {
        alert("An error has occurred: Code = " + error.code);
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
		//file.delete();
		var fileTransfer = new FileTransfer();
		var uri = encodeURI(url);

		fileTransfer.download(
		    uri,
		    fullPath,
		    function(entry) {		        
		        localStorage[url] = entry.fullPath;
		        if(!complete){
		        	complete(entry.fullPath);
		        }
		    },
		    function(error) {		    	
		        console.log("download error source " + error.source);
		        console.log("download error target " + error.target);
		        console.log("upload error code" + error.code);
		        if(!complete){
		        	complete(null);
		        }
		    }
		);
	});
}
