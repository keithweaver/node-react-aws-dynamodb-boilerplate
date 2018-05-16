exports.signInOnServer = (code) => {
  return fetch(`/api/signin?code=${code}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());
};
