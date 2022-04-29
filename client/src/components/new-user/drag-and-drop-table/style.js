import styled from 'styled-components'

export const TableRow = styled.li`
    padding: 5px 10px 5px 10px;
    width: 60vh;
    border: 1px solid black;
    display: flex;

    background-color: ${props => props.isFavorite && 'gold'}
`

export const Rank = styled.div`
    padding-right: 5px;
`

export const Logo = styled.div`
    display: flex;
    margin-left: auto;
    width: 20px;
    height: 20px;
`