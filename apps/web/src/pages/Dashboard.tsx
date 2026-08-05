import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome, {user?.fullName}
        </h1>
        <p className="text-slate-500 mt-1">Role: {user?.role}</p>
        <button
          onClick={logout}
          className="mt-6 bg-slate-900 text-white rounded-lg px-4 py-2 font-medium hover:bg-slate-800 transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}