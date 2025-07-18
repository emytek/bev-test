// src/types/quagga.d.ts

// Declare the global Quagga object
declare const Quagga: {
    init: (
      config: {
        inputStream: {
          name: string;
          type: string;
          target: HTMLElement;
          constraints: {
            width?: number | { min: number };
            height?: number | { min: number };
            aspectRatio?: { min: number; max: number };
            facingMode?: string;
            deviceId?: string;
          };
        };
        decoder: {
          readers: string[];
          debug?: {
            drawBoundingBox?: boolean;
            showFrequency?: boolean;
            drawScanline?: boolean;
            showPattern?: boolean;
          };
        };
        locator?: {
          patchSize?: string;
          halfSample?: boolean;
        };
        numOfWorkers?: number;
        frequency?: number;
        locate?: boolean;
      },
      callback: (err?: any) => void
    ) => void;
    start: () => void;
    stop: () => void;
    onDetected: (callback: (result: { codeResult: { code: string }; box: any; boxes: any[]; line: any[] }) => void) => void;
    onProcessed: (callback: (result: { box: any; boxes: any[]; codeResult?: { code: string }; line?: any[] }) => void) => void;
    offDetected: () => void;
    offProcessed: () => void;
    canvas: {
      ctx: {
        image: CanvasRenderingContext2D;
        overlay: CanvasRenderingContext2D;
      };
      dom: {
        image: HTMLCanvasElement;
        overlay: HTMLCanvasElement;
      };
    };
    ImageDebug: {
      drawPath: (path: any, options: any, ctx: CanvasRenderingContext2D, style: { color: string; lineWidth: number }) => void;
    };
  };