# Azahara — Rediseño "Medianoche & Cromo"

**Fecha:** 2026-06-01
**Estado:** Diseño aprobado por el cliente (dirección visual + paleta + composición de hero + origen de fotos). Listo para implementar.

---

## 1. Objetivo

Rediseñar la tienda de perfumes Azahara para que sea **excepcional a nivel visual** y **sólida y segura a nivel de backend/funcionalidad**, corrigiendo todos los bugs actuales. El cliente rechazó el diseño previo (ámbar/oro, tipografías minúsculas, negro amarronado, responsive roto).

## 2. Decisiones aprobadas (no reabrir sin el cliente)

- **Paleta:** Medianoche & Cromo (azul medianoche + plata/hielo + cromo). Fría, moderna, unisex.
- **Composición de portada:** Hero **cinematográfico centrado** (Opción 1) + **sección de carrusel** de productos justo debajo (lo mejor de ambas: impacto arriba, venta inmediata al hacer scroll).
- **Ingredientes obligatorios:** fondo negro/medianoche con degradado, **3D** (botella), **parallax**, **transiciones**, **carrusel**, **responsive impecable**.
- **Fotos:** **fotografía real royalty-free** (Pexels/Pixabay), descargada a `public/products/`. NO Unsplash, NO iconos. Servidas en local.
- **Código:** seguro y sin fallos. Mantener funcionalidad e-commerce existente funcionando.

## 3. Sistema de diseño (tokens) — reemplaza el ámbar/oro

| Token | Valor | Uso |
|---|---|---|
| `--ink` | `#05070c` | Fondo más profundo |
| `--night` | `#0a0e17` | Fondo base |
| `--surface` | `#11151f` | Tarjetas/superficies |
| `--surface-2` | `#161d2e` | Superficie elevada |
| `--steel` | `#3a4a6b` | Acento medio |
| `--silver` | `#9aa4b4` | Acento claro / texto secundario |
| `--ice` | `#eef1f5` | Texto principal / luz |
| `--ice-dim` | `rgba(238,241,245,.6)` | Texto atenuado |
| `--glow` | `rgba(110,130,170,.35)` | Halo de luz frío |
| chrome gradient | `linear-gradient(135deg,#fff,#aeb9cc 45%,#5e6b85)` | Texto/acentos cromados |

- **Contraste:** todo el texto cuerpo ≥ AA. Eliminar los eyebrows de 8px → mínimo 10–11px con tracking.
- **Tipografía:** wordmark `Italiana`/`Cormorant`; titulares `Cormorant Garamond` (serif elegante); cuerpo/UI `Inter`. (Ya cargadas vía next/font o Google Fonts.)
- **Textura:** capa de partículas/puntos sutiles (no grano amarronado).

## 4. Componentes / arquitectura (unidades con un propósito claro)

1. **`globals.css`** — sustituir tokens, utilidades (`.chrome-text`, glass nav, glow), base responsive.
2. **Navbar** (`components/ui/Navbar`) — glassmorphism con blur, transparente sobre el hero, se solidifica al hacer scroll; menú hamburguesa en móvil; contador de carrito.
3. **HeroClient + 3D** (`HeroClient`, `components/3d/AzaharaHero`) — full-height, degradado medianoche radial, capa de puntos con **parallax** (ratón + scroll), botella 3D **centrada** con material cromo/cristal (env map, metalness), halo `--glow`, reflejo; titular serif grande con palabra en degradado cromo; CTA primario (chrome) + enlace fantasma; scroll cue. **Fallback** estático en móvil / `prefers-reduced-motion`.
4. **Carousel** (`components/ui/ProductCarousel`) — `embla-carousel-react`; tarjeta central escalada; flechas prev/next; **drag/swipe** en móvil; transiciones suaves; cada tarjeta: foto real, nombre, notas, precio, enlace a producto.
5. **ProductCard / Collection / Product page / CartDrawer / Footer / Admin** — re-estilizar a la paleta + responsive; mantener su lógica.
6. **Transiciones** — `framer-motion` para reveals de sección y micro-interacciones; respetar `prefers-reduced-motion`.

## 5. Datos / imágenes

- Agente en segundo plano descarga ~8–10 fotos reales royalty-free a `public/products/` + 1–2 atmosféricas para hero/secciones; devuelve manifiesto (archivo → fuente → licencia).
- Verificación visual de cada foto (Read de imagen); reemplazar las que no encajen con el tema oscuro/lujo.
- `prisma/seed.ts`: cambiar URLs de Unsplash por rutas locales `/products/xxx.jpg`.
- `next.config`: eliminar dominios remotos de imágenes innecesarios (todo local) → elimina los 404 de upstream.

## 6. Bugs a corregir / calidad

- **Hecho:** serialización de `Decimal` Prisma → cliente (`lib/serialize.ts`); formularios newsletter/footer movidos a Client Component (`NewsletterForm`).
- **Pendiente:** bucle de redirección 307 en `/admin/login` — corregir el `matcher` del middleware (sintaxis path-to-regexp correcta para excluir la página de login) y verificar.
- **Mantener funcionando:** catálogo, página de producto, carrito (CartContext), checkout Stripe + webhook idempotente/anti-replay, panel admin CRUD + NextAuth + rate limiting.

## 7. Seguridad ("código seguro")

- Conservar CSP, rate limiting (login/admin), validación Zod, webhook anti-replay, stock sin oversell.
- Sin secretos en el repo (`.env*` gitignorado).
- **Agente Security Engineer + Code Reviewer** auditan el resultado final (OWASP + bugs) antes de cerrar.

## 8. Verificación (evidencia antes de declarar "hecho")

1. `npx tsc --noEmit` → exit 0.
2. `npm run build` → sin errores.
3. Golden path en navegador (capturas/HTTP 200): home (hero 3D + carrusel), colección, producto, añadir al carrito, ir a checkout (redirect Stripe), `/admin/login` (200, sin bucle) + login + CRUD.
4. Responsive: comprobado en ~375px (móvil), ~768px (tablet), ~1280px (desktop).
5. Auditoría de seguridad/bugs por agentes sin hallazgos críticos abiertos.

## 9. Fuera de alcance (YAGNI)

- Pasarela de pago real en producción (sigue en modo test de Stripe).
- i18n / multidioma.
- Funcionalidad de newsletter real (el form queda como UI, sin backend de envío) salvo que el cliente lo pida.
