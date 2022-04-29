import { Link } from 'react-router-dom';
import styled from 'styled-components';


export const Nav = styled.div`
  display: flex;
  justify-content: space-around;
  background: black;
  color: #7B63FF;
  height: 65px;
  box-shadow: 0px 0px 10px rgb(0 0 0 / 25%);

`;


export const NavRight = styled.div`
  display: flex;
  margin-left: auto;

  a:hover {
    background-color: gray;
  }
`

export const NavRightText = styled(Link)`
  transform: skew(-20deg);
  display: inline-block;
  text-decoration: none;
  color: white;
  padding: 20px;
  background-color: ${props => props.isSelected ? '#7B63FF' : 'none'};

  > p {
    transform: skew(20deg);
    margin: 0px;
  }

  
  @media (max-width: 767px) {
    font-size: 12px;
  }
`

export const NavWelcomeBanner = styled.div`
  padding: 20px;
  @media (max-width: 767px) {
    font-size: 12px;
  }
`