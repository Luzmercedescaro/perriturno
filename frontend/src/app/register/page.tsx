'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
	const [fullName, setFullName] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!fullName || !phone || !email || !password || !confirmPassword) {
			setMessage('Completa todos los campos.');
			return;
		}

		if (password !== confirmPassword) {
			setMessage('Las contraseñas no coinciden.');
			return;
		}

		setMessage('Formulario listo para registrar tu cuenta en Perriturno.');
	};

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-br from-teal-50 via-white to-rose-50">
			<header className="border-b border-teal-100/80 bg-white/80 backdrop-blur-sm">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
					<Link href="/" className="flex items-center gap-3 text-left transition-opacity hover:opacity-80">
						<span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-xl text-white shadow-sm">
							🐾
						</span>
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-400">Perriturno</p>
							<h1 className="text-xl font-bold text-teal-700 sm:text-2xl">Perriturno</h1>
						</div>
					</Link>

					<Link href="/" className="rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-700 transition-colors hover:border-teal-300 hover:bg-teal-50">
						Volver al inicio
					</Link>
				</div>
			</header>

			<main className="flex-1">
				<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
					<div className="grid items-stretch gap-8 lg:grid-cols-[1fr_1.1fr]">
						<aside className="order-2 lg:order-1">
							<div className="h-full rounded-3xl border border-teal-100 bg-white/85 p-6 shadow-sm backdrop-blur-sm sm:p-8">
								<div className="mb-6 inline-flex rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-600">
									Crea tu perfil en minutos
								</div>
								<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
									Gestiona reservas, mascotas y horarios desde un solo lugar.
								</h2>
								<p className="mt-4 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
									Perriturno te acompaña con una experiencia clara y ordenada para registrar tu cuenta y empezar a organizar tus servicios.
								</p>

								<div className="mt-8 space-y-4">
									<div className="flex gap-4 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
										<div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-teal-600 text-lg text-white">
											✓
										</div>
										<div>
											<h3 className="font-semibold text-gray-900">Reserva servicios fácilmente</h3>
											<p className="mt-1 text-sm leading-6 text-gray-600">
												Agenda turnos con una experiencia rápida y simple desde cualquier dispositivo.
											</p>
										</div>
									</div>

									<div className="flex gap-4 rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
										<div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500 text-lg text-white">
											🐶
										</div>
										<div>
											<h3 className="font-semibold text-gray-900">Gestiona la información de tus mascotas</h3>
											<p className="mt-1 text-sm leading-6 text-gray-600">
												Mantén tus datos organizados para cada mascota en un mismo perfil.
											</p>
										</div>
									</div>

									<div className="flex gap-4 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
										<div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-teal-700 text-lg text-white">
											📅
										</div>
										<div>
											<h3 className="font-semibold text-gray-900">Consulta tus horarios y reservas</h3>
											<p className="mt-1 text-sm leading-6 text-gray-600">
												Revisa tu agenda y controla fácilmente todo lo que ya reservaste.
											</p>
										</div>
									</div>
								</div>
							</div>
						</aside>

						<section className="order-1 flex items-center lg:order-2">
							<div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-teal-100/40 sm:p-8 lg:p-10">
								<div className="mb-8">
									<p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-400">Registro</p>
									<h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Crea tu cuenta</h2>
									<p className="mt-3 text-base leading-7 text-gray-600">
										Registra tus datos para gestionar tus mascotas y reservas.
									</p>
								</div>

								<form onSubmit={handleSubmit} noValidate className="space-y-5">
									<div>
										<label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-700">
											Nombre completo
										</label>
										<input
											id="fullName"
											type="text"
											required
											placeholder="Tu nombre completo"
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
											className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
										/>
									</div>

									<div className="grid gap-5 sm:grid-cols-2">
										<div>
											<label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
												Teléfono
											</label>
											<input
												id="phone"
												type="tel"
												required
												placeholder="300 123 4567"
												value={phone}
												onChange={(e) => setPhone(e.target.value)}
												className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
											/>
										</div>

										<div>
											<label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
												Correo electrónico
											</label>
											<input
												id="email"
												type="email"
												required
												placeholder="tu@correo.com"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
											/>
										</div>
									</div>

									<div className="grid gap-5 sm:grid-cols-2">
										<div>
											<label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
												Contraseña
											</label>
											<input
												id="password"
												type="password"
												required
												placeholder="Crea una contraseña"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
											/>
										</div>

										<div>
											<label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
												Confirmar contraseña
											</label>
											<input
												id="confirmPassword"
												type="password"
												required
												placeholder="Repite tu contraseña"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
											/>
										</div>
									</div>

									<button
										type="submit"
										className="w-full rounded-xl bg-rose-500 px-4 py-3.5 font-semibold text-white transition-colors hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-200"
									>
										Crear cuenta
									</button>
								</form>

								{message && (
									<div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4">
										<p className="text-sm font-medium text-teal-800">{message}</p>
									</div>
								)}

								<p className="mt-6 text-center text-sm text-gray-600">
									¿Ya tienes cuenta?{' '}
									<Link href="/login" className="font-semibold text-teal-600 transition-colors hover:text-teal-700">
										Inicia sesión
									</Link>
								</p>
							</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}
