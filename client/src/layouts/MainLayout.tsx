import { Outlet } from 'react-router-dom';

import Footer from '../components/Footer/Footer';
import GlobalStyles from '../GlobalStyles';
import { MainContainer } from './main.styled';
import Header from '../components/Header/Header';

export const MainLayout = () => {
  return (
    <>
      <GlobalStyles />
      <MainContainer>
        <Header />

        <Outlet />

        <Footer />
      </MainContainer>
    </>
  );
};

export default MainLayout;
