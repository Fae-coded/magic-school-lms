import { screen } from '@testing-library/react';
import { test, expect,  } from 'vitest';
import '@testing-library/jest-dom'
// import userEvent from '@testing-library/user-event'
import { renderWithAuthContext } from '../test-utils/renderWithAuthContext.jsx';
import { makeStudentAuth,  } from '../test-utils/authHelpers.js';
import StudentCourses from './student.jsx';


test('student users can render the student course page and loading message', () => {
  renderWithAuthContext(<StudentCourses/>, { auth: makeStudentAuth() });
  expect(screen.getByText(/Loading courses.../i)).toBeInTheDocument();
});

test('handles no courses case correctly', () => {
  renderWithAuthContext(<StudentCourses/>, { auth: makeStudentAuth() });
  expect(screen.getByText(/No courses available/i)).toBeInTheDocument();
  expect(screen.queryByText(/Enrolled/i)).not.toBeInTheDocument();
});