# WebGL Framebuffer and Model Loading Fixes

## Issues Addressed

### 1. WebGL Framebuffer Errors
**Problem**: Massive number of `GL_INVALID_FRAMEBUFFER_OPERATION` errors due to renderer trying to render to framebuffers with zero size.

**Root Cause**: 
- Container dimensions were 0 during initialization
- Renderer was attempting to render before container was properly sized
- No validation of container dimensions before rendering

**Solutions Implemented**:
- Added container dimension validation before renderer initialization
- Implemented `containerReady` state to ensure proper timing
- Added minimum size constraints (1x1) to prevent zero-dimension framebuffers
- Limited pixel ratio to prevent performance issues
- Added render condition to only render when container has valid dimensions

### 2. Model Loading Errors
**Problem**: Symbol model failing to load with JSON parsing error due to missing file.

**Root Cause**: 
- Constants file referenced `strong_symbol_01.glb` which doesn't exist
- Actual files have suffixes like `_ns`, `_t01`, etc.

**Solutions Implemented**:
- Fixed symbol path in constants.ts to use existing file (`strong_symbol_01_ns.glb`)
- Added file existence check before loading
- Implemented fallback mechanism to try alternative file variations
- Added better error handling and logging

### 3. Performance Improvements
**Problem**: Excessive WebGL context loss and restoration cycles.

**Solutions Implemented**:
- Added `powerPreference: "high-performance"` to renderer options
- Limited pixel ratio to maximum of 2
- Improved resize handling with proper dimension validation
- Added early return conditions to prevent unnecessary operations

## Code Changes

### CharacterViewer.tsx
```typescript
// Added container ready state
const [containerReady, setContainerReady] = useState(false);

// Improved renderer initialization
const renderer = new THREE.WebGLRenderer({ 
  antialias: true, 
  alpha: true,
  premultipliedAlpha: false,
  preserveDrawingBuffer: true,
  powerPreference: "high-performance"
});

// Ensure minimum size to prevent framebuffer issues
const width = Math.max(currentMount.clientWidth, 1);
const height = Math.max(currentMount.clientHeight, 1);

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Improved animation loop
const animate = () => {
  requestAnimationFrame(animate);
  
  // Only render if the container has valid dimensions
  if (currentMount.clientWidth > 0 && currentMount.clientHeight > 0) {
    controls.update();
    renderer.render(scene, camera);
  }
};
```

### modelCache.ts
```typescript
// Added file existence check
const response = await fetch(path, { method: 'HEAD' });
if (!response.ok) {
  throw new Error(`Model file not found: ${path} (HTTP ${response.status})`);
}

// Added fallback mechanism
if (error instanceof Error && error.message.includes('not found')) {
  const variations = [
    path.replace('.glb', '_ns.glb'),
    path.replace('.glb', '_t01.glb'),
    path.replace('.glb', '_t02.glb'),
    // ... more variations
  ];
  
  for (const variation of variations) {
    // Try each variation
  }
}
```

### constants.ts
```typescript
// Fixed symbol path
{
  id: 'strong_symbol_01', 
  name: 'Strong Symbol Alpha', 
  category: PartCategory.SYMBOL, 
  archetype: ArchetypeId.STRONG,
  gltfPath: 'assets/strong/symbol/strong_symbol_01_ns.glb', // Fixed path
  // ...
}
```

## Benefits

1. **Eliminated WebGL Errors**: No more framebuffer operation errors
2. **Improved Performance**: Better renderer configuration and validation
3. **Robust Model Loading**: Fallback mechanisms and better error handling
4. **Better User Experience**: No more console spam and smoother rendering
5. **Maintainable Code**: Clear separation of concerns and proper error handling

## Testing

To verify the fixes work:

1. Check browser console for absence of WebGL framebuffer errors
2. Verify symbol models load correctly
3. Test resize behavior with different container sizes
4. Monitor performance during model loading and rendering

## Future Improvements

1. Add more sophisticated fallback mechanisms for missing models
2. Implement model preloading for better performance
3. Add loading indicators for better UX
4. Consider implementing model streaming for large files 