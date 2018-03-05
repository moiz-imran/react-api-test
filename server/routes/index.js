const filmController = require('../controllers').film;
const ratingController = require('../controllers').rating;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Films API!',
    }));

    app.post('/api/films', filmController.create);
    app.get('/api/films', filmController.list);
    app.get('/api/films/:filmId', filmController.retrieve);
    app.put('/api/films/:filmId', filmController.update);
    app.delete('/api/films/:filmId', filmController.destroy);

    app.post('/api/films/:filmId/ratings', ratingController.create);
    app.get('/api/films/:filmId/ratings', ratingController.list);
    app.get('/api/films/:filmId/ratings/:ratingId', ratingController.retrieve);
    app.put('/api/films/:filmId/ratings/:ratingId', ratingController.update);
    app.delete('/api/films/:filmId/ratings/:ratingId', ratingController.destroy);
};