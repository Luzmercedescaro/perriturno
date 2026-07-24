"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type UserProfile = {
	name?: string;
};

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

export default function Dashboard() {
	const router = useRouter();
	const [userName, setUserName] = useState('');
	const [pets, setPets] = useState<Pet[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
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

	const formatPrice = (value: number) =>
		new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			maximumFractionDigits: 0,
		}).format(value);

	const fetchDashboardData = async (token: string) => {
		if (!apiUrl) {
			setMessage('No fue posible conectar con el servidor.');
			setIsLoadingDashboard(false);
			return;
		}

		setIsLoadingDashboard(true);
		setMessage('');

		try {
			const [profileResponse, petsResponse, reservationsResponse, servicesResponse] = await Promise.all([
				fetch(`${apiUrl}/users/profile`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
				fetch(`${apiUrl}/pets`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
				fetch(`${apiUrl}/reservations/me`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
				fetch(`${apiUrl}/services`),
			]);

			if ([profileResponse, petsResponse, reservationsResponse, servicesResponse].some((response) => response.status === 401 || response.status === 403)) {
				handleUnauthorized();
				return;
			}

			if (!profileResponse.ok || !petsResponse.ok || !reservationsResponse.ok || !servicesResponse.ok) {
				setMessage('No fue posible cargar la información del panel.');
				return;
			}

			const profileData = (await profileResponse.json()) as UserProfile;
			const petsData = (await petsResponse.json()) as Pet[];
			const reservationsData = (await reservationsResponse.json()) as Reservation[];
			const servicesData = (await servicesResponse.json()) as Service[];

			setUserName(profileData.name?.trim() || 'Usuario');
			setPets(Array.isArray(petsData) ? petsData : []);
			setReservations(Array.isArray(reservationsData) ? reservationsData : []);
			setServices(Array.isArray(servicesData) ? servicesData.filter((item) => item.active) : []);
		} catch {
			setMessage('No fue posible conectar con el servidor.');
		} finally {
			setIsLoadingDashboard(false);
		}
	};

	useEffect(() => {
		const token = getToken();

		if (!token) {
			router.push('/login');
			return;
		}

		fetchDashboardData(token);
	}, [router]);

	const handleLogout = () => {
		localStorage.removeItem('perriturno_token');
		router.push('/login');
	};

	const activeReservations = reservations.filter(
		(item) => item.status === 'PENDIENTE' || item.status === 'CONFIRMADA',
	);

	const nextReservation = [...activeReservations].sort((left, right) => {
		const leftDateTime = new Date(`${left.scheduleDate}T${left.startTime}`);
		const rightDateTime = new Date(`${right.scheduleDate}T${right.startTime}`);

		return leftDateTime.getTime() - rightDateTime.getTime();
	})[0];

	const firstPet = pets[0];
	const profileTitle = isLoadingDashboard ? 'Cargando tu información...' : `Hola, ${userName}`;

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-br from-teal-50 via-white to-rose-50">
			<header className="border-b border-teal-100/80 bg-white/80 backdrop-blur-sm">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
					<Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
						<span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-xl text-white shadow-sm">
							🐾
						</span>
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-400">Perriturno</p>
							<h1 className="text-xl font-bold text-teal-700 sm:text-2xl">Perriturno</h1>
						</div>
					</Link>

					<nav className="flex items-center gap-3 sm:gap-6">
						<Link href="/" className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-teal-50 hover:text-teal-700">
							Inicio
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
					<section className="overflow-hidden rounded-3xl border border-teal-100 bg-white/90 p-6 shadow-xl shadow-teal-100/40 sm:p-8 lg:p-10">
						<div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
							<div>
								<p className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-600">
									Panel principal
								</p>
								<h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
									{profileTitle}
								</h2>
								<p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
									Aquí puedes revisar y organizar el cuidado de tus mascotas.
								</p>

								{message ? (
									<div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
										{message}
									</div>
								) : null}

								<div className="mt-8 grid gap-4 sm:grid-cols-3">
									<div className="rounded-2xl border border-teal-100 bg-teal-50/80 p-5 shadow-sm">
										<p className="text-sm font-medium text-teal-700">Mascotas registradas</p>
										<p className="mt-3 text-3xl font-bold text-gray-900">{isLoadingDashboard ? '...' : pets.length}</p>
									</div>
									<div className="rounded-2xl border border-rose-100 bg-rose-50/80 p-5 shadow-sm">
										<p className="text-sm font-medium text-rose-700">Reservas activas</p>
										<p className="mt-3 text-3xl font-bold text-gray-900">{isLoadingDashboard ? '...' : activeReservations.length}</p>
									</div>
									<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
										<p className="text-sm font-medium text-gray-600">Servicios disponibles</p>
										<p className="mt-3 text-3xl font-bold text-gray-900">{isLoadingDashboard ? '...' : services.length}</p>
									</div>
								</div>
							</div>

							<div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-6 shadow-sm sm:p-8">
								<div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
									<div className="flex items-start justify-between gap-4">
										<div>
											<p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-400">Próxima reserva</p>
											<h3 className="mt-2 text-xl font-bold text-gray-900">
												{isLoadingDashboard
													? 'Cargando reserva...'
													: nextReservation?.service.name || 'Sin reservas activas'}
											</h3>
										</div>
										{!isLoadingDashboard && nextReservation ? (
											<span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
												{nextReservation.status}
											</span>
										) : null}
									</div>

									{isLoadingDashboard ? (
										<div className="mt-5 space-y-3 text-sm text-gray-700">
											<p className="font-medium text-gray-700">Cargando la próxima reserva...</p>
										</div>
									) : nextReservation ? (
										<div className="mt-5 space-y-3 text-sm text-gray-700">
											<div className="flex items-center justify-between gap-4">
												<span>Mascota</span>
												<span className="font-semibold text-gray-900">{nextReservation.pet.name}</span>
											</div>
											<div className="flex items-center justify-between gap-4">
												<span>Servicio</span>
												<span className="font-semibold text-gray-900">{nextReservation.service.name}</span>
											</div>
											<div className="flex items-center justify-between gap-4">
												<span>Fecha</span>
												<span className="font-semibold text-gray-900">{formatDate(nextReservation.scheduleDate)}</span>
											</div>
											<div className="flex items-center justify-between gap-4">
												<span>Hora</span>
												<span className="font-semibold text-gray-900">{formatTime(nextReservation.startTime)}</span>
											</div>
											<div className="flex items-center justify-between gap-4">
												<span>Estado</span>
												<span className="font-semibold text-rose-600">{nextReservation.status}</span>
											</div>
											<div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3">
												<span>Precio</span>
												<span className="font-bold text-teal-700">{formatPrice(nextReservation.service.price)}</span>
											</div>
										</div>
									) : (
										<div className="mt-5 space-y-3 text-sm text-gray-700">
											<p className="font-medium text-gray-700">No tienes reservas activas por ahora.</p>
										</div>
									)}
								</div>
							</div>
						</div>
					</section>

					<section className="mt-8">
						<div className="mb-5 flex items-end justify-between gap-4">
							<div>
								<p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-400">Acciones rápidas</p>
								<h3 className="mt-2 text-2xl font-bold text-gray-900">Organiza tu día en pocos pasos</h3>
							</div>
						</div>

						<div className="grid gap-5 lg:grid-cols-3">
							<div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md">
								<div className="flex items-start justify-between gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-xl text-white">
										🐶
									</div>
									<span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
										Próximamente
									</span>
								</div>
								<h4 className="mt-5 text-xl font-bold text-gray-900">Gestionar mascotas</h4>
								<p className="mt-3 text-sm leading-6 text-gray-600">
									Registra y actualiza la información de tus mascotas.
								</p>
							</div>

							<div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md">
								<div className="flex items-start justify-between gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-xl text-white">
										📅
									</div>
									<span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
										Próximamente
									</span>
								</div>
								<h4 className="mt-5 text-xl font-bold text-gray-900">Nueva reserva</h4>
								<p className="mt-3 text-sm leading-6 text-gray-600">
									Consulta disponibilidad y selecciona un horario.
								</p>
							</div>

							<Link
								href="/#servicios"
								className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-600 to-teal-700 p-6 text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl">
									✨
								</div>
								<h4 className="mt-5 text-xl font-bold">Consultar servicios</h4>
								<p className="mt-3 text-sm leading-6 text-teal-50">
									Conoce los servicios disponibles para tu mascota.
								</p>
							</Link>
						</div>
					</section>

					<section className="mt-8 grid gap-6 lg:grid-cols-2">
						<div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-400">Mi mascota</p>
									<h3 className="mt-2 text-2xl font-bold text-gray-900">
										{isLoadingDashboard ? 'Cargando mascota...' : firstPet?.name || 'Sin mascotas registradas'}
									</h3>
								</div>
								{!isLoadingDashboard && firstPet ? (
									<span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
										Perfil activo
									</span>
								) : null}
							</div>

							{isLoadingDashboard ? (
								<div className="mt-6 space-y-4 text-sm text-gray-700">
									<p className="font-medium text-gray-700">Cargando la información de tu mascota...</p>
								</div>
							) : firstPet ? (
								<div className="mt-6 space-y-4 text-sm text-gray-700">
									<div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
										<span>Nombre</span>
										<span className="font-semibold text-gray-900">{firstPet.name}</span>
									</div>
									<div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
										<span>Tipo</span>
										<span className="font-semibold text-gray-900">{firstPet.type}</span>
									</div>
									<div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
										<span>Tamaño</span>
										<span className="font-semibold text-gray-900">{firstPet.size}</span>
									</div>
									<div className="flex items-start justify-between gap-4">
										<span>Observaciones</span>
										<span className="max-w-xs text-right font-semibold text-gray-900">
											{firstPet.observations?.trim() || 'Sin observaciones especiales'}
										</span>
									</div>
								</div>
							) : (
								<div className="mt-6 space-y-4 text-sm text-gray-700">
									<p className="font-medium text-gray-700">Aún no tienes mascotas registradas.</p>
								</div>
							)}
						</div>

						<div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-6 shadow-sm sm:p-8">
							<div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
								<p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-400">Recomendación</p>
								<p className="mt-3 text-base leading-7 text-gray-700">
									Organiza tus reservas con anticipación para encontrar el horario más conveniente.
								</p>
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
