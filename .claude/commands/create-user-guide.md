# Comando: Crear Manual de Usuario

## Propósito
Generar documentación de usuario para un módulo o funcionalidad específica de EcoPython.

## Cuándo usar
- Al lanzar una nueva funcionalidad
- Cuando usuarios reportan confusión con un flujo
- Para preparar materiales de onboarding o README del portafolio

## Agente principal
`business-analyst` con apoyo de `product-manager`

## Inputs requeridos
Antes de ejecutar, tener claro:
1. **Módulo o funcionalidad:** ¿Qué parte de EcoPython se documenta?
2. **Rol objetivo:** ¿Comprador, Admin de tienda?
3. **Flujo principal:** ¿Cuál es el caso de uso más común?
4. **Errores frecuentes:** ¿Qué problemas pueden ocurrir?

## Template de prompt para el agente
```
Crea un manual de usuario para [MÓDULO/FUNCIONALIDAD] en EcoPython.
- Rol objetivo: [comprador / admin]
- Flujo principal a documentar: [DESCRIPCIÓN DEL FLUJO]
- Errores comunes a incluir: [ERRORES]
- Idioma: Español
- Tono: Simple, amigable, paso a paso
```

## Estructura esperada del manual
```
# Cómo [hacer la acción]
## ¿Para qué sirve?
## Antes de empezar
## Pasos detallados (numerados)
## Qué pasa después
## Problemas comunes y soluciones
## Preguntas frecuentes
```

## Flujos principales a documentar (backlog)
- Cómo registrarse y hacer login
- Cómo agregar productos al carrito y comprar
- Cómo usar un código de descuento
- Cómo gestionar direcciones de envío
- Cómo ver el historial de órdenes
- Guía de admin: gestionar productos, categorías, órdenes

## Dónde guardar el resultado
```
docs/manuales-usuario.md        → manuales para compradores
docs/admin-guide.md             → guía para el administrador de la tienda
README.md                       → flujo general para el portafolio
```
