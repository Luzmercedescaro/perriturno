'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockSlots = ['9:00 a. m.', '10:30 a. m.', '1:30 p. m.', '3:00 p. m.'];

export default function ReservationsPage() {
	const [pet, setPet] = useState('');
	const [service, setService] = useState('');
	const [date, setDate] = useState('');
	const [selectedSlot, setSelectedSlot] = useState('');
	const [showSlots, setShowSlots] = useState(false);
	const [message, setMessage] = useState('');

	const handleCheckAvailability = () => {
		setShowSlots(true);
		setMessage('');
	};

	const handleConfirmReservation = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!pet || !service || !date || !selectedSlot) {
			setMessage('Completa todos los datos de la reserva.');
			return;
		}

		setMessage('Reserva lista para guardarse en Perriturno.');
	};

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-br from-teal-50 via-white to-rose-50">
			<header className="border-b border-teal-100/80 bg-white/80 backdrop-blur-sm">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-3">
						<span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-xl text-white shadow-sm">
							🐾
						</span>
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-400">Perriturno</p>
							<h1 className="text-xl font-bold text-teal-700 sm:text-2xl">Perriturno</h1>
						</div>
					</div>

					<nav className="flex items-center gap-3 sm:gap-6">
						<Link
							href="/dashboard"
							className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-teal-50 hover:text-teal-700"
						>
							Panel principal
						</Link>
						<Link
							href="/login"
							className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
						>
							Cerrar sesión
						</Link>
					</nav>
				</div>
			</header>

			<main className="flex-1">
				<div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
					<section className="rounded-3xl border border-teal-100 bg-white/90 p-6 shadow-xl shadow-teal-100/40 sm:p-8 lg:p-10">
						<div className="mb-8">
							<p className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-600">
								Agenda de cuidado
							</p>
							<h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
								Disponibilidad y reservas
							</h2>
						</div>

						<div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
							<form onSubmit={handleConfirmReservation} noValidate className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
								<h3 className="text-xl font-bold text-gray-900">Nueva reserva</h3>

								<div className="mt-6 space-y-5">
									<div>
										<label htmlFor="pet" className="mb-2 block text-sm font-medium text-gray-700">
											Mascota
										</label>
										<select
											id="pet"
											required
											value={pet}
											onChange={(e) => {
												setPet(e.target.value);
												setSelectedSlot('');
											}}
											className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
										>
											<option value="">Selecciona una mascota</option>
											<option value="Luna">Luna</option>
										</select>
									</div>

									<div>
										<label htmlFor="service" className="mb-2 block text-sm font-medium text-gray-700">
											Servicio
										</label>
										<select
											id="service"
											required
											value={service}
											onChange={(e) => {
												setService(e.target.value);
												setSelectedSlot('');
											}}
											className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
										>
											<option value="">Selecciona un servicio</option>
											<option value="Baño para mascota pequeña">Baño para mascota pequeña</option>
											<option value="Baño para mascota grande">Baño para mascota grande</option>
										</select>
									</div>

									<div>
										<label htmlFor="date" className="mb-2 block text-sm font-medium text-gray-700">
											Fecha
										</label>
										<input
											id="date"
											type="date"
											required
											value={date}
											onChange={(e) => {
												setDate(e.target.value);
												setSelectedSlot('');
											}}
											className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
										/>
									</div>
								</div>

								<button
									type="button"
									onClick={handleCheckAvailability}
									className="mt-6 w-full rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 font-semibold text-teal-700 transition-colors hover:bg-teal-100 focus:outline-none focus:ring-4 focus:ring-teal-100"
								>
									Consultar disponibilidad
								</button>

								{showSlots && (
									<div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
										<p className="text-sm font-semibold text-teal-700">Horarios disponibles</p>
										<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
											{mockSlots.map((slot) => {
												const isActive = selectedSlot === slot;

												return (
													<button
														key={slot}
														type="button"
														onClick={() => setSelectedSlot(slot)}
														className={
															isActive
																? 'rounded-xl border border-teal-600 bg-teal-600 px-3 py-2 text-sm font-semibold text-white'
																: 'rounded-xl border border-teal-200 bg-white px-3 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-100'
														}
													>
														{slot}
													</button>
												);
											})}
										</div>
									</div>
								)}

								<button
									type="submit"
									className="mt-6 w-full rounded-xl bg-rose-500 px-4 py-3.5 font-semibold text-white transition-colors hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-200"
								>
									Confirmar reserva
								</button>

								{message && (
									<div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4">
										<p className="text-sm font-medium text-teal-800">{message}</p>
									</div>
								)}
							</form>

							<div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-6 shadow-sm sm:p-8">
								<p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-400">Mis reservas</p>
								<h3 className="mt-2 text-2xl font-bold text-gray-900">Reserva demostrativa</h3>

								<div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
									<div className="space-y-3 text-sm text-gray-700">
										<div className="flex items-center justify-between gap-4">
											<span>Mascota</span>
											<span className="font-semibold text-gray-900">Luna</span>
										</div>
										<div className="flex items-center justify-between gap-4">
											<span>Servicio</span>
											<span className="font-semibold text-gray-900">Baño para mascota pequeña</span>
										</div>
										<div className="flex items-center justify-between gap-4">
											<span>Fecha</span>
											<span className="font-semibold text-gray-900">25 de julio de 2026</span>
										</div>
										<div className="flex items-center justify-between gap-4">
											<span>Hora</span>
											<span className="font-semibold text-gray-900">10:30 a. m.</span>
										</div>
										<div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3">
											<span>Estado</span>
											<span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">Pendiente</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
