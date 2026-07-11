# SPEC-08: Gestión de reservas

## Objetivo
Permitir crear, consultar y cancelar reservas de forma segura y consistente.

## Contexto
La reserva es el centro del negocio: debe quedar asociada a cliente, mascota, servicio y horario, y debe respetar las reglas del negocio.

## Entradas
- Cliente autenticado.
- Mascota asociada.
- Servicio activo.
- Horario disponible.
- Datos opcionales de observación.

## Salidas
- Creación de reserva con estado pendiente.
- Consulta de reservas propias y generales según rol.
- Cancelación de reservas cuando aplique.

## Reglas
- Toda reserva nueva inicia en estado pendiente.
- Un horario no puede tener dos reservas activas simultáneamente.
- El cliente solo puede gestionar sus propias reservas.
- Una reserva debe asociarse a cliente, mascota, servicio y horario.
- Al cancelar una reserva, el horario debe volver a quedar disponible.

## Criterios de aceptación
- Un cliente puede crear una reserva válida.
- La reserva queda registrada con estado pendiente.
- Si el horario ya fue tomado, se rechaza la creación.
- Un cliente no puede ver o modificar reservas de otros usuarios.
- La cancelación libera el horario correspondiente.

## Fuera de alcance
- Pagos electrónicos.
- Recordatorios automáticos.
- Domicilios o transporte.
