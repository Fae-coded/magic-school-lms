import { screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import '@testing-library/jest-dom'
// import userEvent from '@testing-library/user-event'
import { renderWithAuthContext } from '../test-utils/renderWithAuthContext.jsx';
import { makeAdminAuth,  } from '../test-utils/authHelpers.js';
import ManageUsers from './ManageUsers.jsx';
//makeStudentAuth, makeTeacherAuth

test('admin users can render the manage users page and loading message', () => {
  renderWithAuthContext(<ManageUsers/>, { auth: makeAdminAuth() });
  expect(screen.getByText(/Loading users.../i)).toBeInTheDocument();
});

test('handles no users case correctly', () => {
  renderWithAuthContext(<ManageUsers/>, { auth: makeAdminAuth() });
  expect(screen.getByText(/No users found/i)).toBeInTheDocument();
  expect(screen.queryByText(/Edit User/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Delete User/i)).not.toBeInTheDocument();
});

test('fetches users with correct token and displays them', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, username: 'Aidoneus', role: 'student' },
        { id: 2, username: 'Lisette', role: 'teacher' },
      ])
    })
  );

  renderWithAuthContext(<ManageUsers />, { auth: makeAdminAuth() });
  const aidoneus = await screen.findByText('Aidoneus');
  expect(aidoneus).toBeInTheDocument();
  expect(screen.getByText('Lisette')).toBeInTheDocument();
});

test('fetches users with correct token and displays error message on failure', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.reject(new Error('Network error'))
  );

  renderWithAuthContext(<ManageUsers/>, { auth: makeAdminAuth() });
  const errorMsg = await screen.findByText(/Network error/i);
  expect(errorMsg).toBeInTheDocument();
});  

// test('navigates to edit user and delete user pages on button clicks', async () => {
//   globalThis.fetch = vi.fn(() =>
//     Promise.resolve({
//       ok: true,
//       json: () => Promise.resolve([
//         { id: 1, username: 'Aidoneus', role: 'student' },
//         { id: 2, username: 'Lisette', role: 'teacher' },
//       ])
//     })
//   );

//   renderWithAuthContext(<ManageUsers/>, { auth: makeAdminAuth() });

//   const aidoneus = await screen.findByText('Aidoneus');
//   expect(aidoneus).toBeInTheDocument();
//   userEvent.click(screen.getAllByText(/Edit User/i)[0]);
//   expect(window.location.pathname).toBe('/edit-user/1');

//   const lisette = await screen.findByText('Lisette');
//   expect(lisette).toBeInTheDocument();
//   userEvent.click(screen.getAllByText(/Delete User/i)[1]);
//   expect(window.location.pathname).toBe('/delete-user/2');

// });

// test('non-admin users do not see the user management UI', () => {
//   renderWithAuthContext(<ManageUsers/>, { auth: makeStudentAuth() });
//   // Check alert message is displayed
//   // expect(screen.getByText(/You do not have permission to view this page./i)).toBeInTheDocument();
//   expect(screen.queryByText(/Edit User/i)).not.toBeInTheDocument();
//   expect(screen.queryByText(/Delete User/i)).not.toBeInTheDocument();

//   renderWithAuthContext(<ManageUsers/>, { auth: makeTeacherAuth() });
//   // expect(screen.getByText(/You do not have permission to view this page./i)).toBeInTheDocument();
//   expect(screen.queryByText(/Edit User/i)).not.toBeInTheDocument();
//   expect(screen.queryByText(/Delete User/i)).not.toBeInTheDocument();
// });