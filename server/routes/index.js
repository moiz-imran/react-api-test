const filmController = require('../controllers').film;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Films API!',
    }));

    app.post('/api/films', filmController.create);
    app.get('/api/films', filmController.list);
    app.get('/api/films/:id', filmController.retrieve);
    app.put('/api/films/:id', filmController.update);
    app.delete('/api/films/:id', filmController.destroy);
};