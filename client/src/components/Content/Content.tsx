import styled from 'styled-components';

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const PostCard = styled.div`
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PostTitle = styled.h3`
  margin: 0;
  font-size: 1.1em;
  color: #333;
`;

export const PostInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 0.9em;
`;

export const Tag = styled.span`
  background-color: #e0e0e0;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8em;
  color: #666;
  margin-right: 5px;
`;
