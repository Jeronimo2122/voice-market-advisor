# Voice Market Advisor – RAG + Gemini Live

## Descripción General

Este proyecto implementa un asistente de voz inteligente para un marketplace de productos, combinando Gemini Live (IA conversacional de Google) con RAG (Retrieval-Augmented Generation) usando Supabase y OpenAI. El objetivo es que la IA responda siempre con información real y contextualizada de los productos, evitando alucinaciones y mejorando la experiencia del usuario.

---

## Arquitectura

```
Usuario (voz/texto)
   ↓
Frontend (React + Vite)
   ↓
Supabase Edge Function: gemini-chat
   ↓
1. Genera embedding del mensaje con OpenAI
2. Busca documentos relevantes en Supabase (pgvector)
3. Inyecta contexto en el prompt de Gemini
   ↓
Gemini responde usando SOLO la info relevante
   ↓
Frontend (muestra y lee la respuesta)
```

---

## Enfoque y Proceso de Solución

### 1. RAG (Retrieval-Augmented Generation)
- Se crea una tabla `documents` en Supabase con soporte vectorial (pgvector).
- Cada producto se convierte en un documento vectorizado usando embeddings de OpenAI.
- Se implementa la función SQL `match_documents` para buscar los documentos más similares a una consulta.

### 2. Gemini Live + Contexto Dinámico
- El backend (Edge Function) recibe la pregunta del usuario.
- Genera el embedding de la pregunta.
- Busca los documentos más relevantes en Supabase.
- Inyecta el contenido de esos documentos en el prompt de sistema de Gemini.
- Gemini responde usando ese contexto, dando respuestas precisas y personalizadas.

### 3. Frontend Simple y Seguro
- El frontend solo envía el mensaje del usuario.
- No expone ninguna API key ni lógica de embeddings.
- El backend se encarga de todo el flujo RAG.

---

## Componentes Clave

- Supabase: Base de datos, almacenamiento de documentos, funciones Edge.
- OpenAI: Generación de embeddings para búsqueda semántica.
- Gemini Live: Generación de respuestas conversacionales.
- React + Vite: Interfaz de usuario moderna y rápida.
- shadcn-ui + Tailwind: UI elegante y personalizable.

---

## Proceso de Implementación

1. Migración de Supabase
   - Se crea la tabla `documents` y la función `match_documents`.
2. Carga de Productos
   - Se convierten los productos en documentos y se insertan en la tabla con embeddings.
3. Función Edge gemini-chat
   - Recibe el mensaje, genera embedding, busca documentos, arma el prompt y llama a Gemini.
4. Frontend
   - Solo envía el mensaje del usuario y muestra la respuesta.
5. Depuración y Logs
   - Se agregan logs para asegurar que el contexto RAG se inyecta correctamente.

---

## Cómo Usar

1. Desplegar la migración
   ```bash
   supabase db push
   ```
2. Configurar variables de entorno en Supabase
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Poblar documentos
   - Ve a `/admin/rag` y haz clic en "Populate Documents"
4. Probar el asistente
   - Usa el asistente de voz y pregunta por productos

---

## Problemas y Soluciones

- La IA no responde con contexto: Se revisó que el frontend no pase `productContext` y que el backend haga la consulta RAG internamente.
- No se encuentran documentos: Se agregaron logs para depurar la función y asegurar que los embeddings y la búsqueda funcionan.
- Variables de entorno faltantes: Se documentó la necesidad de todas las keys en el entorno de Supabase.
- Prompt poco claro: Se mejoró el prompt para que Gemini use SOLO la información de productos.

---

## Ejemplo de Prompt Final

```
Eres un asistente de compras. Usa SOLO esta información de productos para responder la pregunta del usuario. Si no tienes información suficiente, dilo claramente.

<Productos relevantes encontrados por RAG>

Usuario: <mensaje del usuario>
```

---

## Ventajas de esta arquitectura
- Respuestas precisas y sin alucinaciones
- Seguridad: las API keys solo viven en el backend
- Escalable: fácil agregar más productos o fuentes
- UX moderna y rápida

---

## Tecnologías usadas
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (pgvector, Edge Functions)
- OpenAI (embeddings)
- Gemini Live (Google)

---

## ¿Cómo contribuir?
1. Clona el repo y sigue las instrucciones de instalación.
2. Haz tus cambios y abre un Pull Request.
3. Usa `/admin/rag` para poblar y probar el sistema RAG.

---

## Créditos y recursos
- [Supabase](https://supabase.com/)
- [OpenAI](https://platform.openai.com/docs/guides/embeddings)
- [Gemini](https://ai.google.dev/gemini-api/docs)
- [pgvector](https://github.com/pgvector/pgvector)
- [LangChain](https://js.langchain.com/docs/integrations/vectorstores/supabase)

---

¿Dudas? Abre un issue o pregunta en el canal del proyecto.
