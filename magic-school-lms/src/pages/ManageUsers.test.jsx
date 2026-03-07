import { screen } from '@testing-library/react';
import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

import { renderWithAuthContext } from '../test-utils/renderWithAuthContext.jsx';
import { makeAdminAuth, makeStudentAuth, makeTeacherAuth } from '../test-utils/authHelpers.js';
import ManageUsers from './ManageUsers.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

beforeEach(() => {
  navigateMock.mockClear();
});

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ([]),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('handles no users case correctly', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ([]),
  });

  renderWithAuthContext(<ManageUsers/>, { auth: makeAdminAuth() });
  expect(await screen.findByText(/No users found/i)).toBeInTheDocument();
  expect(screen.queryByText(/Edit User/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Delete User/i)).not.toBeInTheDocument();
});

test('fetches users with correct token and displays them', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ([
        { id: 1, username: 'Aidoneus', role: 'student' },
        { id: 2, username: 'Lisette', role: 'teacher' },
      ])
    });

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

test('navigates to edit user and delete user pages on button clicks', async () => {
    fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ([
        { id: 1, username: 'Aidoneus', role: 'student' },
        { id: 2, username: 'Lisette', role: 'teacher' },
      ])
    });

  renderWithAuthContext(<ManageUsers/>, { auth: makeAdminAuth() });

  const aidoneus = await screen.findByText('Aidoneus');
  expect(aidoneus).toBeInTheDocument();

  await userEvent.click(screen.getAllByText(/Edit User/i)[0]);
  expect(navigateMock).toHaveBeenCalledWith('/edit-user/1');

  const lisette = await screen.findByText('Lisette');
  expect(lisette).toBeInTheDocument();
  await userEvent.click(screen.getAllByText(/Delete User/i)[1]);
  expect(navigateMock).toHaveBeenCalledWith('/delete-user/2');
});

test('non-admin users do not see the user management page', () => {
  const wrapped = () => (
    <ProtectedRoute allowedRoles={["admin"]}>
      <ManageUsers />
    </ProtectedRoute>
  );

  renderWithAuthContext(wrapped(), { auth: makeStudentAuth() });
  expect(screen.getByText(/You do not have permission to view this page./i)).toBeInTheDocument();
  expect(screen.queryByText(/Loading users.../i)).not.toBeInTheDocument();
  expect(screen.queryByText(/No users found/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Edit User/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Delete User/i)).not.toBeInTheDocument();

  renderWithAuthContext(wrapped(), { auth: makeTeacherAuth() });
  expect(screen.getByText(/Redirecting to teacher dashboard/i)).toBeInTheDocument();
  expect(screen.queryByText(/Loading users.../i)).not.toBeInTheDocument();
  expect(screen.queryByText(/No users found/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Edit User/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Delete User/i)).not.toBeInTheDocument();
});