import styled from 'styled-components';

export const Leaderboard = styled.div`
    padding: 50px;
    overflow-y: auto;
    height: auto;
    overflow-x: hidden
`


export const Table = styled.table`
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 50px;
`

export const Rank = styled.td`
    padding: 10px;
`

export const Team = styled.td`
    text-align: left;
    padding: 10px;
    width: 50vh;
    display: flex;
    justify-content: space-between;

    @media (max-width: 767px) {
        width: 20vh;
    }
`

export const Logo = styled.div`
    display: flex;
    width: 20px;
    height: 20px;
`