const User = require('../models/user');
const jwt = require('jsonwebtoken');
const cors = require("cors")


module.exports = app => {
  
    app.get('/sign-up', (req, res) => res.render('sign-up'));

  // SIGN UP POST
    app.post('/sign-up', (req, res) => {
        // Create User
        const user = new User(req.body);

        user
        .save()
        .then(() => {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        return res.redirect('/home');
        });
    });

    app.get('/logout', (req, res) => {
      res.clearCookie('nToken');
      return res.redirect('/');
    });
    
    app.get('/login', (req, res) => res.render('login'));

    // LOGIN
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("login triggered");
    // Find this user name
    User.findOne({ username }, 'username password')
      .then((user) => {
        if (!user) {
          // User not found
          return res.status(401).send({ message: 'User not found' });
        }
        // Check the password
        user.comparePassword(password, (err, isMatch) => {
          if (!isMatch) {
            // Password does not match
            return res.status(401).send({ message: 'Wrong  password' });
          }
          // Create a token
          const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
            expiresIn: '60 days',
          });
          // Set a cookie and redirect to root
          res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
          return res.redirect('/home');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });



};
  