import { render, screen } from '@testing-library/react';
import App from './App';
// import { describe, it, expect, vi } from 'vitest';

// Mock Clerk components
vi.mock('@clerk/clerk-react', () => ({
    SignedIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SignedOut: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SignInButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SignOutButton: () => <button>Sign Out</button>,
    UserButton: () => <div>User Button</div>,
}));

describe('App', () => {
    it('renders the main page', () => {
        render(<App />);
        expect(screen.getByText('Welcome to VC Interview')).toBeInTheDocument();
    });
});
