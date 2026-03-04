import { screen, waitFor } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
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
import EditCourse from './EditCourse.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx';

test('fetches course to edit and displays it for admin', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(
        { id: 1, 
          course_title: 'Overview of Magical Notation', 
          course_description: 'Learn how to solve common magical cyphers.',
        }),
    })
  );

  renderWithAuthContext(
    <Routes>
      <Route path="/courses/:id" element={<EditCourse/>}/>
    </Routes>,
    {
      auth: makeAdminAuth(),
    route: '/courses/1',
    }
  );
  const overview = await screen.findByDisplayValue('Overview of Magical Notation');
  expect(overview).toBeInTheDocument();
  expect(screen.findByDisplayValue('Learn how to solve common magical cyphers.'));
  expect(screen.getByText(/Edit Course Details/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
});

test('fetches course to edit and displays it for teacher', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(
        { id: 1, 
          course_title: 'Overview of Magical Notation', 
          course_description: 'Learn how to solve common magical cyphers.', 
        }),
    })
  );

  renderWithAuthContext(
    <Routes>
      <Route path="/courses/:id" element={<EditCourse/>}/>
    </Routes>,
    {
      auth: makeTeacherAuth(),
    route: '/courses/1',
    }
  );
  expect(await screen.findByDisplayValue('Overview of Magical Notation')).toBeInTheDocument();
  expect(screen.findByDisplayValue('Learn how to solve common magical cyphers.'));
  expect(screen.getByText(/Edit Course Details/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
});

test('user can type in course title and description fields', async () => {
  renderWithAuthContext(<EditCourse/>, { auth: makeTeacherAuth() });

  const courseTitle = screen.getByLabelText(/Course Title/i);
  const courseDescription = screen.getByLabelText(/Course Description/i);
  await userEvent.clear(courseTitle, courseDescription)

  await userEvent.type(courseTitle, 'Flame of Knowledge');
  await userEvent.type(courseDescription, 'Learn detailed events of Aracvios history');

  expect(courseTitle).toHaveValue('Flame of Knowledge');
  expect(courseDescription).toHaveValue('Learn detailed events of Aracvios history');
});

test('updates course on button click and navigates to manage course page afterwards', async () => {
      globalThis.fetch = vi.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        course_title: 'Intro to Magic',
        course_description: 'Learn the basics of magic.',
      }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

  renderWithAuthContext(
    <Routes>
      <Route path="/courses/:id" element={<EditCourse/>}/>
    </Routes>,
    {
      auth: makeTeacherAuth(),
    route: '/courses/1',
    }
  );

  expect(await screen.findByDisplayValue('Intro to Magic')).toBeInTheDocument();
  expect(await screen.findByDisplayValue('Learn the basics of magic.')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /Save Changes/i}));
  expect(screen.getByText(/Course updated/i)).toBeInTheDocument();
  await waitFor(() => {
    expect(navigateMock).toHaveBeenCalledWith('/teacher')
  }, {timeout: 3000}
);
});

test('fails to update course and displays error message on failure', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({
        course_title: ['Course title is required.'],
      })
    })
  );

  renderWithAuthContext(<EditCourse/>, { auth: makeTeacherAuth() });

  const courseTitle = screen.getByLabelText(/Course Title/i);
  const courseDescription = screen.getByLabelText(/Course Description/i);

  await userEvent.type(courseTitle, 'Test');
  await userEvent.type(courseDescription, 'Too short');
  await userEvent.click(screen.getByRole('button', { name: /Save Changes/i}));

  expect(await screen.findByText(/course_title: Course title is required./i)).toBeInTheDocument();
})

test('Navigates to manage courses page on cancel button click', async () => {
  renderWithAuthContext(<EditCourse/>, { auth: makeAdminAuth() });
  await userEvent.click(screen.getByRole('button', { name:/Cancel/i}));
  expect(navigateMock).toHaveBeenCalledWith('/admin');
});

test('student users do not see the edit course page', () => {
  const wrapped = () => (
    <ProtectedRoute allowedRoles={["admin", "teacher"]}>
      <EditCourse/>
    </ProtectedRoute>
  );

  renderWithAuthContext(wrapped(), { auth: makeStudentAuth() });
  expect(screen.getByText(/You do not have permission to view this page./i)).toBeInTheDocument();
  expect(screen.queryByText(/Edit Course Details/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Save Changes/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument();
});