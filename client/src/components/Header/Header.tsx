import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import bgImage from '../../assets/bg.png';
import logo from '../../assets/logo.png';

export const StyledHeader = styled.header`
  position: relative;
  height: 300px;
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  color: #fff;
`;

export const HeaderButton = styled.button`
  margin-left: 10px;
  padding: 8px 16px;
  font-size: 0.9em;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const Header = () => {
  const navigate = useNavigate();
  return (
    <StyledHeader>
      <img src={logo} onClick={() => navigate('posts')} />
      <div>
        <HeaderButton onClick={() => navigate('signin')}>Sign In</HeaderButton>
        <HeaderButton onClick={() => navigate('posts')}>
          Get Started
        </HeaderButton>
      </div>
    </StyledHeader>
  );
};

export default Header;
