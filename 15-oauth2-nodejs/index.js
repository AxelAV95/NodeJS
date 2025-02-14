// index.js
const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Ruta de inicio
app.get('/', (req, res) => {
    res.send('<h1>OAuth 2.0 Node.js</h1><a href="/auth">Login with OAuth2</a>');
});

app.get('/auth', (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user`;
    res.redirect(githubAuthUrl);
});

app.get('/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.send('Error: No code received from GitHub.');
    }

    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', null, {
            params: {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.REDIRECT_URI,
            },
            headers: {
                Accept: 'application/json',
            },
        });

        const { access_token } = response.data;
        req.session.accessToken = access_token; // Guardar el token en la sesión

        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.send('Error occurred while exchanging the authorization code for an access token.');
    }
});

app.get('/profile', async (req, res) => {
    const accessToken = req.session.accessToken;
  
    if (!accessToken) {
      return res.redirect('/');
    }
  
    try {
      const response = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.send('Error occurred while fetching user profile.');
    }
  });
  


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
