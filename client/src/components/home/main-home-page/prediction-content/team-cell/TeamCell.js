import React from 'react';
import logos from '../../../../../teamlogos/logodict';
import { Cell, CellContent, CellLogo, TeamName } from './style';

const TeamCell = ({className, team}) => {
    return <Cell className={className}>
        <CellContent>
            <TeamName>{team}</TeamName>
            <CellLogo>{logos[team]}</CellLogo>
        </CellContent>
    </Cell>
}

export default TeamCell;