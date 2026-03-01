import { screen } from '@testing-library/react';
import { test, expect,  } from 'vitest';
import '@testing-library/jest-dom'
// import userEvent from '@testing-library/user-event'
import { renderWithAuthContext } from '../test-utils/renderWithAuthContext.jsx';
import { makeTeacherAuth, makeStudentAuth, makeAdminAuth } from '../test-utils/authHelpers.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import Teacher from './Teacher.jsx';


test('teacher users can render the manage courses page and loading message', () => {
  renderWithAuthContext(<Teacher/>, { auth: makeTeacherAuth() });
  expect(screen.getByText(/Loading courses.../i)).toBeInTheDocument();
});

test('handles no courses case correctly', () => {
  renderWithAuthContext(<Teacher/>, { auth: makeTeacherAuth() });
  expect(screen.getByText(/No courses available/i)).toBeInTheDocument();
  expect(screen.queryByText(/Edit Course/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Delete Course/i)).not.toBeInTheDocument();
});

//Other tests here!


test('non-teacher users do not see the teacher page', () => {
  const wrapped = () => (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <Teacher />
    </ProtectedRoute>
  );

  renderWithAuthContext(wrapped(), { auth: makeAdminAuth() });
  expect(screen.getByText(/You do not have permission to view this page./i)).toBeInTheDocument();
  expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
  expect(screen.queryByText(/No courses available/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Edit Course/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Delete Course/i)).not.toBeInTheDocument();

  renderWithAuthContext(wrapped(), { auth: makeStudentAuth() });
  expect(screen.getByText(/Redirecting to student dashboard/i)).toBeInTheDocument();
  expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
  expect(screen.queryByText(/No courses available/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Edit Course/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Delete Course/i)).not.toBeInTheDocument();
});