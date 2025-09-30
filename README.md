# Canvas Stencil Editor

A React-based image editor that allows users to upload, resize, rotate, and position images within a stencil frame using Redux for state management and Fabric.js for canvas manipulation.

## Features

- 🖼️ **Image Upload**: Upload images from your local device
- 🔍 **Zoom Controls**: Zoom in and out of images
- 🔄 **Rotation**: Rotate images freely within the stencil
- 📐 **Positioning**: Drag and move images within the frame
- 🎯 **Stencil Clipping**: Images are clipped to stay within the defined stencil boundary
- ♻️ **Reset Function**: Reset image to original size and position
- 🎨 **Redux State Management**: Centralized state management for all transformations

## Technologies Used

- **React**: UI component library
- **Redux**: State management
- **Fabric.js**: Canvas manipulation library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

**01. Clone or create your project**

```bash
npm create vite@latest canvas-stencil-editor -- --template react
cd canvas-stencil-editor
```

**02. Install dependencies**

```bash
npm install react-redux redux lucide-react
```

**03. Install Tailwind CSS**

```bash
npm install tailwindcss @tailwindcss/vite
```

**04. Configure the Vite plugin**

Add the `@tailwindcss/vite` plugin to your Vite configuration.

`vite.config.ts`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

**05. Import Tailwind CSS**

Add an `@import` to your CSS file that imports Tailwind CSS.

`src/index.css`

```css
@import "tailwindcss";
```

**06. Add the component**

Replace the content of `src/App.jsx` with the Canvas Stencil Editor component code.

**07. Start the development server**

```bash
npm run dev
```

## Usage

1. **Upload Image**: Click the "Upload Image" button to select an image from your device
2. **Transform Image**: Once uploaded, the image is automatically selected and can be:
   - Dragged to reposition
   - Scaled using corner handles
   - Rotated using the rotation handle
3. **Zoom Controls**: Use "Zoom In" and "Zoom Out" buttons for precise scaling
4. **Reset**: Click "Reset" to return the image to its initial size and position
5. **Deselect**: Click "Deselect" to remove selection handles from the image

## How It Works

### Redux State Management

The application uses Redux to manage:
- `imageData`: Base64 encoded image data
- `scale`: Current scale factor of the image
- `position`: X and Y coordinates of the image
- `rotation`: Current rotation angle in degrees
- `isImageLoaded`: Boolean indicating if an image is loaded
- `isImageSelected`: Boolean indicating if the image is selected
- `fabricReady`: Boolean indicating if Fabric.js library is loaded

### Fabric.js Canvas

- A 600x600 canvas is created with a centered stencil frame (300x300)
- Images are loaded and automatically scaled to fit the stencil
- A clip path ensures images stay within the stencil boundaries
- All transformations (move, scale, rotate) are tracked and synced with Redux

### Component Structure

```
App (Redux Provider)
└── CanvasEditor
    ├── Header
    ├── Controls
    └── CanvasContainer
```

## Customization

### Stencil Size

Modify the stencil dimensions in the `createStencil` function:

```javascript
const stencil = new window.fabric.Rect({
  left: 150,
  top: 150,
  width: 300,  // Change width
  height: 300, // Change height
  // ...
});
```

### Canvas Size

Adjust canvas dimensions in the Fabric.js initialization:

```javascript
const canvas = new window.fabric.Canvas(canvasRef.current, {
  width: 600,  // Change width
  height: 600, // Change height
  // ...
});
```

### Stencil Style

Modify the stencil appearance:

```javascript
const stencil = new window.fabric.Rect({
  // ...
  stroke: '#7a6333ff', // Border color
  strokeWidth: 10,     // Border width
  rx: 20,              // Border radius X
  ry: 20,              // Border radius Y
});
```

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript
- HTML5 Canvas
- FileReader API

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on the GitHub repository.