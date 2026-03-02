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
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import DeleteCourse from './DeleteCourse.jsx';

test('fetches course to delete and displays it for only admin or teacher users' , async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 1,
        course_title: 'Magic Fundamentals of All Eight Schools',
        course_description: 'Learn the foundations of magic.',
      })
    })
  );

  renderWithAuthContext(<DeleteCourse/>, { auth: makeAdminAuth() });
  const magicFunds = await screen.findByText('Magic Fundamentals of All Eight Schools');
  expect(magicFunds).toBeInTheDocument();
  expect(screen.getByText('Learn the foundations of magic.')).toBeInTheDocument();
  expect(screen.getByText(/Please confirm you wish to delete this course/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Yes, delete this course/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();

  renderWithAuthContext(<DeleteCourse/>, { auth: makeTeacherAuth() });
  expect(magicFunds).toBeInTheDocument();
  expect(screen.getByText('Learn the foundations of magic.')).toBeInTheDocument();
  expect(screen.getByText(/Please confirm you wish to delete this course/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Yes, delete this course/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
});


test('fails to fetch course and shows error' , async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.reject(new Error('Network error'))
  );

  renderWithAuthContext(<DeleteCourse/>, { auth: makeAdminAuth() });
  const errorMsg = await screen.findByText(/Network error/i);
  expect(errorMsg).toBeInTheDocument();
});  


test('deletes course on button click and navigates to manage course page afterwards', async () => {
    globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 1,
        course_title: 'Intro to Magic',
        course_description: 'Learn the basics of magic.',
      })
    })
  );

  renderWithAuthContext(<DeleteCourse/>, { auth: makeTeacherAuth() });

  const introToMagic = await screen.findByText('Intro to Magic');
  expect(introToMagic).toBeInTheDocument();

  await userEvent.click(screen.getByText(/Yes, delete this course/i));
  expect(screen.getByText(/Course deleted/i))
  expect(navigateMock).toHaveBeenCalledWith('/teacher');
});


test('fails to delete course and displays error message on failure', async () => {
  let callCount = 0;
  globalThis.fetch = vi.fn(() => {
    callCount++;
    // First call: fetch course data (success)
    if (callCount === 1) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 1,
          course_title: 'Magic 101',
          course_description: 'Learn basics.',
        })
      });
    }
    // Second call: delete course (failure)
    return Promise.resolve({
      ok: false,
    });
  });

  renderWithAuthContext(<DeleteCourse/>, { auth: makeTeacherAuth() });

  const magic101 = await screen.findByText('Magic 101');
  expect(magic101).toBeInTheDocument();

  await userEvent.click(screen.getByText(/Yes, delete this course/i));
  expect(await screen.findByText(/Course delete failed/i)).toBeInTheDocument();
});

test('Navigates to manage courses page on cancel button click', async () => {
    globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 1,
        course_title: 'SLAM Poetry',
        course_description: 'Devastating Your Enemies with Magical Insults.',
      })
    })
  );

  renderWithAuthContext(<DeleteCourse/>, { auth: makeAdminAuth() });

  const slamPoetry = await screen.findByText('SLAM Poetry');
  expect(slamPoetry).toBeInTheDocument();

  await userEvent.click(screen.getByText(/Cancel/i));
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