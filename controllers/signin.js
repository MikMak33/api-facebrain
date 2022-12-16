const saltRounds = 3; //*ensure this is the same

const handleSignIn = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission')
    };
	db('login')
	.where('email', '=', email)
	.then(data => {
		const valid = bcrypt.compareSync(password, data[0].hash);
		if (valid) {
			db('users')
			.where('email', '=', email)
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
}

module.exports = {
    handleSignIn: handleSignIn
}