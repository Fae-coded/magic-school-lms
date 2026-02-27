import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Form from './LoginRegister.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

test('renders login form by default', () => {
    render(
        <AuthProvider>
        <MemoryRouter>
        <Form/>
        </MemoryRouter>
        </AuthProvider>);
    expect(
        screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
        <Form/>;
    expect(
        screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();

    expect(
        screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});
    

test('switches to register form when register link is clicked', async () => {
    render(
        <AuthProvider>
        <MemoryRouter>
        <Form/>
        </MemoryRouter>
        </AuthProvider>);
    const registerLink = screen.getByRole('link', { name: /Register here!/i });
    await userEvent.click(registerLink);

    expect(
        screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();

    expect(
        screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
});

test('switches back to login form when login link is clicked', async () => {
    render(
        <AuthProvider>
        <MemoryRouter>
        <Form/>
        </MemoryRouter>
        </AuthProvider>);
    const registerLink = screen.getByRole('link', { name: /Register here!/i });
    await userEvent.click(registerLink);
    const loginLink = screen.getByRole('link', { name: /Login here!/i });
    await userEvent.click(loginLink);

    expect(
        screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
});

