const express = require('express');
const app = express();
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 3;
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');
const { user } = require('pg/lib/defaults');

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

db.select('*').from('users').then(data => {
	// console.log(data)
});

app.use(express.json());
app.use(cors());

app.post('/signin', (req, res) => {
	db('login')
	.where('email', '=', req.body.email)
	.then(data => {
		// console.log(req.body.email)
		// console.log(req.body.password)
		// console.log(data[0].hash)
		const valid = bcrypt.compareSync(req.body.password, data[0].hash);
		if (valid) {
			db('users')
			.where('email', '=', req.body.email)
			.returning('*')
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json('error logging in'))
		} else {
			res.json('error logging in')
		}
	})
	.catch(err => res.status(400).json('error logging in'))
});

app.post('/register', (req, res) => {
	const {name, email, password} = req.body;
	const hash = bcrypt.hashSync(password, saltRounds);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				name: name,
				email: email,
				joined: new Date()
			})
			.then(user => {
				res.json(user[0])
			})
		})
	.then(trx.commit)
	.catch(trx.rollback)
	})
});	

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
	db('users')
	.where('id', '=', req.body.id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries)
	})
	.catch(err => {
		res.status(400).json('erroe: unable to get entries')
	})
});


app.listen(55, () => {
	console.log('--------PORT 55--------')
});

//Flags
console.log('Welcome NEO to the Matrix, the potentials are endless')

//Planing API Server Routes
/*
/ --> res = Root GET is working
/signin --> POST res = success/fail
/register --> POST res => user (returns user object) 
/profile/:userid --> GET => user (returns the user)
/image --> PUT (put because it is updating) => score (returns score)


*/