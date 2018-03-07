const Rating = require('../models').Rating;

module.exports = {
    create(req, res) {
        return Rating
            .create({
                score: req.body.score,
                filmId: req.params.filmId,
            })
            .then(rating => res.status(201).send(rating))
            .catch(error => res.status(400).send(error));
    },

    list(req, res) {
        return Rating
            .findAll({
                where: {
                    filmId: req.params.filmId
                }
            })
            .then(ratings => res.status(200).send(ratings))
            .catch(error => res.status(400).send(error));
    },

    retrieve(req, res) {
        return Rating
            .find({
                where: {
                    id: req.params.ratingId,
                    filmId: req.params.filmId
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
            .find({
                where: {
                    id: req.params.ratingId,
                    filmId: req.params.filmId
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
                        score: req.body.score || rating.score
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
                    filmId: req.params.filmId
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