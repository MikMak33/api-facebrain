const express = require('express');
const app = express();
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 3; //*ensure this is the same
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');
const { user } = require('pg/lib/defaults');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

const db = knex ({
	client: 'pg',
	connection: {
	  host : '127.0.0.1',
	  port : 5432,
	  user : 'postgres',
	  password : 'test',
	  database : 'postgres'
	}
});

app.use(express.json());
app.use(cors());

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });
app.get('/profile/:id', (req, res, db) => { profile.handleProfileGet(req, res, db) });

// app.listen(55, () => { console.log('--------WELCOME NEW TO PORT 55--------')});
const PORT = 55;
app.listen(PORT, () => { console.log(`--------WELCOME NEO TO PORT ${PORT}--------`)});
console.log('PORT: ', PORT);