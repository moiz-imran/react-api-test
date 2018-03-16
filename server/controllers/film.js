const Film = require('../models').Film;
const Rating = require('../models').Rating;
const Sequelize = require('sequelize');
const queryString = require('querystring');
const Op = require('sequelize').Op;

module.exports = {
    create(req, res) { // Create new film
        return Film
            .create({
                title: req.body.title,
                description: req.body.description || null,
                year: req.body.year || null,
                img_url: req.body.img_url || null,
                ratings: []
            }, {
                include: [{
                    model: Rating,
                    as: 'ratings',
                    attributes: { exclude: 'filmId' }
                }],
            })
            .then(film => res.status(201).send(film))
            .catch(error => {
                if (error.errors) { return res.status(400).send({ message: error.errors[0].message }); }
                return res.status(400).send(error);
            });
    },

    list(req, res) { // List all films (filters, calculates avg score, adds pagination)
        let filterObj = {};
        if (req.query.ids) filterObj.id = { [Op.in] : queryString.unescape(req.query.ids).split(',') };
        req.query.min_year = isNaN(req.query.min_year) ? '' : req.query.min_year;
        req.query.max_year = isNaN(req.query.max_year) ? '' : req.query.max_year;
        filterObj.year = { [Op.and] : { [Op.gte] : req.query.min_year || 1800, [Op.lte] : req.query.max_year || (new Date()).getFullYear() } };

        if (req.query.title && req.query.description) {
            const orObj = {
                [Op.or]: {
                    title: { [Op.iLike]: '%' + req.query.title + '%' },
                    description: { [Op.iLike]: '%' + req.query.description + '%' }
                } 
            }
            filterObj = { ...filterObj, ...orObj};
        } else {
            if (req.query.title) filterObj.title = { [Op.iLike]: '%' + req.query.title + '%' };
            if (req.query.description) filterObj.description = { [Op.iLike]: '%' + req.query.description + '%' };
        }

        return Film
            .findAll({
                attributes: {
                    include: [[Sequelize.cast(Sequelize.literal('(SELECT AVG("Ratings"."score") FROM "Ratings" WHERE "Ratings"."filmId" = "Film"."id")'), 'float'), 'average_score']]
                },
                where: filterObj,                    
                include: [{
                    model: Rating,
                    as: 'ratings',
                    attributes: { exclude: 'filmId' }
                }],
            })
            .then(films => {
                let count = films.length;
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
                    'results': films.slice(currentOffset, currentOffset+currentLimit)
                });
            })
            .catch(error => {
                if (error.errors) { return res.status(400).send({ message: error.errors[0].message }); }
                return res.status(400).send(error);
            });
    },

    retrieve(req, res) { // Returns a single Film according to ID (calculates avg score)
        return Film
            .findById(req.params.filmId, {
                include: [{
                    model: Rating,
                    as: 'ratings',
                    attributes: { exclude: 'filmId' }
                }],
            })
            .then(film => {
                if (!film) {
                    return res.status(404).send({
                        message: 'Film Not Found',
                    });
                }
                const getScore = async () => {
                    await Rating.aggregate('score', 'avg', { where: { filmId: film.id }, dataType: Sequelize.FLOAT })
                        .then(score => { film.setDataValue('average_score', score); })
                        .catch(err => { });
                    res.status(200).send(film)
                }
                getScore();
            })
            .catch(error => {
                if (error.errors) { return res.status(400).send({ message: error.errors[0].message }); }
                return res.status(400).send(error);
            });
    },

    update(req, res) { // Updates a single Film according to ID (calculates avg score to return Film)
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
                    .then(() => {
                        const getScore = async () => {
                            await Rating.aggregate('score', 'avg', { where: { filmId: film.id }, dataType: Sequelize.FLOAT })
                                .then(score => { film.setDataValue('average_score', score); })
                                .catch(err => { });
                            res.status(200).send(film)
                        }
                        getScore();
                    })
                    .catch(error => {
                        if (error.errors) { return res.status(400).send({ message: error.errors[0].message }); }
                        return res.status(400).send(error);
                    });
            })
            .catch(error => {
                if (error.errors) { return res.status(400).send({ message: error.errors[0].message }); }
                return res.status(400).send(error);
            });
    },

    destroy(req, res) { // Deletes a single film
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
                    .catch(error => {
                        if (error.errors) { return res.status(400).send({ message: error.errors[0].message }); }
                        return res.status(400).send(error);
                    });
            })
            .catch(error => {
                if (error.errors) { return res.status(400).send({ message: error.errors[0].message }); }
                return res.status(400).send(error);
            });
    }
};