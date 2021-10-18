import React from 'react'
import styled from 'styled-components'
import ColunaTabela from './ColunaTabela'

const StyledListaDadosCovid = styled.h2`
font-size: ${props => props.theme.fontSizes.medium};
background: ${props => props.theme.colors.primary};`

function ListaDadosCovid({ dadosCovid }) {
    console.log('Dados covid ', dadosCovid)

    if (dadosCovid == null)
        return <div></div>
    else
        return (
            <StyledListaDadosCovid>
                {dadosCovid.map(dados => {
                    return (
                        <React.Fragment>
                            <h2 key={dados.day}>Dia: {dados.day} Estado: {dados.state.name}</h2>
                            <ColunaTabela dadosColuna={dados.topTen}></ColunaTabela>
                        </React.Fragment>
                    )
                })}
            </StyledListaDadosCovid>
        )
}

export default ListaDadosCovid