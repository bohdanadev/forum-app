import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

import ReusableForm from '../components/ReusableForm/ReusableForm';
import { authService } from '../services/auth.service';
import { ISignUp } from '../interfaces/auth.interface';
import { ROUTER_KEYS } from '../constants/app-keys';

const SignUp: FC = () => {
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ISignUp> = async (data) => {
    await authService.signUp(data);
    toast.success('Signed up successfully! Try to sign in.');
    navigate(`/${ROUTER_KEYS.SIGNIN}`);
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
