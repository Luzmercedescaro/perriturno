# SPEC-03: Gestión de clientes y perfil

## Objetivo
Permitir al usuario autenticado consultar y actualizar su información básica de forma segura.

## Contexto
El cliente debe poder mantener su perfil actualizado para futuras reservas y para que el negocio cuente con datos de contacto correctos.

## Entradas
- Perfil del usuario autenticado.
- Datos modificables: nombre, teléfono y otros datos básicos.

## Salidas
- Consulta del perfil propio.
- Actualización del perfil.
- Respuestas con datos seguros del usuario.

## Reglas
- Un usuario solo puede consultar y modificar su propio perfil.
- No se debe permitir cambiar el rol sin autorización.
- La contraseña no debe devolverse en ninguna respuesta.

## Criterios de aceptación
- El cliente autenticado puede ver su información personal.
- Puede actualizar sus datos básicos sin afectar a otros usuarios.
- No puede modificar información que no le corresponde.
- El sistema valida los datos antes de guardarlos.

## Fuera de alcance
- Gestión completa de usuarios por parte de clientes.
- Múltiples perfiles por usuario.
- Integración con verificación de identidad externa.
