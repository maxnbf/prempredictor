import React, { useState } from 'react'
import { makeRanking } from '../../redux/actions/rankingActions'
import SetOrder from './drag-and-drop-table/DragAndDropTable'
import { ErrorMessage, InstructionsContent, NewUserContainer, NewUserInstructions, NewUserSaveButton, NewUserSaveButtonContainer, NewUserSaveContainer } from './style'

const globalTeams = ['Arsenal', 'Aston Villa', 'Brentford', 'Brighton', 'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Leeds', 'Leicester', 'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle United', 'Norwich', 'Southampton', 'Tottenham', 'Watford', 'West Ham', 'Wolverhampton Wanderers']
    
const NewUserHomePage = () => {

    const [teams, setTeams] = useState(globalTeams)
    const [favorite, setFavorite] = useState(null);
    const saveTable = () => {
        let body = {ranking: teams};
        if (favorite) {
            body['favorite_team'] = favorite
            localStorage.setItem("favorite_team", favorite);

            makeRanking(body)
            window.location.reload()
        }
      
    }

    return (
        <NewUserContainer>
            <NewUserInstructions>
                <InstructionsContent>
                    <div>Welcome to Premier League Predictor!</div>
                    <li>Drag and drop the teams to the right to make your predicted final standings</li>
                    <li>Double click a team to select them as your favorite team</li>
                    <li>Click 'Save' when done</li>
                </InstructionsContent>
            </NewUserInstructions>
            <SetOrder className="set-order-center" teams={teams} setTeams={setTeams} favorite={favorite} setFavorite={setFavorite}/>
            <NewUserSaveContainer>
                <NewUserSaveButtonContainer>
                <NewUserSaveButton onClick={() => saveTable()}>
                   Save
                </NewUserSaveButton>
                {!favorite && <ErrorMessage>*Please select a favorite team before saving</ErrorMessage>}
                </NewUserSaveButtonContainer>
            </NewUserSaveContainer>
        </NewUserContainer>)
}


export default NewUserHomePage;