# Comando: Generar Plan de QA

## Propósito
Crear un plan de pruebas completo para una funcionalidad nueva o un cambio significativo en EcoPython.

## Cuándo usar
- Antes de comenzar el desarrollo de una nueva funcionalidad
- Antes de hacer release de cambios importantes
- Cuando se detectan regresiones recurrentes en un módulo
- Auditoría de cobertura de tests

## Agente principal
`qa-tester` con apoyo de `security-reviewer` para casos de seguridad

## Inputs requeridos
```
Funcionalidad o módulo a probar:
Cambios realizados (descripción):
Archivos modificados:
Vistas/URLs afectadas:
Roles de usuario relevantes: (usuario autenticado, anónimo, staff)
```

## Template de prompt para el agente
```
Crea un plan de QA completo para [FUNCIONALIDAD].
Cambios: [DESCRIPCIÓN].
Archivos tocados: [LISTA].
Debe cubrir: tests unitarios de modelo, tests de vistas, autorización,
validación de formularios, casos de borde, y regresión en módulos relacionados.
```

## Estructura del plan QA
```
## Plan QA: [Funcionalidad]

### Casos de prueba — Camino feliz
- [ ] TC-01: [descripción] → Resultado esperado: [X]

### Casos de prueba — Errores esperados
- [ ] TC-0X: Usuario no autenticado → Espera: redirect a login
- [ ] TC-0X: Usuario incorrecto (otro owner) → Espera: 403/404
- [ ] TC-0X: Input inválido → Espera: form con errores
- [ ] TC-0X: Promo expirado → Espera: error JSON

### Casos de prueba — Seguridad
- [ ] TC-0X: Acceso cross-user a orden
- [ ] TC-0X: CSRF token ausente → Espera: 403
- [ ] TC-0X: Stripe amount manipulation test

### Pruebas de regresión
- [ ] [módulo relacionado] sigue funcionando correctamente
```

## Cómo ejecutar los tests
```powershell
python backend/manage.py test [app_name] --verbosity=2
```

## Guardar plan en
```
docs/07-checklist-qa.md → agregar sección para el módulo/feature
```
