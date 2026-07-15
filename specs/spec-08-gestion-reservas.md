# SPEC-08: Gestión de reservas

## Objetivo
Permitir crear, consultar y cancelar reservas de forma segura y consistente, respetando los horarios operativos y las restricciones de ocupación del negocio.

## Contexto
La reserva es el centro del negocio: debe quedar asociada a cliente, mascota, servicio y horario, y debe respetar las reglas del negocio. Dado que solo existe una persona encargada, no pueden existir dos reservas activas simultáneas ni turnos que cruzen el almuerzo o superen el horario final.

## Entradas
- Cliente autenticado.
- Mascota asociada.
- Servicio activo.
- Hora de inicio de la reserva.
- Tamaño de la mascota para calcular la duración.
- Datos opcionales de observación.

## Salidas
- Creación de reserva con estado pendiente.
- Consulta de reservas propias y generales según rol.
- Cancelación de reservas cuando aplique.
- Cálculo automático de la hora de finalización.

## Reglas
- Toda reserva nueva inicia en estado pendiente.
- Perriturno atenderá de martes a domingo.
- El horario de atención será de 9:00 a. m. a 6:00 p. m.
- No habrá atención entre las 12:00 m. y la 1:30 p. m. por la hora de almuerzo.
- Solo habrá una persona encargada de bañar y arreglar a las mascotas.
- No pueden existir dos reservas activas al mismo tiempo.
- Las reservas no pueden solaparse con otras reservas pendientes o confirmadas.
- Las reservas tampoco pueden cruzar el horario de almuerzo.
- La duración de la reserva depende del tamaño de la mascota:
  - Mascota pequeña: 2 horas.
  - Mascota grande: 3 horas.
- El sistema debe calcular la hora de finalización de la reserva según la hora de inicio y la duración correspondiente.
- El sistema debe rechazar una reserva si termina después de las 6:00 p. m.
- El sistema debe rechazar una reserva si cruza el bloque de almuerzo de 12:00 m. a 1:30 p. m.
- El sistema debe rechazar una reserva si se cruza con otra reserva activa.
- El cliente solo puede gestionar sus propias reservas.
- Una reserva debe asociarse a cliente, mascota, servicio y horario.
- Al cancelar una reserva, el horario asociado debe volver a quedar disponible, siempre que no exista otra reserva activa para ese mismo horario.
- Una reserva cancelada no puede volver a estado pendiente o confirmada, pero el horario sí puede quedar disponible nuevamente.

## Criterios de aceptación
- Un cliente puede crear una reserva válida dentro del rango operativo.
- La reserva queda registrada con estado pendiente.
- Si el horario ya fue tomado, se rechaza la creación.
- Si la reserva terminaría después de las 6:00 p. m. o cruza el almuerzo, se rechaza.
- Un cliente no puede ver o modificar reservas de otros usuarios.
- La cancelación libera el horario correspondiente cuando ya no existe conflicto con otra reserva activa.

## Fuera de alcance
- Pagos electrónicos.
- Recordatorios automáticos.
- Domicilios o transporte.
