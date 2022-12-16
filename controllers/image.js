const Clarifai = require('clarifai');
const { response } = require('express');

const app = new Clarifai.App({
    apiKey: 'aa372e9d61ab4646b4ef37d305674c5f'
});

const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json('unable to handle API call'))
}

const handleImage = (req, res, db) => {
    db('users')
        .where('id', '=', req.body.id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(err => {
            res.status(400).json('error: unable to get entries')
        })
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}