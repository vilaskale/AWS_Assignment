var AWS = require('aws-sdk');
var sqs = new AWS.SQS();
var config = require('./config.json');
var operations = ['export', 'schedule'];
var reportTypes = [ "all","email","name","phone" ];
exports.handler = async (event) => {
    try {
        /* code */
        var QueueURL = "";
        //validatation operation should be defined
        if (event['body-json'].operation == undefined) {
            return {
                result: "Fail",
                statusCode: "400",
                message: "Please Input Operation"
            };
        }
        //validatation checking operation is valid
        if (!operations.includes(event['body-json'].operation)) {
            return {
                result: "Fail",
                statusCode: "400",
                message: "Please Input A Valid Operation"
            };
        }
        //validatation reportType should be defined
        if (event['body-json'].reportType == undefined) {
            return {
                result: "Fail",
                statusCode: "400",
                message: "Please Input reportType"
            };
        }
        //validatation checking reportType is valid
        if (!reportTypes.includes(event['body-json'].reportType)) {
            return {
                result: "Fail",
                statusCode: "400",
                message: "Please Input A Valid reportType"
            };
        }
        //validatation email should be defined
        if (event['body-json'].operation == "schedule" && event['body-json'].email == undefined) {
           return {
                result: "Fail",
                statusCode: "400",
                message: "Please Input A Email"
            };
        }
        //validatation emailis required
        if (event['body-json'].operation == "schedule" && event['body-json'].email == "") {
           return {
                result: "Fail",
                statusCode: "400",
                message: "Email id required"
            };
        }
        //changing queue URL to ExportQueueURL 
        if (event['body-json'].operation == "export") {
            QueueURL = config.ExportQueueURL;
        }
        //changing queue URL to ScheduleQueueURL 
        if (event['body-json'].operation == "schedule") {
            QueueURL = config.ScheduleQueueURL;
        }
        
        //Setting Param to add message in queue 
        let SQSParams = {
            MessageBody: JSON.stringify(event['body-json']),
            MessageDeduplicationId: create_UUID(),
            MessageGroupId: create_UUID(),
            QueueUrl: QueueURL
        };
        //actual adding message in SQS with request body
        await sqs.sendMessage(SQSParams).promise();
        return {
            result: "Success",
            statusCode: "200",
            message: "Request is Placed in Queue"
        };

    } catch (err) {
        return {
            result: "Fail",
            statusCode: "500",
            error: err
        };
    }
};

//function to generate unique id
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}