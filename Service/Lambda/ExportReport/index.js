var AWS = require('aws-sdk');
var sqs = new AWS.SQS();
var config = require('./config.json');
const mongoose = require('mongoose');
const json2csv = require('json2csv').parse;
const fs = require('fs');

var s3 = new AWS.S3();
exports.handler = async (event, context) => {
    // TODO implement
    try {
        /* code */
        var fields = ['name', 'email', "address", "phone", "username"];
        //getting message from SQS queue 
        var Message = await sqs.receiveMessage({
            QueueUrl: config.QueueURL
        }).promise();
        //cheking Queue have message on not
        if (Message.Messages != undefined) {
            Message = Message.Messages[0];
            var messageBody = JSON.parse(Message.Body);
            //setting data fields as per 
            if(messageBody.reportType=='all'){
                fields = ["name", "email", "address", "phone", "username"];
            }if(messageBody.reportType=='email'){
                fields = ["email"];
            }
            if(messageBody.reportType=='name'){
                fields = ["name"];
            }
            if(messageBody.reportType=='phone'){
                fields = [ "phone"];
            }
            //Connecting to mongoDB Altals cluster Database
            var connection = await mongoose.createConnection(config.DB_URL, {
                bufferCommands: false,
                bufferMaxEntries: 0,
                useNewUrlParser: true
            });
            //creating model 
            const model = connection.models.userdetails || connection.model('userdetails', new mongoose.Schema({
                name: String,
                email: String,
                address: String,
                phone: Number,
                username: String
            }));
            //fairing query to Database
            const doc = await model.find();
            var csv = json2csv(doc, {
                fields
            });
            //writing code in CSV file
            await writeDataintoFile(csv);
            //reading data from file 
            var data = await readDataFromFile();
            var base64data = new Buffer(data, 'binary');
            //exporitng result to S3
            var s3result = await s3.putObject({
                Bucket: 'aws-s3-reporting-bucket',
                Key: 'export.csv',
                Body: base64data
            }).promise();
            //deleting message from SQS after exporting data
             await sqs.deleteMessage({
                QueueUrl: config.QueueURL,
                ReceiptHandle: Message.ReceiptHandle
            }).promise(); 
            //deleting local file after exporting data
            fs.unlinkSync("/tmp/export.csv");
            return {
                result: "Success",
                statusCode: "200",
                message: "Report Exported to s3"
            };
            
        } else {
            return {
                result: "Fail",
                statusCode: "400",
                message: "Request is not Availabe in Queue"
            };
        }
    } catch (err) {
        throw err;
    }
};


function writeDataintoFile(data) {
    return new Promise((resolve, reject) => {
        fs.writeFile("/tmp/export.csv", data, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    }).then((data) => {
        return "File Write done"
    })
}


function readDataFromFile(data) {
    return new Promise((resolve, reject) => {
        fs.readFile("/tmp/export.csv", function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    }).then((data) => {
        return data;
    })
}