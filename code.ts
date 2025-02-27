// This file holds the main code for the Gradient Split plugin
// It handles the color gradient generation between two colors

// Function to interpolate between two colors
function interpolateColor(color1: RGB, color2: RGB, factor: number): RGB {
  return {
    r: color1.r + (color2.r - color1.r) * factor,
    g: color1.g + (color2.g - color1.g) * factor,
    b: color1.b + (color2.b - color1.b) * factor
  };
}

// Function to convert hex color to RGB
function hexToRgb(hex: string): RGB {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  return { r, g, b };
}

// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma') {
  // Show the UI
  figma.showUI(__html__, { width: 300, height: 320 });

  // Handle messages from the UI
  figma.ui.onmessage = (msg: { 
    type: string; 
    color1?: string; 
    color2?: string; 
    splitCount?: number;
    rectangleWidth?: number;
    rectangleHeight?: number;
    spacing?: number;
  }) => {
    if (msg.type === 'create-gradient-boxes') {
      // Get parameters from the message
      const color1 = hexToRgb(msg.color1 || '#FF0000');
      const color2 = hexToRgb(msg.color2 || '#0000FF');
      const splitCount = msg.splitCount || 5;
      const rectangleWidth = msg.rectangleWidth || 100;
      const rectangleHeight = msg.rectangleHeight || 100;
      const spacing = msg.spacing || 10;
      
      // Create a frame to contain all the rectangles
      const frame = figma.createFrame();
      frame.name = "Gradient Boxes";
      frame.layoutMode = "HORIZONTAL";
      frame.counterAxisSizingMode = "AUTO";
      frame.primaryAxisSizingMode = "AUTO";
      frame.itemSpacing = spacing;
      frame.paddingLeft = spacing;
      frame.paddingRight = spacing;
      frame.paddingTop = spacing;
      frame.paddingBottom = spacing;
      frame.fills = [];
      
      const nodes: SceneNode[] = [];
      
      // Create each rectangle with its corresponding color
      for (let i = 0; i < splitCount; i++) {
        const rect = figma.createRectangle();
        rect.name = `Box ${i+1}`;
        rect.resize(rectangleWidth, rectangleHeight);
        
        // Calculate the color for this step
        const factor = splitCount > 1 ? i / (splitCount - 1) : 0;
        const interpolatedColor = interpolateColor(color1, color2, factor);
        
        // Set the fill to be the solid color
        const solidPaint: SolidPaint = {
          type: 'SOLID',
          color: interpolatedColor
        };
        rect.fills = [solidPaint];
        
        // Add the rectangle to the frame
        frame.appendChild(rect);
        nodes.push(rect);
      }
      
      // Focus on the created frame
      figma.currentPage.selection = [frame];
      figma.viewport.scrollAndZoomIntoView([frame]);
    }
    
    // Close the plugin when we're done or cancel
    if (msg.type === 'cancel' || msg.type === 'create-gradient-boxes') {
      figma.closePlugin();
    }
  };
}

// Runs this code if the plugin is run in FigJam
if (figma.editorType === 'figjam') {
  // Show the UI
  figma.showUI(__html__, { width: 300, height: 320 });

  // Handle messages from the UI
  figma.ui.onmessage = (msg: { 
    type: string; 
    color1?: string; 
    color2?: string; 
    splitCount?: number;
    rectangleWidth?: number;
    rectangleHeight?: number;
    spacing?: number;
  }) => {
    if (msg.type === 'create-gradient-boxes') {
      // Get parameters from the message
      const color1 = hexToRgb(msg.color1 || '#FF0000');
      const color2 = hexToRgb(msg.color2 || '#0000FF');
      const splitCount = msg.splitCount || 5;
      const spacing = msg.spacing || 150;
      
      const nodes: SceneNode[] = [];
      
      // Create each shape with its corresponding color
      for (let i = 0; i < splitCount; i++) {
        const shape = figma.createShapeWithText();
        shape.shapeType = 'SQUARE';
        shape.x = i * spacing;
        
        // Calculate the color for this step
        const factor = splitCount > 1 ? i / (splitCount - 1) : 0;
        const interpolatedColor = interpolateColor(color1, color2, factor);
        
        // Set the fill to be the solid color
        const solidPaint: SolidPaint = {
          type: 'SOLID',
          color: interpolatedColor
        };
        shape.fills = [solidPaint];
        
        figma.currentPage.appendChild(shape);
        nodes.push(shape);
      }
      
      // Optional: create connectors between shapes
      for (let i = 0; i < splitCount - 1; i++) {
        const connector = figma.createConnector();
        connector.strokeWeight = 4;

        connector.connectorStart = {
          endpointNodeId: nodes[i].id,
          magnet: 'AUTO',
        };

        connector.connectorEnd = {
          endpointNodeId: nodes[i + 1].id,
          magnet: 'AUTO',
        };
      }
      
      // Focus on the created shapes
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
    }
    
    // Close the plugin when we're done or cancel
    if (msg.type === 'cancel' || msg.type === 'create-gradient-boxes') {
      figma.closePlugin();
    }
  };
}