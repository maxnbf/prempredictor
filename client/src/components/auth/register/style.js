import styled from 'styled-components';

export const RegisterContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    box-shadow: 0px 0px 10px rgb(0 0 0 / 25%);

    border-radius: 15px;
`

export const RegisterHeader = styled.div`
    padding: 10px;
    font-size: 20px;
    color: #7B63FF;
    font-weight: bold;
`

export const RegisterBody = styled.div`
    padding: 20px;
`

export const RegisterInput = styled.input`
    margin: 5px;
    padding-left: 8px;
    padding-right: 8px;
    width: 91%;
    border-radius: 3px;
    border: 1px solid gray;
    margin-top: 8px;
    height: 36px;
`

export const RegisterButtonRow = styled.div`
    text-align: center;
    padding: 5px;
`

export const RegisterButton = styled.div`
    cursor: pointer;
    background: black;
    color: white;
    border-radius: 3px;
    margin-top: 3px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const RegisterBanner = styled.div`
    background: #1E1E1E;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
`

export const RegisterLogo = styled.img`
    max-height: 200px;
    margin-left: 80px;
    margin-right: 80px;    
`

export const AlreadyAMember = styled.div`
    padding-top: 20px;

    > a {
        color: #7B63FF;
        font-weight: bold;
        text-decoration: none;
    }
`
