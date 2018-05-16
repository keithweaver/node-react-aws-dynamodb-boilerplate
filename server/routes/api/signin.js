const superagent = require('superagent');
const async = require('async');
const AWS = require('aws-sdk');
const _ = require('lodash');

const config = require('../../../config/config');
const unique = require('../../utils/unique');
const isDev = process.env.NODE_ENV !== 'production';

module.exports = (app) => {
  /*
   * Sign into a Github account.
   * 1. Pass in the code returned by Github (Approve to sign in)
   * 2. Post code to get Access Token
   * 3. Get User information
   * 4. Get user emails
   * 5. Check for User
   * 6. Sign Up User if not there
   * 7. Create User Session
   * 8. Save User Session
   */
  app.get('/api/signin', (req, res, next) => {
    const { code } = req.query;

    console.log('/api/signin');

    if (!code) {
      res.end('Error: Invalid sign in. Please try again.');
    }

    // Set up AWS
    if (isDev) {
      console.log('isDev');
      AWS.config.update(config.aws_local_config);
    } else {
      console.log('isProd');
      AWS.config.update(config.aws_remote_config);
    }

    const docClient = new AWS.DynamoDB.DocumentClient();

    async.waterfall([
      (callback) => {
        console.log('callback1');
        // Generate access token
        superagent
          .post('https://github.com/login/oauth/access_token')
          .send({
            client_id: config.github_client_id,
            client_secret: config.github_client_secret,
            code: code
          })
          .set('Accept', 'application/json')
          .then((response) => {
            console.log('response', response);
            const { access_token } = response.body;
            console.log('generate_access_token_response', response.body);

            if (!access_token) {
              callback(null, true, {
                success: false,
                message: 'Error: Invalid code'
              });
            } else {
              callback(null, false, { access_token: access_token });
            }
          });
      },
      (hasCompleted, results, callback) => {
        if (hasCompleted) {
          callback(null, hasCompleted, results);
        } else {
          const access_token = results.access_token;
          // Get User
          superagent
            .get('https://api.github.com/user')
            .set('Authorization', `token ${access_token}`)
            .set('Accept', 'application/json')
            .then((responseUser) => {
              const userBody = responseUser.body;
              console.log('get_user_response', responseUser.body);

              callback(null, false, {
                access_token: access_token,
                user: userBody
              });
            });
        } // end of else for hasCompleted
      },
      (hasCompleted, results, callback) => {
        console.log('results0', results);
        if (hasCompleted) {
          callback(null, hasCompleted, results);
        } else {
          const { access_token } = results;
          // Get user emails
          superagent
            .get('https://api.github.com/user/emails')
            .set('Authorization', `token ${access_token}`)
            .set('Accept', 'application/json')
            .then((responseEmails) => {
              const emailsBody = responseEmails.body;
              console.log('get_emails_response', emailsBody);

              let primaryEmail = '';
              let isVerified = false;
              for (let i = 0;i < emailsBody.length; i++) {
                if (emailsBody[i].primary) {
                  primaryEmail = emailsBody[i].email;
                  isVerified = emailsBody[i].verified;

                  break;
                }
              }

              results.primaryEmail = primaryEmail;
              results.isPrimaryEmailVerified = isVerified;
              results.emails = emailsBody;

              callback(null, false, results);
            });
        }
      },
      (hasCompleted, results, callback) => {
        console.log('results1', results);
        if (hasCompleted) {
          callback(null, hasCompleted, results);
        } else {
          // Check for user
          const params = {
            TableName: config.aws_user_table_name,
            FilterExpression: 'email = :e',
            ExpressionAttributeValues: {
              ':e': results.primaryEmail
            }
          };
          console.log('params', params);

          // Change this to a scan
          docClient.scan(params, (err, data) => {
            if (err) {
              console.log('err', err);
              callback(null, true, {
                success: false,
                message: 'Error: User look up'
              });
            } else {
              console.log('data', data);
              const { Items } = data;

              console.log('users_Items', Items);

              results.userAccounts = Items;

              callback(null, false, results);
            }
          });
        }
      },
      (hasCompleted, results, callback) => {
        console.log('results2', results);
        if (hasCompleted) {
          callback(null, hasCompleted, results);
        } else {
          // Sign Up or nothing
          if (results.userAccounts.length == 0) {
            // Sign up
            console.log('Sign Up');
            let bio = '';
            if (results.user.bio) {
              bio = results.user.bio;
            }
            let company = '';
            if (results.user.company) {
              company = results.user.company;
            }
            console.log('results', results);
            // TODO - b/c of the null in the objet. AWS throws error.
            const githubUser = {
              // bio: bio,
              company: company,
              login: results.user.login,
              id: results.user.id,
              // avatar_url: results.user.avatar_url,
              // gravatar_id: results.user.gravatar_id,
              // url: results.user.url,
              // html_url: results.user.html_url,
              // followers_url: results.user.followers_url,
              // following_url: results.user.following_url,
              // gists_url: results.user.gists_url,
              // starred_url: results.user.starred_url,
              // subscriptions_url: results.user.subscriptions_url,
              // organizations_url: results.user.organizations_url,
              // repos_url: results.user.repos_url,
              // events_url: results.user.events_url,
              // received_events_url: results.user.received_events_url,
              // type: results.user.type,
              // site_admin: results.user.site_admin,
              // name: results.user.name,
              // blog: results.user.blog,
              // location: results.user.location,
              // hireable: results.user.hireable,
              // public_repos: results.user.public_repos,
              // public_gists: results.user.public_gists,
              // followers: results.user.followers,
              // following: results.user.following,
              // created_at: results.user.created_at,
              // updated_at: results.user.updated_at,
              // private_gists: results.user.private_gists,
              // total_private_repos: results.user.total_private_repos,
              // owned_private_repos: results.user.owned_private_repos,
              // disk_usage: results.user.disk_usage,
              // collaborators: results.user.collaborators,
              // two_factor_authentication: results.user.two_factor_authentication
            };

            let emails = [];
            for (let i = 0;i < results.emails.length;i++) {
              emails.push({
                email: results.emails[i].email,
                primary: results.emails[i].primary,
                verified: results.emails[i].verified
              });
            }

            const userId = unique.generateUserId();
            const newUser = {
              userId: userId,
              email: results.primaryEmail,
              // user: githubUser,
              emailVerified: results.isPrimaryEmailVerified,
              // emails: emails,
              name: results.user.name
            };
            console.log('newUser1', newUser);

            const params = {
              TableName: config.aws_user_table_name,
              Item: newUser
            };

            console.log('params2', params);

            docClient.put(params, (err, data) => {
              if (err) {
                console.log('err', err);
                callback(null, true, {
                  success: false,
                  message: 'Error: User sign up'
                });
              } else {
                console.log('data', data);
                results.userId = data.userId;
                results.name = newUser.name;
                callback(null, false, results);
              }
            });
          } else {
            console.log('Sign In');
            callback(null, false, results);
          }
        }
      },
      (hasCompleted, results, callback) => {
        console.log('results3', results);
        if (hasCompleted) {
          callback(null, hasCompleted, results);
        } else {
          // Generate user session
          const sessionToken = unique.generateSessionToken();
          const newSession = {
            "userId": results.userId,
            "sessionToken": sessionToken,
            "email": results.primaryEmail,
            "isDeleted": false,
          };

          const params = {
            TableName: config.aws_user_session_table_name,
            Item: newSession
          };

          docClient.put(params, (err, data) => {
            if (err) {
              console.log('err', err);
              callback(null, true, {
                success: false,
                message: 'Error: User session'
              });
            } else {
              results.sessionToken = sessionToken;
              callback(null, results);
            }
          });
        }
      }
    ], (err, result) => {
      if (err) {
        console.log('err', err);
        res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else {
        console.log('result', result);

        result.success = true;
        result.message = 'Signed in';

        res.send(result);
      }
    }); // end of async waterfall
  }); // end of app.get
};
