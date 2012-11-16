function FilesystemHelper() {
			var allFiles = [];
            var failCB = function (msg) {
                return function () {
                    alert('[FAIL] ' + msg);
                }
            },
            fileSystem;

            var filesQue = new Array();
            var fileSystemStatus = 0;

            //console.log("on request file system");

            //window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, function () {
                    console.log("failed getting fs");
                    var func = failCB('requestFileSystem');
                    func();
                    fileSystemStatus = -1;
                });
            /*}, function(e) {
            console.log('Error', e); 
            });*/
            //console.log("requested file system");
            
            function gotFS(fs) {
                //console.log("got file system");
                fileSystem = fs;
                fileSystemStatus = 1;
            }

    this.getFile = function (fileName, callback, readonly) {
        var me = this;
        //console.log("on get file");
        if (fileSystemStatus == -1) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0
            , function (fs) { gotFS(fs); me.getFile(fileName, callback) }
            , function () {
                var func = failCB('requestFileSystem');
                func();
                fileSystemStatus = -1;
                if (callback) {
                    callback(null);
                }
            });
        }
        else {
        	if(!allFiles[fileName]){
	            filesQue.push({ fileName: fileName, callback: callback });
	            var funcPoll = function () {
	                if (fileSystemStatus == 0) {
	                    setTimeout(funcPoll, 100);
	                }
	                else {
	                    if (fileSystemStatus == 1) {
	                        while (filesQue.length > 0) {
	                            var fileItem = filesQue.splice(0, 1)[0];
	                            if (fileItem.callback) {
	                            	var newFile = new File(fileItem.fileName, readonly, fileItem.callback);
	                            	newFile.getFile();
	                                //fileItem.callback(newFile)
	                            }
	                        }
	                    }
	                    else {
	                        if (fileItem.callback) {
	                            fileItem.callback(null)
	                        }
	                    }
	                }
	            }
	            funcPoll();
        	}
        	else{
        		if (callback) {
                    callback(allFiles[fileName]);
                }        		
        	}
        }

    }

    function File(FILENAME, readonly, callback) {
        var writer = { available: false };
        var reader = { available: false }
        var entry = null;
        //console.log("creating file");
        var fail = failCB('getFile');
        var me = this;
        function gotFileEntry(fileEntry) {
            //console.log("got file entry");
            var fail = failCB('createWriter');
            entry = fileEntry;
            reader.available = true;
            if(!readonly){
	            fileEntry.createWriter(gotFileWriter, function(){
    				fail();
    				if(callback){    					
    	            	callback(null)
    	            }
    			});
	            //readText();
            }
            else{
            	if(callback){
            		allFiles[FILENAME] = me;
	            	callback(me)
	            }            	
            }
        }

        var fileParts = FILENAME.split("/");
        var createDirRecursively = function(i, parent){
        	
        	var filePart = fileParts[i];
        	//console.log("Filepart: " + filePart);
        	if(filePart && filePart!=""){
        		if(i== fileParts.length-1){
        			parent.getFile(filePart, { create: !readonly, exclusive: false },
                            gotFileEntry, function(){
		        				fail();
		        				if(callback){
		        	            	callback(null)
		        	            }
		        			}
        			);
        			
        		}
        		else{
        			parent.getDirectory(filePart, {create: true, exclusive: false},
		        			function(dir){
	        					curDir = dir
	        					createDirRecursively(++i, dir);
		        			},
		        			function(){
		        				console.log("Creating directory '"+ filePart +"' failed")
		        			}
	        			);	
        		}
        	}
        	
        }
        
        this.getFile = function(){
        	me = this;
        	createDirRecursively(0, fileSystem.root);
        }
        

        function gotFileWriter(fileWriter) {
            //console.log("got writer");
            writer.available = true;
            var length = fileWriter.length;
            fileWriter.seek(length);
            writer.object = fileWriter;
            if(callback){
            	allFiles[FILENAME] = me;
            	//alert(me.getFullPath());
            	callback(me);
            }
        }
        this.isReaderAvailable = function () {
            return reader.available;
        }
        this.isWriterAvailable = function () {
            return writer.available;
        }
        this.getFullPath = function(){
        	return entry.fullPath;
        }
        this.saveText = function (txt) {
            //console.log("on save text");
            if (writer.available) {
                writer.available = false;
                writer.object.onwriteend = function (evt) {
                    writer.available = true;
                    writer.object.seek(0);
                }
                writer.object.write(txt);
            }

            return false;
        }

        this.readText = function (onReadComplete) {
            //console.log("on read text");          
            var readText = ""
            if (entry) {
                entry.file(function (dbFile) {
                    var reader = new FileReader();
                    reader.onloadend = function (evt) {
                        readText = evt.target.result;
                        onReadComplete(readText);
                    }
                    reader.readAsText(dbFile);
                }, function () {
                    var func = failCB("FileReader")
                    func() ;
                    onReadComplete(null);
                });
            }

            return false;
        }
        this.deleteFile = function(){
        	entry.remove;
        	allFiles[FILENAME] = null;
        }
    }




}
