'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MyPetsPage() {
	const [name, setName] = useState('');
	const [type, setType] = useState('');
	const [size, setSize] = useState('');
	const [observations, setObservations] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!name || !type || !size) {
			setMessage('Completa los datos obligatorios de la mascota.');
			return;
		}

		setMessage('Mascota lista para guardarse en Perriturno.');
		setName('');
		setType('');
		setSize('');
		setObservations('');
	};

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-br from-teal-50 via-white to-rose-50">
			<header className="border-b border-teal-100/80 bg-white/80 backdrop-blur-sm">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
					<Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
						<span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-xl text-white shadow-sm">
							🐾
						</span>
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-400">Perriturno</p>
							<h1 className="text-xl font-bold text-teal-700 sm:text-2xl">Perriturno</h1>
						</div>
					</Link>

					<nav className="flex items-center gap-3 sm:gap-6">
						<Link href="/dashboard" className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-teal-50 hover:text-teal-700">
							Panel principal
						</Link>
						<Link href="/login" className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-600">
							Cerrar sesión
						</Link>
					</nav>
				</div>
			</header>

			<main className="flex-1">
				<div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
					<section className="rounded-3xl border border-teal-100 bg-white/90 p-6 shadow-xl shadow-teal-100/40 sm:p-8 lg:p-10">
						<div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
							<div>
								<p className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-600">
									Gestión de mascotas
								</p>
								<h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
									Mis mascotas
								</h2>
								<p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
									Registra y organiza la información de tus mascotas.
								</p>

								<div className="mt-8 inline-flex rounded-2xl border border-teal-100 bg-teal-50/80 px-5 py-4 shadow-sm">
									<span className="text-sm font-medium text-teal-700">Mascotas registradas: 1</span>
								</div>

								<div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
									<div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
										<div>
											<p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-400">Mascota registrada</p>
											<h3 className="mt-2 text-2xl font-bold text-gray-900">Luna</h3>
										</div>
										<span className="inline-flex w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
											Activa
										</span>
									</div>

									<div className="mt-6 grid gap-4 text-sm text-gray-700 sm:grid-cols-2">
										<div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
											<p className="text-gray-500">Tipo</p>
											<p className="mt-1 text-base font-semibold text-gray-900">Perro</p>
										</div>
										<div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
											<p className="text-gray-500">Tamaño</p>
											<p className="mt-1 text-base font-semibold text-gray-900">Pequeña</p>
										</div>
										<div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:col-span-2">
											<p className="text-gray-500">Observaciones</p>
											<p className="mt-1 text-base font-semibold text-gray-900">Sin observaciones especiales</p>
										</div>
									</div>

									<div className="mt-6">
										<button
											type="button"
											className="inline-flex rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-200"
										>
											Editar información
										</button>
									</div>
								</div>

								<div className="mt-8 rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-6 shadow-sm">
									<p className="text-base leading-7 text-gray-700">
										Registrar correctamente el tamaño de tu mascota permite consultar los horarios y servicios adecuados.
									</p>
								</div>
							</div>

							<div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:sticky lg:top-8">
								<div className="mb-6">
									<p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-400">Nuevo registro</p>
									<h3 className="mt-2 text-2xl font-bold text-gray-900">Agregar mascota</h3>
								</div>

								<form onSubmit={handleSubmit} noValidate className="space-y-5">
									<div>
										<label htmlFor="petName" className="mb-2 block text-sm font-medium text-gray-700">
											Nombre
										</label>
										<input
											id="petName"
											type="text"
											required
											placeholder="Nombre de tu mascota"
											value={name}
											onChange={(e) => setName(e.target.value)}
											className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
										/>
									</div>

									<div>
										<label htmlFor="petType" className="mb-2 block text-sm font-medium text-gray-700">
											Tipo
										</label>
										<select
											id="petType"
											required
											value={type}
											onChange={(e) => setType(e.target.value)}
											className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
										>
											<option value="">Selecciona una opción</option>
											<option value="Perro">Perro</option>
											<option value="Gato">Gato</option>
											<option value="Otro">Otro</option>
										</select>
									</div>

									<div>
										<label htmlFor="petSize" className="mb-2 block text-sm font-medium text-gray-700">
											Tamaño
										</label>
										<select
											id="petSize"
											required
											value={size}
											onChange={(e) => setSize(e.target.value)}
											className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
										>
											<option value="">Selecciona una opción</option>
											<option value="Pequeña">Pequeña</option>
											<option value="Grande">Grande</option>
										</select>
									</div>

									<div>
										<label htmlFor="observations" className="mb-2 block text-sm font-medium text-gray-700">
											Observaciones opcional
										</label>
										<textarea
											id="observations"
											rows={4}
											placeholder="Escribe aquí cualquier detalle importante"
											value={observations}
											onChange={(e) => setObservations(e.target.value)}
											className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
										/>
									</div>

									<button
										type="submit"
										className="w-full rounded-xl bg-teal-600 px-4 py-3.5 font-semibold text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-200"
									>
										Guardar mascota
									</button>

									{message && (
										<div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4">
											<p className="text-sm font-medium text-teal-800">{message}</p>
										</div>
									)}
								</form>
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
