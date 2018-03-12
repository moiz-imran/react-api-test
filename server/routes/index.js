module.exports = (app) => {
    require('./user')(app);
    require('./film')(app);
    require('./rating')(app);
    require('./filmRating')(app);

    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Films API!',
    }));
};