# SPEC-02: Autenticación y autorización

## Objetivo
Permitir que clientes y administradores accedan al sistema de forma segura y con permisos diferenciados.

## Contexto
El sistema necesita controlar el acceso a rutas privadas y evitar que usuarios no autorizados manipulen información sensible.

## Entradas
- Datos de registro: nombre, teléfono, correo y contraseña.
- Credenciales de inicio de sesión.
- Roles: cliente y administrador.

## Salidas
- Registro de usuarios.
- Inicio de sesión con token JWT.
- Respuesta segura sin devolver la contraseña.
- Protección de rutas privadas según rol.

## Reglas
- No puede existir más de un usuario con el mismo correo.
- Las contraseñas deben almacenarse cifradas.
- Solo usuarios activos pueden iniciar sesión.
- Las rutas privadas deben validar un token JWT válido.
- El administrador debe tener permisos superiores a los del cliente.

## Criterios de aceptación
- Un cliente puede registrarse correctamente.
- Un correo duplicado genera un error controlado.
- Un usuario activo puede iniciar sesión y recibir un token válido.
- Un usuario inactivo o con credenciales inválidas no puede acceder.
- Un cliente no puede acceder a rutas exclusivas del administrador.

## Fuera de alcance
- Login con redes sociales.
- Recuperación de contraseña por correo.
- Autenticación multifactor.
