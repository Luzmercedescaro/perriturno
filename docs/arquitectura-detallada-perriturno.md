# Arquitectura detallada de Perriturno

Perriturno implementa una arquitectura cliente-servidor donde el usuario interactúa desde el navegador con una aplicación frontend desarrollada en Next.js. El frontend consume una API REST construida con NestJS mediante solicitudes HTTP y respuestas en formato JSON. El backend organiza la lógica de negocio en módulos, aplica autenticación y autorización con JWT y roles, valida los datos de entrada, y persiste la información con TypeORM sobre PostgreSQL.

```mermaid
flowchart LR
    U[Usuario en navegador] --> FE

    subgraph FE[Frontend - Next.js + React + TypeScript + Tailwind CSS]
        V1[Página principal]
        V2[Registro]
        V3[Inicio de sesión]
        V4[Panel principal]
        V5[Mascotas]
        V6[Reservas]
    end

    FE -- "Solicitudes HTTP JSON" --> API[API REST - NestJS + TypeScript]
    API -- "Respuestas HTTP JSON" --> FE

    subgraph BE[Módulos Backend]
        M1[Auth]
        M2[Users]
        M3[Pets]
        M4[Services]
        M5[Schedules]
        M6[Reservations]
    end

    API --> M1
    API --> M2
    API --> M3
    API --> M4
    API --> M5
    API --> M6

    subgraph SEC[Seguridad]
        S1[Autenticación JWT]
        S2[Control de roles CLIENTE y ADMIN]
        S3[Validación de datos]
    end

    API --- SEC
    M1 --- S1
    M2 --- S2
    M3 --- S3
    M4 --- S3
    M5 --- S3
    M6 --- S3

    M1 --> ORM
    M2 --> ORM
    M3 --> ORM
    M4 --> ORM
    M5 --> ORM
    M6 --> ORM

    ORM[TypeORM - Capa de persistencia] --> DB[(PostgreSQL)]

    subgraph T[Tablas]
        T1[users]
        T2[pets]
        T3[services]
        T4[schedules]
        T5[reservations]
        T6[reservation_status_history]
    end

    DB --- T1
    DB --- T2
    DB --- T3
    DB --- T4
    DB --- T5
    DB --- T6

    DB -- "Datos persistidos" --> ORM
    ORM -- "Entidades y resultados" --> M1
    ORM -- "Entidades y resultados" --> M2
    ORM -- "Entidades y resultados" --> M3
    ORM -- "Entidades y resultados" --> M4
    ORM -- "Entidades y resultados" --> M5
    ORM -- "Entidades y resultados" --> M6

    M1 -- "Respuesta de negocio" --> API
    M2 -- "Respuesta de negocio" --> API
    M3 -- "Respuesta de negocio" --> API
    M4 -- "Respuesta de negocio" --> API
    M5 -- "Respuesta de negocio" --> API
    M6 -- "Respuesta de negocio" --> API

    U -->|Interacción| FE

    F[Flujo general: Usuario → Frontend → API REST → Módulos Backend → TypeORM → PostgreSQL]:::note
    R[Retorno: PostgreSQL → TypeORM → Módulos Backend → API REST → Frontend → Usuario]:::note

    classDef note fill:#f2f8ff,stroke:#1d4ed8,color:#1e3a8a,stroke-width:1px;
```
