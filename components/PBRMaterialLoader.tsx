import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface PBRMaterial {
  name: string;
  variant: string;
  map: string;
  metalnessMap: string;
  roughnessMap: string;
  normalMap: string;
  emissiveMap?: string;
  aoMap?: string;
  alphaTest: number;
  side: 'FrontSide' | 'BackSide' | 'DoubleSide';
  archetype: string;
  maxAnisotropy: number;
  encoding: string;
}

interface PBRMaterialLoaderProps {
  modelUrl: string;
  materialData: PBRMaterial;
  onMaterialLoaded?: (material: THREE.Material) => void;
  onError?: (error: string) => void;
}

const PBRMaterialLoader: React.FC<PBRMaterialLoaderProps> = ({
  modelUrl,
  materialData,
  onMaterialLoaded,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const textureLoader = useRef(new THREE.TextureLoader());
  const gltfLoader = useRef(new GLTFLoader());
  
  // Función para cargar textura con configuración optimizada
  const loadTexture = async (url: string): Promise<THREE.Texture> => {
    return new Promise((resolve, reject) => {
      textureLoader.current.load(
        url,
        (texture) => {
          // Configuración optimizada para PBR
          texture.encoding = THREE.sRGBEncoding;
          texture.flipY = false;
          texture.anisotropy = materialData.maxAnisotropy || 4;
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          
          resolve(texture);
        },
        undefined,
        (error) => reject(error)
      );
    });
  };
  
  // Función para crear material PBR
  const createPBRMaterial = async (): Promise<THREE.MeshStandardMaterial> => {
    try {
      setIsLoading(true);
      setProgress(10);
      
      // Cargar texturas en paralelo
      const texturePromises = [
        loadTexture(materialData.map),
        loadTexture(materialData.metalnessMap),
        loadTexture(materialData.roughnessMap),
        loadTexture(materialData.normalMap)
      ];
      
      // Agregar texturas opcionales si existen
      if (materialData.emissiveMap) {
        texturePromises.push(loadTexture(materialData.emissiveMap));
      }
      if (materialData.aoMap) {
        texturePromises.push(loadTexture(materialData.aoMap));
      }
      
      setProgress(30);
      
      const [
        albedoTexture,
        metalnessTexture,
        roughnessTexture,
        normalTexture,
        emissiveTexture,
        aoTexture
      ] = await Promise.all(texturePromises);
      
      setProgress(70);
      
      // Crear material PBR
      const material = new THREE.MeshStandardMaterial({
        map: albedoTexture,
        metalnessMap: metalnessTexture,
        roughnessMap: roughnessTexture,
        normalMap: normalTexture,
        emissiveMap: emissiveTexture || null,
        aoMap: aoTexture || null,
        alphaTest: materialData.alphaTest,
        side: THREE[materialData.side],
        transparent: false,
        metalness: 1.0,
        roughness: 1.0
      });
      
      setProgress(90);
      
      // Configurar material
      material.name = materialData.name;
      material.userData = {
        variant: materialData.variant,
        archetype: materialData.archetype,
        pbrWorkflow: 'metallic-roughness'
      };
      
      setProgress(100);
      setIsLoading(false);
      
      return material;
      
    } catch (error) {
      const errorMessage = `Error cargando material PBR: ${error}`;
      setError(errorMessage);
      setIsLoading(false);
      onError?.(errorMessage);
      throw error;
    }
  };
  
  // Función para aplicar material al modelo
  const applyMaterialToModel = async (model: THREE.Group, material: THREE.Material) => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Buscar el material que coincida con el nombre del archivo
        const meshName = child.name.toLowerCase();
        const materialName = materialData.name.toLowerCase();
        
        if (meshName.includes(materialName.split('_')[0]) || 
            meshName.includes('mesh') || 
            meshName.includes('body')) {
          child.material = material;
          console.log(`✅ Material aplicado a: ${child.name}`);
        }
      }
    });
  };
  
  // Función principal para cargar modelo y aplicar material
  const loadModelWithMaterial = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Cargar modelo GLB
      const gltf = await new Promise<THREE.GLTF>((resolve, reject) => {
        gltfLoader.current.load(
          modelUrl,
          resolve,
          (progress) => {
            const percent = (progress.loaded / progress.total) * 50; // 50% para carga del modelo
            setProgress(percent);
          },
          reject
        );
      });
      
      // Crear material PBR
      const material = await createPBRMaterial();
      
      // Aplicar material al modelo
      await applyMaterialToModel(gltf.scene, material);
      
      // Notificar que el material está listo
      onMaterialLoaded?.(material);
      
      console.log(`🎨 Material PBR cargado: ${materialData.name}`);
      
    } catch (error) {
      const errorMessage = `Error en carga completa: ${error}`;
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };
  
  // Cargar automáticamente cuando cambien los props
  useEffect(() => {
    if (modelUrl && materialData) {
      loadModelWithMaterial();
    }
  }, [modelUrl, materialData.name]);
  
  return (
    <div className="pbr-material-loader">
      {isLoading && (
        <div className="loading-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="loading-text">
            Cargando material PBR: {materialData.name} ({progress.toFixed(0)}%)
          </p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button 
            onClick={loadModelWithMaterial}
            className="retry-button"
          >
            Reintentar
          </button>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="success-message">
          <p>✅ Material PBR cargado: {materialData.name}</p>
          <p>🎭 Variante: {materialData.variant}</p>
          <p>🏷️ Arquetipo: {materialData.archetype}</p>
        </div>
      )}
    </div>
  );
};

export default PBRMaterialLoader; 