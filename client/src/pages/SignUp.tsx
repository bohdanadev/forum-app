import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ReusableForm from '../components/ReusableForm/ReusableForm';
import { authService } from '../services/auth.service';

const SignUp: FC = () => {
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
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
