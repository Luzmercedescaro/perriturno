# SPEC-05: Gestión de servicios

## Objetivo
Administrar los servicios que ofrece el negocio y permitir que los clientes los consulten.

## Contexto
El negocio ofrece servicios de baño y cuidado básico de mascotas, con información como duración y precio de referencia.

## Entradas
- Nombre del servicio.
- Descripción.
- Duración en minutos.
- Precio de referencia.
- Estado activo/inactivo.

## Salidas
- Crear, activar o desactivar servicios.
- Listar servicios activos para clientes.

## Reglas
- Solo el administrador puede crear o modificar servicios.
- Un servicio debe tener datos mínimos completos para ser válido.
- Los servicios inactivos no deben mostrarse a los clientes.

## Criterios de aceptación
- El administrador puede crear un servicio con datos válidos.
- El cliente ve únicamente los servicios activos.
- Se impide crear un servicio sin duración o precio válido.
- Un servicio puede desactivarse sin eliminarse del sistema.

## Fuera de alcance
- Precios dinámicos por campaña.
- Inventario asociado al servicio.
- Integración con pagos.
