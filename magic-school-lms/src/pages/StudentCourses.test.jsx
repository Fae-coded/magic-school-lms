import { screen } from '@testing-library/react';
import { test, expect, vi, beforeEach, afterEach} from 'vitest';
import '@testing-library/jest-dom'
import { renderWithAuthContext } from '../test-utils/renderWithAuthContext.jsx';
import { makeStudentAuth, makeTeacherAuth, makeAdminAuth } from '../test-utils/authHelpers.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import StudentCourses from './StudentCourses.jsx';

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ([]),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('handles no courses case correctly', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      courses: [],
    }),
  });

  renderWithAuthContext(<StudentCourses/>, { auth: makeStudentAuth() });
  expect(await screen.findByText(/No courses available/i)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Enrolled/i })).not.toBeInTheDocument();
});

test('fetches student\'s enrolled courses with correct token and displays them', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({
      courses: [
        {
          id: 1,
          course_title: 'Intro to Magic',
          course_description: 'Learn the basics of magic.',
          is_enrolled: true,
        },
        {
          id: 2,
          course_title: 'Familiar Care',
          course_description: 'How to care for your familiar.',
          is_enrolled: true,
        },
      ],
    }),
  });

  renderWithAuthContext(<StudentCourses/>, { auth: makeStudentAuth() });
  const IntroCourse = await screen.findByText('Intro to Magic');
  expect(IntroCourse).toBeInTheDocument();
  expect(screen.getByText('How to care for your familiar.')).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /Enrolled/i })).toHaveLength(2);
});

test('fetches courses with correct token and displays error message on failure', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.reject(new Error('Network error'))
  );
  renderWithAuthContext(<StudentCourses/>, { auth: makeStudentAuth() });
  const errorMsg = await screen.findByText(/Network error/i);
  expect(errorMsg).toBeInTheDocument();
});


test('non-student users do not see the student course page', () => {
  const wrapped = () => (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentCourses />
    </ProtectedRoute>
  );

  renderWithAuthContext(wrapped(), { auth: makeAdminAuth() });
  expect(screen.getByText(/You do not have permission to view this page./i)).toBeInTheDocument();
  expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
  expect(screen.queryByText(/No courses available/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Enroll/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Enrolled/i })).not.toBeInTheDocument();

  renderWithAuthContext(wrapped(), { auth: makeTeacherAuth() });
  expect(screen.getByText(/Redirecting to teacher dashboard/i)).toBeInTheDocument();
  expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
  expect(screen.queryByText(/No courses available/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Enroll/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Enrolled/i })).not.toBeInTheDocument();
});