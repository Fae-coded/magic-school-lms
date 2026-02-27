import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MockAuthProvider from './MockAuthProvider.jsx';
import '@testing-library/jest-dom';

const renderWithAuthContext = (ui, { auth } = {}) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <MockAuthProvider auth={auth}>
        <MemoryRouter>{children}</MemoryRouter>
      </MockAuthProvider>
    ),
  });
};

export { renderWithAuthContext };
