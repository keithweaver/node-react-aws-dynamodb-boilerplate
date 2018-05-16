# MERN-boilerplate

This is a boilerplate project using the following technologies:
- [React](https://facebook.github.io/react/) and [React Router](https://reacttraining.com/react-router/) for the frontend
- [Express](http://expressjs.com/) and [Mongoose](http://mongoosejs.com/) for the backend
- [Sass](http://sass-lang.com/) for styles (using the SCSS syntax)
- [Webpack](https://webpack.github.io/) for compilation


## Local Dev

```
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

```
aws dynamodb create-table --cli-input-json file:///Users/weaver/Desktop/node-react-aws-dynamodb-boilerplate/config/tables/create-users-table.json --endpoint-url http://localhost:8000
aws dynamodb create-table --cli-input-json file:///Users/weaver/Desktop/node-react-aws-dynamodb-boilerplate/config/tables/create-user-sessions-table.json --endpoint-url http://localhost:8000
```

## Requirements

- [Node.js](https://nodejs.org/en/) 6+

```shell
npm install
```


## Running

Make sure to add a `config.js` file in the `config` folder. See the example there for more details.

Production mode:

```shell
npm start
```

Development (Webpack dev server) mode:

```shell
npm run start:dev
```
