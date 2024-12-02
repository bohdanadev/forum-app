import styled from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
`;

export const InputField = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  color: #333;
`;

export const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const SubmitButton = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  color: #fff;
  background-color: #fca311;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #fec89a;
  }
`;

export const ErrorMessage = styled.span`
  color: red;
  font-size: 0.8rem;
`;
