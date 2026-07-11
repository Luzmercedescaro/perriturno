PERRITURNO
Documento tecnico consolidado para desarrollo de software con IA
Sistema web para reserva de baños y cuidado basico de mascotas
Autora: Luz Mercedes Caro Wilches
Version: 2.0 - Documento ampliado y normalizado
Estado: En revision docente y listo para auditoria con IA
Fecha: julio de 2026

# Indice de contenido

- 1. Control de version y proposito del documento
- 2. Resumen ejecutivo
- 3. Descripcion del negocio
- 4. Problema
- 5. Solucion propuesta
- 6. Objetivos
- 7. Alcance del MVP
- 8. Supuestos, restricciones y fuera de alcance
- 9. Usuarios, roles y matriz de permisos
- 10. Requisitos funcionales
- 11. Requisitos no funcionales
- 12. Historias de usuario y criterios de aceptacion
- 13. Reglas de negocio y casos borde
- 14. Modelo de datos inicial
- 15. Estados y flujo de una reserva
- 16. Arquitectura del sistema
- 17. Tecnologias previstas y configuracion inicial
- 18. Specs del proyecto
- 19. Endpoints iniciales
- 20. Flujo de trabajo con IA, Git, GitHub y DBeaver
- 21. Prompts para trabajar con IA
- 22. Anexos tecnicos

# 1. Control de version y proposito del documento


| Version | Fecha | Responsable | Descripcion del cambio |
| --- | --- | --- | --- |
| 1.0 | Julio de 2026 | Luz Mercedes Caro Wilches | Documento inicial con idea, MVP, requisitos, historias, modelo de datos y endpoints basicos. |
| 2.0 | Julio de 2026 | Luz Mercedes Caro Wilches | Documento ampliado como insumo tecnico para auditoria con IA, generacion de specs, backend, pruebas y versionamiento. |

Este documento corresponde a la version ampliada del proyecto Perriturno. Su proposito es servir como base tecnica para que el docente revise el avance y para que una herramienta de inteligencia artificial pueda generar, por fases, la estructura del backend, los modulos, endpoints, validaciones y pruebas iniciales.
El documento no busca construir toda la aplicacion de una sola vez. Organiza el sistema en componentes pequenos y verificables, de acuerdo con el metodo trabajado en clase: documento tecnico, auditoria, specs, generacion de codigo, pruebas, correcciones, commit, Pull Request y cierre de cada funcionalidad.

# 2. Resumen ejecutivo

Perriturno es una aplicacion web orientada a pequenos negocios que prestan servicios de baño y cuidado basico de mascotas. El sistema permitira organizar las reservas de atencion, evitar duplicidades en horarios, registrar informacion basica del cliente y de la mascota, consultar disponibilidad y controlar el estado de cada reserva.
La primera version o MVP se enfocara en lo esencial: autenticacion basica, registro de clientes, registro de mascotas, gestion de servicios, horarios disponibles, creacion de reservas y administracion de estados. No se incluiran pagos electronicos, domicilios, notificaciones automaticas ni historia clinica veterinaria completa.

# 3. Descripcion del negocio

El negocio objetivo es un establecimiento de baño y cuidado basico de mascotas. En este tipo de negocio se suelen recibir solicitudes de atencion por llamadas, WhatsApp o de manera presencial. Cuando la agenda se maneja manualmente, aumenta el riesgo de perder datos, repetir horarios o no tener claridad sobre el estado de cada servicio.
Perriturno busca apoyar la organizacion diaria del negocio. El cliente podra solicitar una reserva y el administrador podra revisar la agenda, confirmar cupos, cancelar reservas y marcar servicios como finalizados.

# 4. Problema

- Las reservas se gestionan manualmente por llamadas, mensajes o apuntes en papel.
- Puede haber reservas duplicadas en el mismo horario.
- Se puede perder informacion del cliente o de la mascota.
- El administrador no siempre sabe con facilidad que cupos estan disponibles.
- No existe un seguimiento claro de reservas pendientes, confirmadas, canceladas o finalizadas.
- La agenda diaria puede volverse confusa cuando hay varios servicios o varias mascotas en un mismo dia.

# 5. Solucion propuesta

Crear una aplicacion web sencilla que permita centralizar la informacion del negocio. La solucion tendra un backend organizado por modulos y una base de datos donde se guarden clientes, mascotas, servicios, horarios y reservas.
La aplicacion permitira consultar disponibilidad, solicitar reservas y administrar estados. La logica del sistema evitara que un mismo horario sea usado por dos reservas activas al mismo tiempo.

# 6. Objetivos


## 6.1 Objetivo general

Desarrollar una aplicacion web para la gestion de reservas de baño y cuidado basico de mascotas, que permita a clientes solicitar cupos disponibles y al administrador organizar la agenda del negocio de manera clara y segura.

## 6.2 Objetivos especificos

- Definir el documento tecnico inicial del sistema Perriturno.
- Identificar los requisitos funcionales y no funcionales del MVP.
- Diseñar el modelo de datos inicial del sistema.
- Organizar el proyecto por specs para facilitar el trabajo con IA.
- Definir la arquitectura general con frontend, backend y base de datos.
- Preparar el backend con NestJS, TypeScript y PostgreSQL.
- Probar endpoints iniciales y verificar los datos en DBeaver.
- Versionar los avances mediante Git, GitHub y Pull Request.

# 7. Alcance del MVP


## 7.1 Incluye

- Registro e inicio de sesion de clientes.
- Inicio de sesion de administrador.
- Control basico de roles: cliente y administrador.
- Registro y consulta de mascotas.
- Consulta y administracion de servicios.
- Configuracion y consulta de horarios.
- Consulta de disponibilidad.
- Creacion de reservas.
- Cambio de estado de reservas: pendiente, confirmada, cancelada y finalizada.
- Consulta de reservas del cliente y reservas del dia para administracion.

## 7.2 No incluye en la primera version

- Pagos electronicos en linea.
- Domicilios o rutas de transporte.
- Recordatorios automaticos por WhatsApp o correo.
- Aplicacion movil nativa.
- Integracion con Google Calendar.
- Login con Google, Facebook u otras redes sociales.
- Facturacion electronica.
- Historia clinica veterinaria completa.
- Inventario de productos.

# 8. Supuestos, restricciones y fuera de alcance


| Tipo | Descripcion |
| --- | --- |
| Supuesto | El negocio cuenta con uno o varios horarios de atencion definidos por el administrador. |
| Supuesto | Los clientes pueden acceder a la aplicacion desde un navegador web. |
| Supuesto | El administrador revisa y confirma manualmente las reservas pendientes. |
| Restriccion | El MVP se desarrollara con tecnologias vistas en clase: Node.js, NestJS, TypeScript y PostgreSQL. |
| Restriccion | El sistema se ejecutara inicialmente en ambiente local de desarrollo. |
| Restriccion | La informacion sensible se manejara mediante variables de entorno y no debe subirse al repositorio. |
| Fuera de alcance | No se implementaran pagos electronicos ni pasarelas de pago. |
| Fuera de alcance | No se desarrollara app movil nativa en la primera version. |


# 9. Usuarios, roles y matriz de permisos


## 9.1 Roles


| Rol | Descripcion |
| --- | --- |
| Cliente | Persona que solicita una reserva para el baño o cuidado basico de su mascota. Puede registrar sus datos, sus mascotas, consultar disponibilidad y crear reservas. |
| Administrador | Persona encargada del negocio. Puede gestionar servicios, horarios, reservas, estados y consultar la agenda general. |


## 9.2 Matriz de permisos


| Funcionalidad | Cliente | Administrador | Observacion |
| --- | --- | --- | --- |
| Registrarse | Si | No | El administrador se crea previamente o por carga inicial. |
| Iniciar sesion | Si | Si | Cada usuario accede segun su rol. |
| Consultar su perfil | Si | Si | Ruta protegida por token. |
| Actualizar su perfil | Si | Si | No debe permitir cambiar rol sin autorizacion. |
| Registrar mascota | Si | Si | El cliente registra sus mascotas; el administrador puede apoyar el registro. |
| Consultar mascotas propias | Si | Si | El cliente solo ve sus mascotas. |
| Crear servicio | No | Si | Solo administrador. |
| Consultar servicios | Si | Si | Servicios activos visibles para clientes. |
| Configurar horarios | No | Si | Solo administrador. |
| Consultar disponibilidad | Si | Si | Segun fecha y servicio. |
| Crear reserva | Si | Si | Cliente puede crear reserva; administrador puede crear manualmente. |
| Cancelar reserva propia | Si | Si | Cliente solo si la reserva esta pendiente o confirmada segun regla definida. |
| Confirmar reserva | No | Si | Solo administrador. |
| Finalizar reserva | No | Si | Solo administrador. |
| Consultar todas las reservas | No | Si | El cliente solo consulta sus reservas. |


# 10. Requisitos funcionales


| Codigo | Modulo | Requisito funcional |
| --- | --- | --- |
| RF-01 | Autenticacion | El sistema debera permitir el registro de clientes con nombre, telefono, correo electronico y contraseña. |
| RF-02 | Autenticacion | El sistema debera impedir el registro de dos clientes con el mismo correo electronico. |
| RF-03 | Autenticacion | El sistema debera permitir el inicio de sesion de clientes registrados y activos. |
| RF-04 | Autenticacion | El sistema debera permitir el inicio de sesion del administrador. |
| RF-05 | Autenticacion | El sistema debera generar un token de acceso cuando las credenciales sean correctas. |
| RF-06 | Autenticacion | El sistema no debera devolver la contraseña en ninguna respuesta. |
| RF-07 | Clientes | El sistema debera permitir consultar los datos seguros del perfil del cliente autenticado. |
| RF-08 | Clientes | El sistema debera permitir actualizar nombre, telefono y datos basicos del perfil. |
| RF-09 | Mascotas | El sistema debera permitir registrar una mascota asociada a un cliente. |
| RF-10 | Mascotas | El sistema debera solicitar nombre, tipo, tamaño y observaciones de la mascota. |
| RF-11 | Mascotas | El cliente debera poder consultar solo sus mascotas registradas. |
| RF-12 | Servicios | El sistema debera permitir consultar los servicios activos disponibles. |
| RF-13 | Servicios | El administrador debera poder crear servicios con nombre, descripcion, duracion y precio de referencia. |
| RF-14 | Servicios | El administrador debera poder activar o desactivar servicios. |
| RF-15 | Horarios | El administrador debera poder crear horarios disponibles para atencion. |
| RF-16 | Horarios | El sistema debera mostrar horarios disponibles, ocupados o bloqueados. |
| RF-17 | Horarios | El sistema debera impedir reservar horarios ocupados o bloqueados. |
| RF-18 | Disponibilidad | El sistema debera permitir consultar disponibilidad por fecha y servicio. |
| RF-19 | Reservas | El cliente debera poder crear una reserva para una mascota, un servicio y un horario disponible. |
| RF-20 | Reservas | Toda reserva nueva debera crearse inicialmente en estado pendiente. |
| RF-21 | Reservas | El sistema debera asociar cada reserva con cliente, mascota, servicio y horario. |
| RF-22 | Reservas | El sistema debera impedir que un horario tenga mas de una reserva activa. |
| RF-23 | Reservas | El cliente debera poder consultar sus reservas. |
| RF-24 | Reservas | El administrador debera poder consultar todas las reservas. |
| RF-25 | Estados | El administrador debera poder cambiar una reserva a confirmada, cancelada o finalizada. |
| RF-26 | Estados | El cliente podra cancelar sus reservas pendientes o confirmadas mientras la regla del negocio lo permita. |
| RF-27 | Estados | Cuando una reserva sea cancelada, el horario debera volver a estar disponible. |
| RF-28 | Estados | Cuando una reserva sea finalizada, el horario no se libera para una nueva reserva en el mismo tramo. |
| RF-29 | Administracion | El administrador debera poder consultar las reservas del dia. |
| RF-30 | Administracion | El administrador debera poder filtrar reservas por fecha, estado o servicio. |


# 11. Requisitos no funcionales


| Codigo | Categoria | Requisito no funcional |
| --- | --- | --- |
| RNF-01 | Usabilidad | La aplicacion debera tener una interfaz sencilla, organizada y facil de usar. |
| RNF-02 | Usabilidad | Los mensajes del sistema deberan ser claros y comprensibles. |
| RNF-03 | Seguridad | Las contraseñas deberan almacenarse cifradas. |
| RNF-04 | Seguridad | Las rutas privadas deberan estar protegidas con autenticacion JWT. |
| RNF-05 | Seguridad | El sistema debera aplicar permisos segun rol de usuario. |
| RNF-06 | Seguridad | El archivo .env no debera subirse al repositorio. |
| RNF-07 | Datos | El sistema debera validar datos antes de guardarlos. |
| RNF-08 | Datos | La base de datos debera evitar duplicados inconsistentes. |
| RNF-09 | Arquitectura | El backend debera estar organizado por modulos. |
| RNF-10 | Arquitectura | Cada modulo debera separar controlador, servicio, entidad y DTOs cuando aplique. |
| RNF-11 | Mantenibilidad | El codigo debera estar organizado para facilitar futuras modificaciones. |
| RNF-12 | Compatibilidad | La aplicacion debera funcionar desde un navegador web. |
| RNF-13 | Disponibilidad | El backend debera poder ejecutarse localmente para pruebas de desarrollo. |
| RNF-14 | Rendimiento | Las consultas basicas deberan responder en tiempos razonables para un negocio pequeño. |
| RNF-15 | Trazabilidad | Los cambios del proyecto deberan versionarse con Git y GitHub. |
| RNF-16 | Calidad | Cada spec debera probarse antes de pasar al siguiente. |
| RNF-17 | Configuracion | La configuracion de base de datos y tokens debera manejarse por variables de entorno. |
| RNF-18 | Errores | El sistema debera responder errores con mensajes controlados y no con informacion sensible. |
| RNF-19 | Documentacion | El proyecto debera conservar documento tecnico, specs y README. |
| RNF-20 | Escalabilidad inicial | El diseño debera permitir agregar recordatorios o pagos en versiones futuras sin rehacer todo el sistema. |


# 12. Historias de usuario y criterios de aceptacion


## HU-01. Registrar cliente

Como cliente, quiero registrarme con mis datos basicos para poder solicitar reservas de baño para mi mascota.
Criterios de aceptacion:
- El sistema solicita nombre, telefono, correo y contraseña.
- El sistema valida que el correo no este repetido.
- El sistema muestra confirmacion de registro exitoso.
- La contraseña no se muestra ni se devuelve en la respuesta.

## HU-02. Iniciar sesion

Como cliente, quiero iniciar sesion para acceder a mis mascotas y reservas.
Criterios de aceptacion:
- El sistema solicita correo y contraseña.
- El sistema valida credenciales correctas.
- El sistema devuelve token de acceso.
- El sistema rechaza usuarios inactivos o credenciales incorrectas.

## HU-03. Registrar mascota

Como cliente, quiero registrar mi mascota para asociarla a una reserva.
Criterios de aceptacion:
- El sistema solicita nombre, tipo, tamaño y observaciones.
- La mascota queda asociada al cliente autenticado.
- El cliente puede consultar sus mascotas.

## HU-04. Consultar servicios

Como cliente, quiero ver los servicios disponibles para escoger el que necesita mi mascota.
Criterios de aceptacion:
- El sistema lista servicios activos.
- Cada servicio muestra nombre, descripcion, duracion y precio de referencia.
- No se muestran servicios inactivos al cliente.

## HU-05. Consultar disponibilidad

Como cliente, quiero consultar horarios disponibles para seleccionar un cupo.
Criterios de aceptacion:
- El sistema permite filtrar por fecha y servicio.
- El sistema diferencia horarios disponibles, ocupados y bloqueados.
- El sistema no permite seleccionar un horario ocupado o bloqueado.

## HU-06. Crear reserva

Como cliente, quiero crear una reserva para asegurar la atencion de mi mascota.
Criterios de aceptacion:
- La reserva requiere mascota, servicio y horario disponible.
- La reserva se crea en estado pendiente.
- El horario queda ocupado mientras la reserva este activa.
- El sistema muestra confirmacion de la reserva.

## HU-07. Cancelar reserva propia

Como cliente, quiero cancelar una reserva cuando ya no pueda asistir.
Criterios de aceptacion:
- El cliente solo puede cancelar sus propias reservas.
- La cancelacion cambia el estado a cancelada.
- El horario queda disponible despues de cancelar.

## HU-08. Confirmar reserva

Como administrador, quiero confirmar una reserva pendiente para asegurar la agenda del dia.
Criterios de aceptacion:
- Solo el administrador puede confirmar reservas.
- La reserva cambia de pendiente a confirmada.
- El sistema conserva el historial del cambio de estado.

## HU-09. Finalizar reserva

Como administrador, quiero marcar una reserva como finalizada cuando el servicio haya sido prestado.
Criterios de aceptacion:
- Solo el administrador puede finalizar reservas.
- La reserva cambia a finalizada.
- Una reserva finalizada no puede volver a pendiente.

## HU-10. Consultar agenda del dia

Como administrador, quiero consultar reservas por fecha para organizar el trabajo diario.
Criterios de aceptacion:
- El sistema permite filtrar reservas por fecha.
- El sistema muestra cliente, mascota, servicio, horario y estado.
- El sistema permite identificar reservas pendientes, confirmadas, canceladas y finalizadas.

# 13. Reglas de negocio y casos borde


## 13.1 Reglas de negocio


| Codigo | Regla |
| --- | --- |
| RN-01 | Un cliente solo puede consultar y modificar sus propias mascotas y reservas. |
| RN-02 | Solo el administrador puede crear o modificar servicios. |
| RN-03 | Solo el administrador puede crear o bloquear horarios. |
| RN-04 | Un horario no puede tener dos reservas activas al mismo tiempo. |
| RN-05 | Una reserva nueva siempre inicia en estado pendiente. |
| RN-06 | Una reserva pendiente puede pasar a confirmada o cancelada. |
| RN-07 | Una reserva confirmada puede pasar a finalizada o cancelada. |
| RN-08 | Una reserva finalizada no se puede cancelar ni modificar. |
| RN-09 | Cuando una reserva se cancela, el horario vuelve a disponible. |
| RN-10 | Las contraseñas deben guardarse cifradas. |


## 13.2 Casos borde por cubrir


| Codigo | Caso borde |
| --- | --- |
| CB-01 | Un cliente intenta reservar un horario que acaba de ser tomado por otro cliente. |
| CB-02 | Un cliente intenta cancelar una reserva que no le pertenece. |
| CB-03 | El administrador intenta finalizar una reserva que ya fue cancelada. |
| CB-04 | Se intenta crear una mascota sin cliente asociado. |
| CB-05 | Se intenta crear un servicio sin duracion o precio de referencia. |
| CB-06 | Se intenta iniciar sesion con correo inexistente. |
| CB-07 | Se intenta iniciar sesion con contraseña incorrecta. |
| CB-08 | Se intenta usar un token vencido o invalido. |
| CB-09 | Se intenta crear una reserva en una fecha pasada. |
| CB-10 | Se intenta consultar disponibilidad sin indicar fecha. |


# 14. Modelo de datos inicial

El modelo de datos inicial se propone con tablas principales que permiten cubrir el MVP. Para simplificar la autenticacion, se usa una tabla de usuarios con rol cliente o administrador. Las mascotas y reservas se relacionan con el usuario cliente.

## Tabla users


| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | uuid | Identificador unico |
| name | varchar(100) | Nombre del usuario |
| phone | varchar(30) | Telefono de contacto |
| email | varchar(150) | Correo unico |
| password | varchar | Contraseña cifrada |
| role | enum | CLIENT o ADMIN |
| active | boolean | Estado activo/inactivo |
| created_at | timestamp | Fecha de creacion |


## Tabla pets


| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | uuid | Identificador unico |
| user_id | uuid FK | Dueño de la mascota |
| name | varchar(100) | Nombre de la mascota |
| type | varchar(50) | Tipo: perro, gato u otro |
| size | varchar(30) | Pequeño, mediano, grande |
| observations | text | Observaciones relevantes |
| active | boolean | Estado activo/inactivo |


## Tabla services


| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | uuid | Identificador unico |
| name | varchar(120) | Nombre del servicio |
| description | text | Descripcion del servicio |
| duration_minutes | integer | Duracion aproximada |
| reference_price | numeric | Precio de referencia |
| active | boolean | Servicio activo/inactivo |


## Tabla schedules


| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | uuid | Identificador unico |
| date | date | Fecha del horario |
| start_time | time | Hora de inicio |
| end_time | time | Hora de fin |
| status | enum | available, occupied, blocked |
| service_id | uuid FK | Servicio asociado opcional |


## Tabla reservations


| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | uuid | Identificador unico |
| user_id | uuid FK | Cliente que reserva |
| pet_id | uuid FK | Mascota atendida |
| service_id | uuid FK | Servicio reservado |
| schedule_id | uuid FK | Horario seleccionado |
| status | enum | pending, confirmed, cancelled, completed |
| created_at | timestamp | Fecha de creacion |
| cancelled_at | timestamp nullable | Fecha de cancelacion |
| observation | text | Observacion de la reserva |


## 14.6 Relaciones entre entidades

- Un usuario con rol cliente puede tener muchas mascotas.
- Una mascota pertenece a un usuario cliente.
- Un servicio puede estar asociado a muchas reservas.
- Un horario puede tener una sola reserva activa.
- Una reserva pertenece a un cliente, una mascota, un servicio y un horario.
- El administrador no es dueño de mascotas, pero puede consultar y gestionar reservas.

# 15. Estados y flujo de una reserva


| Estado | Descripcion | Quien puede cambiarlo |
| --- | --- | --- |
| Pendiente | La reserva fue creada, pero aun no ha sido confirmada. | Sistema al crear; administrador puede confirmar o cancelar; cliente puede cancelar. |
| Confirmada | El administrador reviso y aprobo la reserva. | Administrador. |
| Cancelada | La reserva fue anulada. | Cliente si es propia y cumple regla; administrador. |
| Finalizada | El servicio fue realizado. | Administrador. |

Flujo principal: Pendiente -> Confirmada -> Finalizada.
Flujos alternos: Pendiente -> Cancelada; Confirmada -> Cancelada.
Una reserva finalizada no debe regresar a pendiente. Una reserva cancelada libera el horario para que pueda volver a aparecer como disponible.

# 16. Arquitectura del sistema

La arquitectura general sera de tres capas, como se explico en clase con la metafora del restaurante: frontend como el comedor, backend como la cocina y base de datos como el almacen.

| Capa | Responsabilidad | Tecnologia prevista |
| --- | --- | --- |
| Frontend | Pantallas, formularios, botones y experiencia visual del usuario. | Aplicacion web, tecnologia a definir en fase posterior. |
| Backend | Recibe peticiones, valida datos, aplica reglas de negocio, maneja autenticacion y comunica con la base de datos. | NestJS con TypeScript. |
| Base de datos | Guarda usuarios, mascotas, servicios, horarios y reservas. | PostgreSQL revisado con DBeaver. |


## 16.1 Organizacion del backend en NestJS


| src/<br>  main.ts<br>  app.module.ts<br>  auth/<br>    auth.module.ts<br>    auth.controller.ts<br>    auth.service.ts<br>    jwt.strategy.ts<br>    dto/login.dto.ts<br>  users/<br>    user.entity.ts<br>    users.module.ts<br>    users.controller.ts<br>    users.service.ts<br>    dto/create-user.dto.ts<br>  pets/<br>  services/<br>  schedules/<br>  reservations/ |
| --- |


## 16.2 Conceptos tecnicos clave


| Concepto | Explicacion sencilla |
| --- | --- |
| Modulo | Carpeta que agrupa una parte del sistema, por ejemplo mascotas o reservas. |
| Controlador | Recibe las peticiones HTTP, por ejemplo POST /reservations. |
| Servicio | Contiene la logica del negocio, por ejemplo validar disponibilidad. |
| Entidad | Representa una tabla de la base de datos. |
| DTO | Define que datos entran o salen en una peticion. |
| JWT | Token de acceso que demuestra que el usuario inicio sesion. |
| Endpoint | Ruta de la API formada por un verbo y una direccion, por ejemplo GET /services. |


# 17. Tecnologias previstas y configuracion inicial


| Tecnologia | Uso en el proyecto |
| --- | --- |
| Visual Studio Code | Editor de codigo y lugar donde se trabaja con la IA. |
| Node.js | Entorno que permite ejecutar JavaScript/TypeScript en el servidor. |
| npm | Instalacion de dependencias y ejecucion de comandos. |
| NestJS | Framework para construir backend organizado por modulos. |
| TypeScript | Lenguaje usado para escribir el backend con tipado. |
| PostgreSQL | Base de datos relacional. |
| DBeaver | Herramienta para crear y revisar bases de datos y tablas. |
| Git | Control de versiones local. |
| GitHub | Repositorio remoto, ramas, Pull Requests y fusion de cambios. |
| Postman o solicitudes HTTP | Prueba de endpoints. |


## 17.1 Variables de entorno


| PORT=3000<br>DB_HOST=localhost<br>DB_PORT=5432<br>DB_USER=postgres<br>DB_PASSWORD=postgres<br>DB_NAME=perriturno<br>JWT_SECRET=perriturnoSecretKey<br>JWT_EXPIRES_IN=3600s |
| --- |

El archivo .env real no debe subirse a GitHub. El archivo .env.example si puede subirse porque sirve como plantilla y no debe contener datos sensibles reales.

## 17.2 .gitignore recomendado


| node_modules/<br>.env<br>dist/<br>npm-debug.log*<br>yarn-debug.log*<br>.npm<br>*.tsbuildinfo<br>.vscode/<br>.idea/<br>.DS_Store |
| --- |


## 17.3 Especificacion del Frontend con Next.js


### 17.3.1 Descripcion general de Next.js

Next.js es un framework moderno de React que proporciona:
- Renderizado del lado del servidor (SSR) y generacion estatica (SSG)
- Routing basado en archivos (App Router)
- Optimizacion automatica de imagenes y codigo
- API routes para pequenos servicios de backend si es necesario
- Soporte nativo para TypeScript
- Mejora de rendimiento y SEO

Para Perriturno, Next.js permite construir una interfaz responsiva y rapida que funcione en navegadores de escritorio y moviles, con facilidad para conectarse al backend en NestJS.

### 17.3.2 Estructura de carpetas propuesta del frontend


| frontend/<br>  src/<br>    app/<br>      layout.tsx<br>      page.tsx<br>      (auth)/<br>        register/<br>          page.tsx<br>        login/<br>          page.tsx<br>      (dashboard)/<br>        dashboard/<br>          page.tsx<br>        reservations/<br>          page.tsx<br>        my-pets/<br>          page.tsx<br>    components/<br>      auth/<br>        RegisterForm.tsx<br>        LoginForm.tsx<br>      shared/<br>        Header.tsx<br>        Footer.tsx<br>        Navigation.tsx<br>      dashboard/<br>        ReservationCard.tsx<br>        PetList.tsx<br>        ServiceSelector.tsx<br>        AvailabilityCalendar.tsx<br>    lib/<br>      api.ts<br>      auth.ts<br>      constants.ts<br>      hooks/ (custom hooks)<br>    styles/<br>      globals.css<br>      layout.module.css<br>  public/<br>    images/<br>    icons/<br>  .env.local<br>  .env.example<br>  next.config.js<br>  tsconfig.json<br>  package.json<br>  README.md |
| --- |

### 17.3.3 Dependencias principales de Next.js


| Dependencia | Proposito |
| --- | --- |
| next | Framework principal |
| react | Libreria de interfaz |
| typescript | Lenguaje tipado |
| axios | Cliente HTTP para conectarse al backend |
| js-cookie o next-auth | Manejo de cookies y sesiones |
| react-hook-form | Gestion de formularios |
| clsx o classnames | Gestion dinamica de clases CSS |
| tailwindcss | Framework de estilos CSS (recomendado) |
| date-fns | Manejo de fechas |


### 17.3.4 Configuracion de Next.js


Archivo next.config.js basico:

```
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
};

module.exports = nextConfig;
```

### 17.3.5 Variables de entorno del frontend


| Variable | Valor ejemplo | Proposito |
| --- | --- | --- |
| NEXT_PUBLIC_API_URL | http://localhost:3000/api | URL base del backend |
| NEXT_PUBLIC_APP_NAME | Perriturno | Nombre visible de la aplicacion |
| NEXT_PUBLIC_APP_VERSION | 1.0.0 | Version del frontend |


Nota: Las variables con prefijo NEXT_PUBLIC_ son accesibles en el navegador. Las variables sin prefijo solo estan disponibles en el servidor.

### 17.3.6 Flujo de autenticacion en el frontend


1. El usuario ingresa credenciales en la pagina de login.
2. El frontend envia POST a http://localhost:3000/api/auth/login (backend).
3. El backend devuelve access_token y datos del usuario.
4. El frontend almacena el token en un cookie seguro o localStorage.
5. El token se envia en el header Authorization de peticiones futuras.
6. Las rutas privadas validan que existe token valido.
7. Si el token expira, el usuario es redirigido a login.

### 17.3.7 Componentes principales del frontend


| Componente | Ubicacion | Descripcion |
| --- | --- | --- |
| Layout | app/layout.tsx | Estructura base de todas las paginas, header, navegacion y footer |
| LoginForm | components/auth/LoginForm.tsx | Formulario de inicio de sesion |
| RegisterForm | components/auth/RegisterForm.tsx | Formulario de registro de cliente |
| Dashboard | app/(dashboard)/dashboard/page.tsx | Pagina principal del cliente con resumen de reservas |
| ReservationCard | components/dashboard/ReservationCard.tsx | Tarjeta mostrando una reserva |
| ServiceSelector | components/dashboard/ServiceSelector.tsx | Selector de servicios disponibles |
| AvailabilityCalendar | components/dashboard/AvailabilityCalendar.tsx | Calendario para seleccionar fecha y horario |
| PetList | components/dashboard/PetList.tsx | Lista de mascotas del cliente |
| Navigation | components/shared/Navigation.tsx | Barra de navegacion con menu |
| Header | components/shared/Header.tsx | Encabezado con logo y nombre del usuario |

### 17.3.8 Patrones y convenciones recomendadas


| Patron | Descripcion |
| --- | --- |
| Custom Hooks | Crear hooks reutilizables como useAuth, useFetch, usePets para centralizar logica |
| API Client | Crear archivo lib/api.ts con funciones para cada endpoint del backend |
| Context API | Usar React Context para estados globales como usuario autenticado |
| Componentes presentacionales | Componentes sin logica que solo reciben props y renderizan |
| Componentes contenedores | Componentes que manejan logica y pasan datos a presentacionales |
| Error Handling | Mostrar mensajes de error amigables al usuario, nunca errores tecnicos |
| Validacion de formularios | Validar datos en cliente antes de enviar al servidor |
| Rutas protegidas | Crear middleware que redirige a login si no hay token valido |

### 17.3.9 Estructura de ejemplo de un Custom Hook


```
// lib/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si existe token y obtener datos del usuario
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error verificando autenticacion:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { user, loading };
}
```

### 17.3.10 Estructura de ejemplo de un Cliente HTTP


```
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function apiCall(endpoint: string, method: string = 'GET', body?: any) {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('access_token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
}

// Funciones por modulo
export const authAPI = {
  register: (data: any) => apiCall('/users/register', 'POST', data),
  login: (data: any) => apiCall('/auth/login', 'POST', data),
};

export const petsAPI = {
  getMyPets: () => apiCall('/pets/my', 'GET'),
  createPet: (data: any) => apiCall('/pets', 'POST', data),
};

export const reservationsAPI = {
  getMyReservations: () => apiCall('/reservations/my', 'GET'),
  createReservation: (data: any) => apiCall('/reservations', 'POST', data),
};
```

### 17.3.11 Instalacion inicial del frontend


```
npx create-next-app@latest frontend --typescript --tailwind
cd frontend
npm install axios js-cookie react-hook-form date-fns
```

Luego editar .env.local con:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 17.3.12 Comandos comunes del frontend


| Comando | Proposito |
| --- | --- |
| npm run dev | Inicia el servidor de desarrollo en http://localhost:3001 |
| npm run build | Compila la aplicacion para produccion |
| npm run start | Ejecuta la version compilada |
| npm run lint | Verifica codigo para errores |
| npm run type-check | Valida tipos de TypeScript |


### 17.3.13 Seguridad en el frontend


| Practica | Descripcion |
| --- | --- |
| Nunca guardar contraseñas | Guardar solo tokens, nunca contraseñas en el navegador |
| HTTPS en produccion | Usar HTTPS para proteger tokens en transito |
| Cookies seguras | Si se usan cookies, marcar con httpOnly y Secure |
| CORS | Configurar CORS en backend para permitir solicitudes desde frontend |
| Validacion en cliente | Validar datos pero siempre validar nuevamente en servidor |
| Sanitizacion de entrada | Limpiar entrada de usuario antes de mostrar |
| Content Security Policy | Configurar headers de seguridad en next.config.js |


### 17.3.14 Integracion entre Frontend y Backend


El flujo de comunicacion sera:

1. Usuario ingresa datos en componente React del frontend.
2. Frontend valida datos localmente.
3. Frontend envia peticion HTTP a backend usando axios o fetch.
4. Backend recibe, valida nuevamente y procesa logica.
5. Backend responde con datos o error.
6. Frontend maneja respuesta y actualiza estado.
7. Usuario ve cambios reflejados en la interfaz.

Ejemplo de flujo para crear reserva:

```
Usuario selecciona mascota, servicio, fecha -> 
ComponenteReserva renderiza AvailabilityCalendar -> 
Usuario selecciona horario -> 
onClick envia POST /reservations con datos -> 
Backend valida y crea reserva -> 
Backend responde con ID de reserva -> 
Frontend muestra confirmacion -> 
Dashboard se actualiza con nueva reserva
```


# 18. Specs del proyecto

Los specs son documentos pequeños que describen una funcionalidad especifica. La IA debe trabajar un spec a la vez para evitar ambiguedades y errores.

| Archivo sugerido | Proposito |
| --- | --- |
| 00-00-fundaciones.md | Crear estructura inicial del backend, configuracion de NestJS, conexion a PostgreSQL, variables de entorno, .gitignore y prueba de servidor. |
| 01-01-autenticacion-de-clientes.md | Registro, login, perfil del cliente y rutas protegidas con JWT. |
| 02-02-autenticacion-de-administradores.md | Inicio de sesion de administrador y proteccion de rutas administrativas. |
| 03-03-control-de-permisos-y-roles.md | Reglas de acceso segun rol cliente o administrador. |
| 04-04-gestion-de-mascotas.md | Crear y consultar mascotas asociadas a clientes. |
| 05-05-gestion-de-servicios.md | Crear, consultar, actualizar y desactivar servicios. |
| 06-06-gestion-de-horarios.md | Crear horarios, bloquear horarios y consultar estados. |
| 07-07-consulta-de-disponibilidad.md | Consultar horarios disponibles por fecha y servicio. |
| 08-08-creacion-de-reservas.md | Crear reserva validando mascota, servicio, horario y disponibilidad. |
| 09-09-gestion-de-estados-e-historial.md | Confirmar, cancelar, finalizar y consultar reservas por estado o fecha. |


## 18.1. Spec 00 - Fundaciones


### Objetivo

Preparar el proyecto backend para que pueda ejecutarse localmente y conectarse a PostgreSQL.

### Contexto

Esta fase crea la base tecnica del proyecto antes de implementar reglas de negocio.

### Entradas

- Repositorio inicial
- Node.js y npm
- PostgreSQL disponible
- Nombre de base de datos perriturno

### Salidas

- Servidor NestJS iniciado
- Variables de entorno configuradas
- Conexion a base de datos preparada
- Estructura src creada

### Reglas

- No crear funcionalidades de negocio antes de tener el servidor funcionando.
- No subir .env a GitHub.
- Crear .env.example como plantilla.

### Criterios de aceptacion

- npm install termina correctamente.
- npm run start:dev levanta el servidor.
- El servidor responde en http://localhost:3000.
- La base de datos perriturno existe en PostgreSQL.

### Fuera de alcance

- Frontend
- Reservas
- Pagos
- Notificaciones

### Endpoints sugeridos

- GET /health o endpoint equivalente de prueba

## 18.2. Spec 01 - Autenticacion de clientes


### Objetivo

Permitir que un cliente se registre, inicie sesion y consulte o actualice su perfil.

### Contexto

El cliente necesita una cuenta para crear reservas y consultar su historial.

### Entradas

- Nombre
- Telefono
- Correo electronico
- Contraseña
- Datos opcionales de perfil

### Salidas

- Confirmacion de registro
- Token de acceso
- Datos seguros del usuario

### Reglas

- El correo debe ser unico.
- La contraseña debe cifrarse.
- No devolver password en respuestas.
- Solo usuarios activos pueden iniciar sesion.

### Criterios de aceptacion

- POST /users/register crea un cliente.
- POST /auth/login devuelve access_token.
- GET /users/me devuelve perfil seguro.
- PATCH /users/me permite actualizar datos basicos.

### Fuera de alcance

- Recuperacion de contraseña
- Login con redes sociales
- Verificacion por correo

### Endpoints sugeridos

- POST /users/register
- POST /auth/login
- GET /users/me
- PATCH /users/me

## 18.3. Spec 02 - Autenticacion de administradores


### Objetivo

Permitir acceso seguro al administrador del negocio.

### Contexto

El administrador necesita ingresar para gestionar servicios, horarios y reservas.

### Entradas

- Correo
- Contraseña
- Rol administrador

### Salidas

- Token de acceso
- Datos seguros del administrador

### Reglas

- Solo usuarios con rol ADMIN acceden a rutas administrativas.
- El administrador no se registra publicamente desde el formulario de clientes.

### Criterios de aceptacion

- Un administrador activo puede iniciar sesion.
- Un cliente no puede entrar a rutas de administrador.
- Credenciales invalidas devuelven error controlado.

### Fuera de alcance

- Panel visual completo
- Recuperacion de contraseña

### Endpoints sugeridos

- POST /auth/login
- GET /admin/me

## 18.4. Spec 03 - Control de permisos y roles


### Objetivo

Garantizar que cada accion del sistema sea ejecutada solo por el rol autorizado.

### Contexto

El sistema tendra clientes y administradores con permisos diferentes.

### Entradas

- Token JWT
- Rol del usuario
- Accion solicitada

### Salidas

- Permiso concedido o denegado
- Codigo 403 si no tiene autorizacion

### Reglas

- Cliente solo gestiona sus propios datos.
- Administrador gestiona servicios, horarios y reservas.
- Las rutas privadas requieren token valido.

### Criterios de aceptacion

- Cliente no puede crear servicios.
- Cliente no puede confirmar reservas.
- Administrador puede consultar todas las reservas.

### Fuera de alcance

- Roles avanzados
- Permisos configurables desde interfaz

### Endpoints sugeridos

- GET /users/me
- GET /admin/reservations
- PATCH /reservations/:id/status

## 18.5. Spec 04 - Gestion de mascotas


### Objetivo

Permitir registrar y consultar mascotas asociadas a un cliente.

### Contexto

Cada reserva debe estar asociada a una mascota.

### Entradas

- Nombre de mascota
- Tipo
- Tamaño
- Observaciones
- Usuario dueño

### Salidas

- Mascota creada
- Lista de mascotas del cliente

### Reglas

- Una mascota debe tener dueño.
- El cliente solo ve sus mascotas.
- El administrador puede consultar mascotas si es necesario para gestionar reservas.

### Criterios de aceptacion

- POST /pets crea mascota.
- GET /pets/my lista mascotas del cliente.
- No se crea mascota sin nombre.

### Fuera de alcance

- Historia clinica veterinaria
- Vacunas
- Fotos de mascota

### Endpoints sugeridos

- POST /pets
- GET /pets/my
- PATCH /pets/:id

## 18.6. Spec 05 - Gestion de servicios


### Objetivo

Permitir administrar servicios ofrecidos por el negocio.

### Contexto

El cliente selecciona un servicio antes de crear una reserva.

### Entradas

- Nombre
- Descripcion
- Duracion
- Precio de referencia
- Estado activo

### Salidas

- Servicio creado
- Lista de servicios activos

### Reglas

- Solo administrador crea o edita servicios.
- El cliente solo ve servicios activos.

### Criterios de aceptacion

- POST /services crea servicio.
- GET /services lista servicios activos.
- PATCH /services/:id actualiza datos.

### Fuera de alcance

- Paquetes complejos
- Promociones
- Facturacion

### Endpoints sugeridos

- GET /services
- POST /services
- PATCH /services/:id

## 18.7. Spec 06 - Gestion de horarios


### Objetivo

Permitir crear, consultar y bloquear horarios de atencion.

### Contexto

Los horarios son la base para calcular disponibilidad.

### Entradas

- Fecha
- Hora inicio
- Hora fin
- Estado
- Servicio opcional

### Salidas

- Horario creado
- Lista de horarios
- Estado actualizado

### Reglas

- Solo administrador crea horarios.
- Un horario puede estar disponible, ocupado o bloqueado.
- No se debe reservar un horario bloqueado.

### Criterios de aceptacion

- POST /schedules crea horario.
- GET /schedules lista horarios.
- PATCH /schedules/:id cambia estado.

### Fuera de alcance

- Calendario externo
- Google Calendar

### Endpoints sugeridos

- POST /schedules
- GET /schedules
- PATCH /schedules/:id

## 18.8. Spec 07 - Consulta de disponibilidad


### Objetivo

Permitir consultar horarios disponibles por fecha y servicio.

### Contexto

Antes de reservar, el cliente debe saber que cupos existen.

### Entradas

- Fecha
- Servicio
- Opcional: tamaño de mascota

### Salidas

- Lista de horarios disponibles
- Lista de horarios ocupados o bloqueados si aplica

### Reglas

- No mostrar como disponible un horario ocupado.
- No permitir fechas pasadas.
- La consulta no crea reserva.

### Criterios de aceptacion

- GET /availability devuelve horarios por fecha.
- Los horarios ocupados no se pueden seleccionar.

### Fuera de alcance

- Sugerencias automaticas
- Recordatorios

### Endpoints sugeridos

- GET /availability?date=YYYY-MM-DD&serviceId=...

## 18.9. Spec 08 - Creacion de reservas


### Objetivo

Permitir crear una reserva validando disponibilidad y relaciones.

### Contexto

La reserva une cliente, mascota, servicio y horario.

### Entradas

- Usuario autenticado
- Mascota
- Servicio
- Horario
- Observacion opcional

### Salidas

- Reserva creada
- Horario marcado como ocupado
- Mensaje de confirmacion

### Reglas

- La reserva inicia en pendiente.
- No se puede reservar horario ocupado.
- La mascota debe pertenecer al cliente.

### Criterios de aceptacion

- POST /reservations crea reserva valida.
- Si el horario esta ocupado, devuelve error controlado.
- La reserva aparece en las reservas del cliente.

### Fuera de alcance

- Pago electronico
- Confirmacion automatica sin administrador

### Endpoints sugeridos

- POST /reservations
- GET /reservations/my

## 18.10. Spec 09 - Gestion de estados e historial


### Objetivo

Permitir administrar el ciclo de vida de las reservas.

### Contexto

El administrador necesita confirmar, cancelar y finalizar servicios.

### Entradas

- Reserva
- Nuevo estado
- Usuario que realiza cambio
- Observacion opcional

### Salidas

- Estado actualizado
- Historial basico visible
- Disponibilidad actualizada

### Reglas

- Solo administrador confirma o finaliza.
- Cliente puede cancelar solo sus reservas permitidas.
- Cancelar libera horario.
- Finalizar no libera horario.

### Criterios de aceptacion

- PATCH /reservations/:id/status cambia estado segun permisos.
- GET /reservations permite consultar por fecha o estado.
- Estados invalidos son rechazados.

### Fuera de alcance

- Penalizaciones
- Notificaciones automaticas

### Endpoints sugeridos

- GET /reservations
- GET /reservations/my
- PATCH /reservations/:id/status
- PATCH /reservations/:id/cancel

# 19. Endpoints iniciales


| Verbo | Ruta | Funcion | Permiso |
| --- | --- | --- | --- |
| POST | /users/register | Registrar cliente | Publico |
| POST | /auth/login | Iniciar sesion | Publico |
| GET | /users/me | Consultar perfil propio | Cliente/Admin |
| PATCH | /users/me | Actualizar perfil propio | Cliente/Admin |
| POST | /pets | Crear mascota | Cliente/Admin |
| GET | /pets/my | Consultar mis mascotas | Cliente |
| GET | /services | Listar servicios activos | Publico o autenticado |
| POST | /services | Crear servicio | Admin |
| PATCH | /services/:id | Actualizar servicio | Admin |
| POST | /schedules | Crear horario | Admin |
| GET | /schedules | Listar horarios | Admin |
| GET | /availability | Consultar disponibilidad | Cliente/Admin |
| POST | /reservations | Crear reserva | Cliente/Admin |
| GET | /reservations/my | Mis reservas | Cliente |
| GET | /reservations | Todas las reservas | Admin |
| PATCH | /reservations/:id/status | Cambiar estado | Admin |
| PATCH | /reservations/:id/cancel | Cancelar reserva | Cliente/Admin |


# 20. Flujo de trabajo con IA, Git, GitHub y DBeaver

1. Crear o revisar el documento tecnico completo.
1. Ejecutar el prompt de auditoria para detectar ambiguedades, faltantes, contradicciones y casos borde.
1. Responder las preguntas de la IA y ajustar el documento.
1. Crear una carpeta specs y separar un archivo por funcionalidad.
1. Escoger el primer spec y pedir a la IA que lo desarrolle con detalle.
1. Crear una rama nueva en Git para trabajar de forma segura.
1. Pedir a la IA que genere la estructura del backend segun el spec.
1. Revisar cambios antes de aceptarlos.
1. Ejecutar npm install para instalar dependencias.
1. Crear la base de datos en DBeaver si no existe.
1. Ejecutar npm run start:dev para levantar el servidor.
1. Probar endpoints y revisar resultados.
1. Revisar en DBeaver si se crearon tablas y registros.
1. Corregir errores paso a paso.
1. Revisar git status y .gitignore.
1. Hacer commit del feature.
1. Subir la rama a GitHub.
1. Crear Pull Request, revisar archivos y fusionar.
1. Volver a main y comenzar una nueva rama para el siguiente spec.

## 20.1 Comandos de referencia


| npm install<br>npm run start:dev<br>CREATE DATABASE perriturno;<br>git status<br>git checkout -b feature/backend-auth-structure<br>git push -u origin feature/backend-auth-structure<br>git checkout main |
| --- |


## 20.2 Errores frecuentes y respuesta


| Situacion | Significado | Accion sugerida |
| --- | --- | --- |
| npm warn deprecated | Advertencia de librerias antiguas. No siempre detiene el proceso. | Esperar si la instalacion termina correctamente. |
| Base de datos no existe | PostgreSQL no tiene creada la BD indicada en .env. | Crear la base en DBeaver: CREATE DATABASE perriturno; |
| EADDRINUSE :::3000 | El puerto 3000 ya esta ocupado por otro servidor. | Detener el servidor anterior con Ctrl + C o cambiar el puerto. |
| Error en login | Puede fallar consulta de usuario, password o bcrypt. | Copiar error completo y pedir a la IA explicacion y correccion puntual. |
| Archivo .env aparece en Git | Riesgo de subir datos sensibles. | Agregar .env al .gitignore y revisar git status. |


# 21. Prompts para trabajar con IA


## 21.1 Prompt maestro del proyecto


| Actua como arquitecto de software, docente y experto en desarrollo con NestJS, TypeScript y PostgreSQL.<br>Estoy desarrollando una aplicacion web llamada Perriturno, orientada a la reserva de cupos para baño de mascotas.<br>La aplicacion permitira registrar clientes, mascotas, servicios, horarios y reservas. El cliente podra consultar disponibilidad y solicitar una reserva. El administrador podra confirmar, cancelar o finalizar reservas.<br>Ayudame a mejorar el documento tecnico, crear requisitos funcionales y no funcionales, historias de usuario, criterios de aceptacion, modelo de datos, specs y codigo paso a paso.<br>No avances a otra funcionalidad sin cerrar la actual y sin explicar los cambios. |
| --- |


## 21.2 Prompt de auditoria indicado por el profesor


| Actua como analista de sistemas experto.<br>Revisa este documento de requisitos y devuelveme, en listas separadas:<br>1. Requisitos ambiguos o interpretables de varias formas<br>2. Informacion faltante (reglas, limites, permisos)<br>3. Contradicciones entre requisitos<br>4. Casos borde no cubiertos<br>No inventes reglas: cuando falte informacion, hazme preguntas. |
| --- |


## 21.3 Prompt para iniciar desarrollo del primer spec


| Ya tienes un documento tecnico detallado y una carpeta de specs.<br>Quiero que, basado en el primer spec, desarrolles de forma mas detallada la estructura inicial del backend.<br>Crea una nueva rama para trabajar en ella.<br>Genera la configuracion base con NestJS, TypeScript y PostgreSQL.<br>No avances a reservas ni a otros modulos antes de cerrar el spec actual.<br>Antes de modificar archivos, explicame que vas a crear y por que. |
| --- |


## 21.4 Prompt para probar endpoints


| El servidor ya esta arriba en http://localhost:3000.<br>Prueba los endpoints que creaste, especialmente registro e inicio de sesion.<br>Muestrame el resultado de cada prueba y dime si funcionaron correctamente o si aparece algun error. |
| --- |


## 21.5 Prompt para corregir errores


| Explícame este error en lenguaje sencillo.<br>Dime que archivo debo revisar, cual es la causa probable y que cambio exacto debo hacer.<br>No modifiques funcionalidades que no esten relacionadas con este error. |
| --- |


# 22. Anexos tecnicos


## 22.1 Lista de archivos esperados en el repositorio


| README.md<br>Perriturno_Documento_Tecnico_Completo_v2.docx o .md<br>specs/<br>  00-fundaciones.md<br>  01-autenticacion-clientes.md<br>  02-autenticacion-administradores.md<br>  03-control-permisos-roles.md<br>  04-gestion-mascotas.md<br>  05-gestion-servicios.md<br>  06-gestion-horarios.md<br>  07-consulta-disponibilidad.md<br>  08-creacion-reservas.md<br>  09-gestion-estados-reservas.md<br>src/<br>package.json<br>package-lock.json<br>nest-cli.json<br>tsconfig.json<br>tsconfig.build.json<br>.env.example<br>.gitignore |
| --- |


## 22.2 Checklist antes de mostrar al docente

- El documento tiene problema, solucion, MVP, requisitos, historias, modelo de datos y arquitectura.
- El documento tiene matriz de roles y permisos.
- Los specs estan separados y tienen objetivo, contexto, entradas, salidas, reglas, criterios y fuera de alcance.
- El prompt de auditoria esta guardado.
- El proyecto indica tecnologias: NestJS, TypeScript, PostgreSQL, DBeaver, Git y GitHub.
- El documento explica el flujo de trabajo con IA.
- El alcance evita funcionalidades demasiado grandes para el MVP.
- El documento sirve como insumo para subir a la IA y empezar el paso a paso.

# 23. Conclusion

Perriturno se plantea como un proyecto viable para el seminario porque tiene un problema real, un alcance manejable y una estructura tecnica que permite trabajar por fases. El documento organiza la informacion necesaria para que el proyecto pueda pasar de una idea inicial a specs y luego a construccion asistida por IA.
La estrategia recomendada es avanzar una funcionalidad a la vez. Primero fundaciones y autenticacion, luego mascotas, servicios, horarios, disponibilidad y reservas. Cada avance debe probarse, corregirse, versionarse y fusionarse mediante Pull Request antes de continuar.