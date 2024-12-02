import styled from 'styled-components';

import Content from '../components/Content/Content';

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 40vh;
  overflow: scroll;
`;

const HomePage = () => {
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <MainContent>
        <Content />
      </MainContent>
    </div>
  );
};

export default HomePage;
