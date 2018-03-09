const Rating = require('../models').Rating;
const queryString = require('querystring');
const Op = require('sequelize').Op;

module.exports = {
    create(req, res) { // Create rating for film with ID in params
        return Rating
            .create({
                score: req.body.score,
                filmId: req.params.filmId,
            })
            .then(rating => res.status(201).send(rating))
            .catch(error => res.status(400).send(error));
    },

    list(req, res) { // Lists all ratings for film (params) (score filters and pagination)
        const filterObj = {};
        req.query.min_score = isNaN(req.query.min_score) ? 0 : req.query.min_score;
        req.query.max_score = isNaN(req.query.max_score) ? 10 : req.query.max_score;
        filterObj.score = { [Op.and] : { [Op.gte] : req.query.min_score || 0, [Op.lte] : req.query.max_score || 10 } };
        filterObj.filmId = req.params.filmId;
        return Rating
            .findAll({
                attributes: { exclude: 'filmId' },
                where: filterObj
            })
            .then(ratings => {
                let count = ratings.length;
                const currentOffset = req.query.offset ? parseInt(req.query.offset) : 0;
                const currentLimit = req.query.limit ? parseInt(req.query.limit) : 5;

                let prevUrl = null;
                const prevOffset = currentOffset - currentLimit;
                if (prevOffset >= 0) {
                    const prevQuery = req.query;
                    prevQuery.offset = prevOffset;
                    const prevQString = (queryString.stringify(prevQuery));
                    prevUrl = "http://" + req.headers.host + req._parsedUrl.pathname + '?' + prevQString
                }

                let nextUrl = null;
                const nextOffset = currentOffset + currentLimit;
                if (nextOffset < count) {
                    const nextQuery = req.query;
                    nextQuery.offset = nextOffset;
                    const nextQString = (queryString.stringify(nextQuery));
                    nextUrl = "http://" + req.headers.host + req._parsedUrl.pathname + '?' + nextQString;
                }

                res.status(200).json({
                    'count': count,
                    'prev': prevUrl,
                    'next': nextUrl,
                    'results': ratings.slice(currentOffset, currentOffset + currentLimit)
                });
            })
            .catch(error => res.status(400).send(error));
    },

    retrieve(req, res) { // Returns single rating for film from params
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

    update(req, res) { // Updates single rating for film from params
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

    destroy(req, res) { // Deletes single rating for film from params
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