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

    //very basic very bad but working way of publishing a playlist 

    app.get('/spotifytest', (req, res) => {

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
          
              // use the access token to access the Spotify Web API
              var token = 'BQCquyBOfiAXlS-npLkrAi3Gs8yEYGqubkKGK-joZzEVu2s89s5s7Y3tw71z4LdK14AnhTDENQgEh4fJwzYbSkvvJDrzhWSDsAZBDNitZQZtNYJOQ5LbLymplWQHLtEpGv6b-8yy4oXahwo88vR6tD67zCOzC9gIePXreFGp4_RCblzsrnUduTGhOaR26BJTrlgpz2Q7nVPlekLHTUmub2DWWJLZobVT0pELBCMSHEaXe6ANF1kHkp1n5YPVAK9y';
              var options = {
                url: 'https://api.spotify.com/v1/users/313oodjlqlgtvp6joqiomhfumlyq/playlists',
                
                headers: {
                  'Authorization': 'Bearer ' + token,
                  'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    'name': 'Test Playlist',
                    'public': true
                }),
                dataType:'json',
                
                
              };

              request.post(options, function(error, response, body) {
                console.log(body);
              });
            }
          });
          
        
    })
    

}

