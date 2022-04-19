import React from 'react'

const HeaderRow = ({otherRanking, user, username}) => {
return<tr>
    <td>

    </td>
    <td className="compare-table-live-team">
        Live Table
    </td>
    <td className="compare-table-predicted-team">
        {user.username ? user.username : username}'s Predicitons
    </td>
    <td className="compare-table-points">
        My Points
    </td>
    {otherRanking && <td className="compare-table-predicted-team">
        {username}'s Predicitons
    </td>}
    {otherRanking && <td className="compare-table-points">
        Their Points
    </td>}

</tr>
}

export default HeaderRow