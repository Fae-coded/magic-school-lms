import { screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import '@testing-library/jest-dom'
// import userEvent from '@testing-library/user-event'
import { renderWithAuthContext } from '../test-utils/renderWithAuthContext.jsx';
import { makeAdminAuth,  } from '../test-utils/authHelpers.js';
import Admin from './Admin.jsx';
//makeStudentAuth, makeTeacherAuth

test('admin users can render the admin course page and loading message', () => {
  renderWithAuthContext(<Admin/>, { auth: makeAdminAuth() });
  expect(screen.getByText(/Loading courses.../i)).toBeInTheDocument();
});

test('handles no courses case correctly', () => {
  renderWithAuthContext(<Admin/>, { auth: makeAdminAuth() });
  expect(screen.getByText(/No courses available/i)).toBeInTheDocument();
  expect(screen.queryByText(/Edit Course/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Delete Course/i)).not.toBeInTheDocument();
});

test('fetches courses with correct token and displays them', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, course_title: 'Intro to Magic', course_description: 'Learn the basics of magic.' },
        { id: 2, course_title: 'Familiar Care', course_description: 'How to care for your familiar.' },
      ])
    })
  );

  renderWithAuthContext(<Admin/>, { auth: makeAdminAuth() });
  const IntroCourse = await screen.findByText('Intro to Magic');
  expect(IntroCourse).toBeInTheDocument();
  expect(screen.getByText('How to care for your familiar.')).toBeInTheDocument();
});

test('fetches courses with correct token and displays error message on failure', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.reject(new Error('Network error'))
  );

  renderWithAuthContext(<Admin/>, { auth: makeAdminAuth() });
  const errorMsg = await screen.findByText(/Network error/i);
  expect(errorMsg).toBeInTheDocument();
});  