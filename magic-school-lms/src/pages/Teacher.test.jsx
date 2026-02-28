import { screen } from '@testing-library/react';
import { test, expect,  } from 'vitest';
import '@testing-library/jest-dom'
// import userEvent from '@testing-library/user-event'
import { renderWithAuthContext } from '../test-utils/renderWithAuthContext.jsx';
import { makeTeacherAuth,  } from '../test-utils/authHelpers.js';
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