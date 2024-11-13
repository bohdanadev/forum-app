import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ReusableForm from '../components/ReusableForm/ReusableForm';

const SignIn: FC = () => {
  const navigate = useNavigate();

  const onSubmit = (data: { [key: string]: string }) => {
    // Handle sign-in logic here
    console.log('Sign-In Data:', data);
    navigate('/posts'); // Redirect after successful sign-in
  };

  return (
    <div>
      <ReusableForm
        title='Sign In'
        fields={[
          { name: 'email', label: 'Email', type: 'email' },
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
