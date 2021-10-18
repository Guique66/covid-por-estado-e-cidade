import React, { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import Cabecalho from './components/Cabecalho';
import ListaEstados from './components/ListaEstados'
import DatePicker from './components/DatePicker';
import BuscarDadosCovid from './components/BuscarDadosCovid';
import ListaDadosCovid from './components/ListaDadosCovid';

const theme = {
  colors: {
    primary: "#FFFDF9",
    secondary: "#06B49A",
  },
  fonts: ['Roboto', 'monospace'],
  fontSizes: {
    small: "0.5em",
    medium: "1em",
    large: "2em"
  },
  justifyContent: 'space around'
}


function App() {
  const [dataInicial, setDataInicial] = useState()
  const [dataFinal, setDataFinal] = useState()
  const [estadoSelecionado, setEstadoSelecionado] = useState()
  const [dadosCovid, setDadosCovid] = useState(null)
  const [erro, setErro] = useState('')
  return (
      <ThemeProvider theme={theme}>
        <Cabecalho></Cabecalho>
        <ListaEstados estadoSelecionado={dados => setEstadoSelecionado(dados)}></ListaEstados>
        <DatePicker id='DataInicial' label='Data inicial' dataSelecionada={dados => setDataInicial(dados)}></DatePicker>
        <DatePicker id='DataFinal' label='Data final' dataSelecionada={dados => setDataFinal(dados)}></DatePicker>
        <BuscarDadosCovid estado={estadoSelecionado} dataInicial={dataInicial} dataFinal={dataFinal} text='Buscar dados' dadosCovid={dados => setDadosCovid(dados)} erro={erro=> setErro(erro)}></BuscarDadosCovid>
        <ListaDadosCovid dadosCovid={dadosCovid}></ListaDadosCovid>
        <div>{erro}</div>
      </ThemeProvider>
  );
}

export default App;