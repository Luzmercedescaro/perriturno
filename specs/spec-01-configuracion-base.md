# SPEC-01: Configuración base del sistema

## Objetivo
Establecer la infraestructura inicial del backend y la base de datos para que el resto del sistema pueda desarrollarse sobre una estructura estable.

## Contexto
El proyecto debe desarrollarse con NestJS, TypeScript y PostgreSQL, siguiendo una arquitectura modular y permitiendo pruebas locales sin exponer información sensible.

## Entradas
- Requisitos del MVP de Perriturno.
- Variables de entorno para base de datos, JWT, puerto y entorno.
- Estructura general del proyecto propuesta en el documento técnico.

## Salidas
- Proyecto backend inicializado.
- Conexión configurada con PostgreSQL.
- Estructura base de módulos: auth, users, pets, services, schedules, reservations.
- Endpoint de verificación de salud del sistema.

## Reglas
- La configuración sensible debe manejarse con variables de entorno.
- El archivo .env no debe subirse al repositorio.
- El backend debe organizarse por módulos.
- La base de datos debe soportar el modelo inicial del MVP.

## Criterios de aceptación
- El proyecto se levanta correctamente en entorno local.
- La conexión con la base de datos funciona.
- Existe una estructura clara de carpetas y módulos.
- El sistema responde correctamente en una ruta de verificación.

## Fuera de alcance
- Lógica completa de reservas.
- Integraciones externas.
- Funcionalidades de frontend avanzadas.
