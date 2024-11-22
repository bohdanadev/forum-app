import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import Header from '../components/Header/Header';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <>
      <Header />
      <h1>Oops</h1>
      <p>
        {isRouteErrorResponse(error)
          ? 'This page does not exist.'
          : 'An unexpected error occurred.'}
      </p>
    </>
  );
};

export default ErrorPage;
