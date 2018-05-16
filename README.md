# Node.js + React.js + AWS DynamoDB + Github OAuth

This is boilerplate code for a local or remote AWS DynamoDB for a backend using Node.js with a React.js frontend and integrated Github OAuth to handle log in.


## Setup

For either production or local, rename `config.example.js` to `config.js` in the `config` folder. You will need to add values (Github Secret & AWS IAM credentials).


### Local

You will have to download the [local dev JAR](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) to execute DynamoDB on your machine. You will also need Node.js. In your first terminal window run:

```
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

In your second terminal window:

```
npm install

aws dynamodb create-table --cli-input-json file://__YOUR__PATH__/node-react-aws-dynamodb-boilerplate/config/tables/create-users-table.json --endpoint-url http://localhost:8000
aws dynamodb create-table --cli-input-json file://__YOUR__PATH__/node-react-aws-dynamodb-boilerplate/config/tables/create-user-sessions-table.json --endpoint-url http://localhost:8000
```

### Production

Assuming, you have a nginx server setup. You will need to run:

```
npm install
```


## Running

### Local

```shell
npm run start:dev
```

### Production

```shell
npm start
```
