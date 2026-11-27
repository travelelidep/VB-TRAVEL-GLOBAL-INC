# VB TRAVEL GLOBAL INC — Sitio web + célula de agentes IA

Sitio Next.js 16 del casillero China → Venezuela, con una célula de nueve agentes de IA que
coticéan, gestionan documentos, siguen la aduana, rastrean envíos, atienden clientes y ejecutan
tareas de seguimiento de forma autónoma.

## Arquitectura

```
Cliente (web / WhatsApp / webhooks)
        │
        ▼
POST /api/agents/orchestrator
        │
        ▼
   ┌─────────────┐   sin API key
   │ Orquestador │──────────────► motor de reglas (siempre disponible)
   │  (supervisor)│   con API key
   └──────┬──────┘──────────────► LLM compatible con OpenAI
          │
          ├── Coti        cotizaciones aéreas y marítimas
          ├── Docu        checklist documental internacional + Venezuela
          ├── Aduanero    estados del DUA y siguientes pasos
          ├── Rastrea     estado de guías
          ├── Sofía       atención al cliente
          ├── Valeria     seguimiento comercial
          ├── Marca       contenido y marketing
          └── Opera       incidencias y última milla
                 │
                 ▼
      Cola de tareas (memoria o Redis) ──► planificador interno cada 15 min
                                        └─► /api/automation/tick (cron externo opcional)
```

- **Orquestador** (`src/lib/agents/orchestrator.ts`): enruta por LLM o por palabras clave y
  ejecuta al agente con datos reales del sistema.
- **Herramientas** (`src/lib/agents/tools.ts`): cotizar, documentos, rastrear, crear lead,
  crear tarea y resumen operativo. Son deterministas: nunca inventan precios.
- **Memoria** (`src/lib/agents/memory.ts`): tareas, leads, envíos, eventos y métricas.
  Usa memoria del proceso o Upstash Redis si configuras las variables.
- **Automatización** (`src/lib/agents/automation.ts`): procesa tareas vencidas, detecta envíos
  estancados y leads fríos, y genera un resumen diario.

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Health check para Render (estado, agentes, integraciones) |
| GET | `/api/products` | Catálogo de productos (`q`, `categoria`, `limit`); usa catálogo local o fuente remota |
| POST | `/api/asesor` | Asesor de importación: responde con la base de conocimiento (RAG con LLM si hay clave) |
| GET | `/api/agents` | Agentes, métricas, tareas, eventos y leads |
| POST | `/api/agents/orchestrator` | `{ message, agentId?, canal?, cliente?, contexto? }` |
| POST | `/api/agents/cotizador` | Cotización (acepta el payload del API y el del wizard) |
| POST | `/api/agents/documentos` | Checklist documental |
| POST | `/api/leads/casillero` | Alta de casillero + tareas de bienvenida |
| POST | `/api/automation/tick` | Procesa la cola (requiere `CRON_SECRET` si está definido) |
| POST | `/api/agents/tick` | Disparo manual desde el panel (12 tareas, enfriamiento de 10 s) |
| POST | `/api/webhooks/carrier` | Eventos del transportista → rastreo + tarea de aviso |
| POST | `/api/webhooks/aduana` | Estados del DUA → tarea del agente aduanal |
| POST | `/api/webhooks/whatsapp` | Mensajes de WhatsApp → orquestador → respuesta |
| POST | `/api/webhooks/wings` | Reservas WINGS → lead + tareas de post-venta |

Panel de operación: **`/agentes`** (métricas, cola de tareas, actividad y consola de chat).

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # opcional
npm run dev                  # http://localhost:3000
```

Sin `AI_API_KEY` todo funciona en modo reglas: las cotizaciones, documentos, rastreo y
respuestas son deterministas. Al añadir una clave, los agentes redactan con LLM pero siguen
usando las herramientas para los datos.

```bash
npx tsc --noEmit             # tipos
npm run build                # build de producción
curl -X POST localhost:3000/api/automation/tick
```

## Despliegue en Render

El repositorio incluye `render.yaml` (Blueprint) con el servicio web y, comentado, un cron opcional.

1. En Render: **New → Blueprint** y selecciona este repositorio.
2. Render crea:
   - `vb-travel-global` (web, health check en `/api/health`, deploy automático desde `main`).
   - El planificador interno ya procesa la cola cada 15 minutos; el cron
     `vb-agents-automation` del blueprint está comentado porque exige plan de pago.
3. Cada push a `main` dispara el workflow `deploy-render.yml`, que llama al API de Render
   (secrets `RENDER_API_KEY` y `RENDER_SERVICE_ID`). Si instalas la GitHub App de Render,
   puedes borrar ese workflow y usar el auto-deploy nativo.
3. Completa las variables marcadas como secretas (`sync: false`):

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `AI_API_KEY` | No | Activa el LLM (OpenAI, Groq, OpenRouter…) |
| `AI_BASE_URL` / `AI_MODEL` | No | Endpoint y modelo compatibles con OpenAI |
| `AUTOMATION_SELF_SCHEDULE` | No | `false` desactiva el planificador interno |
| `CRON_SECRET` | Recomendada | Protege `/api/automation/tick` (se genera sola) |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | No | Persistencia del estado entre deploys |
| `WHATSAPP_VERIFY_TOKEN` | Sí para WhatsApp | Verificación del webhook de Meta |
| `WHATSAPP_ACCESS_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` | Sí para WhatsApp | Envío de respuestas |
| `RESEND_API_KEY` / `EMAIL_FROM` | No | Notificaciones por email |

Notas de Render:

- La automatización no necesita cron externo: `src/instrumentation.ts` arranca un planificador
  interno que procesa la cola cada 15 minutos dentro del propio servidor.
- Los **Cron Jobs** de Render requieren plan de pago (Starter); por eso vienen comentados en
  `render.yaml`. Si prefieres un disparador externo y gratuito, usa el workflow
  `.github/workflows/agents-automation.yml` definiendo los secretos `AGENTS_BASE_URL` y
  `CRON_SECRET` en GitHub.
- El plan free de Render duerme el servicio tras 15 minutos sin tráfico; el planificador se
  reanuda al despertar.
- Sin Redis el estado se pierde en cada deploy o reinicio. Con Upstash se conserva.

## WhatsApp (Meta)

1. Configura el webhook en Meta Developers apuntando a
   `https://<tu-dominio>/api/webhooks/whatsapp` con el token de verificación.
2. Suscríbete al campo `messages`.
3. Define `WHATSAPP_ACCESS_TOKEN` y `WHATSAPP_PHONE_NUMBER_ID` para que el agente responda.

## Webhooks de operación

```bash
# Evento del transportista
curl -X POST https://<dominio>/api/webhooks/carrier \
  -H 'Content-Type: application/json' \
  -d '{"trackingNumber":"VBG123456","event":"EN_TRANSITO","location":"Puerto Huangpu","carrier":"COSCO"}'

# Estado aduanal
curl -X POST https://<dominio>/api/webhooks/aduana \
  -H 'Content-Type: application/json' \
  -d '{"duaNumber":"DUA-2026-001","trackingNumber":"VBG123456","status":"SELECCION_ROJA"}'

# Tick manual de la automatización
curl -X POST https://<dominio>/api/automation/tick -H "Authorization: Bearer $CRON_SECRET"
```
