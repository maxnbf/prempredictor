import styled from 'styled-components';

export const Cell = styled.td`
    padding: 10px;

    &.zero_points {
        background-color: rgba(255, 255, 255, 0.65);
    }

    &.positive_points {
        background-color: rgba(0, 128, 0, 0.75);
    }

    &.negative_points {
        background: rgba(255, 0, 0, 0.65);
    }
`