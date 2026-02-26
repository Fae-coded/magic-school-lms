import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home.jsx';

test('renders welcome messages and login/register link', () => {
  render(
    <MemoryRouter><Home/></MemoryRouter>);
  expect(
    screen.getByText(/Welcome to Strixhaven University/i)).toBeInTheDocument();

  expect(
    screen.getByText(/Whether you are a novice or an archmage, all magical skill sets have a place at Strixhaven!/i)).toBeInTheDocument();

  expect(
    screen.getByRole('link', { name: /Login or Register here!/i })).toBeInTheDocument();
});

test('Login/Register link redirects to login-register page', () => {
  render(
    <MemoryRouter><Home/></MemoryRouter>);
    expect(screen.getByRole('link', { name: /Login or Register here!/i })).toHaveAttribute('href', '/login-register');
});