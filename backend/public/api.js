const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validate')
const privateApis = require('../private/api')
var stateName = ''

router.use((req, res, next) => {
    validate.checkParams(req.path, req.query)
        .then(response => {
            stateName = response
            next()
        }).catch(error => {
            res.status(500).json(error)
        })
});

router.route('/covidporestadoperiodo')
    .get((req, res) => {
        privateApis.searchCovidData(req.query.dateStart, req.query.dateEnd, req.query.state, stateName)
            .then(response => {
                res.json(response)
            }).catch(error => {
                res.status(500).json(error)
            })
    })

router.route('/salvarnanuvem')
    .post((req, res) => {
        privateApis.saveOnCloud(req.query.id, req.query.city, req.query.user)
            .then(response => {
                res.json(response)
            }).catch(error => {
                res.status(500).json(error)
            })
    })


module.exports = router