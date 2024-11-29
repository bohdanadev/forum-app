import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authService } from '../../services/auth.service';
import { API_KEYS } from '../../constants/app-keys';

export const SidebarContainer = styled.div`
  width: 200px;
  max-height: 40vh;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  a {
    text-decoration: none;
  }
`;

export const SidebarItem = styled.div`
  padding: 8px 0;
  font-weight: bold;
  color: #555;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  margin: 5px 0;
`;
const NotificationsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  gap: 1;
  margin: 0;
  padding: 0;
`;

const Notification = styled.div`
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  font-size: 0.7rem;
  padding-top: 4px;
  text-align: center;
  color: white;
  background-color: #3a6ea5;
`;

const Sidebar = () => {
  const navigate = useNavigate();

  const currentUser = authService.isAuthenticated();
  const logout = async () => {
    authService.signOut();
    navigate('/signin');
  };
  return (
    <SidebarContainer>
      <NotificationsContainer onClick={() => navigate('notifications')}>
        <SidebarItem>Notifications</SidebarItem>
        <Notification>74</Notification>
      </NotificationsContainer>
      <Link to={`${API_KEYS.USERS}/${currentUser.id}`}>
        <SidebarItem>Profile</SidebarItem>
      </Link>
      <SidebarItem>My posts</SidebarItem>
      <SidebarItem>Settings</SidebarItem>
      <SidebarItem onClick={logout}>Logout</SidebarItem>
    </SidebarContainer>
  );
};

export default Sidebar;
