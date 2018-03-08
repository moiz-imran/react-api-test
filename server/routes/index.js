const filmController = require('../controllers').film;
const filmRatingController = require('../controllers').filmRating;
const ratingController = require('../controllers').rating;
const userController = require('../controllers').user;
const passport = require('passport');
let multer = require('multer');
let upload = multer();

require('../middleware/passport')(passport)

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Films API!',
    }));

    app.route('/api/films')
        .post(passport.authenticate('jwt', { session: false }), upload.fields([]), filmController.create)
        .get(passport.authenticate('jwt', { session: false }), filmController.list);

    app.route('/api/films/:filmId')
        .get(passport.authenticate('jwt', { session: false }), filmController.retrieve)
        .put(passport.authenticate('jwt', { session: false }), upload.fields([]), filmController.update)
        .delete(passport.authenticate('jwt', { session: false }), filmController.destroy);

    app.route('/api/films/:filmId/ratings')
        .post(passport.authenticate('jwt', { session: false }), upload.fields([]), filmRatingController.create)
        .get(passport.authenticate('jwt', { session: false }), filmRatingController.list);

    app.route('/api/films/:filmId/ratings/:ratingId')
        .get(passport.authenticate('jwt', { session: false }), filmRatingController.retrieve)
        .put(passport.authenticate('jwt', { session: false }), upload.fields([]), filmRatingController.update)
        .delete(passport.authenticate('jwt', { session: false }), filmRatingController.destroy);

    app.route('/api/ratings')
        .post(passport.authenticate('jwt', { session: false }), upload.fields([]), ratingController.create)
        .get(passport.authenticate('jwt', { session: false }), ratingController.list);
    
    app.route('/api/ratings/:ratingId')
        .get(passport.authenticate('jwt', { session: false }), ratingController.retrieve)
        .put(passport.authenticate('jwt', { session: false }), upload.fields([]), ratingController.update)
        .delete(passport.authenticate('jwt', { session: false }), ratingController.destroy);
        
    app.post('/api/accounts/signup', upload.fields([]), userController.signup);
    app.post('/api/accounts/login', upload.fields([]), userController.login);
    app.get('/api/accounts/jwt', userController.getJWT);
    app.get('/api/accounts/logout', userController.logout);
    app.get('/api/accounts/profile', passport.authenticate('jwt', { session: false }), userController.retrieve);
    app.put('/api/accounts/profile', passport.authenticate('jwt', { session: false }), upload.fields([]), userController.update);
    app.put('/api/accounts/profile/changepassword', passport.authenticate('jwt', { session: false }), upload.fields([]), userController.changePassword);

    //dev methods
    app.get('/api/accounts', userController.list);
    app.delete('/api/accounts/:username', userController.destroy);
};