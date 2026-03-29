import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Tutorial step interface
interface TutorialStep {
  id: string;
  message: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  elementId?: string;
  trigger?: string;
}

// Tutorial context interface
interface TutorialContextType {
  currentStep: TutorialStep | null;
  tutorialActive: boolean;
  highlightedElement: HTMLElement | null;
  startTutorial: () => void;
  nextStep: (trigger?: string) => void;
  prevStep: () => void;
  skipTutorial: () => void;
  registerElement: (id: string, element: HTMLElement | null) => void;
}

// Tutorial steps definition
const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    message: 'Welcome to the 3D Customizer! I\'ll guide you through the main features.',
    placement: 'center'
  },
  {
    id: 'archetype-selector',
    message: 'First, select your archetype. Each one has unique parts available.',
    placement: 'bottom',
    elementId: 'archetype-selector'
  },
  {
    id: 'character-viewer',
    message: 'Here you can see your character in 3D. Rotate the view with your mouse.',
    placement: 'left',
    elementId: 'character-viewer'
  },
  {
    id: 'category-toolbar',
    message: 'Select a category to customize that part of the character.',
    placement: 'bottom',
    elementId: 'category-toolbar'
  },
  {
    id: 'config-panel',
    message: 'This panel shows your current configuration and export options.',
    placement: 'right',
    elementId: 'config-panel'
  },
  {
    id: 'ai-designer',
    message: 'Try the AI Designer to generate unique configurations!',
    placement: 'top',
    elementId: 'ai-designer-button'
  },
  {
    id: 'export',
    message: 'Export your character in GLB or STL format for 3D printing.',
    placement: 'top',
    elementId: 'export-button'
  },
  {
    id: 'complete',
    message: 'Perfect! You now know the main features. Enjoy customizing your hero!',
    placement: 'center'
  }
];

// Create context
const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

// Provider component
export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [registeredElements, setRegisteredElements] = useState<Map<string, HTMLElement>>(new Map());

  const currentStep = currentStepIndex >= 0 && currentStepIndex < TUTORIAL_STEPS.length 
    ? TUTORIAL_STEPS[currentStepIndex] 
    : null;

  const startTutorial = useCallback(() => {
    setCurrentStepIndex(0);
    setTutorialActive(true);
  }, []);

  const nextStep = useCallback((trigger?: string) => {
    if (!tutorialActive) return;

    // Check if we should advance based on trigger
    if (trigger && currentStep?.trigger && currentStep.trigger !== trigger) {
      return; // Don't advance if trigger doesn't match
    }

    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Tutorial completed
      setTutorialActive(false);
      setCurrentStepIndex(-1);
      setHighlightedElement(null);
    }
  }, [tutorialActive, currentStepIndex, currentStep?.trigger]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTutorial = useCallback(() => {
    setTutorialActive(false);
    setCurrentStepIndex(-1);
    setHighlightedElement(null);
  }, []);

  const registerElement = useCallback((id: string, element: HTMLElement | null) => {
    setRegisteredElements(prev => {
      const newMap = new Map(prev);
      if (element) {
        newMap.set(id, element);
      } else {
        newMap.delete(id);
      }
      return newMap;
    });
  }, []);

  // Update highlighted element when step changes
  useEffect(() => {
    if (currentStep?.elementId) {
      const element = registeredElements.get(currentStep.elementId) || 
                     document.getElementById(currentStep.elementId);
      setHighlightedElement(element || null);
    } else {
      setHighlightedElement(null);
    }
  }, [currentStep, registeredElements]);

  const contextValue: TutorialContextType = {
    currentStep,
    tutorialActive,
    highlightedElement,
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    registerElement
  };

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
    </TutorialContext.Provider>
  );
};

// Hook to use tutorial context
export const useTutorial = (): TutorialContextType => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}; 