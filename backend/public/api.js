const express = require('express')
const router = express.Router()
const axios = require('axios')
const moment = require('moment')
const brasilIoToken = 'Token cd06accc7cba9e0b48b4d3106f3ea4359f593725'

axiosLocalidades = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades/',
})

axiosBrasilIo = axios.create({
    baseURL: 'https://api.brasil.io/v1/dataset/covid19/'
})

router.route('/covidporestadoperiodo')
    .get((req, res, next) => {
        let invalidParms = []
        if (!req.query.state) {
            invalidParms.push('O parâmetro "STATE" é obrigatório')
        }
        if (!req.query.dateStart) {
            invalidParms.push('O parâmetro "dateStart" é obrigatório')
        }
        if (!req.query.dateEnd) {
            invalidParms.push('O parâmetro "dateEnd" é obrigatório')
        }

        if (invalidParms.length > 0) {
            res.status(500).json(invalidParms)
            return
        }

        if (!moment(req.query.dateStart, 'YYYY-MM-DD', true).isValid()) {
            invalidParms.push('Informe o parâmetro "dateStart" no formato YYYY-MM-DD')
        }

        if (!moment(req.query.dateEnd, 'YYYY-MM-DD', true).isValid()) {
            invalidParms.push('Informe o parâmetro "dateEnd" no formato YYYY-MM-DD')
        }

        if (invalidParms.length > 0) {
            res.status(500).json(invalidParms)
            return
        }

        if (!moment(req.query.dateStart).isSame(req.query.dateEnd)) {
            if (!moment(req.query.dateEnd).isAfter(req.query.dateStart)) {
                res.status(500).json(['O parâmetro "dateStart" deve ser igual ou menor do que o parâmetro "dateEnd"'])
                return
            }
        }

        axiosLocalidades.get('estados', {
            params: {
                orderBy: 'nome'
            }
        }).then(response => {
            console.log('Entrou aqui')
            if (!!response.data.find(estado => estado.sigla === req.query.state) == false) {
                res.status(500).json([`O estado ${req.query.state} é inválido.`])
                return
            }

            let datesBetween = []
            datesBetween[0] = req.query.dateStart
            while (datesBetween[datesBetween.length - 1] != req.query.dateEnd) {
                datesBetween.push(moment(datesBetween[datesBetween.length - 1]).add(1, 'day').format('YYYY-MM-DD'))
                if (datesBetween.length > 5) {
                    res.status(500).json(['Informe um intervalo de no máximo 5 dias'])
                    return
                }
            }

            let requests = []
            datesBetween.forEach(date => {
                console.log('Dentro do loop ', date)
                requests.push(getCovidData(date))
            })

            Promise.all(requests)
                .then(response => {
                    console.log('Dentro do promise.All ', response)
                    res.json(response.data)
                }).catch(error => {
                    console.log('Deu erro ', error)
                    res.status(500).json([error])
                })

            function getCovidData(day) {
                return new Promise((resolve, reject) => {
                    console.log('Vai chamar ', day, req.query.state)
                    axiosBrasilIo.get('caso/data/', {
                        headers: {
                            Authorization: brasilIoToken
                        },
                        params: {
                            state: req.query.state,
                            date: day
                        }
                    }).then(response => {
                        resolve(response.data.results)
                    }).catch(error => {
                        reject(error)
                    })
                })
            }
        }).catch(error => {
            res.status(500).json([error])
        })
    })


module.exports = router