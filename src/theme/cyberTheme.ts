// ============================================================================
// CYBER THEME: Centralized Design System for Futuristic Cyberpunk 3D Library
// 75% Dark Neutral / 15% Cool Glass / 10% Controlled Accent Illumination
// Designed for extreme visual elegance, eye comfort, and prolonged readability.
// ============================================================================

export const CYBER_THEME = {
  // --- 1. Backgrounds & Deep Spatial Layers ---
  bg: {
    void: '#030712',          // Deepest spatial void
    primary: '#050914',       // Primary library floor & wall baseline
    secondary: '#08111F',     // Secondary structural backdrop
    elevated: '#0B1220',      // Elevated platform panels
    card: '#0E1728',          // Deepest content container
    border: 'rgba(85, 223, 255, 0.12)',
  },

  // --- 2. Surface & Panel Materials ---
  surface: {
    base: '#101A2B',
    hover: '#142137',
    active: '#17263D',
    highlight: 'rgba(85, 223, 255, 0.08)',
  },

  // --- 3. Glassmorphism System ---
  glass: {
    panel: 'rgba(8, 15, 30, 0.70)',
    panelDense: 'rgba(6, 12, 24, 0.88)',
    panelSubtle: 'rgba(10, 20, 40, 0.45)',
    border: 'rgba(85, 223, 255, 0.18)',
    borderSubtle: 'rgba(100, 140, 200, 0.12)',
    borderGlow: 'rgba(85, 223, 255, 0.42)',
    borderViolet: 'rgba(155, 124, 255, 0.28)',
    blur: 'backdrop-blur-xl',
    shadow: '0 20px 50px rgba(0, 3, 10, 0.75), 0 0 30px rgba(6, 182, 212, 0.08)',
    shadowGlow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(85, 223, 255, 0.15)',
  },

  // --- 4. Controlled Accent Colors ---
  accent: {
    cyan: '#06B6D4',
    cyanBright: '#55DFFF',
    cyanDim: '#0891B2',
    cyanGlow: 'rgba(85, 223, 255, 0.25)',

    blue: '#3B82F6',
    blueBright: '#5EA7FF',
    blueDim: '#1D4ED8',

    violet: '#8B5CF6',
    violetBright: '#9B7CFF',
    violetDim: '#6D28D9',
    violetGlow: 'rgba(155, 124, 255, 0.22)',

    magenta: '#D946EF',
    magentaBright: '#D67CFF', // Sparing accents only

    emerald: '#10B981',
    emeraldBright: '#55D6A6',

    gold: '#F59E0B',
    goldBright: '#FBBF24',
  },

  // --- 5. Eye-Comfort Typography ---
  text: {
    primary: '#F4F8FF',       // High contrast crisp white
    secondary: '#AAB8CC',     // Soft cool silver for descriptions
    muted: '#71809A',         // Technical labels and meta hints
    cyan: '#55DFFF',
    violet: '#9B7CFF',
  },

  // --- 6. Lighting Setups per Atmosphere Mode ---
  lighting: {
    day: {
      backgroundColor: '#040914',
      fogColor: '#050D1A',
      fogNear: 55,
      fogFar: 220,
      ambientColor: '#D8ECF8',
      ambientIntensity: 0.95,
      sunColor: '#A5F3FC',
      sunIntensity: 1.15,
      sunPos: [15, 22, -10] as [number, number, number],
      hallAccentColor: '#22D3EE',
      hallAccentIntensity: 0.85,
    },
    evening: {
      backgroundColor: '#080514',
      fogColor: '#0C081E',
      fogNear: 50,
      fogFar: 210,
      ambientColor: '#DDD6FE',
      ambientIntensity: 0.85,
      sunColor: '#C084FC',
      sunIntensity: 1.05,
      sunPos: [-20, 14, -20] as [number, number, number],
      hallAccentColor: '#8B5CF6',
      hallAccentIntensity: 1.0,
    },
    night: {
      backgroundColor: '#02040A',
      fogColor: '#030612',
      fogNear: 45,
      fogFar: 195,
      ambientColor: '#67E8F9',
      ambientIntensity: 0.70,
      sunColor: '#38BDF8',
      sunIntensity: 0.55,
      sunPos: [0, 20, 0] as [number, number, number],
      hallAccentColor: '#06B6D4',
      hallAccentIntensity: 1.15,
    },
  },
} as const;
