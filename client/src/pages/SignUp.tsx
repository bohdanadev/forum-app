import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ReusableForm from '../components/ReusableForm/ReusableForm';

const SignUp: FC = () => {
  const navigate = useNavigate();

  const onSubmit = (data: { [key: string]: string }) => {
    // Handle sign-up logic here
    console.log('Sign-Up Data:', data);
    navigate('/signin'); // Redirect after successful sign-up
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
