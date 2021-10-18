import React from "react";
import styled from "styled-components";

const StyledCabecalho = styled.header`
background-color: black;
color: white;
text-align: center
`

function Cabecalho(){
    return (
        <StyledCabecalho>
            Covidômetro - Percentuais de Covid por cidade e população
        </StyledCabecalho>
    )
}

export default Cabecalho