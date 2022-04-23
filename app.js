const express = require("express")
const {engine} = require('express-handlebars')
const app = express();

var request = require('request'); // "Request" library
var client_id = '3d0b95c610624b5d946ad0db07b6b683'; // Your client id
var client_secret = '9c0c1e9c6c32422282a8c283e23dfa86'; // Your secret

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.json());
app.use(express.static('public'));


var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

request.post(authOptions, function(error, response, body) {

if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
    url: 'https://api.spotify.com/v1/users/paniz.k',
    headers: {
        'Authorization': 'Bearer ' + token
    },
    json: true
    };

}

    app.get('/', (req, res) => {

        request.get(options, function(error, response, body) {
            console.log(body);
            console.log(body.display_name)
            const test_body = body.display_name;
            return res.render('home', { test_body } );
        });
        

    });

});
  







app.listen(3000)
