# Specs de desarrollo - Perriturno

## 1. Lista de specs necesarias, ordenadas por dependencia

El siguiente orden prioriza la construcción incremental del sistema: primero la base técnica y seguridad, luego los módulos de negocio que dependen de ella, y finalmente la lógica de reservas y administración.

1. SPEC-01 - Configuración base del sistema
   - Dependencia: ninguna
   - Objetivo: dejar preparado el proyecto backend, la base de datos y la estructura inicial del código.

2. SPEC-02 - Autenticación y autorización
   - Dependencia: SPEC-01
   - Objetivo: permitir login y proteger rutas según rol.

3. SPEC-03 - Gestión de clientes y perfil
   - Dependencia: SPEC-02
   - Objetivo: permitir registro, consulta y actualización del perfil del usuario autenticado.

4. SPEC-04 - Gestión de mascotas
   - Dependencia: SPEC-02 y SPEC-03
   - Objetivo: permitir registrar mascotas asociadas al cliente autenticado.

5. SPEC-05 - Gestión de servicios
   - Dependencia: SPEC-02
   - Objetivo: permitir administrar servicios ofrecidos por el negocio.

6. SPEC-06 - Gestión de horarios
   - Dependencia: SPEC-02 y SPEC-05
   - Objetivo: permitir definir horarios disponibles, ocupados y bloqueados.

7. SPEC-07 - Consulta de disponibilidad
   - Dependencia: SPEC-05 y SPEC-06
   - Objetivo: mostrar cupos por fecha y servicio.

8. SPEC-08 - Gestión de reservas
   - Dependencia: SPEC-02, SPEC-04, SPEC-05, SPEC-06 y SPEC-07
   - Objetivo: permitir crear, consultar y cancelar reservas según reglas de negocio.

9. SPEC-09 - Administración de estados y agenda
   - Dependencia: SPEC-08
   - Objetivo: permitir confirmar, finalizar y consultar reservas desde rol administrador.

---

## 2. Desarrollo de specs

### SPEC-01 - Configuración base del sistema

- Objetivo
  - Establecer la infraestructura inicial del backend y la base de datos para que el resto de los módulos puedan desarrollarse sobre una estructura estable.

- Contexto
  - El sistema debe desarrollarse con NestJS, TypeScript y PostgreSQL, y debe permitir pruebas locales sin exponer información sensible.

- Entradas
  - Variables de entorno para base de datos, JWT y entorno de ejecución.
  - Requisitos del documento técnico y del MVP.

- Salidas
  - Proyecto backend inicializado.
  - Conexión configurada a PostgreSQL.
  - Estructura de módulos base: usuarios, mascotas, servicios, horarios, reservas.
  - Endpoint de salud o verificación de funcionamiento.

- Reglas
  - La configuración sensible debe manejarse con variables de entorno.
  - El código debe organizarse por módulos.
  - No se deben subir secretos ni el archivo .env al repositorio.
  - La base de datos debe soportar los modelos iniciales del MVP.

- Criterios de aceptación
  - El proyecto se levanta correctamente en ambiente local.
  - La conexión a la base de datos funciona.
  - Existe una estructura clara de módulos y archivos por responsabilidad.
  - Se puede verificar que la aplicación responde correctamente.

- Fuera de alcance
  - Lógica de negocio completa de reservas.
  - Integraciones externas.
  - Panel visual avanzado.

---

### SPEC-02 - Autenticación y autorización

- Objetivo
  - Permitir que clientes y administradores accedan al sistema de forma segura y con permisos diferenciados.

- Contexto
  - El sistema necesita controlar el acceso a rutas privadas y evitar que usuarios no autorizados manipulen información.

- Entradas
  - Datos de registro: nombre, teléfono, correo, contraseña.
  - Credenciales de inicio de sesión.
  - Roles: cliente y administrador.

- Salidas
  - Registro de usuarios.
  - Inicio de sesión con token JWT.
  - Respuesta segura sin devolver la contraseña.
  - Rutas protegidas según rol.

- Reglas
  - No puede existir más de un usuario con el mismo correo.
  - Las contraseñas deben almacenarse cifradas.
  - Solo usuarios activos pueden iniciar sesión.
  - Las rutas privadas deben validar el token.
  - El administrador debe tener permisos superiores a los del cliente.

- Criterios de aceptación
  - Un cliente puede registrarse correctamente.
  - Un usuario con correo duplicado recibe error controlado.
  - Un usuario activo puede iniciar sesión y recibir token.
  - Un usuario inactivo o con credenciales inválidas no puede acceder.
  - Un cliente no puede acceder a rutas exclusivas del administrador.

- Fuera de alcance
  - Login con redes sociales.
  - Recuperación de contraseña por correo.
  - Autenticación multifactor.

---

### SPEC-03 - Gestión de clientes y perfil

- Objetivo
  - Permitir al usuario autenticado consultar y actualizar su información básica de forma segura.

- Contexto
  - El cliente debe poder gestionar sus datos personales y mantener el perfil actualizado para futuras reservas.

- Entradas
  - Perfil del usuario autenticado.
  - Datos modificables: nombre, teléfono y otros datos básicos.

- Salidas
  - Consulta del perfil propio.
  - Actualización del perfil.
  - Respuesta con datos seguros del usuario.

- Reglas
  - Un usuario solo puede consultar y modificar su propio perfil.
  - No se debe permitir cambiar el rol sin autorización.
  - La contraseña no debe devolverse en ninguna respuesta.

- Criterios de aceptación
  - El cliente autenticado puede ver su información personal.
  - Puede actualizar sus datos básicos sin afectar otros usuarios.
  - No puede modificar información que no le corresponde.
  - El sistema valida los datos antes de guardarlos.

- Fuera de alcance
  - Gestión completa de usuarios por parte de clientes.
  - Múltiples perfiles por usuario.
  - Integración con terceros para verificación de identidad.

---

### SPEC-04 - Gestión de mascotas

- Objetivo
  - Permitir que un cliente registre y consulte sus mascotas para asociarlas a reservas.

- Contexto
  - Cada reserva debe asociarse a una mascota específica, por lo que el sistema debe soportar el registro y la relación con el cliente.

- Entradas
  - Nombre de la mascota.
  - Tipo, tamaño y observaciones.
  - Identificador del cliente autenticado.

- Salidas
  - Creación de mascotas.
  - Consulta de mascotas del cliente autenticado.
  - Asociación de la mascota a una reserva futura.

- Reglas
  - La mascota debe estar asociada a un cliente válido.
  - Un cliente solo puede ver y gestionar sus propias mascotas.
  - Los datos mínimos obligatorios deben estar presentes.

- Criterios de aceptación
  - Un cliente autenticado puede registrar al menos una mascota.
  - La mascota queda asociada al usuario correcto.
  - El cliente no puede ver mascotas de otros usuarios.
  - La información de la mascota se puede recuperar al crear una reserva.

- Fuera de alcance
  - Historia clínica veterinaria completa.
  - Gestión de vacunas o tratamientos médicos.
  - Múltiples dueños por mascota.

---

### SPEC-05 - Gestión de servicios

- Objetivo
  - Administrar los servicios que ofrece el negocio y permitir que los clientes los consulten.

- Contexto
  - El negocio ofrece servicios de baño y cuidado básico de mascotas, con información como duración y precio de referencia.

- Entradas
  - Nombre del servicio.
  - Descripción.
  - Duración en minutos.
  - Precio de referencia.
  - Estado activo/inactivo.

- Salidas
  - Crear, activar o desactivar servicios.
  - Listar servicios activos para clientes.

- Reglas
  - Solo el administrador puede crear o modificar servicios.
  - Un servicio debe tener datos mínimos completos para ser válido.
  - Los servicios inactivos no deben mostrarse a los clientes.

- Criterios de aceptación
  - El administrador puede crear un servicio con datos válidos.
  - El cliente ve únicamente los servicios activos.
  - Se impide crear un servicio sin duración o precio válido.
  - Un servicio puede desactivarse sin eliminarse del sistema.

- Fuera de alcance
  - Precios dinámicos por campaña.
  - Inventario asociado al servicio.
  - Integración con pagos.

---

### SPEC-06 - Gestión de horarios

- Objetivo
  - Definir los horarios de atención del negocio y marcar los estados disponibles, ocupados o bloqueados.

- Contexto
  - La agenda del negocio depende de horarios concretos que deben organizarse para evitar conflictos y solapamientos.

- Entradas
  - Fecha y hora de inicio.
  - Duración del turno.
  - Estado del horario: disponible, ocupado o bloqueado.
  - Servicio asociado si aplica.

- Salidas
  - Creación de horarios.
  - Consulta del estado del horario.
  - Bloqueo o liberación de turnos.

- Reglas
  - Solo el administrador puede crear o bloquear horarios.
  - Un horario ocupado o bloqueado no puede usarse para una nueva reserva activa.
  - La lógica de disponibilidad debe basarse en el estado del horario.

- Criterios de aceptación
  - El administrador puede crear horarios válidos.
  - El sistema diferencia claramente entre horario disponible, ocupado y bloqueado.
  - Un horario bloqueado no es seleccionable para reserva.
  - Un horario ocupado no puede reutilizarse simultáneamente.

- Fuera de alcance
  - Recurrencia automática de horarios compleja.
  - Integración con calendarios externos.
  - Gestión de personal múltiple.

---

### SPEC-07 - Consulta de disponibilidad

- Objetivo
  - Mostrar al usuario los turnos disponibles para una fecha y un servicio específicos.

- Contexto
  - Los clientes necesitan conocer rápidamente si existen cupos para la fecha deseada antes de crear una reserva.

- Entradas
  - Fecha de consulta.
  - Servicio seleccionado.
  - Filtro opcional por horario o estado.

- Salidas
  - Lista de horarios disponibles.
  - Lista de horarios ocupados o bloqueados.
  - Mensaje claro si no hay cupos.

- Reglas
  - La consulta debe validar que se reciba una fecha.
  - Solo deben mostrarse horarios compatibles con el servicio.
  - Los horarios ocupados o bloqueados no deben considerarse disponibles.

- Criterios de aceptación
  - El sistema devuelve una lista de horarios según la fecha y el servicio.
  - Si no hay disponibilidad, se informa claramente.
  - El cliente no puede seleccionar un horario no disponible.

- Fuera de alcance
  - Sugerencias inteligentes de horarios alternativos.
  - Disponibilidad por varios servicios simultáneamente.
  - Cálculo predictivo de demanda.

---

### SPEC-08 - Gestión de reservas

- Objetivo
  - Permitir crear, consultar y cancelar reservas de forma segura y consistente.

- Contexto
  - La reserva es el centro del negocio: debe quedar asociada a cliente, mascota, servicio y horario, y debe respetar las reglas del negocio.

- Entradas
  - Cliente autenticado.
  - Mascota asociada.
  - Servicio activo.
  - Horario disponible.
  - Datos opcionales de observación.

- Salidas
  - Creación de reserva con estado pendiente.
  - Consulta de reservas propias y generales según rol.
  - Cancelación de reservas cuando aplique.

- Reglas
  - Toda reserva nueva inicia en estado pendiente.
  - Un horario no puede tener dos reservas activas simultáneamente.
  - El cliente solo puede gestionar sus propias reservas.
  - Una reserva debe asociarse a cliente, mascota, servicio y horario.
  - Al cancelar una reserva, el horario debe volver a quedar disponible.

- Criterios de aceptación
  - Un cliente puede crear una reserva válida.
  - La reserva queda registrada con estado pendiente.
  - Si el horario ya fue tomado, se rechaza la creación.
  - Un cliente no puede ver o modificar reservas de otros usuarios.
  - La cancelación libera el horario correspondiente.

- Fuera de alcance
  - Pagos electrónicos.
  - Recordatorios automáticos.
  - Domicilios o transporte.

---

### SPEC-09 - Administración de estados y agenda

- Objetivo
  - Permitir al administrador gestionar los estados de las reservas y revisar la agenda diaria del negocio.

- Contexto
  - El administrador debe poder organizar la operación diaria, confirmar reservas, cerrarlas como finalizadas y revisar la agenda clara y ordenadamente.

- Entradas
  - Reservas existentes.
  - Acción de cambio de estado: confirmar, cancelar o finalizar.
  - Filtros por fecha, estado o servicio.

- Salidas
  - Cambio de estado de reserva.
  - Dashboard o listado de agenda del día.
  - Historial de cambios por reserva.

- Reglas
  - Solo el administrador puede confirmar o finalizar reservas.
  - Una reserva finalizada no puede volver a estado pendiente.
  - Una reserva cancelada no puede reutilizar el horario activo.
  - Las reservas deben poder filtrarse por fecha, estado y servicio.

- Criterios de aceptación
  - El administrador puede confirmar una reserva pendiente.
  - El administrador puede finalizar una reserva confirmada.
  - El administrador puede cancelar reservas cuando la regla lo permita.
  - La agenda del día se muestra con información clara de cliente, mascota, servicio, horario y estado.

- Fuera de alcance
  - Notificaciones automáticas por WhatsApp o correo.
  - Reportes complejos o exportación de datos.
  - Integración con herramientas externas de calendario.
