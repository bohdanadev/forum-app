import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import bgImage from '../../assets/bg.png';
import avatar from '../../assets/avatar.png';
import { authService } from '../../services/auth.service';
import { userService } from '../../services/user.servise';
import Search from '../Search/Search';

export const StyledHeader = styled.header`
  position: relative;
  height: 300px;
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 20px;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const HeaderButton = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

export const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;

  h4 {
    margin: 0;
    font-size: 1.2em;
    color: #fff;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

export const AvatarImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;

  img {
    object-fit: cover;
  }
`;

export const Menu = styled.div`
  position: absolute;
  top: 70px;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 150px;
  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 10px 20px;
  font-size: 1em;
  color: #333;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const user = authService.isAuthenticated();

  const handleEditProfile = () => {
    setMenuOpen(false);
    navigate('/edit-profile');
  };

  const handleDeleteAccount = (id: string) => {
    userService.deleteAccount(id);
    authService.signOut();
    setMenuOpen(false);
  };

  return (
    <StyledHeader>
      <ButtonContainer>
        <HeaderButton onClick={() => navigate('/')}>Home</HeaderButton>
        <HeaderButton onClick={() => {}}>Add post</HeaderButton>
      </ButtonContainer>
      <Search />
      <AvatarContainer>
        <AvatarImg
          //  src={user.avatarUrl ?? avatar}
          src={avatar}
          alt='avatar'
          onClick={toggleMenu}
        />
        {/* <h4>{user.username} ?? Username</h4> */}
        <h4>Username</h4>
        {menuOpen && (
          <Menu>
            <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
            <MenuItem onClick={() => handleDeleteAccount(user.id)}>
              Delete Account
            </MenuItem>
          </Menu>
        )}
      </AvatarContainer>
    </StyledHeader>
  );
};

export default Header;
