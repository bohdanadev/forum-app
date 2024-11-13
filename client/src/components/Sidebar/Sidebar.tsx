import styled from 'styled-components';

export const Sidebar = styled.div`
  width: 200px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
