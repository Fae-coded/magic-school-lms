import { screen, waitFor } from '@testing-library/react';
import { test, expect, vi, beforeEach, afterEach} from 'vitest';
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
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import DeleteCourse from './DeleteCourse.jsx';

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({}),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('fetches course to delete and displays it for admin' , async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => (
      {id: 1, course_title: 'Magic Fundamentals of All Eight Schools', course_description: 'Learn the foundations of magic.'}
    )
    });

  renderWithAuthContext(
      <Routes>
        <Route path="/courses/:id" element={<DeleteCourse/>}/>
      </Routes>,
      {
        auth: makeAdminAuth(),
      route: '/courses/1',
      }
    );
    const magicFunds = await screen.findByText('Magic Fundamentals of All Eight Schools');
    expect(magicFunds).toBeInTheDocument();
    expect(screen.getByText('Learn the foundations of magic.')).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: /please confirm you wish to delete this course/i}));
    expect(screen.getByRole('button', { name: /Yes, delete this course/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
});

test('fetches course to delete and displays it for teacher' , async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => (
      {id: 1, course_title: 'Magic Fundamentals of All Eight Schools', course_description: 'Learn the foundations of magic.'}
    )
    });

  renderWithAuthContext(
      <Routes>
        <Route path="/courses/:id" element={<DeleteCourse/>}/>
      </Routes>,
      {
        auth: makeTeacherAuth(),
      route: '/courses/1',
      }
    );
  expect(await screen.findByText('Magic Fundamentals of All Eight Schools')).toBeInTheDocument();
  expect(screen.getByText('Learn the foundations of magic.')).toBeInTheDocument();
  expect(screen.getByRole('heading', {name: /please confirm you wish to delete this course/i}));
  expect(screen.getByRole('button', { name: /Yes, delete this course/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
});

test('deletes course on button click and navigates to manage course page afterwards', async () => {
    fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => (
      { id: 1, course_title: 'Intro to Magic', course_description: 'Learn the basics of magic.' }
    )
  })
  .mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

  renderWithAuthContext(<Routes>
        <Route path="/courses/:id" element={<DeleteCourse/>}/>
      </Routes>,
      {
        auth: makeTeacherAuth(),
      route: '/courses/1',
      }
    );

  const introToMagic = await screen.findByText('Intro to Magic');
  expect(introToMagic).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: /Yes, delete this course/i}));
  expect(screen.getByText(/Course deleted/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/teacher')
    }, {timeout: 3000}
  );
  });

test('fails to delete course and displays error message on failure', async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        course_title: 'Magic 101',
        course_description: 'Learn basics.',
      }),
    })
    .mockResolvedValueOnce({
      ok: false,
    });

  renderWithAuthContext(
    <Routes>
      <Route path="/courses/:id" element={<DeleteCourse />} />
    </Routes>,
    {
      auth: makeTeacherAuth(),
      route: '/courses/1',
    }
  );

  expect(await screen.findByText('Magic 101')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name:/Yes, delete this course/i }));
  expect(await screen.findByText(/Course delete failed/i)).toBeInTheDocument();
});

test('Navigates to manage courses page on cancel button click', async () => {
  renderWithAuthContext(<DeleteCourse/>, { auth: makeAdminAuth() });
  await userEvent.click(screen.getByRole('button', { name:/Cancel/i}));
  expect(navigateMock).toHaveBeenCalledWith('/admin');
});


test('student users do not see the delete course page', () => {
  const wrapped = () => (
    <ProtectedRoute allowedRoles={["admin", "teacher"]}>
      <DeleteCourse/>
    </ProtectedRoute>
  );

  renderWithAuthContext(wrapped(), { auth: makeStudentAuth() });
  expect(screen.getByText(/You do not have permission to view this page./i)).toBeInTheDocument();
  expect(screen.queryByText(/Please confirm you wish to delete this course/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Delete Course/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument();
});