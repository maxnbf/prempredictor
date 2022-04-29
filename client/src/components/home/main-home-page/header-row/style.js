import styled from 'styled-components';

export const TeamHeader = styled.td`
    padding: 10px;
    text-align: left;

    @media (max-width: 767px) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 40px;  
    }
`

export const PointsHeader = styled.td`
    padding: 10px;
`





