import { screen } from '@testing-library/react';
import { test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom'

const logoutMock = vi.fn();

import { renderWithAuthContext } from '../test-utils/renderWithAuthContext.jsx';
import { makeAdminAuth, makeStudentAuth, makeTeacherAuth } from '../test-utils/authHelpers.js';
import userEvent from '@testing-library/user-event';
import NavBar from './NavBar.jsx';

beforeEach(() => {
  logoutMock.mockClear();
});

test('renders image', () => {
  renderWithAuthContext(<NavBar />);
  expect(screen.getByAltText(/Strixhaven University Crest/i)).toBeInTheDocument();
});

test('renders login/register link when not authenticated', () => {
  renderWithAuthContext(<NavBar />);
  expect(screen.getByText(/Login \/ Register/i)).toBeInTheDocument();
});

test('renders student links and logout button when authenticated as student', () => {
  renderWithAuthContext(<NavBar />, { auth: makeStudentAuth() });
  expect(screen.getByText(/Available Courses/i)).toBeInTheDocument();
  expect(screen.getByText(/Your Courses/i)).toBeInTheDocument();
  expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  expect(screen.queryByText(/Create Course/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Manage Courses/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Manage Users/i)).not.toBeInTheDocument();
});

test('renders teacher links and logout button when authenticated as teacher', () => {
  renderWithAuthContext(<NavBar />, { auth: makeTeacherAuth() });
  expect(screen.getByText(/Create Course/i)).toBeInTheDocument();
  expect(screen.getByText(/Manage Courses/i)).toBeInTheDocument();
  expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  expect(screen.queryByText(/Manage Users/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Available Courses/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Your Courses/i)).not.toBeInTheDocument();
});

test('renders admin links and logout button when authenticated as admin', () => {
  renderWithAuthContext(<NavBar />, { auth: makeAdminAuth() });
  expect(screen.getByText(/Create Course/i)).toBeInTheDocument();
  expect(screen.getByText(/Manage Courses/i)).toBeInTheDocument();
  expect(screen.getByText(/Manage Users/i)).toBeInTheDocument();
  expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  expect(screen.queryByText(/Available Courses/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Your Courses/i)).not.toBeInTheDocument();
});

test('renders welcome message with username when authenticated', () => {
  const auth = makeStudentAuth({ username: 'Zori' });
  renderWithAuthContext(<NavBar />, { auth });
  expect(screen.getByText(/Welcome Zori/i)).toBeInTheDocument();
});

test('calls logout function on logout link click', async () => {
  const auth = { ...makeAdminAuth(), logout: logoutMock };
    renderWithAuthContext(<NavBar />, { auth });
    await userEvent.click(screen.getByText(/Logout/i));
    expect(logoutMock).toHaveBeenCalled();
});