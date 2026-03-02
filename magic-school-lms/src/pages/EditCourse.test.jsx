import { screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

const navigateMock = vi.fn();
const paramsMock = { id: '1' };
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => paramsMock,
  };
});

import { renderWithAuthContext } from '../test-utils/renderWithAuthContext.jsx';
import { makeAdminAuth, makeStudentAuth, makeTeacherAuth } from '../test-utils/authHelpers.js';
import EditCourse from './EditCourse.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx';

// test('admin and teacher users can render the edit course page', () => {
//   renderWithAuthContext(<EditCourse/>, { auth: makeAdminAuth() });
//   expect(screen.getByText(/Edit Course Details/i)).toBeInTheDocument();
//    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
//    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();

//   renderWithAuthContext(<EditCourse/>, { auth: makeTeacherAuth() });
//   expect(screen.getByText(/Edit Course Details/i)).toBeInTheDocument();
//    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
//    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
// });

test('fetches course to edit and displays it for only admin or teacher users', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(
        { id: 1, course_title: 'Overview of Magical Notation', course_description: 'Learn how to solve common magical cyphers.' },
      )
    })
  );

  renderWithAuthContext(<EditCourse/>, { auth: makeAdminAuth() });
  const overview = await screen.findByText('Overview of Magical Notation');
  expect(overview).toBeInTheDocument();
  expect(screen.getByText('Learn how to solve common magical cyphers.')).toBeInTheDocument();
  expect(screen.getByText(/Edit Course Details/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();


  renderWithAuthContext(<EditCourse/>, { auth: makeTeacherAuth() });
  expect(overview).toBeInTheDocument();
  expect(screen.getByText('Learn how to solve common magical cyphers.')).toBeInTheDocument();
  expect(screen.getByText(/Edit Course Details/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
});

test('user can type in course title and description fields', async () => {
  renderWithAuthContext(<EditCourse/>, { auth: makeTeacherAuth() });

  const courseTitle = screen.getByLabelText(/Course Title/i);
  const courseDescription = screen.getByLabelText(/Course Description/i);

  await userEvent.type(courseTitle, 'Flame of Knowledge');
  await userEvent.type(courseDescription, 'Learn detailed events of Aracvios history');

  expect(courseTitle).toHaveValue('Flame of Knowledge');
  expect(courseDescription).toHaveValue('Learn detailed events of Aracvios history');
});

test('fails to fetch course and shows error', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.reject(new Error('Network error'))
  );

  renderWithAuthContext(<EditCourse/>, { auth: makeAdminAuth() });
  const errorMsg = await screen.findByText(/Network error/i);
  expect(errorMsg).toBeInTheDocument();
});


test('updates course on button click and navigates to manage course page afterwards', async () => {
    globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(
        { id: 1, course_title: 'Intro to Magic', course_description: 'Learn the basics of magic.' },
      )
    })
  );

  renderWithAuthContext(<EditCourse/>, { auth: makeAdminAuth() });

  const introToMagic = await screen.findByText('Intro to Magic');
  expect(introToMagic).toBeInTheDocument();

  await userEvent.click(screen.getByText(/Save Changes/i));
  expect(screen.getByText(/Course updated/i))
  expect(navigateMock).toHaveBeenCalledWith('/admin');
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
  await userEvent.click(screen.getByText(/Save Changes/i));

  expect(await screen.findByText(/course_title: Course title is required./i)).toBeInTheDocument();
})

test('Navigates to manage courses page on cancel button click', async () => {
  //   globalThis.fetch = vi.fn(() =>
  //   Promise.resolve({
  //     ok: true,
  //     json: () => Promise.resolve(
  //       { id: 1, course_title: 'SLAM Poetry', course_description: 'Devastating Your Enemies with Magical Insults.' },
  //     )
  //   })
  // );

  renderWithAuthContext(<EditCourse/>, { auth: makeAdminAuth() });

  // const slamPoetry = await screen.findByText('SLAM Poetry');
  // expect(slamPoetry).toBeInTheDocument();

  await userEvent.click(screen.getByText(/Cancel/i));
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