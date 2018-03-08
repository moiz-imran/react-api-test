const Film = require('../models').Film;
const Rating = require('../models').Rating;
const Sequelize = require('sequelize');
const queryString = require('querystring');

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
        const filterObj = {};
        if (req.query.ids) filterObj.id = { $in: queryString.unescape(req.query.ids).split(',') };
        req.query.min_year = isNaN(req.query.min_year) ? '' : req.query.min_year;
        req.query.max_year = isNaN(req.query.max_year) ? '' : req.query.max_year;
        filterObj.year = { $and: { $gte: req.query.min_year || 1800, $lte: req.query.max_year || (new Date()).getFullYear() } };
        if (req.query.title) filterObj.title = { $like: '%' + req.query.title + '%' };
        if (req.query.description) filterObj.description = { $like: '%' + req.query.description + '%' };

        return Film
            .findAll({
                where: filterObj,                    
                include: [{
                    model: Rating,
                    as: 'ratings',
                    attributes: { exclude: 'filmId' }
                }],
            })
            .then(films => {
                const getScore = async() => {
                    let count = 0;
                    for(let film of films) {
                        count++;
                        await Rating.aggregate('score', 'avg', { where: { filmId: film.id }, dataType: Sequelize.FLOAT })
                            .then(score => { film.setDataValue('average_score', score); })
                            .catch(err => {});
                    }
                    const currentOffset = req.query.offset ? parseInt(req.query.offset) : 0;
                    const currentLimit = req.query.limit ? parseInt(req.query.limit) : 1;

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
                }
                getScore();
            })
            .catch(error => res.status(400).send(error));
    },

    retrieve(req, res) {
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
                    .then(() => {
                        const getScore = async () => {
                            await Rating.aggregate('score', 'avg', { where: { filmId: film.id }, dataType: Sequelize.FLOAT })
                                .then(score => { film.setDataValue('average_score', score); })
                                .catch(err => { });
                            res.status(200).send(film)
                        }
                        getScore();
                    })
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