import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ReusableForm from '../components/ReusableForm/ReusableForm';
import { authService } from '../services/auth.service';

const SignIn: FC = () => {
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    await authService.signIn(data);

    navigate('/posts');
  };

  return (
    <div>
      <ReusableForm
        title='Sign In'
        fields={[
          { name: 'identifier', label: 'Email or Username', type: 'text' },
          { name: 'password', label: 'Password', type: 'password' },
        ]}
        onSubmit={onSubmit}
      />
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account? <Link to='/signup'>Sign up</Link>
      </p>
    </div>
  );
};

export default SignIn;
