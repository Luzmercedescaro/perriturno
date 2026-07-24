# Perriturno

## Descripción del proyecto
Perriturno es una aplicación web para gestionar la operación de un negocio de cuidado de mascotas. Permite administrar usuarios, mascotas, servicios, horarios disponibles y reservas, con una arquitectura separada entre frontend y backend, y persistencia de datos en PostgreSQL.

## Funcionalidades principales
- Registro e inicio de sesión con JWT.
- Consulta del perfil del usuario autenticado.
- Registro y consulta de mascotas.
- Consulta de servicios activos.
- Consulta de disponibilidad de horarios.
- Creación y consulta de reservas del usuario.
- Administración de estados, agenda e historial desde el backend.
- Persistencia completa en PostgreSQL.

## Tecnologías
- Next.js
- React
- TypeScript
- Tailwind CSS
- NestJS
- TypeORM
- PostgreSQL
- JWT
- Jest
- Git y GitHub

## Requisitos previos
- Node.js
- npm
- PostgreSQL
- Base de datos perriturno_dev

## Configuración de variables de entorno
Para ejecutar correctamente el proyecto, crea los archivos de entorno a partir de sus ejemplos correspondientes.

1. Backend: crear el archivo .env usando .env.example.
2. Frontend: configurar frontend/.env.local.

No incluyas contraseñas reales, claves privadas ni secretos en el repositorio.

## Ejecución del backend
Desde la raíz del proyecto:

```bash
cd backend
npm install
npm run start:dev
```

El backend quedará disponible en:

```text
http://localhost:3001
```

## Ejecución del frontend
Desde la raíz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

En frontend/.env.local debe existir:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

El frontend quedará disponible en:

```text
http://localhost:3000
```

## Recorrido de verificación funcional
Para validar el funcionamiento integral de Perriturno:

1. Abre la página principal en el navegador.
2. Registra un usuario nuevo o inicia sesión con uno existente.
3. Ingresa al panel principal.
4. Registra y consulta mascotas.
5. Consulta los servicios activos.
6. Verifica la disponibilidad y crea reservas.
7. Confirma la persistencia de la información en la base de datos.
8. Finaliza con cierre de sesión.

## Pruebas
Comandos recomendados:

```bash
npm test -- --runInBand
npm run build
```

Estado esperado del proyecto:
- Seis suites de pruebas.
- 47 pruebas unitarias aprobadas.
- Pruebas e2e incluidas para validación de integración.

## Arquitectura
Perriturno sigue una arquitectura de tres capas:

- Frontend: interfaz de usuario en Next.js/React para autenticación, gestión de mascotas y reservas.
- Backend: API REST en NestJS con lógica de negocio, autorización y administración de agenda/estados.
- PostgreSQL: almacenamiento persistente de usuarios, mascotas, servicios, horarios, reservas e historial.

El diagrama detallado se encuentra en:

docs/arquitectura-detallada-perriturno.md

## Repositorio
https://github.com/Luzmercedescaro/perriturno

## Video de demostración
https://youtu.be/rgj1hefOMxs

## Autora
Luz Mercedes Caro Wilches  
Universidad CIDE  
Seminario en IA  
Julio de 2026
