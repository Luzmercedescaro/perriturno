# SPEC-04: Gestión de mascotas

## Objetivo
Permitir que un cliente registre y consulte sus mascotas para asociarlas a reservas.

## Contexto
Cada reserva debe asociarse a una mascota específica, por lo que el sistema debe soportar el registro y la relación con el cliente.

## Entradas
- Nombre de la mascota.
- Tipo, tamaño y observaciones.
- Identificador del cliente autenticado.

## Salidas
- Creación de mascotas.
- Consulta de mascotas del cliente autenticado.
- Asociación de la mascota a una reserva futura.

## Reglas
- La mascota debe estar asociada a un cliente válido.
- Un cliente solo puede ver y gestionar sus propias mascotas.
- Los datos mínimos obligatorios deben estar presentes.

## Criterios de aceptación
- Un cliente autenticado puede registrar al menos una mascota.
- La mascota queda asociada al usuario correcto.
- El cliente no puede ver mascotas de otros usuarios.
- La información de la mascota se puede recuperar al crear una reserva.

## Fuera de alcance
- Historia clínica veterinaria completa.
- Gestión de vacunas o tratamientos médicos.
- Múltiples dueños por mascota.
