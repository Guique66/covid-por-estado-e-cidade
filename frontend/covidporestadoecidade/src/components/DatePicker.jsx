import React, {useState, useEffect} from 'react'
import styled  from 'styled-components'
import moment from 'moment'

const StyledDatePicker = styled.input`
font-size: ${props => props.theme.fontSizes.small};
margin: 1% ;
`
const StyledLabel = styled.label`
font-size: ${props => props.theme.fontSizes.small};
`
function DatePicker({id, label, dataSelecionada}) {
    const [date, setDate] = useState(moment(Date.now()).format('YYYY-MM-DD'))
    useEffect(() => {
        dataSelecionada(date)
    }, [dataSelecionada, date])
    
    return (
        <React.Fragment>
        <StyledLabel for={id}>{label}</StyledLabel>
        <StyledDatePicker type='date' value={date} onChange={e => {setDate(e.target.value)}}></StyledDatePicker>
        </React.Fragment>
    )

}

export default DatePicker