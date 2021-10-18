const util = require('../middlewares/util/util')
const brasilIoToken = 'Token cd06accc7cba9e0b48b4d3106f3ea4359f593725'
const axios = require('axios')

axiosLocalidades = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades/',
})

axiosBrasilIo = axios.create({
    baseURL: 'https://api.brasil.io/dataset/covid19/',
})

axiosNuvemMestra = axios.create({
    baseURL: 'https://us-central1-lms-nuvem-mestra.cloudfunctions.net/',
})

function searchStates() {
    return new Promise((resolve, reject) => {
        axiosLocalidades.get('estados', {
            params: {
                orderBy: 'nome'
            }
        }).then(response => {
            resolve(response.data)
        }).catch(error => {
            reject([error])
        })
    })
}

function searchCovidData(start, end, state, stateName) {
    return new Promise((resolve, reject) => {
        let requests = []
        let days = util.daysBetweenDates(start, end)
        if (days) {
            days.forEach(date => {
                requests.push(getCovidData(date, state))
            })
        } else {
            reject(['Não foi possível calcular o intervalo de datas.'])
        }

        Promise.all(requests)
            .then(response => {
                resolve(response)
            }).catch(error => {
                reject([error])
            })

        function getCovidData(day, state) {
            console.log('Chegou no Brasil IO')
            return new Promise((resolve, reject) => {
                axiosBrasilIo.get('caso/data/', {
                    headers: {
                        Authorization: brasilIoToken,
                    },
                    params: {
                        state: state,
                        date: day
                    }
                }).then(response => {
                    topTen = response.data.results.map(({ city, confirmed_per_100k_inhabitants }) => ({ city, confirmed_per_100k_inhabitants })).sort((a, b) => Number(b.confirmed_per_100k_inhabitants) - Number(a.confirmed_per_100k_inhabitants)).slice(0, 10)
                    resolve({ day: day, state: { abb: state, name: stateName }, topTen: topTen })
                }).catch(error => {
                    console.log('Erro do Brasil IO ', error)
                    reject(error.status)
                })
            })
        }
    })
}


function saveOnCloud(dados) {
    return new Promise((resolve, reject) => {
        let requests = []
        dados.forEach(dado => {
            dado.topTen.forEach((top, index) => {
                requests.push(saveCloud({ id: index + 1, city: top.city, perc: top.confirmed_per_100k_inhabitants }))
            })
        })

        Promise.all(requests)
            .then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject([error])
            })

        function saveCloud(dados) {
            return new Promise((resolve, reject) => {
                axiosNuvemMestra.post('testeApi/', {
                    headers: {
                        MeuNome: 'Guilherme'
                    },
                    params: {
                        id: dados.id,
                        nomeCidade: dados.city,
                        percentualDeCasos: dados.percent
                    }
                }).then(() => {
                    console.log('Salvou corretamente')
                    resolve('Solicitação processada com sucesso!')
                }).catch(error => {
                    reject([error])
                })
            })
        }
    })
}
module.exports = { searchStates, searchCovidData, saveOnCloud }