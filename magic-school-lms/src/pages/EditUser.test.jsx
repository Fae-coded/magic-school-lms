import { screen, waitFor } from '@testing-library/react';
import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { Routes, Route} from "react-router-dom"

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
import EditUser from './EditUser.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx';

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({}),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('fetches user to edit and displays it for admin', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => (
      { id: 1, username: 'profvayran', email: 'vayran@strixhaven.com', role: 'teacher' }
    )
  });

  renderWithAuthContext(
    <Routes>
      <Route path="/users/:id" element={<EditUser/>}/>
    </Routes>,
    {
      auth: makeAdminAuth(),
    route: '/users/1',
    }
  );
  const vayran = await screen.findByDisplayValue('profvayran');
  expect(vayran).toBeInTheDocument();
  expect(await screen.findByDisplayValue('vayran@strixhaven.com'));
  const roleSelect = screen.getByRole('combobox');
  expect(roleSelect).toHaveValue('teacher')
  expect(screen.getByText(/Edit User Details/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
});

test('admin can type in username and email', async () => {
  renderWithAuthContext(<EditUser/>, { auth: makeAdminAuth() });

  const username = screen.getByLabelText(/Username/i);
  const email = screen.getByLabelText(/Email/i);
  const role = screen.getByLabelText(/Role/i);
  await userEvent.clear(username);
  await userEvent.clear(email);
  await userEvent.type(username, 'alexander');
  await userEvent.type(email, 'alexander@strixhaven.com');
  await userEvent.selectOptions(role, 'teacher')

  expect(username).toHaveValue('alexander');
  expect(email).toHaveValue('alexander@strixhaven.com');
  expect(role).toHaveValue('teacher')
});

test('updates user on button click and navigates to manage users page afterwards', async () => {
    fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => (
      { id: 1, username: 'aurelia', email: 'aurelia@strixhaven.com', role: 'student' }
    )
  })
  .mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

  renderWithAuthContext(
    <Routes>
      <Route path="/users/:id" element={<EditUser/>}/>
    </Routes>,
    {
      auth: makeAdminAuth(),
    route: '/users/1',
    }
  );

  expect(await screen.findByDisplayValue('aurelia')).toBeInTheDocument();
  expect(await screen.findByDisplayValue('aurelia@strixhaven.com')).toBeInTheDocument();
  const roleSelect = screen.getByRole('combobox');
  expect(roleSelect).toHaveValue('student')
  await userEvent.click(screen.getByRole('button', { name: /Save Changes/i}));
  expect(screen.getByText(/User updated/i)).toBeInTheDocument();
  await waitFor(() => {
    expect(navigateMock).toHaveBeenCalledWith('/manage-users')
  }, {timeout: 3000}
);
});

test('fails to update user and displays error message on failure', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({
        username: ['Username is required.'],
      })
    })
  );

  renderWithAuthContext(<EditUser/>, { auth: makeAdminAuth() });

  const username = screen.getByLabelText(/Username/i);
  const email = screen.getByLabelText(/Email/i);
  const role = screen.getByLabelText(/Role/i);

  await userEvent.type(username, 'Test');
  await userEvent.type(email, 'legitEmail');
  await userEvent.selectOptions(role, 'teacher');
  await userEvent.click(screen.getByRole('button', { name: /Save Changes/i}));

  expect(await screen.findByText(/username: username is required./i)).toBeInTheDocument();
})

test('Navigates to manage users page on cancel button click', async () => {
  renderWithAuthContext(<EditUser/>, { auth: makeAdminAuth() });
  await userEvent.click(screen.getByRole('button', { name:/Cancel/i}));
  expect(navigateMock).toHaveBeenCalledWith('/manage-users');
});

test('students do not see the edit user page', () => {
  const wrapped = () => (
    <ProtectedRoute allowedRoles={["admin"]}>
      <EditUser/>
    </ProtectedRoute>
  );

  renderWithAuthContext(wrapped(), { auth: makeStudentAuth() });
  expect(screen.getByText(/You do not have permission to view this page./i)).toBeInTheDocument();
  expect(screen.queryByText(/Edit User Details/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Save Changes/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument();
});

test('teachers do not see the edit user page', () => {
  const wrapped = () => (
    <ProtectedRoute allowedRoles={["admin"]}>
      <EditUser/>
    </ProtectedRoute>
  );

  renderWithAuthContext(wrapped(), { auth: makeTeacherAuth() });
  expect(screen.getByText(/You do not have permission to view this page./i)).toBeInTheDocument();
  expect(screen.queryByText(/Edit User Details/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Save Changes/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument();
});