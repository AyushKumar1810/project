import React from 'react';
import { Navigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { TodoList } from '../components/TodoList';
import { useAuth } from '../contexts/AuthContext';
import { getGreeting } from '../lib/utils';

export function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user.firstName} {user.lastName}
          </h1>
          <button
            onClick={logout}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <TodoList />
      </main>
    </div>
  );
}