import { useEffect, useRef, useState } from "react";
import { X, Loader2, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface Model3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelUrl: string;
  productName: string;
  modelColor?: string; // Optional color (e.g., "#ff0000" for red, or "0xff0000")
}

const Model3DModal = ({
  isOpen,
  onClose,
  modelUrl,
  productName,
  modelColor,
}: Model3DModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    // Reset progress
    setLoadingProgress(0);

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controlsRef.current = controls;

    // Setup lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    // Detect model format from URL
    const detectModelFormat = (url: string): string | null => {
      // First, try to get extension from filename
      const urlLower = url.toLowerCase();
      const fileExtMatch = urlLower.match(/\.([a-z0-9]+)(?:[?#]|$)/i);
      if (fileExtMatch) {
        const ext = fileExtMatch[1];
        if (['stl', 'obj', 'glb', 'gltf'].includes(ext)) {
          return ext;
        }
      }
      
      // If no valid extension, check if format is in the URL path
      if (urlLower.includes('/stl/') || urlLower.includes('/stl')) {
        return 'stl';
      }
      if (urlLower.includes('/obj/') || urlLower.includes('/obj')) {
        return 'obj';
      }
      if (urlLower.includes('/glb/') || urlLower.includes('/glb')) {
        return 'glb';
      }
      if (urlLower.includes('/gltf/') || urlLower.includes('/gltf')) {
        return 'gltf';
      }
      
      return null;
    };

    const extension = detectModelFormat(modelUrl);
    setIsLoading(true);
    setError(null);

    const onLoadSuccess = (object: THREE.Object3D) => {
      // Remove previous model
      if (modelRef.current) {
        scene.remove(modelRef.current);
      }

      // Center and scale model
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;

      object.position.sub(center);
      object.scale.multiplyScalar(scale);

      scene.add(object);
      modelRef.current = object;
      setIsLoading(false);
      setLoadingProgress(100);
    };

    const onLoadProgress = (xhr: ProgressEvent) => {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        setLoadingProgress(Math.round(percentComplete));
      } else {
        // If length not computable, show estimated progress
        const loaded = xhr.loaded / (1024 * 1024); // Convert to MB
        setLoadingProgress(Math.min(Math.round((loaded / 15) * 100), 95));
      }
    };

    const onLoadError = (error: any) => {
      console.error("Error loading model:", error);
      setError("Failed to load 3D model");
      setIsLoading(false);
    };

    if (extension === "stl") {
      const loader = new STLLoader();
      loader.load(
        modelUrl,
        (geometry) => {
          geometry.center();
          
          // Check if geometry has vertex colors
          const hasVertexColors = geometry.hasAttribute('color');
          
          // Determine color to use
          let materialColor = 0xe8e8e8; // Default grey
          
          if (hasVertexColors) {
            materialColor = 0xffffff; // White base for vertex colors
          } else if (modelColor) {
            // Parse modelColor - support both hex string "#ff0000" and number "0xff0000"
            if (typeof modelColor === 'string') {
              if (modelColor.startsWith('#')) {
                materialColor = parseInt(modelColor.substring(1), 16);
              } else if (modelColor.startsWith('0x')) {
                materialColor = parseInt(modelColor, 16);
              } else {
                materialColor = parseInt(modelColor, 16);
              }
            }
          }
          
          const material = new THREE.MeshStandardMaterial({
            color: materialColor,
            roughness: 0.4,
            metalness: 0.2,
            vertexColors: hasVertexColors,
          });
          const mesh = new THREE.Mesh(geometry, material);
          onLoadSuccess(mesh);
        },
        onLoadProgress,
        onLoadError
      );
    } else if (extension === "obj") {
      const loader = new OBJLoader();
      loader.load(
        modelUrl,
        (object) => {
          // Parse modelColor if provided
          let defaultColor = 0xe8e8e8;
          if (modelColor) {
            if (typeof modelColor === 'string') {
              if (modelColor.startsWith('#')) {
                defaultColor = parseInt(modelColor.substring(1), 16);
              } else if (modelColor.startsWith('0x')) {
                defaultColor = parseInt(modelColor, 16);
              } else {
                defaultColor = parseInt(modelColor, 16);
              }
            }
          }
          
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              // Only apply default material if no material exists
              if (!child.material || (child.material as THREE.Material).type === 'MeshBasicMaterial') {
                child.material = new THREE.MeshStandardMaterial({
                  color: defaultColor,
                  roughness: 0.4,
                  metalness: 0.2,
                });
              } else {
                // Preserve existing material but ensure it's properly lit
                if (child.material instanceof THREE.MeshBasicMaterial) {
                  const oldMaterial = child.material;
                  child.material = new THREE.MeshStandardMaterial({
                    color: oldMaterial.color,
                    map: oldMaterial.map,
                    roughness: 0.4,
                    metalness: 0.2,
                  });
                }
              }
            }
          });
          onLoadSuccess(object);
        },
        onLoadProgress,
        onLoadError
      );
    } else if (extension === "glb" || extension === "gltf") {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          onLoadSuccess(gltf.scene);
        },
        onLoadProgress,
        onLoadError
      );
    } else {
      // No valid extension found
      console.error("❌ Unsupported or missing file extension:", extension);
      setError(
        `Unsupported file format: ${
          extension || "unknown"
        }. Please use .stl, .obj, .glb, or .gltf files.`
      );
      setIsLoading(false);
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, [isOpen, modelUrl]);

  const handleReset = () => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.8);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.2);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full max-w-6xl max-h-[90vh] m-4 bg-background rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">{productName}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Drag to rotate • Scroll to zoom • Right-click to pan
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 3D Canvas Container */}
        <div
          ref={containerRef}
          className="relative h-[calc(100%-80px)] md:h-[calc(100%-100px)] bg-gradient-to-br from-muted/30 to-muted/10"
        >
          {/* Loading Overlay with Progress */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-background/90 backdrop-blur-sm px-8 py-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Loading 3D Model...
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {loadingProgress}%
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${loadingProgress}%` }}
                      />
                    </div>
                    {/* File size hint */}
                    {loadingProgress < 50 && (
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Large file may take 1-2 minutes to load...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-destructive/10 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg border border-destructive/20">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          {!isLoading && !error && (
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomIn}
                className="rounded-full shadow-lg"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomOut}
                className="rounded-full shadow-lg"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleReset}
                className="rounded-full shadow-lg"
                title="Reset View"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Model3DModal;
