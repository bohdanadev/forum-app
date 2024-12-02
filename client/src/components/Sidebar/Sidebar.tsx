import { Link, useNavigate } from 'react-router-dom';

import { authService } from '../../services/auth.service';
import { API_KEYS } from '../../constants/app-keys';
import {
  Notification,
  NotificationsContainer,
  SidebarContainer,
  SidebarItem,
} from './sidebar.styled';

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
