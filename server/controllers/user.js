const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;

module.exports = {
    signup(req, res) {
        return User
            .create({
                username: req.body.username,
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync())
            })
            .then(user => res.status(201).json(jwt.sign({ email: user.email, username: user.username, uuid: user.uuid }, 'RESTFULAPIs')))
            .catch(error => res.status(400).send(error));
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
                        return res.status(200).json(jwt.sign({ email: user.email, username: user.username, uuid: user.uuid }, 'RESTFULAPIs'));
                    }
                }                
            })
            .catch(error => res.status(400).send(error));
    },

    //-------------------------------------DEV METHODS--------------------------------------
    list(req, res) {
        return User
            .findAll()
            .then(users => res.status(200).send(users))
            .catch(error => res.status(400).send(error));
    },
    destroy(req, res) {
        return User
            .findOne({
                username: req.params.username
            })
            .then(user => {
                return user
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
    //---------------------------------------------------------------------------------------
}