const fs = require('fs');
const path = require('path');

console.log('🔧 Configuración de Variables de Entorno');
console.log('==========================================\n');

// Verificar si .env existe
const envPath = path.join(process.cwd(), '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ Archivo .env encontrado');
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📋 Variables configuradas:');
  
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key] = line.split('=');
      if (key) {
        console.log(`   - ${key}`);
      }
    }
  });
} else {
  console.log('❌ Archivo .env no encontrado');
  console.log('📝 Creando archivo .env con valores temporales...\n');
  
  const envContent = `# Stripe Configuration (Temporal - Reemplazar con valores reales)
STRIPE_SECRET_KEY=sk_test_placeholder_key_here
STRIPE_WEBHOOK_SECRET=whsec_placeholder_webhook_secret_here
STRIPE_SUCCESS_URL=http://localhost:5177?success=true
STRIPE_CANCEL_URL=http://localhost:5177?canceled=true
STRIPE_SERVER_PORT=3001

# Supabase Configuration (Temporal - Reemplazar con valores reales)
VITE_SUPABASE_URL=https://placeholder-project.supabase.co
VITE_SUPABASE_ANON_KEY=placeholder_anon_key_here
SUPABASE_SERVICE_KEY=placeholder_service_key_here

# Frontend Stripe (Temporal - Reemplazar con valores reales)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder_publishable_key_here

# OpenAI (Opcional)
VITE_OPENAI_API_KEY=

# Email Configuration
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env creado con valores temporales');
}

console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Edita el archivo .env con tus valores reales');
console.log('2. Configura Supabase: npm run verify-supabase');
console.log('3. Configura Stripe: sigue las instrucciones en env.example');
console.log('4. Prueba el sistema: npm run dev');

console.log('\n🔗 ENLACES ÚTILES:');
console.log('- Supabase: https://supabase.com');
console.log('- Stripe: https://stripe.com');
console.log('- Documentación: docs/ENVIRONMENT_SETUP.md'); 