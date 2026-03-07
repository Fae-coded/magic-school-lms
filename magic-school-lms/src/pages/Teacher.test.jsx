import { screen } from '@testing-library/react';
import { test, expect, vi, beforeEach, afterEach} from 'vitest';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

import { renderWithAuthContext } from '../test-utils/renderWithAuthContext.jsx';
import { makeTeacherAuth, makeStudentAuth, makeAdminAuth } from '../test-utils/authHelpers.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import Teacher from './Teacher.jsx';

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

  renderWithAuthContext(<Teacher/>, { auth: makeTeacherAuth() });
  expect(await screen.findByText(/No courses available/i)).toBeInTheDocument();
  expect(screen.queryByText(/Edit Course/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Delete Course/i)).not.toBeInTheDocument();
});

test('fetches courses with correct token and displays them', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ([
      { id: 1, course_title: 'Intro to Magic', course_description: 'Learn the basics of magic.' },
      { id: 2, course_title: 'Familiar Care', course_description: 'How to care for your familiar.' },
    ])
  });

  renderWithAuthContext(<Teacher/>, { auth: makeTeacherAuth() });
  const IntroCourse = await screen.findByText('Intro to Magic');
  expect(IntroCourse).toBeInTheDocument();
  expect(screen.getByText('How to care for your familiar.')).toBeInTheDocument();
});

test('fetches courses with correct token and displays error message on failure', async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.reject(new Error('Network error'))
  );
  renderWithAuthContext(<Teacher/>, { auth: makeTeacherAuth() });
  const errorMsg = await screen.findByText(/Network error/i);
  expect(errorMsg).toBeInTheDocument();
});

test('navigates to edit course and delete course pages on button clicks', async () => {
    fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ([
      { id: 1, course_title: 'Intro to Magic', course_description: 'Learn the basics of magic.' },
      { id: 2, course_title: 'Familiar Care', course_description: 'How to care for your familiar.' },
    ])
  });

  renderWithAuthContext(<Teacher/>, { auth: makeTeacherAuth() });

  const introToMagic = await screen.findByText('Intro to Magic');
  expect(introToMagic).toBeInTheDocument();

  await userEvent.click(screen.getAllByText(/Edit Course/i)[0]);
  expect(navigateMock).toHaveBeenCalledWith('/edit-course/1');

  const familiarCare = await screen.findByText('Familiar Care');
  expect(familiarCare).toBeInTheDocument();
  await userEvent.click(screen.getAllByText(/Delete Course/i)[1]);
  expect(navigateMock).toHaveBeenCalledWith('/delete-course/2');
});

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