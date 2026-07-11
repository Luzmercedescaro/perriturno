# SPEC-07: Consulta de disponibilidad

## Objetivo
Mostrar al usuario los turnos disponibles para una fecha y un servicio específicos.

## Contexto
Los clientes necesitan conocer rápidamente si existen cupos para la fecha deseada antes de crear una reserva.

## Entradas
- Fecha de consulta.
- Servicio seleccionado.
- Filtro opcional por horario o estado.

## Salidas
- Lista de horarios disponibles.
- Lista de horarios ocupados o bloqueados.
- Mensaje claro si no hay cupos.

## Reglas
- La consulta debe validar que se reciba una fecha.
- Solo deben mostrarse horarios compatibles con el servicio.
- Los horarios ocupados o bloqueados no deben considerarse disponibles.

## Criterios de aceptación
- El sistema devuelve una lista de horarios según la fecha y el servicio.
- Si no hay disponibilidad, se informa claramente.
- El cliente no puede seleccionar un horario no disponible.

## Fuera de alcance
- Sugerencias inteligentes de horarios alternativos.
- Disponibilidad por varios servicios simultáneamente.
- Cálculo predictivo de demanda.
