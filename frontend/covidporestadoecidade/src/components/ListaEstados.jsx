import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import api from '../services/api'

const StyledListaEstados = styled.select`
display: block;
font-size: ${props => props.theme.fontSizes.small};
margin: auto;
padding: 1%;
margin: 1% auto 1% auto;
`

function ListaEstados({ estadoSelecionado }) {
    const [estados, setEstados] = useState(null)
    useEffect(() => {
        api.get(`/listaestados`)
            .then(response => {
                console.log('Resposta no front ', response.data)
                setEstados(response.data)
            }).catch(error => {
                console.log(error)
            })
    }, [])

    if (estados == null)
        return <div>Carregando...</div>
    else
        return (
                <StyledListaEstados onChange={e => estadoSelecionado(e.target.value)}>
                    <option value={undefined}>Selecione o estado a ser pesquisado</option>
                    {estados.map(estado => {
                        return (
                            <option key={estado.id} value={estado.sigla}>{estado.nome} - {estado.sigla}</option>
                        )
                    })}
                </StyledListaEstados>
        );
}

export default ListaEstados;



