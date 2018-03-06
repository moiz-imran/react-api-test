const filmController = require('../controllers').film;
const ratingController = require('../controllers').rating;
const userController = require('../controllers').user;
const passport = require('passport');

require('../middleware/passport')(passport)

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Films API!',
    }));

    app.route('/api/films')
        .post(passport.authenticate('jwt', { session: false }), filmController.create)
        .get(passport.authenticate('jwt', { session: false }), filmController.list);

    app.route('/api/films/:filmId')
        .get(passport.authenticate('jwt', { session: false }), filmController.retrieve)
        .put(passport.authenticate('jwt', { session: false }), filmController.update)
        .delete(passport.authenticate('jwt', { session: false }), filmController.destroy);

    app.route('/api/films/:filmId/ratings')
        .post(passport.authenticate('jwt', { session: false }), ratingController.create)
        .get(passport.authenticate('jwt', { session: false }), ratingController.list);

    app.route('/api/films/:filmId/ratings/:ratingId')
        .get(passport.authenticate('jwt', { session: false }), ratingController.retrieve)
        .put(passport.authenticate('jwt', { session: false }), ratingController.update)
        .delete(passport.authenticate('jwt', { session: false }), ratingController.destroy);

    app.post('/api/accounts/signup', userController.signup);
    app.post('/api/accounts/login', userController.login);
    app.get('/api/accounts/jwt', userController.getJWT);

    //dev
    app.get('/api/accounts', userController.list);
    app.delete('/api/accounts/:username', userController.destroy);
};