const saltRounds = 3; //*ensure this is the same

const handleRegister = (req, res, db, bcrypt) => {
	const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).json('incorrect form submission')
    };
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
};

module.exports = {
    handleRegister: handleRegister
}