# Specs de desarrollo - Perriturno

## 1. Lista de specs necesarias, ordenadas por dependencia

1. SPEC-01 - Configuración base del sistema
2. SPEC-02 - Autenticación y autorización
3. SPEC-03 - Gestión de clientes y perfil
4. SPEC-04 - Gestión de mascotas
5. SPEC-05 - Gestión de servicios
6. SPEC-06 - Gestión de horarios
7. SPEC-07 - Consulta de disponibilidad
8. SPEC-08 - Gestión de reservas
9. SPEC-09 - Administración de estados y agenda

---

## 2. Desarrollo de specs

### SPEC-01 - Configuración base del sistema
- Objetivo: establecer la infraestructura inicial del backend y la base de datos.
- Contexto: el sistema debe desarrollarse con NestJS, TypeScript y PostgreSQL.
- Entradas: variables de entorno, requisitos del MVP.
- Salidas: proyecto backend inicializado, conexión a PostgreSQL, estructura base de módulos.
- Reglas: manejar secretos con variables de entorno, organizar el código por módulos, no subir .env al repositorio.
- Criterios de aceptación: la app se levanta localmente, la conexión a la base de datos funciona y existe estructura modular clara.
- Fuera de alcance: lógica completa de reservas, integraciones externas, panel avanzado.

### SPEC-02 - Autenticación y autorización
- Objetivo: permitir registro, login y control de permisos por rol.
- Contexto: se necesita proteger rutas y diferenciar cliente y administrador.
- Entradas: nombre, teléfono, correo, contraseña, rol.
- Salidas: registro, login con token JWT, respuestas sin contraseña.
- Reglas: correo único, contraseña cifrada, usuarios activos únicamente, rutas protegidas por token.
- Criterios de aceptación: registro exitoso, login válido, acceso denegado para roles no autorizados.
- Fuera de alcance: login con redes sociales, recuperación de contraseña, MFA.

### SPEC-03 - Gestión de clientes y perfil
- Objetivo: permitir consultar y actualizar el perfil propio.
- Contexto: el cliente debe mantener sus datos actualizados.
- Entradas: datos del usuario autenticado.
- Salidas: consulta y actualización del perfil.
- Reglas: el usuario solo puede modificar su propio perfil; no se permite cambiar el rol sin autorización.
- Criterios de aceptación: el cliente puede ver y actualizar sus datos básicos sin afectar a otros usuarios.
- Fuera de alcance: gestión completa de usuarios por parte de clientes.

### SPEC-04 - Gestión de mascotas
- Objetivo: registrar y consultar mascotas asociadas al cliente.
- Contexto: las reservas deben relacionarse con una mascota específica.
- Entradas: nombre, tipo, tamaño, observaciones.
- Salidas: creación y consulta de mascotas.
- Reglas: la mascota debe estar asociada a un cliente válido y solo el dueño puede verla.
- Criterios de aceptación: un cliente puede registrar una mascota y verla en su listado.
- Fuera de alcance: historial clínico veterinario.

### SPEC-05 - Gestión de servicios
- Objetivo: administrar los servicios que ofrece el negocio.
- Contexto: el negocio necesita definir servicios con duración y precio de referencia.
- Entradas: nombre, descripción, duración, precio, estado activo/inactivo.
- Salidas: creación y listado de servicios activos.
- Reglas: solo el administrador puede crear o editar servicios; los servicios inactivos no se muestran al cliente.
- Criterios de aceptación: el administrador crea servicios válidos y el cliente solo ve los activos.
- Fuera de alcance: pagos, inventario ni precios dinámicos.

### SPEC-06 - Gestión de horarios
- Objetivo: definir y consultar los turnos de atención del negocio.
- Contexto: la agenda depende de horarios disponibles, ocupados y bloqueados.
- Entradas: fecha, hora, duración, estado del horario.
- Salidas: creación y consulta de horarios.
- Reglas: solo el administrador puede crear o bloquear horarios; los horarios ocupados o bloqueados no son seleccionables.
- Criterios de aceptación: el administrador crea horarios válidos y el sistema los marca correctamente.
- Fuera de alcance: recurrencia compleja y sincronización con calendarios externos.

### SPEC-07 - Consulta de disponibilidad
- Objetivo: mostrar turnos disponibles para una fecha y servicio concretos.
- Contexto: el cliente necesita conocer qué cupos hay antes de reservar.
- Entradas: fecha y servicio.
- Salidas: listado de horarios disponibles y no disponibles.
- Reglas: la consulta debe validar la fecha y no mostrar horarios ocupados o bloqueados.
- Criterios de aceptación: el sistema devuelve horarios según la fecha y servicio, y evita mostrar cupos no disponibles.
- Fuera de alcance: recomendaciones inteligentes o disponibilidad múltiple.

### SPEC-08 - Gestión de reservas
- Objetivo: crear, consultar y cancelar reservas de forma segura.
- Contexto: la reserva es el corazón del sistema y debe estar asociada a cliente, mascota, servicio y horario.
- Entradas: cliente autenticado, mascota, servicio, horario.
- Salidas: creación y consulta de reservas; cancelación cuando aplique.
- Reglas: toda reserva nueva inicia en pendiente; un horario no puede tener dos reservas activas; al cancelar, el horario vuelve a estar disponible.
- Criterios de aceptación: se pueden crear reservas válidas, se rechazan conflictos y el cliente solo gestiona sus propias reservas.
- Fuera de alcance: pagos electrónicos y recordatorios automáticos.

### SPEC-09 - Administración de estados y agenda
- Objetivo: permitir que el administrador confirme, finalize y consulte la agenda del negocio.
- Contexto: la administración diaria requiere ver el estado de las reservas y organizar la jornada.
- Entradas: reservas existentes, filtros por fecha, estado o servicio.
- Salidas: cambio de estado y listado de agenda.
- Reglas: solo el administrador puede confirmar o finalizar; una reserva finalizada no vuelve a pendiente.
- Criterios de aceptación: el administrador puede cambiar estados y consultar reservas por fecha y estado.
- Fuera de alcance: reportes complejos y notificaciones externas.
