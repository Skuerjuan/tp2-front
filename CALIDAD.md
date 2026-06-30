# CALIDAD.md
## Estrategia general de calidad

El enfoque de calidad del proyecto se basa en una estrategia de estratificación para checkear el funcionamiento adecuado de los distintos niveles de la app. Para seguir avanzando por los niveles es necesario que los anteriores hayan pasado todos sus tests. Fueron separados en lint, donde se buscan posibles errores en la sintáxis del código; tests unitarios, que prueban funcionalidades específicas; tests end-2-end, que prueban el flujo general de la website; building, donde se construye el proyecto y se checkea que ningún subdirectorio tenga problemas de compilación; deployment, donde se sube la build a producción.

Se priorizó esta estructura porque permite detectar errores en etapas tempranas (tests unitarios) y asegurar que los flujos críticos del usuario funcionen correctamente en un entorno lo más parecido posible a producción (E2E).

## Herramientas seleccionadas
### Tests unitarios: Vitest

Se eligió Vitest por su integración nativa con proyectos modernos de Next.js, su velocidad y su compatibilidad con mocks sencillos.

### Tests E2E: Playwright

Se utilizó Playwright para los tests end-to-end debido a:

- Soporte multi-browser
- Auto-waiting (reduce tests flakys)
- Buen soporte para CI
- APIs modernas (getByRole, getByTestId)

### Linting: ESLint

Se utiliza ESLint manual (npx eslint .) debido a su fácil utilización y a que next lint no funcionó en nuestros tests por errores en el binario de next.

### CI/CD: GitHub Actions + Vercel

Se implementó CI/CD con GitHub Actions para automatizar:

- validación de código (lint)
- ejecución de tests unitarios
- ejecución de tests E2E
- build de la aplicación
- deploy a Vercel

Se eligió GitHub Actions por su integración directa con el repositorio y Vercel por su despliegue simple para Next.js.

## Tests desarrollados
### Tests unitarios (Vitest)
- fetchResenas returns all rows: valida que la función obtiene correctamente todas las reseñas desde Supabase.
- fetchLeidos filters by usuario_id: asegura que el filtrado por usuario funciona correctamente.
- fetchResenasDesdeLeidos returns empty array: verifica el caso sin datos.
- insertLeido sends payload correctly: valida la inserción de libros leídos.
- deleteResena resolves correctly: asegura que la eliminación se ejecuta sin errores.
### Tests E2E (Playwright)
- Flujo de autenticación
- Usuario completa login correctamente y es redirigido al home.
- Flujo de navegación a libros
- Usuario accede a /libros y visualiza listado de libros.
- Flujo marcar como leído
- Usuario marca un libro como leído y el estado se actualiza correctamente.
- Flujo libros leídos
- El libro marcado aparece en la sección /leidos.

Estos tests validan el flujo completo de uso real de la aplicación.

## Casos de uso críticos

Los flujos priorizados fueron:

1. Autenticación de usuario

Es el punto de entrada a toda la aplicación. Si falla, el resto del sistema no es accesible.

2. Visualización de libros

Es el core funcional de la app (lectura y reseñas).

3. Marcar libros como leídos

Es la funcionalidad principal de interacción del usuario con el sistema.

4. Persistencia de datos en Supabase

Garantiza que los cambios del usuario no se pierdan y se reflejen entre sesiones.

## Pipeline de CI/CD

El pipeline está dividido en etapas secuenciales:

1. Lint

Valida estilo y errores básicos del código antes de ejecutar tests.

2. Unit tests

Ejecuta tests de lógica aislada con Vitest.

3. E2E tests

Levanta la aplicación y ejecuta Playwright contra un entorno real.

4. Build

Compila la aplicación Next.js para producción.

5. Deploy

Solo se ejecuta si todas las etapas anteriores pasan correctamente.
El deploy se realiza a Vercel en la rama main.

Decisión clave: el deploy está condicionado a los tests para evitar publicar código roto en producción.

## Limitaciones y deuda técnica
- Los tests E2E dependen actualmente de datos reales en Supabase, lo que puede generar inestabilidad.
- Algunos tests son sensibles a timing (fetch + SSR), lo que puede causar flakiness en CI.
- No se implementaron mocks completos para Supabase en E2E.
- El login en tests podría mejorarse usando storageState para evitar repetir autenticación.
- El pipeline podría optimizarse separando build reutilizable entre jobs para reducir tiempos.

Los tests unitarios fueron hechos con GPT-5.4 mini en agente de VSCode