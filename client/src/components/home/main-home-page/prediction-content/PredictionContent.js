import React from 'react';
import { indexToRowStyle, pointsToColorStyle } from '../helpers';
import PointCell from './point-cell/PointCell';
import TeamCell from './team-cell/TeamCell';

const PredictionContent = ({myRanking, otherRanking, live}) => {

    return myRanking.ranking.map((team, index) => {
                    
        let positionColor = indexToRowStyle(index)
        let myPoints = myRanking.points[index];
        let theirPoints = otherRanking?.points[index]

        return (
        <tr key = {index}>
            <td className={`compare-table-ranking ${positionColor}`}>{index + 1}</td>
            <TeamCell className={positionColor} team={live?.table[index]}/>
            <TeamCell className={positionColor} team={team}/>
            <PointCell className={pointsToColorStyle(myPoints)} points={myPoints}/>
            {otherRanking && <TeamCell className={positionColor} team={otherRanking.ranking[index]}/>}
            {otherRanking && <PointCell className={pointsToColorStyle(theirPoints)} points={theirPoints} />}
        </tr>)
    })
}

export default PredictionContent