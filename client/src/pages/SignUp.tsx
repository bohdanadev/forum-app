import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ReusableForm from '../components/ReusableForm/ReusableForm';
import { authService } from '../services/auth.service';
import { ISignUp } from '../interfaces/auth.interface';
import { SubmitHandler } from 'react-hook-form';

const SignUp: FC = () => {
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ISignUp> = async (data) => {
    await authService.signUp(data);

    navigate('/signin');
  };

  return (
    <div>
      <ReusableForm
        title='Sign Up'
        fields={[
          { name: 'username', label: 'Username', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'avatarUrl', label: 'Avatar', type: 'url' },
          { name: 'password', label: 'Password', type: 'password' },
          {
            name: 'confirmPassword',
            label: 'Confirm Password',
            type: 'password',
          },
        ]}
        onSubmit={onSubmit}
      />
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <Link to='/signin'>Sign in</Link>
      </p>
    </div>
  );
};

export default SignUp;
