import React, { Component } from 'react';
import 'whatwg-fetch';

class Home extends Component {
  constructor(props) {
    super(props);

  }



  render() {
    const clientId = '57745241ffc46182028e';
    const scope = 'user';
    const openLink = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}`
    return (
      <div>
        <a href={openLink}>
          Sign in with Github
        </a>
      </div>
    );
  }
}

export default Home;
