const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validate')
const privateApis = require('../private/api')
var stateName = ''
const axios = require('axios')

router.use((req, res, next) => {
    validate.checkParams(req.path, req.query)
        .then(response => {
            if (!!response.nome)
                stateName = response.nome
            next()
        }).catch(error => {
            res.status(500).json(error)
        })
});

router.route('/covidporestadoperiodo')
    .get((req, res, next) => {
        privateApis.searchCovidData(req.query.dateStart, req.query.dateEnd, req.query.state, stateName)
            .then(response => {
                privateApis.saveOnCloud(response)
                    .then(() => {
                        res.json(response)
                    }).catch(error => {
                        res.status(500).json(error)
                    })
            }).catch(error => {
                res.status(500).json(error.response)
            })
    })

router.route('/listaestados')
    .get((req, res) => {
        privateApis.searchStates({})
            .then((response) => {
                res.json(response)
            }).catch(error => {
                res.status(500).json([error])
            })

    })


module.exports = router