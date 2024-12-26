// src/mui.d.ts

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface Palette {
    chart: {
      bloodPressure: {
        systolic: string;
        diastolic: string;
      };
      bloodSugar: {
        fasting: string;
        postPrandial: string;
      };
    };
  }

  interface PaletteOptions {
    chart?: {
      bloodPressure?: {
        systolic?: string;
        diastolic?: string;
      };
      bloodSugar?: {
        fasting?: string;
        postPrandial?: string;
      };
    };
  }
}