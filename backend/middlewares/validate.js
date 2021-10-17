const moment = require('moment')
const util = require('../middlewares/util/util')
const privateApis = require('../private/api')
const maxDays = 5

function checkParams(endPoint, query) {
    switch (endPoint) {
        case '/covidporestadoperiodo':
            return validateCovidPorEstadoPeriodo(query)
            break
        case '/salvarnanuvem':
            return validateSalvarNaNuvem(query)
            break
        default:
            return Promise.reject(['Endpoint não informado ou inválido.'])
            break
    }
}

function validateCovidPorEstadoPeriodo(query) {
    return new Promise((resolve, reject) => {
        let invalidParms = []
        if (!query.state) {
            invalidParms.push('O parâmetro "STATE" é obrigatório')
        }
        if (!query.dateStart) {
            invalidParms.push('O parâmetro "dateStart" é obrigatório')
        }
        if (!query.dateEnd) {
            invalidParms.push('O parâmetro "dateEnd" é obrigatório')
        }
        if (invalidParms.length == 0) {
            if (!moment(query.dateStart, 'YYYY-MM-DD', true).isValid()) {
                invalidParms.push('Informe o parâmetro "dateStart" no formato YYYY-MM-DD')
            }
            if (!moment(query.dateEnd, 'YYYY-MM-DD', true).isValid()) {
                invalidParms.push('Informe o parâmetro "dateEnd" no formato YYYY-MM-DD')
            }
            if (invalidParms.length == 0) {
                if (!moment(query.dateStart).isSame(query.dateEnd)) {
                    if (!moment(query.dateEnd).isAfter(query.dateStart)) {
                        invalidParms.push('O parâmetro "dateStart" deve ser igual ou menor do que o parâmetro "dateEnd"')
                    }
                }
            }
        }
        if (!util.daysBetweenDates(query.dateStart, query.dateEnd, maxDays)) {
            invalidParms.push(`Informe um intervalo de no máximo ${maxDays} dias`)
        }
        if (invalidParms.length > 0) {
            reject(invalidParms)
        }

        privateApis.searchStates(query.state)
            .then((response) => {
                resolve(response)
            }).catch(error => {
                reject([error])
            })
    })
}


function validateSalvarNaNuvem(query) {
    return new Promise((resolve, reject) => {
        let invalidParms = []
        if (!query.id) {
            invalidParms.push('O parâmetro "ID" é obrigatório')
        }
        if (!query.cities) {
            invalidParms.push('O parâmetro "CITY" é obrigatório')
        }
        if (!query.user) {
            invalidParms.push('O parâmetro "USER" é obrigatório')
        }
        if (!query.percent) {
            invalidParms.push('O parâmetro "PERCENT" é obrigatório')
        }
        if (invalidParms.length > 0) {
            reject(invalidParms)
        } else {
            resolve(query)
        }
    })
}

module.exports = { checkParams }