import { useState, useEffect, forwardRef } from 'react';
import { Download, Printer, FileDown, AlertCircle } from 'lucide-react';

interface ExportButtonProps {
  onExportGLB?: () => Promise<any>;
  onExportSTL?: () => Promise<any>;
  disabled?: boolean;
  className?: string;
  id: string;
  registerElement: (id: string, element: HTMLElement | null) => void;
}

const ExportButton = forwardRef<HTMLButtonElement, ExportButtonProps>(({ onExportGLB, onExportSTL, disabled = false, className = "", id, registerElement }, ref) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [lastExportResult, setLastExportResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (ref && typeof ref !== 'function' && ref.current) {
      registerElement(id, ref.current);
    }
  }, [id, registerElement, ref]);

  const handleExport = async (exportType: 'glb' | 'stl') => {
    if (disabled || isExporting) return;

    setIsExporting(true);
    setShowMenu(false);
    setLastExportResult(null);

    try {
      const result = exportType === 'glb' 
        ? (onExportGLB ? await onExportGLB() : { success: false, error: 'GLB export not available' }) 
        : (onExportSTL ? await onExportSTL() : { success: false, error: 'STL export not available' });

      if (result.success) {
        setLastExportResult({
          success: true,
          message: `${exportType.toUpperCase()} exported successfully!`
        });
      } else {
        setLastExportResult({
          success: false,
          message: `Error exporting ${exportType.toUpperCase()}: ${result.error}`
        });
      }
    } catch (error) {
      setLastExportResult({
        success: false,
        message: `Unexpected error exporting ${exportType.toUpperCase()}`
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      {/* Main Export Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled || isExporting}
        className={`
          relative flex items-center gap-2 px-4 py-2 font-semibold transition-colors transition-transform transition-shadow duration-200 overflow-hidden group
          ${disabled || isExporting
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'marvel-button marvel-button-active bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:shadow-lg hover:shadow-amber-400/50'
          }
          ${className}
        `}
        style={{ 
          fontFamily: 'var(--font-comic), system-ui',
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
        }}
        ref={ref}
      >
        {!disabled && !isExporting && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-200" />
        )}
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Export</span>
          </>
        )}
      </button>

      {/* Export Menu */}
      {showMenu && !isExporting && (
        <div className="absolute top-0 left-full ml-2 origin-top-left bg-white rounded-lg shadow-xl border border-gray-200 p-2 min-w-[220px] z-50">
          <div className="text-sm font-medium text-gray-700 mb-2 px-2">Export format:</div>
          
          <button
            onClick={() => handleExport('glb')}
            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
          >
            <FileDown className="w-4 h-4 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">GLB (3D View)</div>
              <div className="text-xs text-gray-500">For 3D visualization</div>
            </div>
          </button>
          
          <button
            onClick={() => handleExport('stl')}
            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
          >
            <Printer className="w-4 h-4 text-green-600" />
            <div>
              <div className="font-medium text-gray-900">STL (3D Print)</div>
              <div className="text-xs text-gray-500">For 3D printing</div>
            </div>
          </button>
        </div>
      )}

      {/* Export Result Notification */}
      {lastExportResult && (
        <div className={`
          absolute top-0 left-full ml-2 px-4 py-2 rounded-lg shadow-lg border z-50
          ${lastExportResult.success 
            ? 'bg-green-100 border-green-300 text-green-800' 
            : 'bg-red-100 border-red-300 text-red-800'
          }
        `}>
          <div className="flex items-center gap-2">
            {lastExportResult.success ? (
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{lastExportResult.message}</span>
          </div>
        </div>
      )}

      {/* Backdrop to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
});

export default ExportButton; 