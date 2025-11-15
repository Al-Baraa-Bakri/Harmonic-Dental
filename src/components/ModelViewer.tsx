import { useEffect, useState } from 'react';

interface ModelViewerProps {
  src: string;
  alt: string;
  className?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

const ModelViewer = ({ src, alt, className = '' }: ModelViewerProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only run on client side
    setIsClient(true);
    
    // Dynamically import model-viewer only on client
    import('@google/model-viewer').catch((err) => {
      console.error('Failed to load model-viewer:', err);
    });
  }, []);

  // Don't render until we're on the client
  if (!isClient) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-muted`}
        style={{ minHeight: '400px' }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading 3D viewer...</p>
        </div>
      </div>
    );
  }

  return (
    <model-viewer
      src={src}
      alt={alt}
      camera-controls
      touch-action="pan-y"
      auto-rotate
      rotation-per-second="30deg"
      shadow-intensity="1"
      exposure="1"
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
      }}
    />
  );
};

export default ModelViewer;