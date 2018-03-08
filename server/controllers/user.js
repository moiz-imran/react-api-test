const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;

module.exports = {
    signup(req, res) {
        if (req.body.password1 === req.body.password2) {
            return User
                .create({
                    username: req.body.username,
                    email: req.body.email,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    raw_password: req.body.password1
                })
                .then(user => {
                    req.login(user, function (err) {
                        if (err) { return next(err); }
                        return res.status(200).json(jwt.sign({ uuid: user.uuid }, process.env.JWT_ENCRYPTION));
                    })
                })
                .catch(error => res.status(400).send(error));
        } else {
            return res.status(401).send({ message: 'Sign up failed. Passwords don\'t match.' });
        }
    },

    login(req, res) {
        return User
            .findOne({
                where: {
                    [Op.or]: [{ username: req.body.email }, { email: req.body.email }]
                }
            })
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: 'Authentication failed. User not found.'
                    });
                } else {
                    if (!user.comparePassword(req.body.password)) {
                        return res.status(401).send({ message: 'Authentication failed. Wrong password.' });
                    } else {
                        req.login(user, function(err) {
                            if (err) { return next(err); }
                            return res.status(200).json(jwt.sign({ uuid: user.uuid }, process.env.JWT_ENCRYPTION));
                        })
                    }
                }                
            })
            .catch(error => res.status(400).send(error));
    },

    logout(req, res) {
        if (req.user) {
            return User
                .findOne({
                    where: {
                        uuid: req.user.dataValues.uuid
                    }
                })
                .then(user => {
                    if (!user) {
                        return res.status(404).send({ message: 'Logout failed. User not found.' })
                    }
                    req.logout();
                    return res.status(200).json(jwt.sign({ uuid: user.uuid }, process.env.JWT_ENCRYPTION));
                })
                .catch(error => res.status(400).send(error));
        } else {
            return res.status(401).send({ message: 'Logout failed. No user logged in.' })
        }        
    },

    getJWT(req, res) {
        if (req.user) {
            return User
                .findOne({
                    where: {
                        uuid: req.user.dataValues.uuid
                    }
                })
                .then(user => {
                    if(!user) {
                        return res.status(404).send({ message: 'Authentication failed. User not found.' })                    
                    }
                    return res.status(200).json(jwt.sign({ uuid: user.uuid }, process.env.JWT_ENCRYPTION));
                })
                .catch(error => res.status(400).send(error));
        } else {
            return res.status(401).send({ message: 'Not authorized. Need to login.' })
        }
    },

    retrieve(req, res) {
        if (req.user) {
            return User
                .findOne({
                    where: {
                        uuid: req.user.dataValues.uuid
                    },
                    attributes: { exclude: 'password' }
                })
                .then(user => {
                    if (!user) {
                        return res.status(404).send({ message: 'User not found.' })
                    }
                    return res.status(200).send(user);
                })
                .catch(error => res.status(400).send(error));
        } else {
            return res.status(401).send({ message: 'Not authorized. Need to login.' })
        }
    },

    update(req, res) {
        if (req.user) {
            return User
                .findOne({
                    where: {
                        uuid: req.user.dataValues.uuid     
                    },
                    attributes: { exclude: 'password' }
                })
                .then(user => {
                    if (!user) {
                        return res.status(404).send({ message: 'User not found.' })                        
                    }
                    return user.
                        update({
                            first_name: req.body.first_name || user.first_name,
                            last_name: req.body.last_name || user.last_name,
                            email: req.body.email || user.email
                        })
                        .then(() => res.status(200).send(user))
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        } else {
            return res.status(401).send({ message: 'Not authorized. Need to login.' })
        }
    },

    changePassword(req, res) {
        if(req.body.newPassword1 === req.body.newPassword2) {
            if (req.user) {
                return User
                    .findOne({
                        where: {
                            uuid: req.user.dataValues.uuid
                        }
                    })
                    .then(user => {
                        if (!user) {
                            return res.status(404).send({ message: 'Operation failed. User not found.' })
                        }
                        if (!user.comparePassword(req.body.oldPassword)) {
                            return res.status(401).send({ message: 'Authentication failed. Wrong password.' });
                        }
                        return user
                            .update({ raw_password: req.body.newPassword1 })
                            .then(() => res.status(200).json(jwt.sign({ uuid: user.uuid }, process.env.JWT_ENCRYPTION)))
                            .catch(error => res.status(400).send(error));
                    })
            } else {
                return res.status(401).send({ message: 'Not authorized. Need to login.' })
            }
        } else {
            return res.status(401).send({ message: 'Sign up failed. Passwords don\'t match.' });
        }
    }
}