const filmController = require('../controllers').film;
const passport = require('passport');
let multer = require('multer');
let upload = multer();

require('../middleware/passport')(passport)

module.exports = (app) => {
    app.use('/api/films', function (req, res, next) {
        res.setHeader('Allow', 'POST, GET');
        next();
    })

    app.route('/api/films')
        .post(passport.authenticate('jwt', { session: false }), upload.fields([]), filmController.create)
        .get(passport.authenticate('jwt', { session: false }), filmController.list);

    app.use('/api/films/:filmId', function (req, res, next) {
        res.setHeader('Allow', 'PUT, GET, DELETE');
        next();
    })

    app.route('/api/films/:filmId')
        .get(passport.authenticate('jwt', { session: false }), filmController.retrieve)
        .put(passport.authenticate('jwt', { session: false }), upload.fields([]), filmController.update)
        .delete(passport.authenticate('jwt', { session: false }), filmController.destroy);
}