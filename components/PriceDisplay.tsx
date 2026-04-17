import React, { useState } from 'react';
import { SelectedParts } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Download, Loader2 } from "lucide-react";

interface PriceDisplayProps {
  selectedParts: SelectedParts;
  onDownloadModel?: () => Promise<any>;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ selectedParts, onDownloadModel }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string>('');

  const totalPrice = Object.values(selectedParts).reduce((sum, part) => {
    if (part && !part.attributes?.none) {
      return sum + (part.priceUSD ?? 0);
    }
    return sum;
  }, 0);

  const handleDownload = async () => {
    if (!onDownloadModel) {
      alert('Download functionality not available');
      return;
    }

    setIsDownloading(true);
    setDownloadMessage('Preparing model for download...');

    try {
      const result = await onDownloadModel();
      
      if (result.success) {
        setDownloadMessage(`✅ Downloaded: ${result.filename}`);
        setTimeout(() => setDownloadMessage(''), 3000);
      } else {
        setDownloadMessage(`❌ Error: ${result.error}`);
        setTimeout(() => setDownloadMessage(''), 5000);
      }
    } catch (error) {
      setDownloadMessage(`❌ Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setDownloadMessage(''), 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="bg-slate-900">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-sm md:text-base font-semibold text-orange-400">
          Total Price
        </CardTitle>
        <p className="text-xl md:text-2xl font-bold text-cyan-300">
          ${totalPrice.toFixed(2)} <span className="text-sm md:text-lg text-slate-400">USD</span>
        </p>
      </CardHeader>
      <CardContent className="p-2 md:p-3 pt-0 space-y-2">
        {/* Download Model Button */}
        <Button
          className="w-full text-xs md:text-sm py-1.5 md:py-2 h-8 md:h-9 bg-green-600 hover:bg-green-700"
          onClick={handleDownload}
          disabled={isDownloading || totalPrice === 0}
        >
          {isDownloading ? (
            <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-1.5 animate-spin" />
          ) : (
            <Download className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />
          )}
          <span className="hidden sm:inline">
            {isDownloading ? 'Preparing...' : 'Download STL'}
          </span>
          <span className="sm:hidden">
            {isDownloading ? '...' : 'STL'}
          </span>
        </Button>

        {/* Checkout Button */}
        <Button
          className="w-full text-xs md:text-sm py-1.5 md:py-2 h-8 md:h-9"
          onClick={() => alert(`Checkout for $${totalPrice.toFixed(2)} USD (functionality not implemented)`)}
          disabled={totalPrice === 0}
        >
          <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />
          <span className="hidden sm:inline">Checkout (Mock)</span>
          <span className="sm:hidden">Buy</span>
        </Button>

        {/* Download Status Message */}
        {downloadMessage && (
          <div className={`text-xs text-center p-2 rounded ${
            downloadMessage.includes('✅') 
              ? 'bg-green-900/50 text-green-300 border border-green-700' 
              : downloadMessage.includes('❌')
              ? 'bg-red-900/50 text-red-300 border border-red-700'
              : 'bg-blue-900/50 text-blue-300 border border-blue-700'
          }`}>
            {downloadMessage}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 md:p-3 pt-0">
        <p className="text-xs text-slate-400 text-center w-full">
          Download your custom 3D model as STL • Checkout for STL files
        </p>
      </CardFooter>
    </Card>
  );
};

export default PriceDisplay;