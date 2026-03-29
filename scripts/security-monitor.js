#!/usr/bin/env node

/**
 * 🛡️ Monitor de Seguridad en Tiempo Real
 * 
 * Este script monitorea el sistema en busca de amenazas de seguridad.
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class SecurityMonitor {
  constructor() {
    this.threats = [];
    this.logFile = 'security-monitor.log';
    this.alertThreshold = 5; // Número de amenazas antes de alertar
  }

  // Monitorear archivos críticos
  async monitorCriticalFiles() {
    const criticalFiles = [
      'complete-server.cjs',
      'App.tsx',
      'types.ts',
      'lib/utils.ts',
      'components/CharacterViewer.tsx'
    ];

    for (const file of criticalFiles) {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        const lastModified = stats.mtime;
        
        // Verificar si el archivo fue modificado en las últimas 24 horas
        const hoursSinceModification = (Date.now() - lastModified.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceModification < 24) {
          this.logThreat('CRITICAL_FILE_MODIFIED', {
            file,
            lastModified: lastModified.toISOString(),
            hoursAgo: Math.round(hoursSinceModification)
          });
        }
      }
    }
  }

  // Monitorear procesos sospechosos
  async monitorProcesses() {
    try {
      const { stdout } = await execAsync('tasklist /FO CSV');
      const processes = stdout.split('\n').slice(1); // Ignorar header
      
      const suspiciousProcesses = [
        'sqlmap',
        'nmap',
        'wireshark',
        'burpsuite',
        'metasploit'
      ];
      
      for (const process of processes) {
        const processName = process.split(',')[0]?.replace(/"/g, '');
        if (suspiciousProcesses.some(sp => processName?.toLowerCase().includes(sp))) {
          this.logThreat('SUSPICIOUS_PROCESS', {
            process: processName,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.log('⚠️ No se pudo monitorear procesos:', error.message);
    }
  }

  // Monitorear conexiones de red
  async monitorNetworkConnections() {
    try {
      const { stdout } = await execAsync('netstat -an');
      const connections = stdout.split('\n');
      
      // Buscar conexiones sospechosas
      const suspiciousPorts = [22, 23, 3389, 1433, 3306, 5432];
      
      for (const connection of connections) {
        if (connection.includes('LISTENING')) {
          const portMatch = connection.match(/:(\d+)/);
          if (portMatch) {
            const port = parseInt(portMatch[1]);
            if (suspiciousPorts.includes(port)) {
              this.logThreat('SUSPICIOUS_PORT_LISTENING', {
                port,
                connection: connection.trim(),
                timestamp: new Date().toISOString()
              });
            }
          }
        }
      }
    } catch (error) {
      console.log('⚠️ No se pudo monitorear conexiones de red:', error.message);
    }
  }

  // Monitorear archivos de log de seguridad
  async monitorSecurityLogs() {
    const logFiles = [
      'security-logs.json',
      'security-monitor.log'
    ];

    for (const logFile of logFiles) {
      if (fs.existsSync(logFile)) {
        try {
          const content = fs.readFileSync(logFile, 'utf8');
          const lines = content.split('\n').filter(line => line.trim());
          
          // Buscar patrones de amenaza en los logs
          const threatPatterns = [
            /rate limit exceeded/i,
            /suspicious request/i,
            /validation error/i,
            /security warning/i,
            /xss attempt/i,
            /sql injection/i
          ];
          
          for (const line of lines.slice(-10)) { // Últimas 10 líneas
            for (const pattern of threatPatterns) {
              if (pattern.test(line)) {
                this.logThreat('SECURITY_LOG_THREAT', {
                  logFile,
                  pattern: pattern.toString(),
                  line: line.substring(0, 100) + '...',
                  timestamp: new Date().toISOString()
                });
              }
            }
          }
        } catch (error) {
          console.log(`⚠️ Error leyendo log ${logFile}:`, error.message);
        }
      }
    }
  }

  // Monitorear cambios en archivos de configuración
  async monitorConfigFiles() {
    const configFiles = [
      'package.json',
      'vite.config.ts',
      'tailwind.config.js',
      'tsconfig.json'
    ];

    for (const file of configFiles) {
      if (fs.existsSync(file)) {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          // Buscar configuraciones sospechosas
          const suspiciousConfigs = [
            /debug.*true/i,
            /verbose.*true/i,
            /devtools.*true/i,
            /sourcemap.*true/i
          ];
          
          for (const pattern of suspiciousConfigs) {
            if (pattern.test(content)) {
              this.logThreat('SUSPICIOUS_CONFIG', {
                file,
                pattern: pattern.toString(),
                timestamp: new Date().toISOString()
              });
            }
          }
        } catch (error) {
          console.log(`⚠️ Error leyendo config ${file}:`, error.message);
        }
      }
    }
  }

  // Registrar amenaza
  logThreat(type, data) {
    const threat = {
      type,
      data,
      timestamp: new Date().toISOString(),
      severity: this.getSeverity(type)
    };
    
    this.threats.push(threat);
    
    const logEntry = JSON.stringify(threat);
    fs.appendFileSync(this.logFile, logEntry + '\n');
    
    console.log(`🚨 AMENAZA DETECTADA [${threat.severity}]: ${type}`);
    console.log(`   📊 Datos: ${JSON.stringify(data)}`);
  }

  // Determinar severidad de la amenaza
  getSeverity(type) {
    const critical = ['CRITICAL_FILE_MODIFIED', 'SUSPICIOUS_PROCESS'];
    const high = ['SUSPICIOUS_PORT_LISTENING', 'SECURITY_LOG_THREAT'];
    const medium = ['SUSPICIOUS_CONFIG'];
    
    if (critical.includes(type)) return 'CRITICAL';
    if (high.includes(type)) return 'HIGH';
    if (medium.includes(type)) return 'MEDIUM';
    return 'LOW';
  }

  // Generar reporte de amenazas
  generateReport() {
    const critical = this.threats.filter(t => t.severity === 'CRITICAL');
    const high = this.threats.filter(t => t.severity === 'HIGH');
    const medium = this.threats.filter(t => t.severity === 'MEDIUM');
    const low = this.threats.filter(t => t.severity === 'LOW');
    
    console.log('\n📊 REPORTE DE SEGURIDAD:');
    console.log(`🚨 Críticas: ${critical.length}`);
    console.log(`⚠️ Altas: ${high.length}`);
    console.log(`🔶 Medias: ${medium.length}`);
    console.log(`ℹ️ Bajas: ${low.length}`);
    console.log(`📈 Total: ${this.threats.length}`);
    
    if (this.threats.length >= this.alertThreshold) {
      console.log('\n🚨 ALERTA: Se han detectado múltiples amenazas!');
      console.log('📧 Considera enviar alerta por email al administrador');
    }
  }

  // Ejecutar monitoreo completo
  async run() {
    console.log('🛡️ Iniciando monitoreo de seguridad...\n');
    
    await this.monitorCriticalFiles();
    await this.monitorProcesses();
    await this.monitorNetworkConnections();
    await this.monitorSecurityLogs();
    await this.monitorConfigFiles();
    
    this.generateReport();
    
    console.log('\n✅ Monitoreo completado');
    console.log(`📝 Logs guardados en: ${this.logFile}`);
  }
}

// Ejecutar monitor
const monitor = new SecurityMonitor();
monitor.run().catch(console.error); 