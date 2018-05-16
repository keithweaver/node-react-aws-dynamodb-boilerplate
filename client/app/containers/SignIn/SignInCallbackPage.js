import React, { Component } from 'react';
import { Redirect } from 'react-router';

import {
  signInOnServer,
} from '../../utils/restapi';
import {
  setInStorage,
  STORAGE_KEY,
} from '../../utils/storage';

class SignInCallbackPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      redirectTo: null,
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const code = params.get('code');
    console.log('code', code);
    signInOnServer(code).then((response) => {
      console.log('response', response);
      if (!response.success) {
        this.setState({
          error: response.message,
        });
      } else {
        setInStorage(STORAGE_KEY, {
          token: response.sessionToken,
        });

        this.setState({
          redirectTo: '/',
        });
      }
    });
  }

  render() {
    const {
      error,
      redirectTo,
    } = this.state;

    if (error) {
      return (<p>{error}</p>);
    }

    if (redirectTo) {
      return (
        <Redirect
          to={redirectTo}
        />
      )
    }

    return (<p>Logging in</p>);
  }
}

export default SignInCallbackPage;
