'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Completa el correo y la contraseña.');
      return;
    }

    setMessage('Formulario listo para conectarse con Perriturno.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-teal-50 border-b border-teal-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🐾</span>
            <h1 className="text-2xl font-bold text-teal-700">Perriturno</h1>
          </Link>
          <Link href="/" className="text-teal-600 hover:text-teal-700 transition-colors font-medium">
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">
          {/* Benefits Section */}
          <div className="hidden md:flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">¿Por qué usar Perriturno?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-600 text-white text-xl">
                    📅
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Consulta horarios disponibles</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Visualiza en tiempo real los horarios disponibles para cada servicio.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-600 text-white text-xl">
                    🐶
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gestiona tus mascotas</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Registra y administra todos los datos de tus mascotas en un solo lugar.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-600 text-white text-xl">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Revisa tus reservas</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Mantén un registro completo de todas tus reservas y confirmaciones.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Inicia sesión</h2>
              <p className="text-gray-600 mb-6">
                Accede para gestionar tus mascotas y reservas.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                  Ingresar
                </button>
              </form>

              {/* Message */}
              {message && (
                <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <p className="text-teal-800 text-sm">{message}</p>
                </div>
              )}

              {/* Register Link */}
              <p className="text-center text-gray-600 text-sm mt-6">
                ¿Aún no tienes cuenta?{' '}
                <Link href="/register" className="text-teal-600 hover:text-teal-700 font-semibold">
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
