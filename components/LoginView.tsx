
import React from 'react';
import { View } from '../types';

interface LoginViewProps {
  onNavigate: (view: View) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const username = (document.querySelector('input[type="text"]') as HTMLInputElement)?.value;
        const password = (document.querySelector('input[type="password"]') as HTMLInputElement)?.value;

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                onNavigate('dashboard');
            } else {
                alert('Login failed: ' + await response.text());
            }
        } catch (error) {
            alert('Login error: ' + error);
        }
    }

  return (
    <div className="w-full max-w-md bg-secondary p-8 rounded-2xl shadow-2xl">
      <div className="text-center mb-8">
        <i className="fas fa-cloud-sun-rain text-5xl text-accent"></i>
        <h1 className="text-3xl font-bold mt-3">Welcome Back</h1>
        <p className="text-text-secondary">Sign in to continue to WeatherApp</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-text-secondary mb-2">Username</label>
          <input
            type="text"
            className="w-full bg-tertiary p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="johndoe"
          />
        </div>
        <div>
          <label className="block text-text-secondary mb-2">Password</label>
          <input
            type="password"
            className="w-full bg-tertiary p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-sky-500 transition-colors duration-300 shadow-lg"
        >
          Login
        </button>
      </form>
      <p className="text-center text-text-secondary mt-6">
        Don't have an account?{' '}
        <span
          onClick={() => onNavigate('register')}
          className="text-accent font-semibold cursor-pointer hover:underline"
        >
          Register
        </span>
      </p>
    </div>
  );
};

export default LoginView;
