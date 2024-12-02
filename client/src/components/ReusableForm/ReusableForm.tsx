import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { ISignIn, ISignUp } from '../../interfaces/auth.interface';
import {
  ErrorMessage,
  FormContainer,
  Input,
  InputField,
  Label,
  SubmitButton,
} from './form.styled';

type OnSubmitHandler = SubmitHandler<ISignIn> | SubmitHandler<ISignUp>;

interface ReusableFormProps {
  title: string;
  fields: { [key: string]: string }[];
  onSubmit: OnSubmitHandler;
}

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
