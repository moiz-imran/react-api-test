const userController = require('../controllers').user;
const passport = require('passport');
let multer = require('multer');
let upload = multer();

require('../middleware/passport')(passport)

module.exports = (app) => {
    app.use('/api/accounts/login', function (req, res, next) {
        res.setHeader('Allow', 'POST');
        app.post('/api/accounts/login', upload.fields([]), userController.login);
        next();
    })

    app.use('/api/accounts/signup', function (req, res, next) {
        res.setHeader('Allow', 'POST');
        next();
    })

    app.post('/api/accounts/signup', upload.fields([]), userController.signup);

    app.use('/api/accounts/jwt', function (req, res, next) {
        res.setHeader('Allow', 'GET');
        next();
    })

    app.get('/api/accounts/jwt', userController.getJWT);
    
    app.use('/api/accounts/logout', function (req, res, next) {
        res.setHeader('Allow', 'GET');
        next();
    })

    app.get('/api/accounts/logout', passport.authenticate('jwt', { session: false }), userController.logout);
    
    app.use('/api/accounts/profile', function (req, res, next) {
        res.setHeader('Allow', 'GET, PUT');
        next();
    })

    app.route('/api/accounts/profile')
        .get(passport.authenticate('jwt', { session: false }), userController.retrieve)
        .put(passport.authenticate('jwt', { session: false }), upload.fields([]), userController.update);

    app.use('/api/accounts/profile/password', function (req, res, next) {
        res.setHeader('Allow', 'PUT');
        next();
    })

    app.put('/api/accounts/profile/password', passport.authenticate('jwt', { session: false }), upload.fields([]), userController.changePassword);
}
