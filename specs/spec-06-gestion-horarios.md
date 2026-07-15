# SPEC-06: Gestión de horarios

## Objetivo
Definir el calendario operativo del negocio, establecer los bloques de atención válidos y determinar cuándo un horario está disponible, ocupado o bloqueado.

## Contexto
Perriturno opera de martes a domingo, con atención limitada a un único encargado. Por ello, los horarios deben organizarse para evitar solapamientos, proteger la hora de almuerzo y asegurar que cada turno pueda completarse dentro del horario operativo.

## Entradas
- Día de atención.
- Hora de inicio de la reserva.
- Tamaño de la mascota (pequeña o grande).
- Estado del horario: disponible, ocupado o bloqueado.
- Servicio asociado, si aplica.

## Salidas
- Creación de horarios o bloques operativos.
- Consulta del estado del horario.
- Bloqueo o liberación de turnos.
- Cálculo de la hora de finalización del turno según la duración.

## Reglas
- Perriturno atenderá de martes a domingo.
- El horario de atención será de 9:00 a. m. a 6:00 p. m.
- No habrá atención entre las 12:00 m. y la 1:30 p. m. por la hora de almuerzo.
- Solo habrá una persona encargada de bañar y arreglar a las mascotas.
- No pueden existir dos reservas activas al mismo tiempo.
- Las reservas no pueden solaparse con otras reservas pendientes o confirmadas.
- Una reserva no puede cruzar el bloque de almuerzo.
- La duración de la reserva depende del tamaño de la mascota:
  - Mascota pequeña: 2 horas.
  - Mascota grande: 3 horas.
- El sistema debe calcular la hora de finalización de la reserva según la hora de inicio y la duración correspondiente.
- El sistema debe rechazar un horario si la reserva terminaría después de las 6:00 p. m.
- El sistema debe rechazar un horario si cruza el bloque de almuerzo de 12:00 m. a 1:30 p. m.
- El sistema debe rechazar un horario si se cruza con otra reserva activa.

## Criterios de aceptación
- El sistema permite crear bloques de atención válidos solo dentro del rango operativo.
- Los horarios que cruzan el almuerzo o superan las 6:00 p. m. no son aceptados.
- Un horario con reserva pendiente o confirmada no puede reutilizarse simultáneamente.
- El sistema calcula correctamente la hora final según el tamaño de la mascota.
- El administrador puede bloquear horarios fuera del rango operativo o con restricciones especiales.

## Fuera de alcance
- Recurrencia automática de horarios compleja.
- Integración con calendarios externos.
- Gestión de personal múltiple.
