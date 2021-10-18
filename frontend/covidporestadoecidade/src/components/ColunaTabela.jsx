import React from 'react'
import styled from 'styled-components'


const StyledColunaTabela = styled.ol`
font-size: ${props => props.theme.fontSizes.small};
background: ${props => props.theme.colors.secondary};
margin: auto;
`

function ColunaTabela({ dadosColuna }) {

    if (dadosColuna == null)
        return <div></div>
    else
        return (
            <StyledColunaTabela>
                <p>Cidade / Casos por 100 mil habitantes</p>
                <ol>
                {dadosColuna.map(dados => {
                    return <li key={dados.city}>{dados.city} {dados.confirmed_per_100k_inhabitants}</li>
                })}
                </ol>
            </StyledColunaTabela>
        )
}

export default ColunaTabela