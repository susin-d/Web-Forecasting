
import React from 'react';
import { View } from '../types';

interface RegisterViewProps {
  onNavigate: (view: View) => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onNavigate }) => {

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const username = (document.querySelector('input[type="text"]') as HTMLInputElement)?.value;
        const email = (document.querySelector('input[type="email"]') as HTMLInputElement)?.value;
        const password = (document.querySelector('input[type="password"]') as HTMLInputElement)?.value;

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                alert("Registration successful! Please log in.");
                onNavigate('login');
            } else {
                alert('Registration failed: ' + await response.text());
            }
        } catch (error) {
            alert('Registration error: ' + error);
        }
    }

  return (
    <div className="w-full max-w-md bg-secondary p-8 rounded-2xl shadow-2xl">
      <div className="text-center mb-8">
        <i className="fas fa-cloud-sun-rain text-5xl text-accent"></i>
        <h1 className="text-3xl font-bold mt-3">Create Account</h1>
        <p className="text-text-secondary">Join WeatherApp today!</p>
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
          <label className="block text-text-secondary mb-2">Email</label>
          <input
            type="email"
            className="w-full bg-tertiary p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="john.doe@example.com"
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
          Register
        </button>
      </form>
      <p className="text-center text-text-secondary mt-6">
        Already have an account?{' '}
        <span
          onClick={() => onNavigate('login')}
          className="text-accent font-semibold cursor-pointer hover:underline"
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default RegisterView;
