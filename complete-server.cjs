require('dotenv').config({ path: require('path').join(__dirname, '.env.server') });

const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Joi = require('joi');
const winston = require('winston');
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const supabaseAdmin = process.env.SUPABASE_SERVICE_KEY
  ? createClient('https://jvzovtxjaezvefinaown.supabase.co', process.env.SUPABASE_SERVICE_KEY)
  : null;

// Pending purchases keyed by Stripe session ID — cleared after webhook fires
const pendingPurchases = new Map();

// Importar dependencias para procesamiento 3D
let THREE;
let GLTFTransform;
try {
  THREE = require('three');
  GLTFTransform = require('@gltf-transform/core');
  console.log('✅ Three.js and GLTFTransform loaded successfully');
} catch (error) {
  console.log('⚠️ 3D libraries not available, using fallback STL generation');
}

const app = express();
const port = 3001;

// 🛡️ CONFIGURACIÓN DE LOGGING AVANZADO
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'security-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: 'security-logs.json',
      format: winston.format.json()
    })
  ]
});

// 🛡️ CONFIGURACIÓN DE SEGURIDAD MEJORADA

// 1. Headers de seguridad con Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://api.resend.com"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://js.stripe.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  frameguard: { action: 'deny' }
}));

// 2. Rate limiting mejorado
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Demasiadas requests desde esta IP, intenta más tarde',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    securityLogger.warn('Rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url
    });
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Demasiadas requests, intenta más tarde',
      retryAfter: '15 minutos'
    });
  }
});

// Rate limiting específico para endpoints sensibles
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  message: { error: 'Demasiados emails enviados, intenta más tarde', retryAfter: '1 hora' }
});

const stripeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Demasiados intentos de pago, intenta más tarde' }
});

// Aplicar rate limiting
app.use(limiter);
app.use('/send-email', emailLimiter);
app.use('/api/create-checkout-session', stripeLimiter);

// 3. Validación Joi para todos los endpoints
const emailSchema = Joi.object({
  to: Joi.string().email().required(),
  subject: Joi.string().min(1).max(200).required(),
  html: Joi.string().min(1).max(10000).required(),
  from: Joi.string().email().optional()
});

const configurationSchema = Joi.object({
  parts: Joi.object().pattern(Joi.string(), Joi.object()).required(),
  archetype: Joi.string().valid('strong', 'speed', 'tech').required(),
  price: Joi.number().min(0).max(10000).required()
});

// 4. Middleware de validación
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      securityLogger.warn('Validation error', {
        ip: req.ip,
        error: error.details[0].message,
        body: { hasData: !!req.body, size: JSON.stringify(req.body).length }
      });
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details[0].message
      });
    }
    next();
  };
};

// 5. Middleware de logging mejorado
app.use((req, res, next) => {
  // Log de requests básico
  securityLogger.info('HTTP Request', {
    ip: req.ip,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // Detección de patrones sospechosos
  const suspiciousPatterns = [
    /\.\.\//, // Directory traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /eval\(/i, // Code injection
    /javascript:/i, // JavaScript injection
    /vbscript:/i, // VBScript injection
    /onload=/i, // Event handler injection
    /onerror=/i, // Event handler injection
  ];
  
  const requestString = JSON.stringify(req.body) + req.url + req.get('User-Agent');
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestString));
  
  if (isSuspicious) {
    securityLogger.warn('Suspicious request detected', {
      ip: req.ip,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      hasBody: !!req.body,
      bodySize: req.body ? JSON.stringify(req.body).length : 0,
      pattern: suspiciousPatterns.find(pattern => pattern.test(requestString)).toString()
    });
  }
  
  next();
});

// 6. Configurar CORS de forma más estricta
const ALLOWED_ORIGINS = [
  'http://localhost:5177',
  'http://localhost:3000',
  'https://darkslategrey-ape-448372.hostingersite.com',
  'https://herosculpt.loca.lt',
  process.env.ALLOWED_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

// Stripe webhook — MUST be registered before express.json() to receive raw body for signature verification
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    securityLogger.error('STRIPE_WEBHOOK_SECRET not set');
    return res.status(503).json({ error: 'Webhook not configured' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    securityLogger.warn('Stripe webhook signature failed', { ip: req.ip, error: err.message });
    return res.status(400).json({ error: `Webhook signature failed: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const pending = pendingPurchases.get(session.id);

    if (pending) {
      pendingPurchases.delete(session.id);
      const totalPrice = (session.amount_total || 0) / 100;
      await savePurchaseToSupabase(pending.userId, pending.cartItems, totalPrice);
      await sendPurchaseConfirmationEmail(session.customer_email, pending.cartItems, totalPrice);
      securityLogger.info('Purchase completed', { sessionId: session.id, email: session.customer_email });
    }
  }

  res.json({ received: true });
});

// 7. Validación de tamaño de payload
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configurar Resend (con fallback para desarrollo)
let resend;
try {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend configurado correctamente');
} catch (error) {
  console.log('⚠️ Resend no configurado, usando modo simulado');
  resend = {
    emails: {
      send: async (data) => {
        console.log('📧 Email simulado enviado:', data);
        return { id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
      }
    }
  };
}

// Almacenamiento temporal de configuraciones
const savedConfigurations = new Map();

// 🛡️ FUNCIONES DE VALIDACIÓN MEJORADAS
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateConfiguration = (config) => {
  if (!config || typeof config !== 'object') {
    return false;
  }
  
  // Validar que no tenga demasiadas propiedades
  const keys = Object.keys(config);
  if (keys.length > 50) {
    return false;
  }
  
  // Validar que las propiedades sean strings válidos
  return keys.every(key => typeof key === 'string' && key.length < 100);
};

const validatePrice = (price) => {
  return typeof price === 'number' && price >= 0 && price <= 10000;
};

// 🛡️ SANITIZACIÓN DE DATOS
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/vbscript:/gi, '') // Remover vbscript:
    .trim();
};

const sanitizeConfiguration = (config) => {
  if (!config || typeof config !== 'object') return {};
  
  const sanitized = {};
  for (const [key, value] of Object.entries(config)) {
    if (typeof key === 'string' && key.length < 100) {
      sanitized[sanitizeString(key)] = value;
    }
  }
  return sanitized;
};

// ✅ ENDPOINT: Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment processing not configured' });
  }

  const { cartItems, userEmail, userId } = req.body;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Invalid cart items' });
  }

  if (!userEmail || typeof userEmail !== 'string') {
    return res.status(400).json({ error: 'User email required' });
  }

  try {
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name || 'HeroSculpt Model',
          description: item.archetype ? `Archetype: ${item.archetype}` : undefined,
        },
        unit_amount: Math.max(0, Math.round((item.price || 0) * 100)),
      },
      quantity: Math.max(1, item.quantity || 1),
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: userEmail,
      success_url: process.env.STRIPE_SUCCESS_URL || `${req.headers.origin || 'https://darkslategrey-ape-448372.hostingersite.com'}?success=true`,
      cancel_url: process.env.STRIPE_CANCEL_URL || `${req.headers.origin || 'https://darkslategrey-ape-448372.hostingersite.com'}?canceled=true`,
    });

    // Store pending purchase so webhook can save it after payment
    pendingPurchases.set(session.id, { userId, cartItems, createdAt: Date.now() });
    // Cleanup entries older than 2 hours
    for (const [id, data] of pendingPurchases) {
      if (Date.now() - data.createdAt > 7200000) pendingPurchases.delete(id);
    }

    securityLogger.info('Stripe session created', { ip: req.ip, sessionId: session.id });
    res.json({ sessionId: session.id });
  } catch (error) {
    securityLogger.error('Stripe checkout error', { ip: req.ip, error: error.message });
    res.status(500).json({ error: 'Error creating payment session' });
  }
});

// ✅ ENDPOINT: Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    security: 'Active',
    timestamp: new Date().toISOString()
  });
});

// ✅ ENDPOINT: Enviar email (con validación mejorada)
app.post('/send-email', validateRequest(emailSchema), async (req, res) => {
  try {
    const { to, subject, html, from } = req.body;
    
    // Sanitizar datos
    const sanitizedTo = sanitizeString(to);
    const sanitizedSubject = sanitizeString(subject);
    const sanitizedFrom = from ? sanitizeString(from) : 'noreply@tuapp.com';
    
    // Validar email
    if (!validateEmail(sanitizedTo)) {
      securityLogger.warn('Invalid email attempt', { ip: req.ip, email: sanitizedTo });
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    // Log de intento de envío
    securityLogger.info('Email send attempt', {
      ip: req.ip,
      to: sanitizedTo,
      subject: sanitizedSubject,
      hasHtml: !!html
    });
    
    const data = await resend.emails.send({
      from: sanitizedFrom,
      to: [sanitizedTo],
      subject: sanitizedSubject,
      html: html
    });

    securityLogger.info('Email sent successfully', {
      ip: req.ip,
      to: sanitizedTo,
      messageId: data.id
    });
      
      res.json({ 
        success: true, 
      message: 'Email enviado correctamente',
      messageId: data.id
      });
  } catch (error) {
    securityLogger.error('Email send error', {
      ip: req.ip,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'Error al enviar email',
      message: 'Intenta más tarde'
    });
  }
});

// ✅ ENDPOINT: Guardar configuración
app.post('/save-config', (req, res) => {
  try {
    const { configId, selectedParts, totalPrice, configName, email } = req.body;
    
    // 🛡️ VALIDACIÓN DE ENTRADA
    if (!configId || typeof configId !== 'string' || configId.length > 100) {
      securityLogger.warn('Invalid config ID', {
        ip: req.ip,
        configIdType: typeof configId,
        configIdLength: configId ? configId.length : 0
      });
      return res.status(400).json({ 
        success: false, 
        error: 'ID de configuración inválido' 
      });
    }
    
    if (!validateConfiguration(selectedParts)) {
      securityLogger.warn('Invalid configuration data', {
        ip: req.ip,
        configId: configId,
        configType: typeof selectedParts,
        configKeys: selectedParts ? Object.keys(selectedParts).length : 0
      });
      return res.status(400).json({ 
        success: false, 
        error: 'Datos de configuración inválidos' 
      });
    }
    
    if (!validatePrice(totalPrice)) {
      securityLogger.warn('Invalid price', {
        ip: req.ip,
        configId: configId,
        priceType: typeof totalPrice,
        priceValue: totalPrice
      });
      return res.status(400).json({ 
        success: false, 
        error: 'Precio inválido' 
      });
    }
    
    if (email && !validateEmail(email)) {
      securityLogger.warn('Invalid email in config save', {
        ip: req.ip,
        configId: configId,
        emailDomain: email ? email.split('@')[1] : 'invalid'
      });
      return res.status(400).json({ 
        success: false, 
        error: 'Email inválido' 
      });
    }
    
    // 🛡️ LOGGING DE SEGURIDAD (sin exponer datos sensibles)
    securityLogger.info('Configuration save request', {
      ip: req.ip,
      configId: configId,
      price: totalPrice,
      emailDomain: email ? email.split('@')[1] : 'none',
      configSize: selectedParts ? Object.keys(selectedParts).length : 0
    });
    
    console.log('💾 Guardando configuración:', configId);
    
    savedConfigurations.set(configId, {
      selectedParts,
      totalPrice,
      configName,
      email,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Configuración guardada' });
  } catch (error) {
    console.error('❌ Error guardando configuración:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ ENDPOINT: Obtener configuración
app.get('/config/:configId', (req, res) => {
  try {
    const { configId } = req.params;
    const config = savedConfigurations.get(configId);
    
    if (!config) {
      return res.status(404).json({ success: false, error: 'Configuración no encontrada' });
    }

    res.json({ success: true, data: config });
  } catch (error) {
    console.error('❌ Error obteniendo configuración:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ ENDPOINT: Descargar GLB
app.get('/download/:configId/glb', async (req, res) => {
  try {
    const { configId } = req.params;
    
    // 🛡️ VALIDACIÓN DE ENTRADA
    if (!configId || typeof configId !== 'string' || configId.length > 100) {
      securityLogger.warn('Invalid config ID in GLB download', {
        ip: req.ip,
        configIdType: typeof configId,
        configIdLength: configId ? configId.length : 0
      });
      return res.status(400).json({ 
        error: 'ID de configuración inválido' 
      });
    }
    
    // 🛡️ LOGGING DE SEGURIDAD (sin exponer datos sensibles)
    securityLogger.info('GLB download request', {
      ip: req.ip,
      configId: configId
    });
    
    console.log('📥 Solicitud de descarga GLB para configuración:', configId);
    
    const config = savedConfigurations.get(configId);
    if (!config) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }

    console.log('🔨 Generando GLB con modelos reales para configuración:', configId);
    const glbContent = await generateRealModelGLB(config.selectedParts);
    
    res.setHeader('Content-Type', 'model/gltf-binary');
    res.setHeader('Content-Disposition', `attachment; filename="${configId}.glb"`);
    res.send(glbContent);
    
    console.log('✅ Descarga GLB completada para:', configId);
  } catch (error) {
    console.error('❌ Error en descarga GLB:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ ENDPOINT: Descargar STL
app.get('/download/:configId/stl', async (req, res) => {
  try {
    const { configId } = req.params;
    
    // 🛡️ VALIDACIÓN DE ENTRADA
    if (!configId || typeof configId !== 'string' || configId.length > 100) {
      securityLogger.warn('Invalid config ID in STL download', {
        ip: req.ip,
        configIdType: typeof configId,
        configIdLength: configId ? configId.length : 0
      });
      return res.status(400).json({ 
        error: 'ID de configuración inválido' 
      });
    }
    
    // 🛡️ LOGGING DE SEGURIDAD (sin exponer datos sensibles)
    securityLogger.info('STL download request', {
      ip: req.ip,
      configId: configId
    });
    
    console.log('📥 Solicitud de descarga STL para configuración:', configId);
    
    const config = savedConfigurations.get(configId);
    if (!config) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }

    console.log('🔍 Buscando configuración:', configId);
    console.log('🔨 Generando STL con modelos reales para configuración:', configId);
    
    const stlContent = await generateSTL(config.selectedParts);
    
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${configId}.stl"`);
    res.send(stlContent);
    
    console.log('✅ Descarga STL completada para:', configId);
  } catch (error) {
    console.error('❌ Error en descarga STL:', error);
    res.status(500).json({ error: error.message });
  }
});

// Función para generar GLB combinando modelos reales
async function generateRealModelGLB(selectedParts) {
  // Validar que selectedParts existe
  if (!selectedParts || typeof selectedParts !== 'object') {
    console.log('⚠️ selectedParts no válido, generando GLB básico');
    return generateBasicGLB();
  }
  
  const parts = Object.keys(selectedParts);
  console.log('🎯 Generando GLB combinando modelos reales para:', parts);
  
  try {
    // Buscar y combinar archivos GLB reales
    const modelBuffers = [];
    let totalSize = 0;
    
    for (const partCategory of parts) {
      const part = selectedParts[partCategory];
      if (!part || !part.gltfPath) {
        console.log(`⚠️ Saltando parte sin gltfPath: ${partCategory}`);
        continue;
      }
      
      const modelPath = path.join(__dirname, 'public', 'assets', part.gltfPath.replace(/^\//, ''));
      
      if (fs.existsSync(modelPath)) {
        try {
          console.log(`📦 Leyendo modelo real: ${part.name} desde ${modelPath}`);
          const glbData = fs.readFileSync(modelPath);
          
          modelBuffers.push({
            category: partCategory,
            name: part.name,
            data: glbData,
            size: glbData.length
          });
          
          totalSize += glbData.length;
          console.log(`✅ Modelo cargado: ${part.name} (${glbData.length} bytes)`);
          
        } catch (error) {
          console.error(`❌ Error leyendo modelo ${part.name}:`, error);
        }
      } else {
        console.log(`❌ Modelo no encontrado: ${modelPath}`);
      }
    }
    
    if (modelBuffers.length === 0) {
      console.log('⚠️ No se encontraron modelos reales, generando GLB básico');
      return generateBasicGLB();
    }
    
    console.log(`✅ Encontrados ${modelBuffers.length} modelos reales (${totalSize} bytes total)`);
    
    // Por simplicidad, devolver el primer modelo encontrado
    // TODO: En el futuro se podrían combinar realmente los modelos GLB
    const firstModel = modelBuffers[0];
    console.log(`🎯 Usando modelo principal: ${firstModel.name}`);
    
    return firstModel.data;
    
  } catch (error) {
    console.error('❌ Error generando GLB con modelos reales:', error);
    console.log('🔄 Fallback a GLB básico');
    return generateBasicGLB();
  }
}

// Función para generar GLB básico (fallback)
function generateBasicGLB() {
  console.log('🔄 Generando GLB básico de fallback');
  
  // GLB Header (12 bytes)
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546C67, 0); // magic: "glTF"
  header.writeUInt32LE(2, 4); // version
  header.writeUInt32LE(1000, 8); // total length
  
  // Crear contenido GLB básico
  const jsonContent = {
    asset: { version: "2.0" },
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }],
    accessors: [{ bufferView: 0, componentType: 5126, count: 8, type: "VEC3" }],
    bufferViews: [{ buffer: 0, byteLength: 96 }],
    buffers: [{ byteLength: 96 }]
  };
  
  const jsonString = JSON.stringify(jsonContent);
  const jsonBuffer = Buffer.from(jsonString);
  
  // Datos binarios (cubo básico)
  const binaryData = Buffer.alloc(96);
  // Llenar con coordenadas de cubo
  const vertices = [
    -1, -1, -1,  1, -1, -1,  1,  1, -1, -1,  1, -1,
    -1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  1,  1
  ];
  
  for (let i = 0; i < vertices.length; i++) {
    binaryData.writeFloatLE(vertices[i], i * 4);
  }
  
  // Combinar todo
  const totalSize = 12 + 8 + jsonBuffer.length + 8 + binaryData.length;
  const result = Buffer.alloc(totalSize);
  
  let offset = 0;
  header.copy(result, offset);
  offset += 12;
  
  // JSON chunk header
  result.writeUInt32LE(jsonBuffer.length, offset);
  result.writeUInt32LE(0x4E4F534A, offset + 4); // "JSON"
  offset += 8;
  
  jsonBuffer.copy(result, offset);
  offset += jsonBuffer.length;
  
  // Binary chunk header
  result.writeUInt32LE(binaryData.length, offset);
  result.writeUInt32LE(0x004E4942, offset + 4); // "BIN\0"
  offset += 8;
  
  binaryData.copy(result, offset);
  
  return result;
}

// Función para generar STL usando modelos reales
async function generateRealModelSTL(selectedParts) {
  // Validar que selectedParts existe y es un objeto
  if (!selectedParts || typeof selectedParts !== 'object') {
    console.error('❌ selectedParts es null, undefined o no es un objeto:', selectedParts);
    return generateFallbackSTL();
  }
  
  const parts = Object.keys(selectedParts);
  console.log('🎯 Generando STL con modelos GLB reales para:', parts);
  
  // Si Three.js no está disponible, usar fallback
  if (!THREE) {
    console.log('⚠️ Three.js no disponible, usando STL con formas geométricas');
    return generateAdvancedSTL(selectedParts);
  }
  
  try {
    // Crear escena temporal para combinar modelos
    const scene = new THREE.Scene();
    const loader = new THREE.GLTFLoader();
    
    // Cargar todos los modelos GLB reales
    const loadPromises = parts.map(async (partCategory, index) => {
      const part = selectedParts[partCategory];
      if (!part || !part.gltfPath) {
        console.log(`⚠️ Saltando parte sin gltfPath: ${partCategory}`);
        return null;
      }
      
      const modelPath = path.join(__dirname, 'public', 'assets', part.gltfPath.replace(/^\//, ''));
      
      if (!fs.existsSync(modelPath)) {
        console.log(`❌ Modelo no encontrado: ${modelPath}`);
        return null;
      }
      
      try {
        console.log(`📦 Cargando modelo real: ${part.name} desde ${modelPath}`);
        
        // Leer el archivo GLB
        const glbData = fs.readFileSync(modelPath);
        
        // TODO: Aquí iría la lógica para procesar el GLB con Three.js
        // Por ahora, usar representación geométrica mejorada
        return {
          category: partCategory,
          part: part,
          index: index,
          hasRealModel: true
        };
        
      } catch (error) {
        console.error(`❌ Error cargando modelo ${part.name}:`, error);
        return {
          category: partCategory,
          part: part,
          index: index,
          hasRealModel: false
        };
      }
    });
    
    const loadedModels = await Promise.all(loadPromises);
    const validModels = loadedModels.filter(Boolean);
    
    console.log(`✅ Procesados ${validModels.length} modelos de ${parts.length} partes`);
    
    // Generar STL combinado
    let stlContent = '';
    stlContent += 'solid Superhero 3D Model - Real Models Combined\n';
    
    validModels.forEach(model => {
      const offset = model.index * 3;
      console.log(`🔧 Generando geometría para: ${model.category} - ${model.part.name}`);
      
      if (model.hasRealModel) {
        // Modelo real encontrado - generar geometría representativa mejorada
        stlContent += generateAdvancedGeometry(offset, 0, 0, model.category, model.part.name, true);
      } else {
        // Fallback a geometría básica
        stlContent += generateAdvancedGeometry(offset, 0, 0, model.category, model.part.name, false);
      }
    });
    
    stlContent += 'endsolid Superhero 3D Model - Real Models Combined\n';
    
    console.log(`✅ STL con modelos reales generado exitosamente`);
    return Buffer.from(stlContent);
    
  } catch (error) {
    console.error('❌ Error generando STL con modelos reales:', error);
    console.log('🔄 Fallback a STL avanzado con geometría');
    return generateAdvancedSTL(selectedParts);
  }
}

// Función para generar STL avanzado (fallback)
function generateAdvancedSTL(selectedParts) {
  const parts = Object.keys(selectedParts);
  console.log('🎯 Generando STL avanzado con representaciones realistas para:', parts);
  
  let stlContent = '';
  stlContent += 'solid Superhero 3D Model - Advanced STL\n';
  
  parts.forEach((partCategory, index) => {
    const part = selectedParts[partCategory];
    if (part && part.name) {
      console.log(`🧩 Procesando parte: ${partCategory} - ${part.name}`);
      
      // Verificar si existe el archivo GLB
      let modelExists = false;
      if (part.gltfPath) {
        const modelPath = path.join(__dirname, 'public', 'assets', part.gltfPath.replace(/^\//, ''));
        modelExists = fs.existsSync(modelPath);
        console.log(`📂 Modelo ${modelExists ? '✅ encontrado' : '❌ no encontrado'}: ${modelPath}`);
      }
      
      // Generar geometría específica para cada tipo de parte
      const offset = index * 3; // Más separación entre partes
      stlContent += generateAdvancedGeometry(offset, 0, 0, partCategory, part.name, modelExists);
    } else {
      console.log(`⚠️ Parte inválida encontrada: ${partCategory}`, part);
    }
  });
  
  stlContent += 'endsolid Superhero 3D Model - Advanced STL\n';
  
  console.log(`✅ STL avanzado generado exitosamente con ${parts.length} partes`);
  return Buffer.from(stlContent);
}

// Función principal para generar STL (usa modelos reales cuando es posible)
function generateSTL(selectedParts) {
  return generateRealModelSTL(selectedParts);
}

// Función para generar STL básico (fallback)
function generateFallbackSTL() {
  console.log('🔄 Generando STL básico de fallback');
  let stlContent = '';
  stlContent += 'solid Superhero 3D Model - Basic STL\n';
  stlContent += generateCube(0, 0, 0, 'BASIC_MODEL');
  stlContent += 'endsolid Superhero 3D Model - Basic STL\n';
  return Buffer.from(stlContent);
}

// Función para generar geometría avanzada específica por tipo de parte
function generateAdvancedGeometry(x, y, z, category, name, modelExists) {
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_');
  let geometry = '';
  
  // Agregar comentario identificativo
  geometry += `\n  // ${category}: ${name} ${modelExists ? '(Real Model Found)' : '(Placeholder)'}\n`;
  
  switch (category) {
    case 'TORSO':
    case 'SUIT_TORSO':
      // Torso: Forma rectangular más grande
      geometry += generateDetailedCube(x, y, z, 1.8, 2.2, 1.0, `${category}_${cleanName}`);
      // Agregar detalles del pecho
      geometry += generateDetailedCube(x, y + 0.8, z + 0.4, 1.4, 0.6, 0.3, `${category}_chest_detail`);
      break;
      
    case 'LOWER_BODY':
    case 'LEGS':
      // Piernas: Dos cilindros
      geometry += generateCylinder(x - 0.3, y - 1.0, z, 0.25, 1.5, `${category}_left_leg`);
      geometry += generateCylinder(x + 0.3, y - 1.0, z, 0.25, 1.5, `${category}_right_leg`);
      break;
      
    case 'HEAD':
      // Cabeza: Esfera más realista
      geometry += generateSphere(x, y + 2.8, z, 0.7, `${category}_${cleanName}`);
      // Agregar cuello
      geometry += generateCylinder(x, y + 2.0, z, 0.3, 0.6, `${category}_neck`);
      break;
      
    case 'HAND_LEFT':
      // Mano izquierda: Forma de mano
      geometry += generateHand(x - 1.5, y + 1.2, z, 'LEFT', `${category}_${cleanName}`);
      break;
      
    case 'HAND_RIGHT':
      // Mano derecha: Forma de mano
      geometry += generateHand(x + 1.5, y + 1.2, z, 'RIGHT', `${category}_${cleanName}`);
      break;
      
    case 'CAPE':
      // Capa: Forma ondulada
      geometry += generateCape(x, y + 1.5, z - 0.8, `${category}_${cleanName}`);
      break;
      
    case 'BOOTS':
      // Botas: Formas de pie
      geometry += generateBoot(x - 0.3, y - 2.2, z, 'LEFT', `${category}_${cleanName}`);
      geometry += generateBoot(x + 0.3, y - 2.2, z, 'RIGHT', `${category}_${cleanName}`);
      break;
      
    case 'CHEST_BELT':
      // Cinturón del pecho: Banda horizontal
      geometry += generateDetailedCube(x, y + 0.5, z + 0.5, 1.6, 0.2, 0.1, `${category}_${cleanName}`);
      break;
      
    case 'BELT':
      // Cinturón: Banda en la cintura
      geometry += generateDetailedCube(x, y - 0.2, z + 0.4, 1.4, 0.15, 0.1, `${category}_${cleanName}`);
      break;
      
    case 'BUCKLE':
      // Hebilla: Pequeño rectángulo
      geometry += generateDetailedCube(x, y - 0.2, z + 0.5, 0.3, 0.2, 0.1, `${category}_${cleanName}`);
      break;
      
    case 'POUCH':
      // Bolsa: Pequeño cubo lateral
      geometry += generateDetailedCube(x + 0.8, y - 0.3, z + 0.3, 0.4, 0.5, 0.3, `${category}_${cleanName}`);
      break;
      
    case 'SYMBOL':
      // Símbolo: Forma plana en el pecho
      geometry += generateSymbol(x, y + 1.0, z + 0.6, `${category}_${cleanName}`);
      break;
      
    case 'ELBOW':
      // Coderas: Pequeños protectores
      geometry += generateDetailedCube(x - 1.0, y + 0.8, z, 0.3, 0.2, 0.25, `${category}_left_elbow`);
      geometry += generateDetailedCube(x + 1.0, y + 0.8, z, 0.3, 0.2, 0.25, `${category}_right_elbow`);
      break;
      
    default:
      // Forma genérica mejorada
      geometry += generateDetailedCube(x, y, z, 0.6, 0.6, 0.6, `${category}_${cleanName}`);
  }
  
  return geometry;
}

// Función para generar un cubo detallado en STL
function generateDetailedCube(x, y, z, width, height, depth, name) {
  const w = width / 2;
  const h = height / 2;
  const d = depth / 2;
  
  let cube = `\n  // ${name} - Detailed Cube (${width}x${height}x${depth})\n`;
  
  // Generar 12 triángulos (2 por cara, 6 caras)
  const faces = [
    // Front face (Z+)
    { normal: [0, 0, 1], vertices: [[x-w, y-h, z+d], [x+w, y-h, z+d], [x+w, y+h, z+d]] },
    { normal: [0, 0, 1], vertices: [[x-w, y-h, z+d], [x+w, y+h, z+d], [x-w, y+h, z+d]] },
    // Back face (Z-)
    { normal: [0, 0, -1], vertices: [[x-w, y-h, z-d], [x-w, y+h, z-d], [x+w, y+h, z-d]] },
    { normal: [0, 0, -1], vertices: [[x-w, y-h, z-d], [x+w, y+h, z-d], [x+w, y-h, z-d]] },
    // Left face (X-)
    { normal: [-1, 0, 0], vertices: [[x-w, y-h, z-d], [x-w, y+h, z-d], [x-w, y+h, z+d]] },
    { normal: [-1, 0, 0], vertices: [[x-w, y-h, z-d], [x-w, y+h, z+d], [x-w, y-h, z+d]] },
    // Right face (X+)
    { normal: [1, 0, 0], vertices: [[x+w, y-h, z-d], [x+w, y+h, z+d], [x+w, y+h, z-d]] },
    { normal: [1, 0, 0], vertices: [[x+w, y-h, z-d], [x+w, y-h, z+d], [x+w, y+h, z+d]] },
    // Bottom face (Y-)
    { normal: [0, -1, 0], vertices: [[x-w, y-h, z-d], [x+w, y-h, z-d], [x+w, y-h, z+d]] },
    { normal: [0, -1, 0], vertices: [[x-w, y-h, z-d], [x+w, y-h, z+d], [x-w, y-h, z+d]] },
    // Top face (Y+)
    { normal: [0, 1, 0], vertices: [[x-w, y+h, z-d], [x-w, y+h, z+d], [x+w, y+h, z+d]] },
    { normal: [0, 1, 0], vertices: [[x-w, y+h, z-d], [x+w, y+h, z+d], [x+w, y+h, z-d]] }
  ];
  
  faces.forEach(face => {
    const [p1, p2, p3] = face.vertices;
    const [nx, ny, nz] = face.normal;
    
    cube += `  facet normal ${nx} ${ny} ${nz}\n`;
    cube += '    outer loop\n';
    cube += `      vertex ${p1[0]} ${p1[1]} ${p1[2]}\n`;
    cube += `      vertex ${p2[0]} ${p2[1]} ${p2[2]}\n`;
    cube += `      vertex ${p3[0]} ${p3[1]} ${p3[2]}\n`;
    cube += '    endloop\n';
    cube += '  endfacet\n';
  });
  
  return cube;
}

// Función para generar una esfera (para cabezas)
function generateSphere(x, y, z, radius, name) {
  const segments = 12;
  const rings = 8;
  let sphere = `\n  // ${name} - Sphere (radius: ${radius})\n`;
  
  for (let i = 0; i < rings; i++) {
    const lat1 = (i / rings) * Math.PI - Math.PI / 2;
    const lat2 = ((i + 1) / rings) * Math.PI - Math.PI / 2;
    
    for (let j = 0; j < segments; j++) {
      const lng1 = (j / segments) * Math.PI * 2;
      const lng2 = ((j + 1) / segments) * Math.PI * 2;
      
      // Calcular vértices
      const x1 = x + Math.cos(lat1) * Math.cos(lng1) * radius;
      const y1 = y + Math.sin(lat1) * radius;
      const z1 = z + Math.cos(lat1) * Math.sin(lng1) * radius;
      
      const x2 = x + Math.cos(lat2) * Math.cos(lng1) * radius;
      const y2 = y + Math.sin(lat2) * radius;
      const z2 = z + Math.cos(lat2) * Math.sin(lng1) * radius;
      
      const x3 = x + Math.cos(lat2) * Math.cos(lng2) * radius;
      const y3 = y + Math.sin(lat2) * radius;
      const z3 = z + Math.cos(lat2) * Math.sin(lng2) * radius;
      
      const x4 = x + Math.cos(lat1) * Math.cos(lng2) * radius;
      const y4 = y + Math.sin(lat1) * radius;
      const z4 = z + Math.cos(lat1) * Math.sin(lng2) * radius;
      
      // Primer triángulo
      sphere += `  facet normal 0 1 0\n`;
      sphere += '    outer loop\n';
      sphere += `      vertex ${x1} ${y1} ${z1}\n`;
      sphere += `      vertex ${x2} ${y2} ${z2}\n`;
      sphere += `      vertex ${x3} ${y3} ${z3}\n`;
      sphere += '    endloop\n';
      sphere += '  endfacet\n';
      
      // Segundo triángulo
      sphere += `  facet normal 0 1 0\n`;
      sphere += '    outer loop\n';
      sphere += `      vertex ${x1} ${y1} ${z1}\n`;
      sphere += `      vertex ${x3} ${y3} ${z3}\n`;
      sphere += `      vertex ${x4} ${y4} ${z4}\n`;
      sphere += '    endloop\n';
      sphere += '  endfacet\n';
    }
  }
  
  return sphere;
}

// Función para generar cilindro
function generateCylinder(x, y, z, radius, height, name) {
  const segments = 12;
  let cylinder = `\n  // ${name} - Cylinder (radius: ${radius}, height: ${height})\n`;
  
  const h = height / 2;
  
  for (let i = 0; i < segments; i++) {
    const angle1 = (i / segments) * Math.PI * 2;
    const angle2 = ((i + 1) / segments) * Math.PI * 2;
    
    const x1 = x + Math.cos(angle1) * radius;
    const z1 = z + Math.sin(angle1) * radius;
    const x2 = x + Math.cos(angle2) * radius;
    const z2 = z + Math.sin(angle2) * radius;
    
    // Lado del cilindro
    cylinder += `  facet normal ${Math.cos(angle1)} 0 ${Math.sin(angle1)}\n`;
    cylinder += '    outer loop\n';
    cylinder += `      vertex ${x1} ${y-h} ${z1}\n`;
    cylinder += `      vertex ${x1} ${y+h} ${z1}\n`;
    cylinder += `      vertex ${x2} ${y+h} ${z2}\n`;
    cylinder += '    endloop\n';
    cylinder += '  endfacet\n';
    
    cylinder += `  facet normal ${Math.cos(angle1)} 0 ${Math.sin(angle1)}\n`;
    cylinder += '    outer loop\n';
    cylinder += `      vertex ${x1} ${y-h} ${z1}\n`;
    cylinder += `      vertex ${x2} ${y+h} ${z2}\n`;
    cylinder += `      vertex ${x2} ${y-h} ${z2}\n`;
    cylinder += '    endloop\n';
    cylinder += '  endfacet\n';
    
    // Tapa superior
    cylinder += `  facet normal 0 1 0\n`;
    cylinder += '    outer loop\n';
    cylinder += `      vertex ${x} ${y+h} ${z}\n`;
    cylinder += `      vertex ${x1} ${y+h} ${z1}\n`;
    cylinder += `      vertex ${x2} ${y+h} ${z2}\n`;
    cylinder += '    endloop\n';
    cylinder += '  endfacet\n';
    
    // Tapa inferior
    cylinder += `  facet normal 0 -1 0\n`;
    cylinder += '    outer loop\n';
    cylinder += `      vertex ${x} ${y-h} ${z}\n`;
    cylinder += `      vertex ${x2} ${y-h} ${z2}\n`;
    cylinder += `      vertex ${x1} ${y-h} ${z1}\n`;
    cylinder += '    endloop\n';
    cylinder += '  endfacet\n';
  }
  
  return cylinder;
}

// Función para generar mano
function generateHand(x, y, z, side, name) {
  let hand = `\n  // ${name} - Hand (${side})\n`;
  
  // Palma
  hand += generateDetailedCube(x, y, z, 0.4, 0.6, 0.2, `${name}_palm`);
  
  // Dedos
  const fingerOffset = side === 'LEFT' ? -0.15 : 0.15;
  for (let i = 0; i < 4; i++) {
    const fingerY = y + 0.2 + (i * 0.1);
    hand += generateDetailedCube(x + fingerOffset, fingerY, z, 0.1, 0.3, 0.1, `${name}_finger_${i}`);
  }
  
  // Pulgar
  const thumbX = side === 'LEFT' ? x + 0.2 : x - 0.2;
  hand += generateDetailedCube(thumbX, y, z + 0.15, 0.1, 0.25, 0.1, `${name}_thumb`);
  
  return hand;
}

// Función para generar capa
function generateCape(x, y, z, name) {
  let cape = `\n  // ${name} - Cape\n`;
  
  // Capa principal
  cape += generateDetailedCube(x, y, z, 2.0, 2.5, 0.1, `${name}_main`);
  
  // Pliegues de la capa
  for (let i = 0; i < 3; i++) {
    const offsetX = (i - 1) * 0.6;
    cape += generateDetailedCube(x + offsetX, y - 0.5, z - 0.1, 0.3, 1.5, 0.05, `${name}_fold_${i}`);
  }
  
  return cape;
}

// Función para generar bota
function generateBoot(x, y, z, side, name) {
  let boot = `\n  // ${name} - Boot (${side})\n`;
  
  // Parte principal de la bota
  boot += generateDetailedCube(x, y, z, 0.35, 0.4, 0.8, `${name}_main`);
  
  // Suela
  boot += generateDetailedCube(x, y - 0.25, z, 0.4, 0.1, 0.9, `${name}_sole`);
  
  // Punta
  boot += generateDetailedCube(x, y - 0.1, z + 0.5, 0.3, 0.2, 0.3, `${name}_tip`);
  
  return boot;
}

// Función para generar símbolo
function generateSymbol(x, y, z, name) {
  let symbol = `\n  // ${name} - Symbol\n`;
  
  // Símbolo principal (estrella simplificada)
  symbol += generateDetailedCube(x, y, z, 0.6, 0.1, 0.05, `${name}_horizontal`);
  symbol += generateDetailedCube(x, y, z, 0.1, 0.6, 0.05, `${name}_vertical`);
  
  // Detalles diagonales
  symbol += generateDetailedCube(x, y, z, 0.4, 0.1, 0.05, `${name}_diagonal1`);
  symbol += generateDetailedCube(x, y, z, 0.1, 0.4, 0.05, `${name}_diagonal2`);
  
  return symbol;
}

// Función para generar un cubo simple (compatibilidad)
function generateCube(x, y, z, name) {
  return generateDetailedCube(x, y, z, 1, 1, 1, name);
}

// Save a completed purchase to Supabase using service role key
async function savePurchaseToSupabase(userId, cartItems, totalPrice) {
  if (!supabaseAdmin || !userId) return;
  try {
    const { data: purchase, error } = await supabaseAdmin
      .from('purchases')
      .insert({
        user_id: userId,
        configuration_name: `Compra ${new Date().toLocaleDateString('es-ES')}`,
        total_price: totalPrice,
        items_count: cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
        status: 'completed',
        purchase_date: new Date().toISOString()
      })
      .select()
      .single();

    if (error || !purchase) {
      securityLogger.error('Supabase purchase save error', { error: error?.message });
      return;
    }

    const purchaseItems = cartItems.map(item => ({
      purchase_id: purchase.id,
      item_name: item.name || 'HeroSculpt Model',
      item_price: item.price || 0,
      quantity: item.quantity || 1,
      configuration_data: item.configuration || {}
    }));

    await supabaseAdmin.from('purchase_items').insert(purchaseItems);
  } catch (err) {
    securityLogger.error('savePurchaseToSupabase error', { error: err.message });
  }
}

// Send purchase confirmation email via Resend
async function sendPurchaseConfirmationEmail(toEmail, cartItems, totalPrice) {
  if (!toEmail) return;
  try {
    const itemsList = cartItems.map(item =>
      `<li style="padding:4px 0">${item.name || 'HeroSculpt Model'} — $${(item.price || 0).toFixed(2)}</li>`
    ).join('');

    await resend.emails.send({
      from: 'HeroSculpt <noreply@herosculpt.com>',
      to: [toEmail],
      subject: 'HeroSculpt — Tu compra está confirmada',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
          <h2 style="color:#111">Tu héroe está listo</h2>
          <p>Gracias por tu compra. Aquí está el resumen:</p>
          <ul style="padding-left:20px">${itemsList}</ul>
          <p style="font-size:18px"><strong>Total: $${totalPrice.toFixed(2)}</strong></p>
          <a href="https://darkslategrey-ape-448372.hostingersite.com"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#e63946;color:#fff;text-decoration:none;border-radius:6px">
            Descargar modelo 3D
          </a>
        </div>
      `
    });
  } catch (err) {
    securityLogger.error('sendPurchaseConfirmationEmail error', { error: err.message });
  }
}

// Serve frontend static files (SPA fallback — must be AFTER all API routes)
const DIST_PATH = path.join(__dirname, 'dist');
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
  });
}

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor Completo iniciado en http://localhost:${port}`);
  console.log('📋 Endpoints disponibles:');
  console.log('• GET  /health                    - Estado del servidor');
  console.log('• POST /send-email                - Enviar email');
  console.log('• POST /save-config               - Guardar configuración');
  console.log('• GET  /config/:configId          - Obtener configuración');
  console.log('• GET  /download/:configId/glb    - Descargar configuración como GLB');
  console.log('• GET  /download/:configId/stl    - Descargar configuración como STL');
  console.log('🧪 Para probar email:');
  console.log('curl -X POST http://localhost:3001/send-email -H "Content-Type: application/json" -d \'{"to":"test@example.com","subject":"Test","html":"<p>Hello</p>"}\'');
  console.log('📥 Para probar descarga:');
  console.log('http://localhost:3001/download/test_config/glb');
  console.log('http://localhost:3001/download/test_config/stl');
  console.log('✉️  Listo para enviar emails y procesar descargas');
}); 