var client_id = '4889e43cc0dd4792938fe5cee78fd00d';
const client_secret = process.env.SPOTIFY_SECRET; // Your secret
var redirect_uri = 'http://localhost:3001/callback';
var request = require('request'); // "Request" library


// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

module.exports = (app) => {

    app.get('/spotifytest', (req, res) => {

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
          
              // use the access token to access the Spotify Web API
              var token = body.access_token;
              var options = {
                url: 'https://api.spotify.com/v1/users/313oodjlqlgtvp6joqiomhfumlyq',
                headers: {
                  'Authorization': 'Bearer ' + token
                },
                json: true
              };
              request.get(options, function(error, response, body) {
                console.log(body);
              });
            }
          });
    })
    

}

