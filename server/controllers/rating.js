const Rating = require('../models').Rating;
const Film = require('../models').Film;

module.exports = {
    create(req, res) {
        return Film
            .findOne({
                where: {
                    id: req.body.filmId
                }
            })
            .then(film => {
                if (!film) {
                    return res.status(404).send({ message: "Film not found!" })
                }
                return Rating
                    .create({
                        score: req.body.score,
                        filmId: req.body.filmId,
                    })
                    .then(rating => res.status(201).send(rating))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },

    list(req, res) {
        return Rating
            .findAll()
            .then(ratings => res.status(200).send(ratings))
            .catch(error => res.status(400).send(error));            
    },

    retrieve(req, res) {
        return Rating
            .findOne({
                where: {
                    id: req.params.ratingId,
                }
            })
            .then(rating => {
                if (!rating) {
                    return res.status(404).send({
                        message: 'Rating Not Found',
                    });
                }
                return res.status(200).send(rating);
            })
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
        return Rating
            .findOne({
                where: {
                    id: req.params.ratingId,
                }
            })
            .then(rating => {
                if (!rating) {
                    return res.status(404).send({
                        message: 'Rating Not Found',
                    });
                }
                return rating
                    .update({
                        score: req.body.score || rating.score,
                        filmId: req.body.filmId || rating.filmId
                    })
                    .then(() => res.status(200).send(rating))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    destroy(req, res) {
        return Rating
            .find({
                where: {
                    id: req.params.ratingId,
                }
            })
            .then(rating => {
                if (!rating) {
                    return res.status(400).send({
                        message: 'Rating Not Found',
                    });
                }
                return rating
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
};