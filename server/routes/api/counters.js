const AWS = require('aws-sdk');
const config = require('../../../config/config.js');

// More docs: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SQLtoNoSQL.html

module.exports = (app) => {
  app.get('/api/counters', (req, res, next) => {
    AWS.config.update({
      region: config.aws_region
    });

    const docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
      TableName: config.aws_dynamodb_table
    };

    docClient.scan(params, function(err, data) {
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
      }
    });
  });

  app.post('/api/counters', function (req, res, next) {
    const counter = {
      countVal: 0,
      id: parseInt(Math.random() * 1000)
    };

    console.log('counter', counter);
    console.log('config', config);

    AWS.config.update({
      region: config.aws_region
    });

    const docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
      TableName: config.aws_dynamodb_table,
      Item: counter
    };

    docClient.put(params, function(err, data) {
      if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
      }
    });
  });

  app.delete('/api/counters/:id', function (req, res, next) {
    const id = parseInt(req.params.id);

    AWS.config.update({
      region: config.aws_region
    });

    const docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
      TableName: config.aws_dynamodb_table,
      Key: {
        'id': id
      }
    };

    docClient.delete(params, function(err, data) {
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("delete succeeded:", JSON.stringify(data, null, 2));
      }
    });
  });

  app.put('/api/counters/:id/increment', (req, res, next) => {
    const id = parseInt(req.params.id);

    AWS.config.update({
      region: config.aws_region
    });

    const docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
      TableName: config.aws_dynamodb_table,
      Key: {
        'id': id
      },
      UpdateExpression: "set countVal = :c + countVal",
      ExpressionAttributeValues: {
        ':c': 1
      },
      ReturnValues: "UPDATED_NEW"
    };

    docClient.update(params, function(err, data) {
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("update succeeded:", JSON.stringify(data, null, 2));
      }
    });

    // More info: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html
  });
};
