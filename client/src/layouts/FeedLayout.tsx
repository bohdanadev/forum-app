import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar/Sidebar';
import { authService } from '../services/auth.service';

const FeedLayout = () => {
  const currentUser = authService.isAuthenticated();
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {currentUser && <Sidebar />}
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default FeedLayout;
