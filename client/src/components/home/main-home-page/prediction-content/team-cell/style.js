import styled from 'styled-components';


export const Cell = styled.td`
    padding: 10px;
    text-align: left;
    border: 1px solid black;
    border-collapse: collapse;


    &.compare-table-champions {
        background-color: rgba(30, 212, 87, 0.5);
    }

    &.compare-table-top-four {
        background-color: rgba(106, 191, 15, 0.5);
    }

    &.compare-table-relegation {
        background-color: rgba(209, 37, 10, 0.5); 
    }

    &.compare-table-other {
        background-color: rgba(214, 217, 54, 0.5);
    }
`

export const CellContent = styled.div`
    display: flex;
    justify-content: space-between;
`

export const CellLogo = styled.div`
    display: flex;
    width: 20px;
    height: 20px;
`

export const TeamName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`