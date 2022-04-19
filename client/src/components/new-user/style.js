import styled from 'styled-components'

export const NewUserContainer = styled.div`
    display: flex;
    width: 100%;
`

export const NewUserInstructions = styled.div`
    width: 33%;
    position: relative;
`

export const InstructionsContent = styled.ol`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 30px;
    width: 350px;
    border-radius: 15px;

    > li {
        padding: 15px 0px 15px 0px;
        margin-left: 10px;
        width: 100%;
        color: #7B63FF;
        font-weight: bold;
    }

    > div {
        color: black;
        font-weight: bold;
    }
`

export const NewUserSaveContainer = styled.div`
    position: relative;
    width: 33%;
`

export const NewUserSaveButton = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);    
    background: #7B63FF;
    color: white;
    width: 200px;
    padding: 15px;
    font-size: 25px;
    border-radius: 35px;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0px 0px 10px rgb(0 0 0 / 25%);

`
