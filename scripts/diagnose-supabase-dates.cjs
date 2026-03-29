#!/usr/bin/env node

/**
 * 🔍 DIAGNÓSTICO: Fechas en Supabase
 * Verifica cómo están almacenadas las fechas en la base de datos
 */

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

console.log('🔍 DIAGNÓSTICO: Fechas en Supabase');
console.log('==================================\n');

console.log('📋 CONFIGURACIÓN:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✅ Configurada' : '❌ No configurada');

if (!supabaseKey || supabaseKey === 'your-anon-key') {
  console.log('\n❌ ERROR: Configura las variables de entorno de Supabase');
  console.log('VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseDates() {
  try {
    console.log('\n🔍 CONSULTANDO TABLA PURCHASES...');
    
    // Obtener todas las compras con sus fechas
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('id, configuration_name, purchase_date, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.log('❌ Error consultando purchases:', error.message);
      return;
    }

    console.log(`✅ Encontradas ${purchases.length} compras\n`);

    if (purchases.length === 0) {
      console.log('📝 No hay compras en la base de datos');
      console.log('💡 Crea algunas compras para ver las fechas');
      return;
    }

    console.log('📅 ANÁLISIS DE FECHAS:');
    console.log('======================');

    purchases.forEach((purchase, index) => {
      console.log(`\n🔍 Compra ${index + 1}: ${purchase.configuration_name}`);
      console.log(`   ID: ${purchase.id}`);
      
      // Analizar purchase_date
      if (purchase.purchase_date) {
        const purchaseDate = new Date(purchase.purchase_date);
        console.log(`   📅 purchase_date: ${purchase.purchase_date}`);
        console.log(`      Formateado: ${purchaseDate.toLocaleDateString('es-ES')}`);
        console.log(`      ISO: ${purchaseDate.toISOString()}`);
      } else {
        console.log(`   📅 purchase_date: ❌ NULL`);
      }

      // Analizar created_at
      if (purchase.created_at) {
        const createdAt = new Date(purchase.created_at);
        console.log(`   🕐 created_at: ${purchase.created_at}`);
        console.log(`      Formateado: ${createdAt.toLocaleDateString('es-ES')}`);
        console.log(`      ISO: ${createdAt.toISOString()}`);
      } else {
        console.log(`   🕐 created_at: ❌ NULL`);
      }

      // Analizar updated_at
      if (purchase.updated_at) {
        const updatedAt = new Date(purchase.updated_at);
        console.log(`   🔄 updated_at: ${purchase.updated_at}`);
        console.log(`      Formateado: ${updatedAt.toLocaleDateString('es-ES')}`);
        console.log(`      ISO: ${updatedAt.toISOString()}`);
      } else {
        console.log(`   🔄 updated_at: ❌ NULL`);
      }

      // Verificar consistencia
      const purchaseDate = purchase.purchase_date ? new Date(purchase.purchase_date) : null;
      const createdAt = purchase.created_at ? new Date(purchase.created_at) : null;
      
      if (purchaseDate && createdAt) {
        const diffMs = Math.abs(purchaseDate - createdAt);
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        
        if (diffMinutes < 5) {
          console.log(`   ✅ Consistencia: purchase_date y created_at son similares (${diffMinutes} min)`);
        } else {
          console.log(`   ⚠️ Inconsistencia: purchase_date y created_at difieren (${diffMinutes} min)`);
        }
      }
    });

    // Análisis general
    console.log('\n📊 ANÁLISIS GENERAL:');
    console.log('===================');

    const nullPurchaseDates = purchases.filter(p => !p.purchase_date).length;
    const nullCreatedAt = purchases.filter(p => !p.created_at).length;
    const nullUpdatedAt = purchases.filter(p => !p.updated_at).length;

    console.log(`📅 purchase_date NULL: ${nullPurchaseDates}/${purchases.length}`);
    console.log(`🕐 created_at NULL: ${nullCreatedAt}/${purchases.length}`);
    console.log(`🔄 updated_at NULL: ${nullUpdatedAt}/${purchases.length}`);

    // Verificar formato de fechas
    console.log('\n🔍 VERIFICACIÓN DE FORMATOS:');
    console.log('============================');

    const samplePurchase = purchases[0];
    if (samplePurchase) {
      console.log('Muestra de formato de fecha:');
      
      if (samplePurchase.purchase_date) {
        const date = new Date(samplePurchase.purchase_date);
        console.log(`   purchase_date original: ${samplePurchase.purchase_date}`);
        console.log(`   purchase_date parseado: ${date.toISOString()}`);
        console.log(`   purchase_date local: ${date.toLocaleDateString('es-ES')}`);
        console.log(`   purchase_date UTC: ${date.toUTCString()}`);
      }
    }

    // Recomendaciones
    console.log('\n💡 RECOMENDACIONES:');
    console.log('==================');

    if (nullPurchaseDates > 0) {
      console.log('❌ Algunas compras no tienen purchase_date');
      console.log('   → Considerar usar created_at como fallback');
    }

    if (nullCreatedAt > 0) {
      console.log('❌ Algunas compras no tienen created_at');
      console.log('   → Verificar triggers de Supabase');
    }

    console.log('✅ Usar fallback: purchase_date || created_at');
    console.log('✅ Formato español: toLocaleDateString("es-ES")');
    console.log('✅ Verificar timezone: UTC vs local');

  } catch (error) {
    console.log('❌ Error en diagnóstico:', error.message);
  }
}

// Ejecutar diagnóstico
diagnoseDates().then(() => {
  console.log('\n✅ Diagnóstico completado');
  process.exit(0);
}).catch(error => {
  console.log('❌ Error fatal:', error.message);
  process.exit(1);
}); 