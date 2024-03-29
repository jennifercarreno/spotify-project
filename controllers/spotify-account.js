var client_id = '4889e43cc0dd4792938fe5cee78fd00d';
const client_secret = process.env.SPOTIFY_SECRET; // Your secret
var redirect_uri = 'http://localhost:3001/callback';
const querystring = require ('querystring');
const request = require('request'); // "Request" library
var access = process.env.ACCESS; // Your access
var refresh = process.env.REFRESH; 

// THIS AUTH PROCESS WORKS

function randomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+=-';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

module.exports = (app) => {

app.get('/loginspotify', function(req, res) {
  console.log('PLAYLIST ID: '+ req.body.playlist)

  var state = randomString(16);
  var scope = 'user-read-private user-read-email playlist-modify-public';
  var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));

    
});

app.get('/callback', function(req, res, next) {

    var code = req.query.code || null;
    var state = req.query.state || null;
  
    if (state === null) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
  
          var access_token = body.access_token,
              refresh_token = body.refresh_token;

          // process.env.ACCESS = access_token;
          // console.log('AUTH TEST ACCESS ENV: '+ process.env.ACCESS)
          // process.env.REFRESH = refresh_token;
          // console.log('REFRESH TEST ACCESS ENV: '+ process.env.REFRESH)


              
  
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
          // const spotifyApi = new SpotifyWebApi({
          //   accessToken: access_token
          // });

          // spotifyApi.createPlaylist('My playlist', { 'description': 'My description', 'public': true })
          // .then(function(data) {
          //   console.log('Created playlist!');
          // }, function(err) {
          //   console.log('Something went wrong!', err);
          // });
      
          
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body + access_token);

          });

          
  
          // we can also pass the token to the browser to make requests from there
          res.redirect('/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });

    };
});



}
  
