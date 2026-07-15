# SPEC-07: Consulta de disponibilidad

## Objetivo
Mostrar al usuario los turnos disponibles para una fecha y un servicio específicos, considerando los horarios operativos, la hora de almuerzo y las reservas activas.

## Contexto
Los clientes necesitan conocer rápidamente si existen cupos para la fecha deseada antes de crear una reserva. Dado que solo existe una persona encargada, la disponibilidad debe calcularse con base en los horarios de atención, la duración del turno y la posibilidad de solapamiento.

## Entradas
- Fecha de consulta.
- Servicio seleccionado.
- Tamaño de la mascota, si aplica para calcular la duración.
- Filtro opcional por horario o estado.

## Salidas
- Lista de horarios disponibles.
- Lista de horarios ocupados o bloqueados.
- Mensaje claro si no hay cupos.

## Reglas
- La consulta debe validar que se reciba una fecha.
- Solo deben mostrarse horarios compatibles con el servicio.
- Solo se deben considerar días hábiles de martes a domingo.
- Los horarios fuera del rango de 9:00 a. m. a 6:00 p. m. no deben mostrarse.
- No deben mostrarse horarios dentro del bloque de almuerzo de 12:00 m. a 1:30 p. m.
- La disponibilidad debe excluir horarios que generen una reserva que termine después de las 6:00 p. m.
- La disponibilidad debe excluir horarios que se solapen con reservas pendientes o confirmadas.
- La duración del turno depende del tamaño de la mascota: 2 horas para pequeña y 3 horas para grande.
- El sistema debe calcular la hora de finalización del turno para determinar si el horario es válido.

## Criterios de aceptación
- El sistema devuelve una lista de horarios según la fecha, el servicio y el tamaño de la mascota.
- Si no hay disponibilidad, se informa claramente.
- El cliente no puede seleccionar un horario que cruce el almuerzo, supere las 6:00 p. m. o se solape con una reserva activa.
- La consulta refleja correctamente los horarios ocupados, bloqueados y disponibles.

## Fuera de alcance
- Sugerencias inteligentes de horarios alternativos.
- Disponibilidad por varios servicios simultáneamente.
- Cálculo predictivo de demanda.
