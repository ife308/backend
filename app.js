const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./db')
const route = require('./router');
require('dotenv').config();
const cors = require("cors");

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const sessionStore = new MySQLStore({}, db);

app.use(session({
    key: 'user_cookies',
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24
    }
  }));
if (process.env.NODE_ENV === 'production') {
app.set('trust proxy', 1);
}
app.use(route);

  app.get('/', (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    res.json(req.session.user);    
  })

// logic to get all users
app.get('/api/users', (req, res) => {
    const sql = 'SELECT id, name, email FROM users';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is listening on http://0.0.0.0:${PORT}`);

})
