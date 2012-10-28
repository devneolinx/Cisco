function FilesystemHelper() {
   
            var failCB = function (msg) {
                return function () {
                    alert('[FAIL] ' + msg);
                }
            },
            fileSystem;

            var filesQue = new Array();
            var fileSystemStatus = 0;

            console.log("on request file system");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, function () {
                console.log("failed getting fs");
                var func = failCB('requestFileSystem');
                func();
                fileSystemStatus = -1;
            });
            function gotFS(fs) {
                console.log("got file system");
        fileSystem = fs;
        fileSystemStatus = 1;
    }

    this.getFile = function (fileName, callback) {
        var me = this;
        console.log("on get file");
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
            filesQue.push({ fileName: fileName, callback: callback });
            var funcPoll = function () {
                if (fileSystemStatus == 0) {
                    setTimeout(funcPoll, 100);
                }
                else {
                    if (fileSystemStatus == 1) {
                        while (filesQue.length > 0) {
                            var fileItem = filesQue.slice(0, 1);
                            if (fileItem.callback) {
                                fileItem.callback(new File(fileItem.fileName))
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

    }

    function File(FILENAME) {
        var writer = { available: false };
        var reader = { available: false }
        var entry = null;
        console.log("creating file");
        var fail = failCB('getFile');
        fileSystem.root.getFile(FILENAME, { create: true, exclusive: false },
                            gotFileEntry, fail);
        function gotFileEntry(fileEntry) {
            console.log("got file entry");
            var fail = failCB('createWriter');
            entry = fileEntry;
            reader.available = true;
            fileEntry.createWriter(gotFileWriter, fail);
            readText();
        }

        function gotFileWriter(fileWriter) {
            console.log("got writer");
            writer.available = true;
            writer.object = fileWriter;
        }
        this.isReaderAvailable = function () {
            return reader.available;
        }
        this.isWriterAvailable = function () {
            return writer.available;
        }
        this.saveText = function (txt) {
            console.log("on save text");
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
            console.log("on read text");          
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
    }




}
