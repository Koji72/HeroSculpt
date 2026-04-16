# Superhero 3D Customizer

Frontend de personalizacion 3D de superheroes construido con React, Vite, TypeScript y Three.js.

## Estado actual

- `npm run build` funciona.
- `npm run test:run` pasa en verde.
- El frontend ya no expone claves de OpenAI, Resend o secretos de Stripe.
- Los servicios de pago, email e IA deben resolverse desde backend.

## Ejecutar en local

1. Instala dependencias:

```bash
npm install
```

2. Configura variables de entorno:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_BACKEND_URL=http://localhost:3001
```

3. Verifica la configuracion minima:

```bash
npm run verify-supabase
```

4. Arranca desarrollo:

```bash
npm run dev
```

La app intenta usar el puerto `5177`. Si ya esta ocupado, Vite subira al siguiente disponible.

## Scripts utiles

```bash
npm run dev
npm run build
npm run preview
npm run test:run
npm run test:coverage
```

## Arquitectura

- [App.tsx](/C:/Users/david/HeroSculpt-test/App.tsx): shell principal de la app.
- [components/CharacterViewer.tsx](/C:/Users/david/HeroSculpt-test/components/CharacterViewer.tsx): visor 3D y exportacion.
- [components/ShoppingCart.tsx](/C:/Users/david/HeroSculpt-test/components/ShoppingCart.tsx): flujo de carrito.
- [services/stripeService.ts](/C:/Users/david/HeroSculpt-test/services/stripeService.ts): checkout delegado a backend.
- [services/resendEmailService.ts](/C:/Users/david/HeroSculpt-test/services/resendEmailService.ts): envio de email delegado a backend con fallback local.
- [lib/supabase.ts](/C:/Users/david/HeroSculpt-test/lib/supabase.ts): cliente de Supabase para frontend.

## Notas

- `VITE_*` solo debe contener valores publicos aptos para navegador.
- Las claves privadas como `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY` o secretos de Stripe deben quedarse en backend.
- El repositorio aun contiene material legacy y archivos de prototipo que no forman parte del flujo validado.
