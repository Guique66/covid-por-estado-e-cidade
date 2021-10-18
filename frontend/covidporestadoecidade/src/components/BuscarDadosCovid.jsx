import React from "react";
import styled from "styled-components";
import api from '../services/api'

const StyledBuscarDadosCovid = styled.button`
display: inline;
margin: 1% auto;
font-size: ${props => props.theme.fontSizes.small};`

function BuscarDadosCovid({text, estado, dataInicial, dataFinal, dadosCovid, erro}) {
    function buscarDados() {
        console.log(estado, dataInicial, dataFinal)
        console.log('Dentro da funcao')
        api.get(`/covidporestadoperiodo`,{
            params: {
                state:  estado,
                dateStart: dataInicial,
                dateEnd: dataFinal
            }
        })
            .then(response => {
                console.log('Resposta no front ', response.data)
                dadosCovid(response.data)
                erro('')
            }).catch(error => {
                console.log(error)
                erro(`Não foi possível completar a solicitação ${error}`)
            })
    }

    return <StyledBuscarDadosCovid onClick={buscarDados}>{text}</StyledBuscarDadosCovid>
}

export default BuscarDadosCovid