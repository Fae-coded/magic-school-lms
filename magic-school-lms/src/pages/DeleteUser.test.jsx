import { screen, waitFor } from '@testing-library/react';
import { test, expect, vi, beforeEach, afterEach} from 'vitest';
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
import { makeAdminAuth, makeStudentAuth, makeTeacherAuth} from '../test-utils/authHelpers.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import DeleteUser from './DeleteUser.jsx';

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({}),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('fetches user to delete and displays it for admin' , async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => (
      {id: 1, username: 'aurelia', email: 'aurelia@strixhaven.com', role: 'student'}
    )
    });

  renderWithAuthContext(
      <Routes>
        <Route path="/users/:id" element={<DeleteUser/>}/>
      </Routes>,
      {
        auth: makeAdminAuth(),
      route: '/users/1',
      }
    );
    const aurelia = await screen.findByText('aurelia');
    expect(aurelia).toBeInTheDocument();
    expect(screen.getByText('aurelia@strixhaven.com')).toBeInTheDocument();
    expect(screen.getByText('student')).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: /please confirm you wish to delete this user/i}));
    expect(screen.getByRole('button', { name: /Yes, delete this user/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
});

test('deletes user on button click and navigates to manage users page afterwards', async () => {
    fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => (
      { id: 1, username: 'profvayran', email: 'vayran@strixhaven.com', role: 'teacher' }
    )
  })
  .mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

  renderWithAuthContext(<Routes>
        <Route path="/users/:id" element={<DeleteUser/>}/>
      </Routes>,
      {
        auth: makeAdminAuth(),
      route: '/users/1',
      }
    );

  const vayran = await screen.findByText('profvayran');
  expect(vayran).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: /Yes, delete this user/i}));
  expect(screen.getByText(/User deleted/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/manage-users')
    }, {timeout: 3000}
  );
  });

  test('fails to delete user and displays error message on failure', async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => (
        { id: 1, username: 'aurelia', email: 'aurelia@strixhaven.com', role: 'student' }),
    })
    .mockResolvedValueOnce({
      ok: false,
    });

  renderWithAuthContext(
    <Routes>
      <Route path="/courses/:id" element={<DeleteUser />} />
    </Routes>,
    {
      auth: makeAdminAuth(),
      route: '/courses/1',
    }
  );

  expect(await screen.findByText('aurelia')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name:/Yes, delete this user/i }));
  expect(await screen.findByText(/Failed to delete user/i)).toBeInTheDocument();
});

test('Navigates to manage users page on cancel button click', async () => {
  renderWithAuthContext(<DeleteUser/>, { auth: makeAdminAuth() });
  await userEvent.click(screen.getByRole('button', { name:/Cancel/i}));
  expect(navigateMock).toHaveBeenCalledWith('/manage-users');
});

test('students do not see the delete user page', () => {
  const wrapped = () => (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DeleteUser/>
    </ProtectedRoute>
  );

  renderWithAuthContext(wrapped(), { auth: makeStudentAuth() });
  expect(screen.getByText(/You do not have permission to view this page./i)).toBeInTheDocument();
  expect(screen.queryByText(/Please confirm you wish to delete this user/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Yes, delete this user/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument();
});

test('teachers do not see the delete user page', () => {
  const wrapped = () => (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DeleteUser/>
    </ProtectedRoute>
  );

  renderWithAuthContext(wrapped(), { auth: makeTeacherAuth() });
  expect(screen.getByText(/You do not have permission to view this page./i)).toBeInTheDocument();
  expect(screen.queryByText(/Please confirm you wish to delete this user/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Yes, delete this user/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument();
});