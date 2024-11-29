import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { ISignIn, ISignUp } from '../../interfaces/auth.interface';

type OnSubmitHandler = SubmitHandler<ISignIn> | SubmitHandler<ISignUp>;

interface ReusableFormProps {
  title: string;
  fields: { [key: string]: string }[];
  onSubmit: OnSubmitHandler;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #333;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SubmitButton = styled.button`
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

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.8rem;
`;

const ReusableForm: FC<ReusableFormProps> = ({ title, fields, onSubmit }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>();
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const avatarUrl = watch('avatarUrl', '');

  useEffect(() => {
    setPreviewUrl(avatarUrl || '../../assets/avatar.png');
  }, [avatarUrl]);

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <h2>{title}</h2>
      {fields.map((field) => (
        <InputField key={field.name}>
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            type={field.type}
            {...register(field.name, {
              required: `${field.label} is required`,
            })}
          />
          {errors[field.name] && (
            <ErrorMessage>{errors[field.name]?.message as string}</ErrorMessage>
          )}
          {field.name === 'avatarUrl' && (
            <img
              src={previewUrl}
              alt='Avatar Preview'
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #ccc',
              }}
            />
          )}
        </InputField>
      ))}
      <SubmitButton type='submit'>Submit</SubmitButton>
    </FormContainer>
  );
};

export default ReusableForm;
