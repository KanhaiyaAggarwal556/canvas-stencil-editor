import React, { useEffect, useRef } from 'react';
import { createStore } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Upload, RotateCcw, Move, ZoomIn, ZoomOut } from 'lucide-react';


const ActionTypes = {
  SET_IMAGE_DATA: 'SET_IMAGE_DATA',
  SET_SCALE: 'SET_SCALE',
  SET_POSITION: 'SET_POSITION',
  SET_ROTATION: 'SET_ROTATION',
  RESET_TRANSFORM: 'RESET_TRANSFORM',
  SET_IMAGE_LOADED: 'SET_IMAGE_LOADED',
  SET_IMAGE_SELECTED: 'SET_IMAGE_SELECTED',
  SET_FABRIC_READY: 'SET_FABRIC_READY'
};

const setImageData = (data) => ({ 
  type: ActionTypes.SET_IMAGE_DATA, 
  payload: data 
});

const setScale = (scale) => ({ 
  type: ActionTypes.SET_SCALE, 
  payload: scale 
});

const setPosition = (position) => ({ 
  type: ActionTypes.SET_POSITION, 
  payload: position 
});

const setRotation = (rotation) => ({ 
  type: ActionTypes.SET_ROTATION, 
  payload: rotation 
});

const resetTransform = () => ({ 
  type: ActionTypes.RESET_TRANSFORM 
});

const setImageLoaded = (loaded) => ({ 
  type: ActionTypes.SET_IMAGE_LOADED, 
  payload: loaded 
});

const setImageSelected = (selected) => ({ 
  type: ActionTypes.SET_IMAGE_SELECTED, 
  payload: selected 
});

const setFabricReady = (ready) => ({ 
  type: ActionTypes.SET_FABRIC_READY, 
  payload: ready 
});

// Initial State
const initialState = {
  imageData: null,
  scale: 1,
  position: { x: 0, y: 0 },
  rotation: 0,
  isImageLoaded: false,
  isImageSelected: false,
  fabricReady: false
};

// Reducer
const canvasReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_IMAGE_DATA:
      return { ...state, imageData: action.payload };
    case ActionTypes.SET_SCALE:
      return { ...state, scale: action.payload };
    case ActionTypes.SET_POSITION:
      return { ...state, position: action.payload };
    case ActionTypes.SET_ROTATION:
      return { ...state, rotation: action.payload };
    case ActionTypes.RESET_TRANSFORM:
      return { ...state, scale: 1, position: { x: 0, y: 0 }, rotation: 0 };
    case ActionTypes.SET_IMAGE_LOADED:
      return { ...state, isImageLoaded: action.payload };
    case ActionTypes.SET_IMAGE_SELECTED:
      return { ...state, isImageSelected: action.payload };
    case ActionTypes.SET_FABRIC_READY:
      return { ...state, fabricReady: action.payload };
    default:
      return state;
  }
};

// Create Redux Store
const store = createStore(canvasReducer);


// Header Component
const Header = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Canvas Stencil Editor</h1>
      <p className="text-gray-600">Upload, resize, and position images within a frame using Redux & Fabric.js</p>
    </div>
  );
};

// Controls Component
const Controls = ({ onUpload, onReset, onDeselect, onZoomIn, onZoomOut, fileInputRef }) => {
  const isImageLoaded = useSelector(state => state.isImageLoaded);

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        <Upload size={20} />
        Upload Image
      </button>

      <button
        onClick={onZoomIn}
        disabled={!isImageLoaded}
        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <ZoomIn size={20} />
        Zoom In
      </button>

      <button
        onClick={onZoomOut}
        disabled={!isImageLoaded}
        className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <ZoomOut size={20} />
        Zoom Out
      </button>

      <button
        onClick={onReset}
        disabled={!isImageLoaded}
        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <RotateCcw size={20} />
        Reset
      </button>

      {isImageLoaded && (
        <button
          onClick={onDeselect}
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md"
        >
          Deselect
        </button>
      )}
    </div>
  );
};

// Canvas Component
const CanvasContainer = ({ canvasRef }) => {
  return (
    <div className="flex justify-center bg-gray-100 rounded-xl p-4 shadow-inner">
      <canvas ref={canvasRef} />
    </div>
  );
};



// Main Canvas Editor Component
const CanvasEditor = () => {
  const dispatch = useDispatch();
  const fabricReady = useSelector(state => state.fabricReady);

  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const imageObjRef = useRef(null);
  const stencilRef = useRef(null);
  const fileInputRef = useRef(null);
  const fabricLoadedRef = useRef(false);

  // Load Fabric.js library
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if Fabric.js is already loaded in the window
    if (window.fabric && !fabricReady) {
      dispatch(setFabricReady(true));
      return;
    }

    if (fabricLoadedRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js';
    script.async = true;
    script.onload = () => {
      fabricLoadedRef.current = true;
      dispatch(setFabricReady(true));
    };
    document.body.appendChild(script);

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, [dispatch, fabricReady]);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!fabricReady || !canvasRef.current || fabricCanvasRef.current) return;

    const canvas = new window.fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: '#f3f4f6',
      preserveObjectStacking: true
    });

    fabricCanvasRef.current = canvas;
    createStencil(canvas);
    setupCanvasEvents(canvas);
  }, [fabricReady, dispatch]);

  const createStencil = (canvas) => {
    const stencil = new window.fabric.Rect({
      left: 150,
      top: 150,
      width: 300,
      height: 300,
      fill: 'transparent',
      stroke: '#7a6333ff',
      strokeWidth: 10,
      rx: 20,
      ry: 20,
      selectable: false,
      evented: false,
      absolutePositioned: true
    });

    canvas.add(stencil);
    stencilRef.current = stencil;

    const text = new window.fabric.Text('Upload an image to begin', {
      left: 300,
      top: 290,
      fontSize: 16,
      fill: '#6b7280',
      fontFamily: 'Arial',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });
    canvas.add(text);
  };

  const setupCanvasEvents = (canvas) => {
    canvas.on('selection:created', (e) => {
      if (e.selected[0] === imageObjRef.current) {
        dispatch(setImageSelected(true));
      }
    });

    canvas.on('selection:updated', (e) => {
      if (e.selected[0] === imageObjRef.current) {
        dispatch(setImageSelected(true));
      } else {
        dispatch(setImageSelected(false));
      }
    });

    canvas.on('selection:cleared', () => {
      dispatch(setImageSelected(false));
    });

    canvas.on('object:modified', (e) => {
      if (e.target === imageObjRef.current) {
        const img = imageObjRef.current;
        dispatch(setScale(img.scaleX));
        dispatch(setPosition({ x: img.left, y: img.top }));
        dispatch(setRotation(img.angle));
      }
    });

    canvas.on('object:scaling', (e) => {
      if (e.target === imageObjRef.current) {
        dispatch(setScale(imageObjRef.current.scaleX));
      }
    });

    canvas.on('object:moving', (e) => {
      if (e.target === imageObjRef.current) {
        const img = imageObjRef.current;
        dispatch(setPosition({ x: img.left, y: img.top }));
      }
    });

    canvas.on('object:rotating', (e) => {
      if (e.target === imageObjRef.current) {
        dispatch(setRotation(imageObjRef.current.angle));
      }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      dispatch(setImageData(event.target.result));
      loadImageToCanvas(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const loadImageToCanvas = (imageSrc) => {
    if (!fabricCanvasRef.current || !stencilRef.current) return;

    const canvas = fabricCanvasRef.current;

    canvas.getObjects().forEach(obj => {
      if (obj.type === 'image' || (obj.type === 'text' && obj.text === 'Upload an image to begin')) {
        canvas.remove(obj);
      }
    });

    window.fabric.Image.fromURL(imageSrc, (img) => {
      const stencil = stencilRef.current;
      
      const scaleX = stencil.width / img.width;
      const scaleY = stencil.height / img.height;
      const scale = Math.max(scaleX, scaleY);

      img.set({
        left: stencil.left + stencil.width / 2,
        top: stencil.top + stencil.height / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        borderColor: '#3b82f6',
        cornerColor: '#3b82f6',
        cornerSize: 12,
        transparentCorners: false,
        cornerStyle: 'circle',
        borderScaleFactor: 2,
        lockRotation: false,
        centeredScaling: false
      });

      img.clipPath = new window.fabric.Rect({
        left: stencil.left,
        top: stencil.top,
        width: stencil.width,
        height: stencil.height,
        rx: stencil.rx,
        ry: stencil.ry,
        absolutePositioned: true
      });

      canvas.add(img);
      canvas.bringToFront(stencil);
      imageObjRef.current = img;
      
      dispatch(setImageLoaded(true));
      canvas.setActiveObject(img);
      dispatch(setImageSelected(true));
      
      dispatch(setScale(scale));
      dispatch(setPosition({ x: img.left, y: img.top }));
      dispatch(setRotation(0));
      
      canvas.renderAll();
    });
  };

  const handleReset = () => {
    if (!imageObjRef.current || !stencilRef.current) return;
    
    const img = imageObjRef.current;
    const stencil = stencilRef.current;
    
    const scaleX = stencil.width / (img.width || 1);
    const scaleY = stencil.height / (img.height || 1);
    const scale = Math.max(scaleX, scaleY);
    
    img.set({
      left: stencil.left + stencil.width / 2,
      top: stencil.top + stencil.height / 2,
      scaleX: scale,
      scaleY: scale,
      angle: 0
    });
    
    dispatch(resetTransform());
    fabricCanvasRef.current.renderAll();
  };

  const handleDeselect = () => {
    if (fabricCanvasRef.current && imageObjRef.current) {
      fabricCanvasRef.current.discardActiveObject();
      fabricCanvasRef.current.renderAll();
      dispatch(setImageSelected(false));
    }
  };

  const handleZoomIn = () => {
    if (!imageObjRef.current) return;
    
    const img = imageObjRef.current;
    const newScale = img.scaleX * 1.1;
    
    img.set({
      scaleX: newScale,
      scaleY: newScale
    });
    
    dispatch(setScale(newScale));
    fabricCanvasRef.current.renderAll();
  };

  const handleZoomOut = () => {
    if (!imageObjRef.current) return;
    
    const img = imageObjRef.current;
    const newScale = img.scaleX * 0.9;
    
    img.set({
      scaleX: newScale,
      scaleY: newScale
    });
    
    dispatch(setScale(newScale));
    fabricCanvasRef.current.renderAll();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <Header />
          <Controls 
            onUpload={handleImageUpload}
            onReset={handleReset}
            onDeselect={handleDeselect}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            fileInputRef={fileInputRef}
          />
          <CanvasContainer canvasRef={canvasRef} />

        </div>
      </div>
    </div>
  );
};

// Main App with Redux Provider
export default function App() {
  return (
    <Provider store={store}>
      <CanvasEditor />
    </Provider>
  );
}