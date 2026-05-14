# Curso de Probabilidad desde Cero — Next.js

Mini web en **Next.js + Tailwind CSS** basada en el material generado a partir de la playlist pública **Statistics 110: Probability**.

## Qué incluye

- Landing visual del curso.
- Buscador de clases.
- Filtros por bloque temático.
- Cards de clases.
- Página de detalle por clase.
- Fórmulas, conceptos clave, errores típicos y ejercicios desplegables.
- Progreso local con `localStorage`.
- Configuración `output: "export"` para poder generar una web estática.

## Instalación

```bash
npm install
npm run dev
```

Abre:

```bash
http://localhost:3000
```

## Generar versión estática para subir a hosting

```bash
npm run build
```

Next generará la carpeta:

```bash
out/
```

Puedes subir esa carpeta a Netlify, Vercel, Cloudflare Pages, S3, FTP o cualquier hosting estático.

## Estructura principal

```txt
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── clase/[slug]/page.tsx
├── components/
│   ├── CourseExplorer.tsx
│   ├── CourseBadge.tsx
│   ├── Icon.tsx
│   └── SectionTitle.tsx
├── data/
│   └── lectures.json
└── lib/
    └── course.ts
```

## Personalización rápida

- Cambia el contenido en `src/data/lectures.json`.
- Cambia colores globales en `src/app/globals.css`.
- Cambia la home en `src/app/page.tsx`.
- Cambia la ficha de cada clase en `src/app/clase/[slug]/page.tsx`.
