const filmController = require('../controllers').film;
const ratingController = require('../controllers').rating;
const userController = require('../controllers').user;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Films API!',
    }));

    app.post('/api/films', filmController.loginRequired, filmController.create);
    app.get('/api/films', filmController.loginRequired, filmController.list);
    app.get('/api/films/:filmId', filmController.loginRequired, filmController.retrieve);
    app.put('/api/films/:filmId', filmController.loginRequired, filmController.update);
    app.delete('/api/films/:filmId', filmController.loginRequired, filmController.destroy);

    app.post('/api/films/:filmId/ratings', filmController.loginRequired, ratingController.create);
    app.get('/api/films/:filmId/ratings', filmController.loginRequired, ratingController.list);
    app.get('/api/films/:filmId/ratings/:ratingId', filmController.loginRequired, ratingController.retrieve);
    app.put('/api/films/:filmId/ratings/:ratingId', filmController.loginRequired, ratingController.update);
    app.delete('/api/films/:filmId/ratings/:ratingId', filmController.loginRequired, ratingController.destroy);

    app.post('/api/accounts/signup', userController.signup);
    app.post('/api/accounts/login', userController.login);

    //dev
    app.get('/api/accounts', userController.list);
    app.delete('/api/accounts/:username', userController.destroy);
};