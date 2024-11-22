import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';

const FeedLayout = () => {
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default FeedLayout;
