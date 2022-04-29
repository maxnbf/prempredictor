import React from 'react';
import logos from '../../../teamlogos/logodict';
import { Leaderboard, Logo, Rank, Table, Team } from './style';

const CommunityRanking = ({ranking}) => {
    return  <Leaderboard>
                <Table>
                    {ranking?.map((team) => {
                        return (
                        <tr key={team.ranking}>
                            <Rank>{Number.parseFloat(team.ranking).toFixed(2)}</Rank> 
                            <Team>
                                <div>{team.team}</div>
                                <Logo>{logos[team.team]}</Logo>
                            </Team> 
                        </tr>)
                    })}
                </Table>
            </Leaderboard>
}

export default CommunityRanking;
