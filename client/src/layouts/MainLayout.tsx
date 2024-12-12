import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Footer from '../components/Footer/Footer';
import GlobalStyles from '../GlobalStyles';
import { MainContainer } from './main.styled';
import Header from '../components/Header/Header';

import 'react-toastify/dist/ReactToastify.css';

export const MainLayout = () => {
  return (
    <>
      <GlobalStyles />
      <MainContainer>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='colored'
        />
        <Header />

        <Outlet />

        <Footer />
      </MainContainer>
    </>
  );
};

export default MainLayout;
