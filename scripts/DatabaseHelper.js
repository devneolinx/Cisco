function DatabaseHelper() {
    function populateDB(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS RESPONSE (id INTEGER PRIMARY KEY, surveyId INT,email VARCHAR(255), response TEXT, status INT, updatedAt INT)');
        //tx.executeSql('INSERT INTO RESPONSE (surveyId , deviceId , response , status , updatedAt) VALUES (1, "device1", "This is the response 1", 1, ' + timestamp + ')');
        //tx.executeSql('INSERT INTO RESPONSE (surveyId , deviceId , response , status , updatedAt) VALUES (1, "device2", "This is the response 2", 1, ' + timestamp + ')');
        //tx.executeSql('INSERT INTO RESPONSE (surveyId , deviceId , response , status , updatedAt) VALUES (1, "device3", "This is the response 3", 1, ' + timestamp + ')');
        
    }

    function errorCDB(err) {
        alert("Error processing SQL: " + err.code);
    }
    this.isReady = false;
    function successCDB() {
        this.isReady = true;
    }
    var db = window.openDatabase("CiscoSurvey", "1.0", "Cisco Survey", 20000);
    db.transaction(populateDB, errorCDB, successCDB);

    this.execQuery = function (query, params, callback) {
        var queryCB = function (tx) {
            var querySuccess = function (tx, results) {

                if (results.rowsAffected) {
                    console.log("Query: " + query + ", Rows Affected: " + results.rowsAffected);
                }
                else {
                    console.log("Query: " + query + ", results: " + results.rows.length);
                }
                if (callback) {
                    callback(results, null);
                }

                /*for (var i = 0; i < results.rows.length; i++) {
                    var row = results.rows.item(i);
                    var rowText = ""
                    for (var key in row) {
                        rowText += (key + " : " + row[key] + ", ");
                    }
                    
                    console.log(rowText);
                }*/
                
            };
            var errorQ = function (err) {
                console.log("Error executing SQL: " + err.code + ", Message: " + err.message + " Query: " + query);
                if (callback) {
                    callback(null, err);
                }
            };
            tx.executeSql(query, params? params:[], querySuccess, errorQ);
        };
        function errorT(err) {
            console.log("Error processing SQL: " + err.code);
        }
        db.transaction(queryCB, errorT);
    }

   

}