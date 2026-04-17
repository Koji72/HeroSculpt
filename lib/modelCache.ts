import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { getMaterialForPath } from '../components/materials/materials';

class ModelCache {
  private cache = new Map<string, THREE.Group>();
  private loadingPromises = new Map<string, Promise<THREE.Group>>();
  private loader: GLTFLoader | null = null;
  private dracoLoader: DRACOLoader | null = null;

  public initializeLoaders(gltfLoader: GLTFLoader, dracoLoader: DRACOLoader) {
    this.loader = gltfLoader;
    this.dracoLoader = dracoLoader;
    if (this.loader) {
      this.loader.setDRACOLoader(this.dracoLoader);
    }
    // console.log('ModelCache: Loaders initialized.');
  }

  async getModel(path: string): Promise<THREE.Group> {
    // console.log(`ModelCache: getModel called with path: ${path}`);
    if (!this.loader) {
      console.error('ModelCache: GLTFLoader not initialized.');
      throw new Error('GLTFLoader not initialized.');
    }

    // Check if already cached
    if (this.cache.has(path)) {
      const cachedModel = this.cache.get(path)!;
      // console.log(`ModelCache: Returning cached model for ${path}. Model ID: ${cachedModel.name || cachedModel.uuid}`);
      
      // Log específico para manos
      if (path.includes('hands')) {
        // console.log(`🔍 CACHED HAND MODEL:`, {
        //   path: path,
        //   modelName: cachedModel.name,
        //   modelUuid: cachedModel.uuid,
        //   childrenCount: cachedModel.children.length,
        //   childrenNames: cachedModel.children.map(child => child.name)
        // });
      }
      
      // Log específico para buckles
      if (path.includes('buckle')) {
        // console.log(`🔍 CACHED BUCKLE MODEL:`, {
        //   path: path,
        //   modelName: cachedModel.name,
        //   modelUuid: cachedModel.uuid,
        //   childrenCount: cachedModel.children.length,
        //   childrenNames: cachedModel.children.map(child => child.name)
        // });
      }
      
      return this.cloneWithMaterials(cachedModel);
    }

    // Check if already loading
    if (this.loadingPromises.has(path)) {
      const model = await this.loadingPromises.get(path)!;
      // console.log(`ModelCache: Waiting for and returning loading model for ${path}. Model ID: ${model.name || model.uuid}`);
      
      // Log específico para manos
      if (path.includes('hands')) {
        // console.log(`🔍 LOADING HAND MODEL:`, {
        //   path: path,
        //   modelName: model.name,
        //   modelUuid: model.uuid,
        //   childrenCount: model.children.length,
        //   childrenNames: model.children.map(child => child.name)
        // });
      }
      
      // Log específico para buckles
      if (path.includes('buckle')) {
        // console.log(`🔍 LOADING BUCKLE MODEL:`, {
        //   path: path,
        //   modelName: model.name,
        //   modelUuid: model.uuid,
        //   childrenCount: model.children.length,
        //   childrenNames: model.children.map(child => child.name)
        // });
      }
      
      return this.cloneWithMaterials(model);
    }

    // Load new model
    // console.log(`ModelCache: Loading new model for ${path}`);
    const loadPromise = this.loadModel(path);
    this.loadingPromises.set(path, loadPromise);

    try {
      const model = await loadPromise;
      this.cache.set(path, model);
      this.loadingPromises.delete(path);
      // console.log(`ModelCache: Loaded and cached new model for ${path}. Model ID: ${model.name || model.uuid}`);
      
      // Log específico para manos
      if (path.includes('hands')) {
        // console.log(`🔍 NEW HAND MODEL:`, {
        //   path: path,
        //   modelName: model.name,
        //   modelUuid: model.uuid,
        //   childrenCount: model.children.length,
        //   childrenNames: model.children.map(child => child.name)
        // });
      }
      
      // Log específico para buckles
      if (path.includes('buckle')) {
        // console.log(`🔍 NEW BUCKLE MODEL:`, {
        //   path: path,
        //   modelName: model.name,
        //   modelUuid: model.uuid,
        //   childrenCount: model.children.length,
        //   childrenNames: model.children.map(child => child.name)
        // });
      }
      
      return this.cloneWithMaterials(model);
    } catch (error) {
      this.loadingPromises.delete(path);
      console.error(`ModelCache: Error in getModel for ${path}:`, error);
      throw error;
    }
  }

  private async loadModel(path: string): Promise<THREE.Group> {
    // console.log(`ModelCache: Loading model ${path}`);
    if (!this.loader) throw new Error('GLTFLoader not available for loading.');
    
    try {
      // console.log(`ModelCache: Starting async load for ${path}`);
      const gltf = await this.loader.loadAsync(path);
              // console.log(`ModelCache: Successfully loaded ${path}`, gltf);
      const model = gltf.scene;
      model.name = path;
      
      // Aplicar materiales mejorados basados en la categoría del modelo
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Determinar la categoría basada en la ruta del archivo
          // let category = 'default'; // Removed: not used
          // if (path.includes('head')) category = 'head';
          // else if (path.includes('torso') || path.includes('suit_torso')) category = 'body';
          // else if (path.includes('hands')) category = 'body';
          // else if (path.includes('legs')) category = 'body';
          // else if (path.includes('boots')) category = 'equip';
          // else if (path.includes('belt')) category = 'equip';
          // else if (path.includes('cape')) category = 'equip';
          // else if (path.includes('symbol')) category = 'equip';
          
          // Aplicar material específico para la categoría
          const material = getMaterialForPath(path);
          child.material = material;
          
          // Mejorar la calidad visual
          if (child.geometry) {
            child.geometry.computeVertexNormals();
            child.geometry.computeBoundingSphere();
          }
        }
      });
      
              // console.log(`ModelCache: Model ${path} processed and ready`);
      return model;
    } catch (error) {
      console.error(`ModelCache: Error loading model ${path}:`, error);
      throw error;
    }
  }

  async preloadModels(paths: string[]): Promise<void> {
    if (!this.loader) {
      console.error('ModelCache: GLTFLoader not initialized for preloading.');
      return;
    }
    // console.log(`ModelCache: Starting preload of ${paths.length} models.`);
    const preloadPromises = paths.map(path => this.getModel(path).catch(error => {
      console.error(`ModelCache: Failed to preload model ${path}:`, error);
      return null; // Don't block if one preload fails
    }));
    await Promise.all(preloadPromises);
    // console.log(`ModelCache: Finished preload of ${paths.length} models.`);
  }

  private cloneWithMaterials(source: THREE.Group): THREE.Group {
    const cloned = source.clone();
    cloned.userData = { ...source.userData };
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.userData = { ...child.userData };
        if (Array.isArray(child.material)) {
          child.material = child.material.map((m: THREE.Material) => m.clone());
        } else if (child.material) {
          child.material = (child.material as THREE.Material).clone();
        }
      }
    });
    return cloned;
  }

  clearCache(): void {
    this.cache.forEach(model => {
      model.traverse(object => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    });
    this.cache.clear();
    this.loadingPromises.clear();
    // console.log('ModelCache: Cache cleared.');
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getLoadingCount(): number {
    return this.loadingPromises.size;
  }
}

export const modelCache = new ModelCache(); 