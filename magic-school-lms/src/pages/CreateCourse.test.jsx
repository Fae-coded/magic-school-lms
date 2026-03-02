import { screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
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
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import CreateCourse from './CreateCourse.jsx';

test('admin and teacher users can render the edit course page', () => {
  renderWithAuthContext(<CreateCourse/>, { auth: makeAdminAuth() });
  expect(screen.getByText(/New Course Creation/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Create Course/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();

  renderWithAuthContext(<CreateCourse/>, { auth: makeTeacherAuth() });
  expect(screen.getByText(/New Course Creation/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Create Course/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
});

test('user can type in course title and description fields', async () => {
  renderWithAuthContext(<CreateCourse/>, { auth: makeTeacherAuth() });

  const courseTitle = screen.getByLabelText(/Course Title/i);
  const courseDescription = screen.getByLabelText(/Course Description/i);

  await userEvent.type(courseTitle, 'Flame of Knowledge');
  await userEvent.type(courseDescription, 'Learn detailed events of Aracvios history');

  expect(courseTitle).toHaveValue('Flame of Knowledge');
  expect(courseDescription).toHaveValue('Learn detailed events of Aracvios history');
});

test('creates course on button click and navigates to manage course page afterwards', async () => {
    globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, course_title: 'SLAM Poetry', course_description: 'Devastating Your Enemies with Magical Insults.' },
      ])
    })
  );

  renderWithAuthContext(<CreateCourse/>, { auth: makeTeacherAuth() });

  const slamPoetry = await screen.findByText('SLAM Poetry');
  expect(slamPoetry).toBeInTheDocument();

  await userEvent.click(screen.getByText(/Create Course/i));
  expect(screen.queryByText(/Course created/i)).toBeInTheDocument();
  expect(navigateMock).toHaveBeenCalledWith('/teacher');
});

test('fails to create course and displays error message on failure', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({
        course_title: ['Course title is required.'],
      })
    })
  );

  renderWithAuthContext(<CreateCourse/>, { auth: makeTeacherAuth() });

  const courseTitle = screen.getByLabelText(/Course Title/i);
  const courseDescription = screen.getByLabelText(/Course Description/i);

  await userEvent.type(courseTitle, 'Test');
  await userEvent.type(courseDescription, 'Too short');
  await userEvent.click(screen.getByText(/Create Course/i));

  expect(await screen.findByText(/course_title: Course title is required./i)).toBeInTheDocument();
})







test('Navigates back to manage courses page on cancel button click', async () => {
    globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, course_title: 'SLAM Poetry', course_description: 'Devastating Your Enemies with Magical Insults.' },
      ])
    })
  );

  renderWithAuthContext(<CreateCourse/>, { auth: makeTeacherAuth() });

  const slamPoetry = await screen.findByText('SLAM Poetry');
  expect(slamPoetry).toBeInTheDocument();

  await userEvent.click(screen.getByText(/Cancel/i));
  expect(screen.queryByText(/Course created/i)).not.toBeInTheDocument();
  expect(navigateMock).toHaveBeenCalledWith('/teacher');
});


test('student users do not see the delete course page', () => {
  const wrapped = () => (
    <ProtectedRoute allowedRoles={["admin", "teacher"]}>
      <CreateCourse/>
    </ProtectedRoute>
  );

  renderWithAuthContext(wrapped(), { auth: makeStudentAuth() });
  expect(screen.getByText(/You do not have permission to view this page./i)).toBeInTheDocument();
  expect(screen.queryByText(/New Course Creation/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Create Course/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument();
});