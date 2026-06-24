# Skill: Estándar de Documentación EcoPython

## Propósito
Guía unificada para toda la documentación del proyecto EcoPython: técnica, de usuario y de portafolio.

## Principios generales
1. **Actualidad:** La documentación desactualizada es peor que no tenerla.
2. **Audiencia clara:** Siempre escribir con una audiencia específica en mente.
3. **Accionable:** Cada documento debe terminar con algo que el lector puede hacer.
4. **Concisión:** Si se puede decir en 3 palabras, no usar 10.
5. **Código > Comentarios:** En documentación técnica, el código es la fuente de verdad.

## Tipos de documentación y ubicación

| Tipo | Audiencia | Ubicación | Formato |
|------|-----------|-----------|---------|
| Contexto del proyecto | Claude/devs | `CLAUDE.md` | Markdown |
| README de portafolio | Reclutadores/devs | `README.md` | Markdown |
| Arquitectura técnica | Devs | `docs/arquitectura.md` | Markdown + diagramas |
| Manuales de usuario | Compradores | `docs/manuales-usuario.md` | Markdown simple |
| Guía de admin | Admin tienda | `docs/admin-guide.md` | Markdown simple |
| Cambios y versiones | Equipo técnico | `docs/Cambios-para-versionamiento.md` | Markdown con fecha |

## Formato estándar de documentos técnicos

```markdown
# Título del documento

## Resumen
[2-3 líneas de qué trata este documento]

## Audiencia
[Quién debería leer esto]

## Contexto
[Por qué existe este documento]

## Contenido principal
[Secciones relevantes]

## Actualizaciones
| Fecha | Versión | Cambio | Autor |
|-------|---------|--------|-------|
| 2026-06-12 | 1.0 | Creación inicial | [nombre] |
```

## Estándar de código en documentación técnica
- Siempre incluir el lenguaje en bloques de código: ` ```python`, ` ```html`, ` ```powershell`
- Rutas de archivos en formato completo desde `backend/`: `backend/orden/views.py`
- Comandos siempre probados antes de documentar

## Documentación de cambios (versionamiento)
Ver formato completo en `CLAUDE.md` → sección "Formato de documentación de cambios"

Ubicación: `docs/Cambios-para-versionamiento.md`

Cada entrada incluye:
- Fecha, tipo de cambio, resumen técnico
- Explicación sencilla (para no técnicos)
- Archivos modificados, motivo, riesgos
- Pasos para probar localmente
- Impacto en sistema (backend, templates, DB, seguridad, usuarios)

## Cuándo actualizar la documentación
- **Inmediatamente:** Cambios en URLs, nuevas vistas, cambios en modelos
- **Con el commit:** Cambios de arquitectura, nuevas apps
- **Por ciclo:** Changelog, README del portafolio
