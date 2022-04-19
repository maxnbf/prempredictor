import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Leaderboard = styled.div`
    padding: 50px;
    overflow: auto;
    height: auto;
`

export const Table = styled.table`
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 50px;
`

export const Row = styled.tr`
`

export const RankCol = styled.td`
    padding: 10px;
`

export const UsernameCol = styled.td`
    text-align: left;
    padding: 10px;
    width: 50vh;
    display: flex;
    justify-content: space-between;
`

export const UsernameColText = styled(Link)`
    text-decoration: none;
    color: black;
`

export const UsernameColLogo = styled.div`
    display: flex;
    width: 20px;
    height: 20px;
`

export const PointsCol = styled.td`
    padding: 10px;
    text-align: center;
`

export const UsernameHeader = styled.td`
    padding: 10px;
`

export const PointsHeader = styled.td`
    padding: 10px;
`