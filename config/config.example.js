// Copy this file as config.js in the same folder, with the proper database connection URI.
// More info for setting up credentials for AWS DynamoDB.
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html
module.exports = {
  local_storage_key: 'node-react-aws-dynamodb',
  aws_user_table_name: 'usersTab',
  aws_user_session_table_name: 'userSessionsTab',
  aws_table_name: 'fruitsTab',
  aws_local_config: {
    region: 'local',
    endpoint: 'http://localhost:8000'
  },
  aws_remote_config: {
    accessKeyId: 'YOUR_KEY',
    secretAccessKey: 'YOUR_SECRET_KEY',
    region: 'us-east-1',
  },
  github_client_id: '',
  github_client_secret: ''
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
