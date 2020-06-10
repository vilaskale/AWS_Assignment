var AWS = require('aws-sdk');
var sqs = new AWS.SQS();
var ses = new AWS.SES();
var nodemailer = require('nodemailer');
var config = require('./config.json');
var s3 = new AWS.S3();
exports.handler = async (event) => {
    // TODO implement
    try {
        /* code */
        //getting message from sqs
        var Message = await sqs.receiveMessage({
            QueueUrl: config.QueueURL
        }).promise();
        //checking message is availabe in SQS or not 
        if (Message.Messages != undefined) {
            Message = Message.Messages[0];
            var messageBody = JSON.parse(Message.Body);
            //getting file from S3
            var s3Response = await s3.getObject({
                Bucket: "aws-s3-reporting-bucket",
                Key: "export.csv"
            }).promise();
            //setting mail options for nodemailer
            var mailOptions = {
                from: 'vilas.kale@codevian.com',
                subject: "User "+ messageBody.reportType + ' Report from Codevian',
                html: `<p>You got a contact message from: <b>vilas.kale@codevian.com</b></p>`,
                to: messageBody.email,
                attachments: [{
                    filename: "export.csv",
                    content: s3Response.Body
                }]
            }
            //setting mail service SES
            var transporter = nodemailer.createTransport({
                SES: ses
            });
            //Sending Report to Email
            await transporter.sendMail(mailOptions);
            //delete request from queue after sending report
            await sqs.deleteMessage({
                QueueUrl: config.QueueURL,
                ReceiptHandle: Message.ReceiptHandle
            }).promise();
            return {
                result: "Success",
                statusCode: "200",
                message: "Report Send Successfully"
            } 
        } else {
            return {
                result: "Fail",
                statusCode: "400",
                message: "Request is not Availabe in Queue"
            };
        }
    } catch (error) {
        throw error;
    }
};