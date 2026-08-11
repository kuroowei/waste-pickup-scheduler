import { Link } from 'react-router-dom';
import { Truck, Bell, MapPin, ShieldCheck, Calendar, Star } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Truck size={18} className="text-white" />
            </div>
            <span className="font-semibold text-slate-900">WastePickup</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-emerald-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-emerald-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-4 pt-20 pb-16 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1 mb-6">
          <Truck size={14} />
          Now serving Yenagoa and Amassoma
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
          Reliable waste pickup for{' '}
          <span className="text-emerald-600">modern communities</span>
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Schedule pickups, track collection status, and stay informed — all in one place.
          No more guessing when the truck is coming.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/register"
            className="bg-emerald-600 text-white font-medium rounded-lg px-6 py-3 hover:bg-emerald-700 transition"
          >
            Schedule your first pickup
          </Link>
          <Link
            to="/login"
            className="border border-slate-300 text-slate-700 font-medium rounded-lg px-6 py-3 hover:bg-slate-50 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
              <Calendar size={20} className="text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Easy Scheduling</h3>
            <p className="text-sm text-slate-500 mt-2">
              Book a pickup in seconds, choose your waste type, date, and time.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
              <Bell size={20} className="text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Stay Informed</h3>
            <p className="text-sm text-slate-500 mt-2">
              Real-time status updates and announcements, so you always know what's happening.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
              <ShieldCheck size={20} className="text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Accountable Service</h3>
            <p className="text-sm text-slate-500 mt-2">
              Rate completed pickups and file complaints — your feedback drives better service.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={20} className="fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-slate-500">
          Residents rate every completed pickup — helping keep collection teams accountable.
        </p>
      </section>

      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Truck size={14} className="text-white" />
            </div>
            <span className="font-medium text-slate-900 text-sm">WastePickup</span>
          </div>
          <p className="text-sm text-slate-400 flex items-center gap-1.5">
            <MapPin size={14} />
            © {new Date().getFullYear()} Kuro-soft tech. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}