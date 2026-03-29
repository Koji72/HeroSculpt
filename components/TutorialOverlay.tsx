import React, { useEffect, useRef, useState } from 'react';
import { useTutorial } from '../hooks/useTutorial';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from './icons';

const TutorialOverlay: React.FC = () => {
  const { currentStep, nextStep, prevStep, skipTutorial, highlightedElement, tutorialActive } = useTutorial();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number; width?: number; } | null>(null);

  useEffect(() => {
    if (!currentStep || !highlightedElement || !tooltipRef.current) {
      setTooltipPosition(null);
      return;
    }

    const targetRect = highlightedElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let top = 0;
    let left = 0;
    let width: number | undefined;

    switch (currentStep.placement) {
      case 'top':
        top = targetRect.top + scrollY - tooltipRect.height - 10;
        left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = targetRect.bottom + scrollY + 10;
        left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = targetRect.top + scrollY + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.left + scrollX - tooltipRect.width - 10;
        break;
      case 'right':
        top = targetRect.top + scrollY + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.right + scrollX + 10;
        break;
      case 'center':
        top = window.innerHeight / 2 + scrollY - tooltipRect.height / 2;
        left = window.innerWidth / 2 + scrollX - tooltipRect.width / 2;
        width = targetRect.width > 0 ? targetRect.width : undefined; // Use target width for center
        break;
      default:
        break;
    }

    // Ensure tooltip stays within viewport
    if (top < scrollY) top = scrollY + 10;
    if (left < scrollX) left = scrollX + 10;
    if (top + tooltipRect.height > window.innerHeight + scrollY) top = window.innerHeight + scrollY - tooltipRect.height - 10;
    if (left + tooltipRect.width > window.innerWidth + scrollX) left = window.innerWidth + scrollX - tooltipRect.width - 10;

    setTooltipPosition({ top, left, width });
  }, [currentStep, highlightedElement]);

  if (!tutorialActive || !currentStep) return null;

  const targetRect = highlightedElement?.getBoundingClientRect();

  return (
    <>
      {/* Dim overlay */}
      <div className="fixed inset-0 bg-black/60 z-[9998]" aria-hidden="true"></div>

      {/* Highlighted element clone (to avoid z-index issues) */}
      {targetRect && highlightedElement && currentStep.placement !== 'center' && ( 
        <div
          className="fixed z-[9999] rounded-md shadow-lg pointer-events-none transition-colors transition-transform transition-shadow duration-150 ease-out animate-pulse-border"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            border: '3px solid #f59e0b',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)', // Creates the dark overlay around the highlight
            borderRadius: '8px',
          }}
        />
      )}

      {/* Tutorial Tooltip */}
      {tooltipPosition && (
        <div
          ref={tooltipRef}
          className="absolute bg-slate-800 border border-slate-700 text-white p-4 rounded-lg shadow-xl max-w-sm z-[10000] animate-fadeInUp"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            ...(tooltipPosition.width && currentStep.placement === 'center' && { width: tooltipPosition.width }),
            textAlign: currentStep.placement === 'center' ? 'center' : 'left',
            transform: currentStep.placement === 'top' ? 'translateY(-10px)' : 
                       currentStep.placement === 'bottom' ? 'translateY(10px)' : 
                       currentStep.placement === 'left' ? 'translateX(-10px)' : 
                       currentStep.placement === 'right' ? 'translateX(10px)' : 'none',
          }}
        >
          <p className="text-lg font-semibold mb-3">Step {currentStep.id.split('-')[0].toUpperCase()}: {currentStep.message}</p>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={prevStep}
              disabled={currentStep.id === 'welcome'}
              className="px-3 py-1 bg-slate-700 text-white rounded-md hover:bg-slate-600 disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              <ChevronLeftIcon className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => nextStep('manual')}
              className="px-3 py-1 bg-amber-500 text-black font-bold rounded-md hover:bg-amber-400 transition-colors flex items-center gap-1"
            >
              Next <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={skipTutorial}
            className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
};

export default TutorialOverlay; 