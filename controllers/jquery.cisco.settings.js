(function ($) {
    var uploadInProgress = false;

    /*
    Response statauses
    1 = New
    2 = Marked for copying to file
    3 = copied to file
    4 = uploaded

    */

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
            masterPageController.hideNextBtn(true);
            masterPageController.hideBackBtn(false);
        },
        _upload: function (s, e) {
            var me = this;
            if (!uploadInProgress) {
                uploadInProgress = true;
                this._createFile(function () {
                    me._uploadResponse();
                });
            }
            else {
                alert("Upload in progress");
            }
        },
        _uploadResponse: function () {
        	var me = this;
        	loadingWidget.show("Uploading user response...");
            FiletransferHelper.uploadTextFile("Cisco/result.txt", baseServerPath + "/client.php?access=url.com"
            	, function(success){
            		if(success){
            		    console.log("Result uploaded sucessfully.");
            		    databaseHelper.execQuery("DELETE FROM RESPONSE WHERE STATUS=3", [], function () {
            		        me._uploadImages();
            		    });
            		}
            		else{
            			alert("Couldn't upload response to server.");
            			loadingWidget.hide();
            			me._uploadImages();
            		}
            		
            		
            	});
            
        },
        _createFile: function (callback) {
            if (isPhoneGap) {                
                var selectQueryExecuted = function (results, err) {
                    if (results.rows.length > 0) {
                        loadingWidget.show("Preparing response for upload");
                        filesystemHelper.getFile("Cisco/result.txt", function (file) {
                            if (file) {
                                var funcLoop = function () {
                                    if (file.isWriterAvailable()) {
                                        var saveText = "[";
                                        for (var i = 0; i < results.rows.length; i++) {
                                            var resp = results.rows.item(i);
                                            saveText += ((i > 0 ? "," : "") + resp.response);
                                            /*if (saveText.length > 2000) {
                                                console.log("size limit exceeded");
                                                file.saveText(saveText);
                                                saveText = "";
                                            }*/
                                        }
                                        saveText += "]";
                                        file.saveText(saveText);
                                        databaseHelper.execQuery("UPDATE RESPONSE SET status=3 WHERE STATUS=2", [], function () {
                                            if (callback) {
                                                callback();
                                            }
                                        });
                                    }
                                    else {
                                        setTimeout(funcLoop, 100);
                                    }
                                }
                                funcLoop();
                            }
                            else {
                                uploadInProgress = false;
                                loadingWidget.hide();
                            }
                        });
                    }
                    else {
                        uploadInProgress = false;
                    }

                };

                var updateQueryExecuted = function () {
                    databaseHelper.execQuery("SELECT * FROM RESPONSE WHERE STATUS=2", [], selectQueryExecuted);
                }
                filesystemHelper.getFile("Cisco/result.txt", function (file) {
                    if (file) {
                        file.deleteFile();
                    }
                    databaseHelper.execQuery("UPDATE RESPONSE SET status=2 WHERE STATUS<>4", [], updateQueryExecuted);
                }, true);
                
            }
        },
        _uploadImages: function(){
        	console.log("in uploadImages");
        	filesystemHelper.getDir("Cisco/pictures/", function(dirEntry){
        		console.log("got dir " + dirEntry);                                    
        		if (dirEntry != null) {
        		    function success(entries) {
        		        //var i;
        		        var uploading = 0;
        		        var uploaded = 0;
        		        var failed = 0;
        		        var fileCount = entries.length;
        		        if (fileCount == 0) {
        		            loadingWidget.hide();
        		            uploadInProgress = false;
        		            return;
        		        }
        		        loadingWidget.show("Uploading card image 0 of " + fileCount);
        		        var uploadImageAt = function (i) {
        		            console.log("Images qued: " + i);
        		            if (uploading < 5) {
        		                var entry = entries[i];

        		                if (entry.isFile) {
        		                    uploading++;
        		                    FiletransferHelper.uploadImageFile(entry, baseServerPath + "/UploadCardImage.php"
			        	                	, function (success) {
			        	                	    uploading--;
			        	                	    if (success) {
			        	                	        uploaded++;
			        	                	        console.log("Uploaded " + entry.fullPath);
			        	                	    }
			        	                	    else {
			        	                	        failed++;
			        	                	        console.log("Upload failed " + entry.fullPath);
			        	                	    }
			        	                	    var msg = "Uploading card image " + uploaded + " of " + fileCount;
			        	                	    if (failed > 0) {
			        	                	        msg += " (" + failed + " failed)";
			        	                	    }
			        	                	    loadingWidget.show(msg);
			        	                	});

        		                }
        		                i++;
        		            }
        		            if (i >= fileCount) {
        		                var checkUploaded = function () {
        		                    //console.log("Check upload");
        		                    //console.log("Length: " + fileCount + " Uploaded" + uploaded + " failed " + failed );
        		                    if (fileCount <= (uploaded + failed)) {
        		                        loadingWidget.hide();
        		                        uploadInProgress = false;
        		                    }
        		                    else {
        		                        setTimeout(checkUploaded, 1000);
        		                    }
        		                };
        		                checkUploaded();
        		            }
        		            else {
        		                setTimeout(function () { uploadImageAt(i); }, 1000);
        		            }

        		        }
        		        if (fileCount > 0) {
        		            uploadImageAt(0);
        		        }



        		    }

        		    function fail(error) {
        		        //alert("Failed to list directory contents: " + error.code);
        		        loadingWidget.hide();
        		    }

        		    // Get a directory reader
        		    var directoryReader = dirEntry.createReader();

        		    // Get a list of all the entries in the directory
        		    directoryReader.readEntries(success, fail);
        		}
        		else {
        		    uploadInProgress = false;
        		    loadingWidget.hide();
        		}
        	});
        },
        _download: function (s, e) {
            var me = this;
            FiletransferHelper.downloadFile(baseServerPath + "/xml/survey.xml", "survey.xml", function (path) {
            	if(path==null){
            		alert("Couldn't download Survey.")
            		loadingWidget.hide();
            	}
            	else{
	                var survey = new Survey();
	                survey.loadXML($.proxy(me._downloadResources, me), path);
            	}
            });
            loadingWidget.show();
        },
        _downloadResources: function (survey) {
            var allResources = new Array();
            for (var i = 0; i < survey.questions.length; i++) {
                var curQ = survey.questions[i];
                if (curQ.resources) {
                    for (var j = 0; j < curQ.resources.length; j++) {
                        var curR = curQ.resources[j];
                        allResources.push(curR);

                    }
                }
            }
            var downloading = 0;
            var downloaded = 0;
            var failed = 0;
            var resourceCount = allResources.length;
            loadingWidget.show("Downloading resources 0 of " + resourceCount);
            //alert(resourceCount);
            var download = function () {
                if (allResources.length > 0) {
                    if (downloading <= 5) {
                        var res = allResources.splice(0, 1)[0];
                        console.log("downloading " + res.name);
                        downloading++;
                        FiletransferHelper.downloadFile(baseServerPath + res.path, res.name, function (path) {
                            downloading--;                           
                            if(path==null){
                            	console.log("download failed " + path);
                            	failed++;
                            }
                            else{
                            	console.log("downloaded " + path);
                            	downloaded++;
                            }
                            var msg = "Downloading resources "+ downloaded +" of " + resourceCount;
                            if(failed>0){
                            	msg += " (" + failed + ")";
                            }
                            loadingWidget.show(msg);
                        });
                    }

                }
                else if (downloaded + failed >= resourceCount) {
                    alert("Resource files downloaded sucessfully");
                    loadingWidget.hide();
                    window.location = "index.html";
                }
                setTimeout(download, 50);
            }

            download();

        },
        _changeResponseClicked: function () {
            var me = this;
            loadingWidget.show();
            databaseHelper.execQuery("SELECT id, email from RESPONSE", [], function (results, err) {
                if(results){
                    var context = [];
                    for (var i = 0; i < results.rows.length; i++) {
                        var item = results.rows.item(i);
                        console.log("id: " + item.id + " email: " + item.email);
                        context.push(item);
                    }
                    me.navigateTo("responseList", context);
                    loadingWidget.hide();
                }
            });
        },
        onPrev: function (arg) {
            window.location = "index.html";
        },
        //destructor
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);