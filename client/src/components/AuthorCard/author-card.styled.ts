import styled from 'styled-components';

export const AuthorCardContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-height: 300px;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 1.4em;
    margin: 10px 0 5px;
    color: #333;
  }

  p {
    font-size: 0.9em;
    color: #555;
  }

  .contact {
    margin-top: 10px;
    font-size: 0.9em;
    color: #007bff;
    text-decoration: none;
  }
`;
