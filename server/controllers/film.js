const Film = require('../models').Film;
const Rating = require('../models').Rating;
const Sequelize = require('sequelize');

module.exports = {
    create(req, res) {
        return Film
            .create({
                title: req.body.title,
                description: req.body.description,
                year: req.body.year
            })
            .then(film => res.status(201).send(film))
            .catch(error => res.status(400).send(error));
    },

    list(req, res) {
        return Film
            .findAll({
                // attributes: {include: [[Sequelize.fn('AVG', Sequelize.col('ratings.score')), 'average_score']]},
                // group: ["Film.id"],
                include: [{
                    model: Rating,
                    as: 'ratings',
                    // attributes: []
                }],
            })
            .then(films => res.status(200).send(films))
            .catch(error => res.status(400).send(error));
    },

    retrieve(req, res) {
        return Film
            .findById(req.params.filmId, {
                include: [{
                    model: Rating,
                    as: 'ratings',
                }],
            })
            .then(film => {
                if (!film) {
                    return res.status(404).send({
                        message: 'Film Not Found',
                    });
                }
                return res.status(200).send(film);
            })
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
        return Film
            .findById(req.params.filmId, {
                include: [{
                    model: Rating,
                    as: 'ratings',
                }],
            })
            .then(film => {
                if (!film) {
                    return res.status(404).send({
                        message: 'Film Not Found',
                    });
                }
                return film
                    .update({
                        title: req.body.title || film.title,
                        description: req.body.description || film.description,
                        year: req.body.year || film.year,
                        img_url: req.body.img_url || film.img_url
                    })
                    .then(() => res.status(200).send(film))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    destroy(req, res) {
        return Film
            .findById(req.params.filmId)
            .then(film => {
                if (!film) {
                    return res.status(400).send({
                        message: 'Film Not Found',
                    });
                }
                return film
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },

    loginRequired(req, res, next) {
        if (req.user) {
            console.log(req.user);
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized user!' });
        }
    },

};