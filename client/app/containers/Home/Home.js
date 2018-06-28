import React, { Component } from 'react';
import 'whatwg-fetch';

import {
  github_scope,
  github_client_id,
} from '../../../../config/config';
import {
  getFromStorage,
  STORAGE_KEY,
} from '../../utils/storage';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionToken: '',
    };
  }

  componentDidMount() {
    const localObj = getFromStorage(STORAGE_KEY);
    if (localObj && localObj.token) {
      this.setState({
        sessionToken: localObj.token,
      });
    }
  }

  render() {
    const {
      sessionToken,
    } = this.state;

    if (!sessionToken) {
      const openLink = `https://github.com/login/oauth/authorize?client_id=${github_client_id}&scope=${github_scope}`
      return (
        <div>
          <a href={openLink}>
            Sign in with Github
          </a>
        </div>
      );
    }
    return (
      <div>
        <p>Logged in</p>
      </div>
    );
  }
}

export default Home;
