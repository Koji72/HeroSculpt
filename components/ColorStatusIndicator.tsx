import React from 'react';
import { getColorableParts, isPartColorable } from './materials/materials';
import { PartCategory } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ColorStatusIndicatorProps {
  selectedParts: { [category: string]: any };
  currentColors: { [category: string]: number };
}

const ColorStatusIndicator: React.FC<ColorStatusIndicatorProps> = ({
  selectedParts,
  currentColors
}) => {
  const colorableParts = getColorableParts();
  const availableParts = colorableParts.filter(part => 
    selectedParts[part.category] && selectedParts[part.category].id
  );

  const getColorStatus = (category: PartCategory) => {
    if (!isPartColorable(category)) {
              return { status: 'not-colorable', label: 'Not colorable', icon: '🚫' };
    }
    
    if (currentColors[category]) {
      return { 
        status: 'colored', 
        label: 'Colored', 
        icon: '🎨',
        color: currentColors[category]
      };
    }
    
    return { status: 'default', label: 'Default color', icon: '⚪' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Color Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {availableParts.map((part) => {
            const status = getColorStatus(part.category);
            
            return (
              <div
                key={part.category}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{status.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{part.name}</div>
                    <div className="text-xs text-gray-500">{status.label}</div>
                  </div>
                </div>
                
                {status.status === 'colored' && status.color && (
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: `#${status.color.toString(16).padStart(6, '0')}` }}
                    title={`Color: #${status.color.toString(16).padStart(6, '0')}`}
                  />
                )}
                
                {status.status === 'not-colorable' && (
                  <div className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
                    Not applicable
                  </div>
                )}
              </div>
            );
          })}
          
          {availableParts.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No colorable parts selected
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorStatusIndicator; 