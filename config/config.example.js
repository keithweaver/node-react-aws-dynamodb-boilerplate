// Copy this file as config.js in the same folder, with the proper database connection URI.
// More info for setting up credentials for AWS DynamoDB.
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html
module.exports = {
  aws_region: 'us-east-1',
  aws_dynamodb_table: 'demoTable',
  endpoint: 'http://localhost:8080'
};

// A little more about it. After creating a table.
// 1. You need to create an IAM Role. Download the IAM Key
// and IAM secret.
//
// 2. You need the AWS CLI. Dont have it? Run:
// pip install awscli --upgrade --user
//
// 3. Enter your Access Key and Secret with running:
// aws configure
//
// AKIAIHE2WWIOZFWRIASQ
// 1vYHX3s185I8W1O0kcdvcKeAPDmOVJtIDQUHOh0+
