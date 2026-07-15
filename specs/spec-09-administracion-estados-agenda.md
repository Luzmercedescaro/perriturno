# SPEC-09: Administración de estados y agenda

## Objetivo
Permitir que el administrador gestione los estados de las reservas y revise la agenda diaria del negocio, asegurando que la operación cumpla con las reglas de atención y disponibilidad.

## Contexto
El administrador debe poder organizar la operación diaria, confirmar reservas, cerrarlas como finalizadas y revisar la agenda de forma clara. Dado que el negocio cuenta con una sola persona encargada, la agenda debe reflejar correctamente los bloques ocupados, los turnos disponibles y las restricciones del almuerzo y del horario final.

## Entradas
- Reservas existentes.
- Acción de cambio de estado: confirmar, cancelar o finalizar.
- Filtros por fecha, estado o servicio.
- Información de tamaño de mascota, hora de inicio y hora estimada de finalización.

## Salidas
- Cambio de estado de reserva.
- Listado de agenda del día.
- Historial de cambios por reserva.
- Visualización de disponibilidad y conflictos de horario.

## Reglas
- Solo el administrador puede confirmar o finalizar reservas.
- Una reserva finalizada no puede volver a estado pendiente.
- Una reserva cancelada no puede volver a estado pendiente o confirmada, pero su horario puede quedar disponible nuevamente si no existe otra reserva activa para el mismo intervalo.
- No pueden existir dos reservas activas al mismo tiempo.
- Las reservas no pueden solaparse con otras reservas pendientes o confirmadas.
- Las reservas no pueden cruzar el bloque de almuerzo de 12:00 m. a 1:30 p. m.
- Las reservas deben poder filtrarse por fecha, estado y servicio.
- El administrador debe poder revisar si una reserva cumple con las reglas de horario y duración según el tamaño de la mascota.

## Criterios de aceptación
- El administrador puede confirmar una reserva pendiente si no existe conflicto de horario.
- El administrador puede finalizar una reserva confirmada.
- El administrador puede cancelar reservas cuando la regla lo permita.
- La agenda del día se muestra con información clara de cliente, mascota, servicio, horario, duración y estado.
- Un cambio de estado no debe dejar una reserva en conflicto con otra reserva activa.

## Fuera de alcance
- Notificaciones automáticas por WhatsApp o correo.
- Reportes complejos o exportación de datos.
- Integración con herramientas externas de calendario.
