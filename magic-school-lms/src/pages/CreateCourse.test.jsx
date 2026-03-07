import { screen, waitFor } from '@testing-library/react';
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
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import CreateCourse from './CreateCourse.jsx';

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ([]),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('admin user can render the create course page', () => {
  renderWithAuthContext(<CreateCourse/>, { auth: makeAdminAuth() });
  expect(screen.getByText(/New Course Creation/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Create Course/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
});

test('teacher user can render the create course page', () => {
  renderWithAuthContext(<CreateCourse/>, { auth: makeTeacherAuth() });
  expect(screen.getByText(/New Course Creation/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Create Course/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
});

test('user can type in course title and description fields', async () => {
  renderWithAuthContext(<CreateCourse/>, { auth: makeTeacherAuth() });

  const courseTitle = screen.getByLabelText(/Course Title/i);
  const courseDescription = screen.getByLabelText(/Course Description/i);
  await userEvent.clear(courseTitle, courseDescription)

  await userEvent.type(courseTitle, 'Flame of Knowledge');
  await userEvent.type(courseDescription, 'Learn detailed events of Aracvios history');

  expect(courseTitle).toHaveValue('Flame of Knowledge');
  expect(courseDescription).toHaveValue('Learn detailed events of Aracvios history');
});

test('creates course on button click and navigates to manage course page afterwards', async () => {
    fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ([
      { id: 1, 
          course_title: 'SLAM Poetry', 
          course_description: 'Devastating Your Enemies with Magical Insults.' },
    ])
  });

  renderWithAuthContext(<CreateCourse/>, { auth: makeTeacherAuth() });
  await userEvent.type(
    screen.getByRole('textbox', { name: /title/i }),
    'SLAM Poetry'
  );

  await userEvent.type(
    screen.getByRole('textbox', { name: /description/i }),
    'Devastating Your Enemies with Magical Insults.'
  );

  await userEvent.click(screen.getByRole('button', { name:/Create Course/i}));

expect(fetch).toHaveBeenCalledWith(
  expect.stringContaining('/api/courses'),
  expect.objectContaining({
    method: 'POST',
    body: JSON.stringify({
      course_title: 'SLAM Poetry',
      course_description: 'Devastating Your Enemies with Magical Insults.',
    }),
  })
);

  expect(screen.queryByText(/Course created/i)).toBeInTheDocument();
  await waitFor(() => {
    expect(navigateMock).toHaveBeenCalledWith('/teacher')
    }, {timeout: 3000}
  )
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

test('Navigates to manage courses page on cancel button click', async () => {
  renderWithAuthContext(<CreateCourse/>, { auth: makeAdminAuth() });
  await userEvent.click(screen.getByText(/Cancel/i));
  expect(navigateMock).toHaveBeenCalledWith('/admin');
});

test('student users do not see the create course page', () => {
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