'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Pet = {
	id: string;
	name: string;
	type: string;
	size: string;
	observations?: string;
};

type Service = {
	id: string;
	name: string;
	description?: string;
	durationMinutes: number;
	price: number;
	active: boolean;
};

type Schedule = {
	id: string;
	scheduleDate: string;
	startTime: string;
	endTime: string;
	petSize: string;
	status: string;
	serviceName?: string;
};

type Reservation = {
	id: string;
	pet: Pet;
	service: Service;
	schedule: Schedule;
	scheduleDate: string;
	startTime: string;
	endTime: string;
	status: string;
	observations?: string;
};

type AvailabilityResponse = {
	available: Schedule[];
	message?: string;
};

export default function ReservationsPage() {
	const router = useRouter();
	const [pet, setPet] = useState('');
	const [service, setService] = useState('');
	const [date, setDate] = useState('');
	const [selectedScheduleId, setSelectedScheduleId] = useState('');
	const [pets, setPets] = useState<Pet[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [availableSchedules, setAvailableSchedules] = useState<Schedule[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState('');

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	const handleUnauthorized = () => {
		localStorage.removeItem('perriturno_token');
		router.push('/login');
	};

	const getToken = () => localStorage.getItem('perriturno_token');

	const formatDate = (value: string) => {
		const dateValue = new Date(`${value}T00:00:00`);
		if (Number.isNaN(dateValue.getTime())) {
			return value;
		}

		return new Intl.DateTimeFormat('es-CO', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}).format(dateValue);
	};

	const formatTime = (value: string) => value.slice(0, 5);

	const clearAvailability = () => {
		setAvailableSchedules([]);
		setSelectedScheduleId('');
	};

	const fetchInitialData = async (token: string) => {
		if (!apiUrl) {
			setMessage('No fue posible conectar con el servidor.');
			setIsLoading(false);
			return;
		}

		setIsLoading(true);

		try {
			const [petsResponse, servicesResponse, reservationsResponse] = await Promise.all([
				fetch(`${apiUrl}/pets`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
				fetch(`${apiUrl}/services`),
				fetch(`${apiUrl}/reservations/me`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
			]);

			if ([petsResponse, reservationsResponse].some((response) => response.status === 401 || response.status === 403)) {
				handleUnauthorized();
				return;
			}

			if (!petsResponse.ok || !servicesResponse.ok || !reservationsResponse.ok) {
				setMessage('No fue posible cargar la información de tus reservas.');
				return;
			}

			const petsData = (await petsResponse.json()) as Pet[];
			const servicesData = (await servicesResponse.json()) as Service[];
			const reservationsData = (await reservationsResponse.json()) as Reservation[];

			setPets(Array.isArray(petsData) ? petsData : []);
			setServices(Array.isArray(servicesData) ? servicesData.filter((item) => item.active) : []);
			setReservations(Array.isArray(reservationsData) ? reservationsData : []);
		} catch {
			setMessage('No fue posible conectar con el servidor.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const token = getToken();

		if (!token) {
			router.push('/login');
			return;
		}

		fetchInitialData(token);
	}, [router]);

	const handleLogout = () => {
		localStorage.removeItem('perriturno_token');
		router.push('/login');
	};

	const handleCheckAvailability = async () => {
		if (!pet || !service || !date) {
			setMessage('Completa todos los datos de la reserva.');
			return;
		}

		const selectedPet = pets.find((item) => item.id === pet);
		if (!selectedPet) {
			setMessage('La mascota seleccionada no es válida.');
			return;
		}

		const token = getToken();
		if (!token) {
			router.push('/login');
			return;
		}

		if (!apiUrl) {
			setMessage('No fue posible conectar con el servidor.');
			return;
		}

		setIsCheckingAvailability(true);
		setMessage('');
		setAvailableSchedules([]);
		setSelectedScheduleId('');

		try {
			const params = new URLSearchParams({
				scheduleDate: date,
				serviceId: service,
				petSize: selectedPet.size,
			});

			const response = await fetch(`${apiUrl}/schedules/availability?${params.toString()}`);

			if (response.status === 401 || response.status === 403) {
				handleUnauthorized();
				return;
			}

			if (!response.ok) {
				let backendMessage = 'No fue posible consultar la disponibilidad.';
				try {
					const errorData = (await response.json()) as { message?: string | string[] };
					if (Array.isArray(errorData.message)) {
						backendMessage = errorData.message.join(' ');
					} else if (typeof errorData.message === 'string' && errorData.message.trim()) {
						backendMessage = errorData.message;
					}
				} catch {
					backendMessage = 'No fue posible consultar la disponibilidad.';
				}

				setMessage(backendMessage);
				return;
			}

			const data = (await response.json()) as AvailabilityResponse;
			const available = Array.isArray(data.available) ? data.available : [];

			setAvailableSchedules(available);

			if (available.length === 0) {
				setMessage(data.message || 'No hay horarios disponibles para la fecha seleccionada.');
			}
		} catch {
			setMessage('No fue posible conectar con el servidor.');
		} finally {
			setIsCheckingAvailability(false);
		}
	};

	const handleConfirmReservation = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isSubmitting) {
			return;
		}

		if (!pet || !service || !date || !selectedScheduleId) {
			setMessage('Completa todos los datos de la reserva.');
			return;
		}

		const token = getToken();
		if (!token) {
			router.push('/login');
			return;
		}

		if (!apiUrl) {
			setMessage('No fue posible conectar con el servidor.');
			return;
		}

		setIsSubmitting(true);
		setMessage('');

		try {
			const response = await fetch(`${apiUrl}/reservations`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					petId: pet,
					serviceId: service,
					scheduleId: selectedScheduleId,
				}),
			});

			if (response.status === 401 || response.status === 403) {
				handleUnauthorized();
				return;
			}

			if (!response.ok) {
				let backendMessage = 'No fue posible crear la reserva.';
				try {
					const errorData = (await response.json()) as { message?: string | string[] };
					if (Array.isArray(errorData.message)) {
						backendMessage = errorData.message.join(' ');
					} else if (typeof errorData.message === 'string' && errorData.message.trim()) {
						backendMessage = errorData.message;
					}
				} catch {
					backendMessage = 'No fue posible crear la reserva.';
				}

				setMessage(backendMessage);
				return;
			}

			setMessage('Reserva creada correctamente.');
			setPet('');
			setService('');
			setDate('');
			clearAvailability();
			await fetchInitialData(token);
		} catch {
			setMessage('No fue posible conectar con el servidor.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFieldChange = (setter: (value: string) => void) => (value: string) => {
		setter(value);
		clearAvailability();
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
						<button
							type="button"
							onClick={handleLogout}
							className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
						>
							Cerrar sesión
						</button>
					</nav>
				</div>
			</header>

			<main className="flex-1">
				<div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
					<section className="rounded-3xl border border-teal-100 bg-white/90 p-6 shadow-xl shadow-teal-100/40 sm:p-8 lg:p-10">
						{isLoading ? (
							<div className="mb-8 rounded-2xl border border-teal-100 bg-teal-50/80 px-4 py-4 text-sm font-medium text-teal-700">
								Cargando la información de tus reservas...
							</div>
						) : null}
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
												handleFieldChange(setPet)(e.target.value);
											}}
											className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
										>
											<option value="">Selecciona una mascota</option>
											{pets.map((item) => (
												<option key={item.id} value={item.id}>
													{item.name}
												</option>
											))}
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
												handleFieldChange(setService)(e.target.value);
											}}
											className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
										>
											<option value="">Selecciona un servicio</option>
											{services.map((item) => (
												<option key={item.id} value={item.id}>
													{item.name}
												</option>
											))}
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
											onChange={(e) => handleFieldChange(setDate)(e.target.value)}
											className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
										/>
									</div>
								</div>

								<button
									type="button"
									onClick={handleCheckAvailability}
									disabled={isCheckingAvailability}
									className="mt-6 w-full rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 font-semibold text-teal-700 transition-colors hover:bg-teal-100 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-70"
								>
									{isCheckingAvailability ? 'Consultando...' : 'Consultar disponibilidad'}
								</button>

								{availableSchedules.length > 0 && (
									<div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
										<p className="text-sm font-semibold text-teal-700">Horarios disponibles</p>
										<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
											{availableSchedules.map((slot) => {
												const isActive = selectedScheduleId === slot.id;

												return (
													<button
														key={slot.id}
														type="button"
														onClick={() => setSelectedScheduleId(slot.id)}
														className={
															isActive
																? 'rounded-xl border border-teal-600 bg-teal-600 px-3 py-2 text-sm font-semibold text-white'
																: 'rounded-xl border border-teal-200 bg-white px-3 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-100'
														}
													>
														{formatTime(slot.startTime)} - {formatTime(slot.endTime)}
													</button>
												);
											})}
										</div>
									</div>
								)}

								<button
									type="submit"
									disabled={isSubmitting}
									className="mt-6 w-full rounded-xl bg-rose-500 px-4 py-3.5 font-semibold text-white transition-colors hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-70"
								>
									{isSubmitting ? 'Confirmando reserva...' : 'Confirmar reserva'}
								</button>

								{message && (
									<div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4">
										<p className="text-sm font-medium text-teal-800">{message}</p>
									</div>
								)}
							</form>

							<div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-6 shadow-sm sm:p-8">
								<p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-400">Mis reservas</p>
								<h3 className="mt-2 text-2xl font-bold text-gray-900">Mis reservas</h3>

								{isLoading ? null : reservations.length === 0 ? (
									<div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
										<p className="text-sm font-medium text-gray-700">Aún no tienes reservas registradas.</p>
									</div>
								) : (
									<div className="mt-6 space-y-4">
										{reservations.map((reservation) => (
											<div key={reservation.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
												<div className="space-y-3 text-sm text-gray-700">
													<div className="flex items-center justify-between gap-4">
														<span>Mascota</span>
														<span className="font-semibold text-gray-900">{reservation.pet.name}</span>
													</div>
													<div className="flex items-center justify-between gap-4">
														<span>Servicio</span>
														<span className="font-semibold text-gray-900">{reservation.service.name}</span>
													</div>
													<div className="flex items-center justify-between gap-4">
														<span>Fecha</span>
														<span className="font-semibold text-gray-900">{formatDate(reservation.scheduleDate)}</span>
													</div>
													<div className="flex items-center justify-between gap-4">
														<span>Hora</span>
														<span className="font-semibold text-gray-900">
															{formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
														</span>
													</div>
													<div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3">
														<span>Estado</span>
														<span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">{reservation.status}</span>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
