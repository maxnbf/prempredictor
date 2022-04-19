import React from 'react';
import logos from '../../../../teamlogos/logodict';
import { indexToRowStyle, pointsToColorStyle } from '../helpers';

const PredictionContent = ({myRanking, otherRanking, live}) => {
    return myRanking.ranking.map((team, index) => {
                    
        let myRow_styling = indexToRowStyle(index)
        let myPoints = myRanking.points[index];
        let myPoint_styling = pointsToColorStyle(myPoints)


        return (
        <tr className="compare-table-row" key = {index}>
            <td className={`compare-table-ranking ${myRow_styling}`}>{index + 1}</td>
            <td className={`compare-table-live-team  ${myRow_styling}`}>
                <div className="compare-table-cell">
                    <div>{live?.table[index]}</div>
                    <div className="compare-table-logo">{logos[live?.table[index]]}</div>
                </div>
            </td>
            <td className={`compare-table-predicted-team ${myRow_styling}`}>
                <div className="compare-table-cell">
                    <div>{team}</div>
                    <div className="compare-table-logo">{logos[team]}</div>
                </div>
            </td>
            <td className={`compare-table-points ${myPoint_styling}`}>{myPoints>0 && '+'}{myPoints}</td>
            {otherRanking && <td className={`compare-table-predicted-team ${myRow_styling}`}>
                <div className="compare-table-cell">
                    <div>{otherRanking.ranking[index]}</div>
                    <div className="compare-table-logo">{logos[otherRanking.ranking[index]]}</div>
                </div>
            </td>}
            {otherRanking && <td className={`compare-table-points ${myPoint_styling}`}>{myPoints>0 && '+'}{otherRanking.points[index]}</td>}
        </tr>)
    })
}

export default PredictionContent