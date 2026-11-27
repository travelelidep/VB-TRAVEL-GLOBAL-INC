# AGENTS.md — contexto del repositorio

## Qué es este proyecto

Sitio Next.js 16 (App Router, React 19, Tailwind 4) de **VB TRAVEL GLOBAL INC**: casillero en
China con envíos puerta a puerta a Venezuela. Además del sitio público, incluye una célula de
nueve agentes de IA que opera cotizaciones, documentos, aduana, rastreo, atención, ventas,
marketing y operaciones.

## Comandos

```bash
npm install            # dependencias
npm run dev            # servidor de desarrollo (puerto 3000)
npm run build          # build de producción
npm start              # sirve el build
npx tsc --noEmit       # verificación de tipos
npm run lint           # eslint
node scripts/automation-tick.mjs   # dispara un tick contra AGENTS_BASE_URL
```

## Estructura

- `src/app/` — páginas (`/`, `/agentes`, `/portal/*`, `/buscar`) y rutas API.
- `src/components/` — componentes del sitio público.
- `src/lib/ai/llm.ts` — cliente único para proveedores compatibles con OpenAI; devuelve `null`
  ante cualquier fallo para activar el fallback determinista.
- `src/lib/agents/` — `types.ts`, `registry.ts` (definiciones y prompts), `tools.ts`
  (herramientas deterministas), `handlers.ts` (respuestas por reglas), `orchestrator.ts`
  (enrutado + ejecución), `memory.ts` (estado), `automation.ts` (cola y alertas).
- `src/lib/pricing.ts` y `src/lib/documents.ts` — motores de negocio reutilizados por las rutas
  API y por las herramientas de los agentes. **No dupliques esta lógica**: importa desde aquí.
- `src/instrumentation.ts` + `src/lib/agents/scheduler.ts` — planificador interno que ejecuta
  `runAutomationTick()` cada 15 minutos al arrancar el servidor (controlado por
  `AUTOMATION_SELF_SCHEDULE`).
- `render.yaml` — Blueprint de Render (servicio web; el cron externo está comentado porque exige
  plan de pago).
- `.github/workflows/agents-automation.yml` — cron alternativo y gratuito.

## Convenciones

- Todo el texto de cara al cliente va en español venezolano neutro.
- Las herramientas nunca inventan precios ni datos: usan `pricing.ts`, `documents.ts` o la
  memoria. El LLM solo redacta.
- Cada acción relevante debe registrar un evento con `addEvent` y, si genera trabajo futuro,
  una tarea con `createTask`.
- Los agentes se declaran en `registry.ts`; si agregas uno, actualiza también `AgentId` en
  `types.ts`, el `enum` del body de `/api/agents/orchestrator` y el switch de `handlers.ts`.

## Detalles que importan

- El estado vive en `globalThis.__vbgAgentStore`. Sin `UPSTASH_REDIS_REST_URL`/`_TOKEN` se
  pierde en cada reinicio (Render free duerme y redespliega).
- `POST /api/automation/tick` exige `CRON_SECRET` cuando la variable está definida.
- El wizard de cotización envía `pesoPorCaja/cajas/valorCarga/destinoFinal`; la ruta
  `/api/agents/cotizador` normaliza ese payload al contrato de `quoteSchema`.
- Las pruebas manuales útiles están documentadas en el README (curl de health, cotizador,
  casillero, webhooks y tick).

## Verificación del 2026-11-27

- `npm run lint` queda en 0 errores (3 avisos: `<img>` en Destinations/BuscadorProductos y
  fuente custom en `layout.tsx`). `npm ci` ya funciona: el `package-lock.json` está en sync.
- `POST /api/agents/tick` es el disparo manual del panel `/agentes`; procesa 12 tareas y
  aplica un enfriamiento de 10 s por instancia. El protegido con secreto sigue siendo
  `/api/automation/tick`.
- Enrutado por palabras clave: las siglas de 3 letras o menos (`bl`, `kg`, `awb`, `dua`)
  solo cuentan como palabra completa; de lo contrario "problema" activaba a documentos.
- El chat entiende "N cajas de AxBxC de P kg": calcula peso total, piezas y volumen.
- `generateQuote` usa `piezas` para multiplicar el peso volumétrico y resuelve destinos
  compuestos ("Puerto Ordaz", "San Cristóbal") sin acentos.
- El push a GitHub está bloqueado (403): el token de la sesión es de solo lectura.
  Los cambios deben subirse desde una cuenta con permiso de escritura.
