const filmRatingController = require('../controllers').filmRating;
const passport = require('passport');
let multer = require('multer');
let upload = multer();

require('../middleware/passport')(passport)

module.exports = (app) => {
    app.use('/api/films/:filmId/ratings', function (req, res, next) {
        res.setHeader('Allow', 'POST, GET');
        next();
    })

    app.route('/api/films/:filmId/ratings')
        .post(passport.authenticate('jwt', { session: false }), upload.fields([]), filmRatingController.create)
        .get(passport.authenticate('jwt', { session: false }), filmRatingController.list);

    app.use('/api/films/:filmId/ratings/:ratingId', function (req, res, next) {
        res.setHeader('Allow', 'PUT, GET, DELETE');
        next();
    })

    app.route('/api/films/:filmId/ratings/:ratingId')
        .get(passport.authenticate('jwt', { session: false }), filmRatingController.retrieve)
        .put(passport.authenticate('jwt', { session: false }), upload.fields([]), filmRatingController.update)
        .delete(passport.authenticate('jwt', { session: false }), filmRatingController.destroy);
}