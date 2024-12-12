import styled from 'styled-components';

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  padding-right: 40px;
  border: 2px solid #ccc;
  border-radius: 20px;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.3s ease-in-out;

  &:focus {
    border-color: gray;
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const SearchButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: none;

  img {
    width: 20px;
    height: 20px;
    filter: invert(50%);
  }

  &:hover img {
    filter: invert(30%);
  }
`;
