import { screen } from '@testing-library/react';
import { test, expect,  } from 'vitest';
import '@testing-library/jest-dom'
// import userEvent from '@testing-library/user-event'
import { renderWithAuthContext } from '../test-utils/renderWithAuthContext.jsx';
import { makeStudentAuth, makeTeacherAuth, makeAdminAuth } from '../test-utils/authHelpers.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import StudentCourses from './StudentCourses.jsx';


test('student users can render the student course page and loading message', () => {
  renderWithAuthContext(<StudentCourses/>, { auth: makeStudentAuth() });
  expect(screen.getByText(/Loading courses.../i)).toBeInTheDocument();
});

test('handles no courses case correctly', () => {
  renderWithAuthContext(<StudentCourses/>, { auth: makeStudentAuth() });
  expect(screen.getByText(/No courses available/i)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Enrolled/i })).not.toBeInTheDocument();
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