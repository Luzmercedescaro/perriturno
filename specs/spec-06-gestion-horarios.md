# SPEC-06: Gestión de horarios

## Objetivo
Definir los horarios de atención del negocio y marcar los estados disponibles, ocupados o bloqueados.

## Contexto
La agenda del negocio depende de horarios concretos que deben organizarse para evitar conflictos y solapamientos.

## Entradas
- Fecha y hora de inicio.
- Duración del turno.
- Estado del horario: disponible, ocupado o bloqueado.
- Servicio asociado si aplica.

## Salidas
- Creación de horarios.
- Consulta del estado del horario.
- Bloqueo o liberación de turnos.

## Reglas
- Solo el administrador puede crear o bloquear horarios.
- Un horario ocupado o bloqueado no puede usarse para una nueva reserva activa.
- La lógica de disponibilidad debe basarse en el estado del horario.

## Criterios de aceptación
- El administrador puede crear horarios válidos.
- El sistema diferencia claramente entre horario disponible, ocupado y bloqueado.
- Un horario bloqueado no es seleccionable para reserva.
- Un horario ocupado no puede reutilizarse simultáneamente.

## Fuera de alcance
- Recurrencia automática de horarios compleja.
- Integración con calendarios externos.
- Gestión de personal múltiple.
