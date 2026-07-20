import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-teal-50 border-b border-teal-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-teal-700">Perriturno</h1>
            <span className="text-xl">🐾</span>
          </div>
          <nav className="hidden sm:flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-teal-600 transition-colors">
              Inicio
            </a>
            <a href="#servicios" className="text-gray-700 hover:text-teal-600 transition-colors">
              Servicios
            </a>
            <Link href="/login" className="bg-coral-500 text-white px-6 py-2 rounded-lg hover:bg-coral-600 transition-colors">
              Iniciar sesión
            </Link>
          </nav>
          <div className="sm:hidden">
            <Link href="/login" className="bg-coral-500 text-white px-4 py-2 rounded-lg text-sm">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <section className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              El cuidado de tu mascota, reservado en pocos minutos
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Perriturno te permite consultar disponibilidad y reservar servicios de cuidado para tu mascota de forma rápida y sencilla. Encuentra el horario perfecto que se adapte a tu rutina.
            </p>
            <a href="#servicios" className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium">
              Consultar servicios
            </a>
          </div>
          <div className="bg-teal-50 rounded-lg p-8 border border-teal-200">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Reserva de ejemplo</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Mascota:</span>
                  <span className="font-medium">Max - Perro Mediano</span>
                </div>
                <div className="flex justify-between">
                  <span>Servicio:</span>
                  <span className="font-medium">Baño y cuidado</span>
                </div>
                <div className="flex justify-between">
                  <span>Fecha:</span>
                  <span className="font-medium">Mañana, 14:00</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span>Total:</span>
                  <span className="font-bold text-teal-600">$45.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Nuestros Servicios</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Ofrecemos una variedad de servicios profesionales para el cuidado de tu mascota
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🛁</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Baño y Cuidado</h3>
              <p className="text-gray-600">Baños completos con productos de calidad, secado profesional y cuidado de la piel y pelaje de tu mascota.</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">✂️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Peluquería</h3>
              <p className="text-gray-600">Cortes y estilos profesionales adaptados a la raza y preferencias de tu mascota, realizados por expertos.</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Atención Especializada</h3>
              <p className="text-gray-600">Servicios especializados para mascotas pequeñas, grandes y con necesidades particulares de cuidado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Registra tu mascota</h3>
              <p className="text-gray-600 text-sm">Crea una cuenta y agrega los datos de tu mascota para comenzar.</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consulta disponibilidad</h3>
              <p className="text-gray-600 text-sm">Visualiza los horarios disponibles para cada servicio.</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Reserva tu horario</h3>
              <p className="text-gray-600 text-sm">Confirma tu reserva y recibe la confirmación al instante.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">Perriturno · Cuidado y reservas para mascotas</p>
        </div>
      </footer>
    </div>
  );
}
