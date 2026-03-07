import { screen } from '@testing-library/react';
import { test, expect, vi, beforeEach, afterEach} from 'vitest';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { renderWithAuthContext } from '../test-utils/renderWithAuthContext.jsx';
import { makeStudentAuth, makeTeacherAuth, makeAdminAuth } from '../test-utils/authHelpers.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import Student from './Student.jsx';

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
    json: async () => ([]),
  });

  renderWithAuthContext(<Student/>, { auth: makeStudentAuth() });
  expect(await screen.findByText(/No courses available/i)).toBeInTheDocument();
  expect(screen.queryByText(/Enroll/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Enrolled/i)).not.toBeInTheDocument();
});

test('fetches courses with correct token and displays them', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ([
      { id: 1, course_title: 'Intro to Magic', course_description: 'Learn the basics of magic.' },
      { id: 2, course_title: 'Familiar Care', course_description: 'How to care for your familiar.' },
    ])
  });

  renderWithAuthContext(<Student/>, { auth: makeStudentAuth() });
  const IntroCourse = await screen.findByText('Intro to Magic');
  expect(IntroCourse).toBeInTheDocument();
  expect(screen.getByText('How to care for your familiar.')).toBeInTheDocument();
});

test('fetches courses with correct token and displays error message on failure', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.reject(new Error('Network error'))
  );

  renderWithAuthContext(<Student/>, { auth: makeStudentAuth() });
  const errorMsg = await screen.findByText(/Network error/i);
  expect(errorMsg).toBeInTheDocument();
});  

test('enrolls in course and updates button state on click', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ([
      { id: 1, course_title: 'Intro to Magic', course_description: 'Learn the basics of magic.' }
    ])
  })
  .mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => ({})
  });

  renderWithAuthContext(<Student/>, { auth: makeStudentAuth() });
  const enrollButton = await screen.findByText(/Enroll/i);
  expect(enrollButton).toBeInTheDocument();
  await userEvent.click(enrollButton);
  const enrolledButton = await screen.findByText(/Enrolled/i);
  expect(enrolledButton).toBeInTheDocument();
});

test('non-student users do not see the available courses page', () => {
  const wrapped = () => (
    <ProtectedRoute allowedRoles={["student"]}>
      <Student />
    </ProtectedRoute>
  );

   renderWithAuthContext(wrapped(), { auth: makeAdminAuth() });
  expect(screen.getByText(/You do not have permission to view this page./i)).toBeInTheDocument();
  expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
  expect(screen.queryByText(/No courses available/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Enroll/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Enrolled/i)).not.toBeInTheDocument();

  renderWithAuthContext(wrapped(), { auth: makeTeacherAuth() });
  expect(screen.getByText(/Redirecting to teacher dashboard/i)).toBeInTheDocument();
  expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
  expect(screen.queryByText(/No courses available/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Enroll/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Enrolled/i)).not.toBeInTheDocument();
});