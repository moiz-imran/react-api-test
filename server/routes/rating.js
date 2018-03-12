const ratingController = require('../controllers').rating;
const passport = require('passport');
let multer = require('multer');
let upload = multer();

require('../middleware/passport')(passport)

module.exports = (app) => {
    app.use('/api/ratings', function (req, res, next) {
        res.setHeader('Allow', 'POST, GET');
        next();
    })

    app.route('/api/ratings')
        .post(passport.authenticate('jwt', { session: false }), upload.fields([]), ratingController.create)
        .get(passport.authenticate('jwt', { session: false }), ratingController.list);

    app.use('/api/ratings/:ratingId', function (req, res, next) {
        res.setHeader('Allow', 'PUT, GET, DELETE');
        next();
    })

    app.route('/api/ratings/:ratingId')
        .get(passport.authenticate('jwt', { session: false }), ratingController.retrieve)
        .put(passport.authenticate('jwt', { session: false }), upload.fields([]), ratingController.update)
        .delete(passport.authenticate('jwt', { session: false }), ratingController.destroy);
}