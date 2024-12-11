import { useNavigate } from 'react-router-dom';

import { authService } from '../../services/auth.service';
import { ROUTER_KEYS } from '../../constants/app-keys';
import {
  Notification,
  NotificationsContainer,
  SidebarContainer,
  SidebarItem,
} from './sidebar.styled';
import useFetchUser from '../../hooks/useFetchUser';
import { IUser } from '../../interfaces/user.interface';

const Sidebar = () => {
  const navigate = useNavigate();
  // const [_, setSearchParams] = useSearchParams();

  const currentUser: IUser = authService.isAuthenticated();
  const { data: user } = useFetchUser(currentUser?.id);

  const unreadNotificationsCount = user?.notifications?.filter(
    (n) => !n.isRead
  ).length;

  const goToProfile = () => {
    navigate(`${ROUTER_KEYS.USERS}/${currentUser.id}`);
  };

  const setAuthorIdQuery = (authorId: string | null) => {
    navigate(`${ROUTER_KEYS.POSTS}?${ROUTER_KEYS.AUTHOR_ID}=${authorId}`);
    // setSearchParams((params) => {
    //   params.set('authorId', authorId!);
    //   return params;
    // });
  };

  const logout = async () => {
    authService.signOut();
    navigate(`/${ROUTER_KEYS.SIGNIN}`);
  };
  return (
    <SidebarContainer>
      <NotificationsContainer
        onClick={() => navigate(ROUTER_KEYS.NOTIFICATIONS)}
      >
        <SidebarItem>Notifications</SidebarItem>
        <Notification>{unreadNotificationsCount || ''}</Notification>
      </NotificationsContainer>

      <SidebarItem onClick={goToProfile}>Profile</SidebarItem>

      <SidebarItem onClick={() => setAuthorIdQuery(currentUser?.id)}>
        My posts
      </SidebarItem>
      <SidebarItem>Settings</SidebarItem>
      <SidebarItem onClick={logout}>Logout</SidebarItem>
    </SidebarContainer>
  );
};

export default Sidebar;
