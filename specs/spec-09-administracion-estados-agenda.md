# SPEC-09: Administración de estados y agenda

## Objetivo
Permitir que el administrador gestione los estados de las reservas y revise la agenda diaria del negocio.

## Contexto
El administrador debe poder organizar la operación diaria, confirmar reservas, cerrarlas como finalizadas y revisar la agenda de forma clara.

## Entradas
- Reservas existentes.
- Acción de cambio de estado: confirmar, cancelar o finalizar.
- Filtros por fecha, estado o servicio.

## Salidas
- Cambio de estado de reserva.
- Listado de agenda del día.
- Historial de cambios por reserva.

## Reglas
- Solo el administrador puede confirmar o finalizar reservas.
- Una reserva finalizada no puede volver a estado pendiente.
- Una reserva cancelada no puede reutilizar el horario activo.
- Las reservas deben poder filtrarse por fecha, estado y servicio.

## Criterios de aceptación
- El administrador puede confirmar una reserva pendiente.
- El administrador puede finalizar una reserva confirmada.
- El administrador puede cancelar reservas cuando la regla lo permita.
- La agenda del día se muestra con información clara de cliente, mascota, servicio, horario y estado.

## Fuera de alcance
- Notificaciones automáticas por WhatsApp o correo.
- Reportes complejos o exportación de datos.
- Integración con herramientas externas de calendario.
