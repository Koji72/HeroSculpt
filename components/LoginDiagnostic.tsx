import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const LoginDiagnostic: React.FC = () => {
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const runDiagnostic = async () => {
      const info: any = {};

      // 1. Verificar variables de entorno
      const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
      const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
      
      info.envVars = {
        supabaseUrl: supabaseUrl ? '✅ Configurado' : '❌ No configurado',
        supabaseAnonKey: supabaseAnonKey ? '✅ Configurado' : '❌ No configurado',
        urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'No encontrado',
        keyValue: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 30)}...` : 'No encontrado'
      };

      // 2. Verificar cliente Supabase
      info.supabaseClient = {
        exists: supabase ? '✅ Cliente creado' : '❌ Cliente no creado',
        type: typeof supabase
      };

      // 3. Verificar conexión
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.getSession();
          info.connection = {
            status: error ? '❌ Error de conexión' : '✅ Conexión exitosa',
            error: error?.message || 'Ninguno',
            session: data.session ? '✅ Sesión disponible' : 'ℹ️ Sin sesión'
          };
        } catch (err) {
          info.connection = {
            status: '❌ Error de conexión',
            error: err instanceof Error ? err.message : 'Error desconocido',
            session: 'N/A'
          };
        }
      }

      // 4. Verificar configuración de autenticación
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.getUser();
          info.auth = {
            status: error ? '❌ Error de auth' : '✅ Auth configurado',
            error: error?.message || 'Ninguno',
            user: data.user ? '✅ Usuario autenticado' : 'ℹ️ Sin usuario'
          };
        } catch (err) {
          info.auth = {
            status: '❌ Error de auth',
            error: err instanceof Error ? err.message : 'Error desconocido',
            user: 'N/A'
          };
        }
      }

      setDiagnosticInfo(info);
    };

    runDiagnostic();
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg z-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 font-bold border-2 border-red-500"
        style={{
          fontFamily: 'var(--font-comic), system-ui',
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
        }}
      >
        🔧 Diagnóstico Login
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto border-2 border-slate-600 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-comic), system-ui' }}>
            🔧 Diagnóstico de Login
          </h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white text-2xl font-bold transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Variables de Entorno */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-600 shadow-lg">
            <h3 className="font-bold mb-4 text-amber-400 uppercase tracking-wider text-lg" style={{ fontFamily: 'var(--font-comic), system-ui' }}>
              📋 Variables de Entorno
            </h3>
            <div className="space-y-3 text-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold">URL:</span>
                <span className={`font-mono text-sm ${diagnosticInfo.envVars?.supabaseUrl?.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                  {diagnosticInfo.envVars?.supabaseUrl}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Key:</span>
                <span className={`font-mono text-sm ${diagnosticInfo.envVars?.supabaseAnonKey?.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                  {diagnosticInfo.envVars?.supabaseAnonKey}
                </span>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-600">
                <div className="text-xs text-slate-300 font-mono">
                  <div>URL: {diagnosticInfo.envVars?.urlValue}</div>
                  <div>Key: {diagnosticInfo.envVars?.keyValue}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cliente Supabase */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-600 shadow-lg">
            <h3 className="font-bold mb-4 text-blue-400 uppercase tracking-wider text-lg" style={{ fontFamily: 'var(--font-comic), system-ui' }}>
              🔧 Cliente Supabase
            </h3>
            <div className="space-y-3 text-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Estado:</span>
                <span className={`font-mono text-sm ${diagnosticInfo.supabaseClient?.exists?.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                  {diagnosticInfo.supabaseClient?.exists}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Tipo:</span>
                <span className="font-mono text-sm text-slate-300">
                  {diagnosticInfo.supabaseClient?.type}
                </span>
              </div>
            </div>
          </div>

          {/* Conexión */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-600 shadow-lg">
            <h3 className="font-bold mb-4 text-green-400 uppercase tracking-wider text-lg" style={{ fontFamily: 'var(--font-comic), system-ui' }}>
              🌐 Conexión
            </h3>
            <div className="space-y-3 text-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Estado:</span>
                <span className={`font-mono text-sm ${diagnosticInfo.connection?.status?.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                  {diagnosticInfo.connection?.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Sesión:</span>
                <span className={`font-mono text-sm ${diagnosticInfo.connection?.session?.includes('✅') ? 'text-green-400' : 'text-yellow-400'}`}>
                  {diagnosticInfo.connection?.session}
                </span>
              </div>
              {diagnosticInfo.connection?.error && (
                <div className="bg-red-900/50 border border-red-600 p-3 rounded-lg">
                  <div className="text-red-300 font-semibold mb-1">Error:</div>
                  <div className="text-red-200 text-sm font-mono">
                    {diagnosticInfo.connection.error}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Autenticación */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-600 shadow-lg">
            <h3 className="font-bold mb-4 text-purple-400 uppercase tracking-wider text-lg" style={{ fontFamily: 'var(--font-comic), system-ui' }}>
              🔐 Autenticación
            </h3>
            <div className="space-y-3 text-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Estado:</span>
                <span className={`font-mono text-sm ${diagnosticInfo.auth?.status?.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                  {diagnosticInfo.auth?.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Usuario:</span>
                <span className={`font-mono text-sm ${diagnosticInfo.auth?.user?.includes('✅') ? 'text-green-400' : 'text-yellow-400'}`}>
                  {diagnosticInfo.auth?.user}
                </span>
              </div>
              {diagnosticInfo.auth?.error && (
                <div className="bg-red-900/50 border border-red-600 p-3 rounded-lg">
                  <div className="text-red-300 font-semibold mb-1">Error:</div>
                  <div className="text-red-200 text-sm font-mono">
                    {diagnosticInfo.auth.error}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botón de prueba */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-600 shadow-lg">
            <h3 className="font-bold mb-4 text-cyan-400 uppercase tracking-wider text-lg" style={{ fontFamily: 'var(--font-comic), system-ui' }}>
              🧪 Prueba de Registro
            </h3>
            <button
              onClick={async () => {
                if (supabase) {
                  try {
                    const { data, error } = await supabase.auth.signUp({
                      email: 'test@example.com',
                      password: 'testpassword123',
                      options: {
                        emailRedirectTo: 'https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app',
                        emailConfirm: false // TEMPORAL: No requerir confirmación de email
                      }
                    });
                    
                    if (error) {
                      alert(`Error de registro: ${error.message}`);
                    } else {
                      alert('Registro exitoso (verificar email)');
                    }
                  } catch (err) {
                    alert(`Error inesperado: ${err instanceof Error ? err.message : 'Error desconocido'}`);
                  }
                } else {
                  alert('Cliente Supabase no disponible');
                }
              }}
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-cyan-500"
              style={{
                fontFamily: 'var(--font-comic), system-ui',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            >
              Probar Registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDiagnostic; 