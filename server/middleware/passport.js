const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models').User;

module.exports = function (passport) {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = process.env.JWT_ENCRYPTION;

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        return User
            .findOne({
                where: {
                    uuid: jwt_payload.uuid
                }
            })
            .then(user => {
                if (!user) {
                    return done(null, false);
                } else {
                    return done(null, user);
                }
            })
            .catch(error => done(error, false));
    }));
}