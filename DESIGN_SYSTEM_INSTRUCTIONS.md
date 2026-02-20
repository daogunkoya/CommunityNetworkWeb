# Vue 3 Design System Instructions

This document provides 3 distinct, modern design systems that can be easily toggled in your Vue 3 application. Each design system is complete with colors, typography, components, and implementation instructions.

## 🎨 Design System Overview

### System 1: **Minimalist Professional** (Clean, Corporate)
### System 2: **Modern Vibrant** (Bold, Energetic) 
### System 3: **Elegant Sophisticated** (Premium, Luxurious)

## 🌙 Dark Mode Support
Each design system includes **both light and dark mode variants** with automatic theme switching capabilities.

---

## 🏢 System 1: Minimalist Professional

### Design Philosophy
Clean, corporate, professional. Perfect for business applications and professional sports communities.

### Color Palette
```css
/* Light Mode */
:root {
  /* Primary Colors */
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  --primary-900: #0c4a6e;

  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Background Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  
  /* Text Colors */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;

  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}

/* Dark Mode */
[data-theme="dark"] {
  /* Primary Colors - Adjusted for dark mode */
  --primary-50: #0c4a6e;
  --primary-100: #0369a1;
  --primary-500: #38bdf8;
  --primary-600: #0ea5e9;
  --primary-700: #0284c7;
  --primary-900: #f0f9ff;

  /* Neutral Colors - Inverted for dark mode */
  --gray-50: #111827;
  --gray-100: #1f2937;
  --gray-200: #374151;
  --gray-300: #4b5563;
  --gray-400: #6b7280;
  --gray-500: #9ca3af;
  --gray-600: #d1d5db;
  --gray-700: #e5e7eb;
  --gray-800: #f3f4f6;
  --gray-900: #f9fafb;

  /* Background Colors - Dark theme */
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --bg-tertiary: #374151;
  
  /* Text Colors - Light for dark backgrounds */
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-tertiary: #9ca3af;

  /* Semantic Colors - Adjusted for dark mode */
  --success: #34d399;
  --warning: #fbbf24;
  --error: #f87171;
  --info: #60a5fa;
}
```

### Typography
```css
:root {
  /* Font Family */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Component Styling
```css
/* Buttons */
.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded-lg font-medium;
  @apply hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  @apply transition-colors duration-200;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium;
  @apply hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
  @apply transition-colors duration-200;
}

/* Cards */
.card {
  @apply bg-white rounded-xl border border-gray-200 shadow-sm;
  @apply hover:shadow-md transition-shadow duration-200;
}

/* Inputs */
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-primary-500;
  @apply transition-colors duration-200;
}
```

---

## 🌟 System 2: Modern Vibrant

### Design Philosophy
Bold, energetic, modern. Perfect for dynamic sports communities and youth-oriented applications.

### Color Palette
```css
:root {
  /* Primary Colors - Electric Blue */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-900: #1e3a8a;

  /* Accent Colors */
  --accent-500: #f59e0b;  /* Amber */
  --accent-600: #d97706;
  --accent-700: #b45309;

  /* Secondary Colors */
  --secondary-500: #10b981;  /* Emerald */
  --secondary-600: #059669;
  --secondary-700: #047857;

  /* Vibrant Colors */
  --vibrant-500: #8b5cf6;   /* Violet */
  --vibrant-600: #7c3aed;
  --vibrant-700: #6d28d9;

  /* Neutral Colors - Warmer */
  --gray-50: #fafaf9;
  --gray-100: #f5f5f4;
  --gray-200: #e7e5e4;
  --gray-300: #d6d3d1;
  --gray-400: #a8a29e;
  --gray-500: #78716c;
  --gray-600: #57534e;
  --gray-700: #44403c;
  --gray-800: #292524;
  --gray-900: #1c1917;
}
```

### Typography
```css
:root {
  /* Font Family - More Dynamic */
  --font-sans: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Font Sizes - Slightly Larger */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

### Component Styling
```css
/* Buttons - More Vibrant */
.btn-primary {
  @apply bg-gradient-to-r from-primary-500 to-primary-600 text-white;
  @apply px-6 py-3 rounded-xl font-semibold shadow-lg;
  @apply hover:from-primary-600 hover:to-primary-700 hover:shadow-xl;
  @apply focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  @apply transform hover:scale-105 transition-all duration-200;
}

.btn-secondary {
  @apply bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700;
  @apply px-6 py-3 rounded-xl font-semibold border border-gray-300;
  @apply hover:from-gray-200 hover:to-gray-300 hover:shadow-md;
  @apply focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
  @apply transform hover:scale-105 transition-all duration-200;
}

/* Cards - More Dynamic */
.card {
  @apply bg-white rounded-2xl border border-gray-200 shadow-lg;
  @apply hover:shadow-xl hover:border-primary-200;
  @apply transform hover:-translate-y-1 transition-all duration-300;
}

/* Inputs - More Engaging */
.input {
  @apply w-full px-4 py-3 border-2 border-gray-300 rounded-xl;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-primary-500;
  @apply transition-all duration-200 bg-gray-50;
}
```

---

## 💎 System 3: Elegant Sophisticated

### Design Philosophy
Premium, luxurious, sophisticated. Perfect for high-end sports clubs and premium applications.

### Color Palette
```css
:root {
  /* Primary Colors - Deep Navy */
  --primary-50: #f8fafc;
  --primary-100: #f1f5f9;
  --primary-500: #475569;
  --primary-600: #334155;
  --primary-700: #1e293b;
  --primary-800: #0f172a;
  --primary-900: #020617;

  /* Accent Colors - Gold */
  --accent-500: #f59e0b;
  --accent-600: #d97706;
  --accent-700: #b45309;
  --accent-800: #92400e;

  /* Secondary Colors - Deep Purple */
  --secondary-500: #7c3aed;
  --secondary-600: #6d28d9;
  --secondary-700: #5b21b6;
  --secondary-800: #4c1d95;

  /* Neutral Colors - Cool Grays */
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
}
```

### Typography
```css
:root {
  /* Font Family - Elegant */
  --font-sans: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-serif: 'Playfair Display', 'Times New Roman', serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;

  /* Font Sizes - Refined */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 3.75rem;   /* 60px */

  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Component Styling
```css
/* Buttons - Elegant */
.btn-primary {
  @apply bg-gradient-to-r from-primary-700 to-primary-800 text-white;
  @apply px-8 py-4 rounded-lg font-medium shadow-lg;
  @apply hover:from-primary-800 hover:to-primary-900 hover:shadow-xl;
  @apply focus:ring-2 focus:ring-accent-500 focus:ring-offset-2;
  @apply transition-all duration-300 ease-in-out;
  @apply border border-primary-600;
}

.btn-secondary {
  @apply bg-white text-primary-700 border-2 border-primary-200;
  @apply px-8 py-4 rounded-lg font-medium;
  @apply hover:bg-primary-50 hover:border-primary-300 hover:shadow-md;
  @apply focus:ring-2 focus:ring-accent-500 focus:ring-offset-2;
  @apply transition-all duration-300 ease-in-out;
}

/* Cards - Sophisticated */
.card {
  @apply bg-white rounded-lg border border-gray-200 shadow-lg;
  @apply hover:shadow-xl hover:border-accent-200;
  @apply transition-all duration-300 ease-in-out;
  @apply backdrop-blur-sm;
}

.card-premium {
  @apply bg-gradient-to-br from-white to-gray-50;
  @apply border border-accent-200 shadow-2xl;
  @apply hover:shadow-3xl hover:border-accent-300;
}

/* Inputs - Refined */
.input {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg;
  @apply focus:ring-2 focus:ring-accent-500 focus:border-accent-500;
  @apply transition-all duration-300 ease-in-out;
  @apply bg-white placeholder-gray-400;
}
```

---

## 🔄 Design System Toggle Implementation

### 1. Design System Configuration
```javascript
// config/designSystem.js
export const DESIGN_SYSTEMS = {
  MINIMALIST: {
    name: 'Minimalist Professional',
    id: 'minimalist',
    colors: {
      primary: 'blue',
      accent: 'gray',
      style: 'clean'
    },
    typography: 'Inter',
    borderRadius: 'rounded-lg',
    shadows: 'subtle'
  },
  VIBRANT: {
    name: 'Modern Vibrant',
    id: 'vibrant',
    colors: {
      primary: 'blue',
      accent: 'amber',
      style: 'bold'
    },
    typography: 'Poppins',
    borderRadius: 'rounded-xl',
    shadows: 'prominent'
  },
  SOPHISTICATED: {
    name: 'Elegant Sophisticated',
    id: 'sophisticated',
    colors: {
      primary: 'navy',
      accent: 'gold',
      style: 'elegant'
    },
    typography: 'Inter',
    borderRadius: 'rounded-lg',
    shadows: 'luxury'
  }
}

export function getDesignSystem(systemId) {
  return DESIGN_SYSTEMS[systemId.toUpperCase()] || DESIGN_SYSTEMS.MINIMALIST
}
```

### 2. Vue 3 Composable for Design System with Dark Mode
```javascript
// composables/useDesignSystem.js
import { ref, computed, watch } from 'vue'
import { DESIGN_SYSTEMS, getDesignSystem } from '@/config/designSystem'

const currentSystem = ref('minimalist')
const isDarkMode = ref(false)

export function useDesignSystem() {
  // System Management
  const setDesignSystem = (systemId) => {
    currentSystem.value = systemId
    localStorage.setItem('design-system', systemId)
    applyTheme()
  }

  // Dark Mode Management
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('dark-mode', isDarkMode.value.toString())
    applyTheme()
  }

  const setDarkMode = (dark) => {
    isDarkMode.value = dark
    localStorage.setItem('dark-mode', dark.toString())
    applyTheme()
  }

  // Apply theme to DOM
  const applyTheme = () => {
    const root = document.documentElement
    const system = getDesignSystem(currentSystem.value)
    
    // Remove existing theme classes
    root.className = root.className.replace(/design-system-\w+/g, '')
    root.className = root.className.replace(/theme-\w+/g, '')
    
    // Apply new theme classes
    root.classList.add(`design-system-${system.id}`)
    root.classList.add(`theme-${isDarkMode.value ? 'dark' : 'light'}`)
    
    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
    
    // Apply CSS variables
    applyCSSVariables(system)
  }

  const applyCSSVariables = (system) => {
    const root = document.documentElement
    
    // Apply system-specific CSS variables
    Object.entries(system.colors).forEach(([key, value]) => {
      root.style.setProperty(`--design-${key}`, value)
    })
    
    // Apply theme-specific variables
    root.style.setProperty('--theme-mode', isDarkMode.value ? 'dark' : 'light')
  }

  // Computed properties
  const designSystem = computed(() => getDesignSystem(currentSystem.value))
  const availableSystems = computed(() => Object.values(DESIGN_SYSTEMS))
  const themeMode = computed(() => isDarkMode.value ? 'dark' : 'light')
  
  // Theme combinations
  const currentTheme = computed(() => ({
    system: designSystem.value,
    mode: themeMode.value,
    isDark: isDarkMode.value,
    classes: `design-system-${designSystem.value.id} theme-${themeMode.value}`
  }))

  // Initialize from localStorage
  const initializeTheme = () => {
    const savedSystem = localStorage.getItem('design-system')
    const savedDarkMode = localStorage.getItem('dark-mode')
    
    if (savedSystem) {
      currentSystem.value = savedSystem
    }
    
    if (savedDarkMode !== null) {
      isDarkMode.value = savedDarkMode === 'true'
    } else {
      // Auto-detect system preference
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    applyTheme()
  }

  // Watch for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('dark-mode')) {
      isDarkMode.value = e.matches
      applyTheme()
    }
  })

  // Initialize on first load
  initializeTheme()

  return {
    // System management
    designSystem,
    currentSystem,
    setDesignSystem,
    availableSystems,
    
    // Dark mode management
    isDarkMode,
    themeMode,
    toggleDarkMode,
    setDarkMode,
    
    // Combined theme
    currentTheme,
    
    // Utility functions
    applyTheme
  }
}
```

### 3. Enhanced Design System Toggle Component with Dark Mode
```vue
<!-- components/DesignSystemToggle.vue -->
<template>
  <div class="design-system-toggle p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Settings</h3>
    
    <!-- Design System Selection -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Design System:
      </label>
      <select 
        v-model="currentSystem"
        @change="setDesignSystem(currentSystem)"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm 
               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
               focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option 
          v-for="system in availableSystems" 
          :key="system.id"
          :value="system.id"
        >
          {{ system.name }}
        </option>
      </select>
    </div>
    
    <!-- Dark Mode Toggle -->
    <div class="mb-4">
      <label class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Dark Mode:
        </span>
        <button
          @click="toggleDarkMode"
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            isDarkMode ? 'bg-primary-600' : 'bg-gray-200'
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              isDarkMode ? 'translate-x-6' : 'translate-x-1'
            ]"
          />
        </button>
      </label>
    </div>
    
    <!-- Visual Preview Buttons -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Quick Switch:
      </label>
      <div class="grid grid-cols-3 gap-2">
        <button 
          v-for="system in availableSystems"
          :key="system.id"
          @click="setDesignSystem(system.id)"
          :class="[
            'px-3 py-2 rounded-md text-xs font-medium transition-all',
            'border border-gray-300 dark:border-gray-600',
            currentSystem === system.id 
              ? 'bg-primary-500 text-white border-primary-500' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          {{ system.name }}
        </button>
      </div>
    </div>
    
    <!-- Theme Preview -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</h4>
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="setDarkMode(false)"
          :class="[
            'px-3 py-2 rounded-md text-xs font-medium transition-all',
            'border',
            !isDarkMode 
              ? 'bg-gray-100 text-gray-900 border-gray-300' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          ]"
        >
          ☀️ Light
        </button>
        <button
          @click="setDarkMode(true)"
          :class="[
            'px-3 py-2 rounded-md text-xs font-medium transition-all',
            'border',
            isDarkMode 
              ? 'bg-gray-800 text-white border-gray-600' 
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          ]"
        >
          🌙 Dark
        </button>
      </div>
    </div>
    
    <!-- Current Theme Info -->
    <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
      <div class="text-xs text-gray-600 dark:text-gray-400">
        <div>System: <span class="font-medium">{{ designSystem.name }}</span></div>
        <div>Mode: <span class="font-medium">{{ themeMode }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDesignSystem } from '@/composables/useDesignSystem'

const { 
  currentSystem, 
  setDesignSystem, 
  availableSystems,
  isDarkMode,
  themeMode,
  toggleDarkMode,
  setDarkMode,
  designSystem
} = useDesignSystem()
</script>
```

### 4. Enhanced CSS Implementation with Dark Mode
```css
/* styles/design-systems.css */

/* Base styles for all systems */
:root {
  /* Common variables */
  --transition-base: all 0.2s ease-in-out;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  /* Dark mode shadows */
  --shadow-sm-dark: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md-dark: 0 4px 6px -1px rgb(0 0 0 / 0.4);
  --shadow-lg-dark: 0 10px 15px -3px rgb(0 0 0 / 0.4);
  --shadow-xl-dark: 0 20px 25px -5px rgb(0 0 0 / 0.4);
}

/* System 1: Minimalist Professional - Light Mode */
.design-system-minimalist {
  --primary-color: #0ea5e9;
  --primary-hover: #0284c7;
  --accent-color: #6b7280;
  --background: #ffffff;
  --surface: #f9fafb;
  --surface-secondary: #f3f4f6;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  --border-color: #e5e7eb;
  --border-color-light: #f3f4f6;
  --border-radius: 0.5rem;
  --font-family: 'Inter', sans-serif;
}

/* System 1: Minimalist Professional - Dark Mode */
.design-system-minimalist[data-theme="dark"] {
  --primary-color: #38bdf8;
  --primary-hover: #0ea5e9;
  --accent-color: #9ca3af;
  --background: #111827;
  --surface: #1f2937;
  --surface-secondary: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-tertiary: #9ca3af;
  --border-color: #374151;
  --border-color-light: #4b5563;
}

/* System 2: Modern Vibrant - Light Mode */
.design-system-vibrant {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --accent-color: #f59e0b;
  --background: #ffffff;
  --surface: #fafaf9;
  --surface-secondary: #f5f5f4;
  --text-primary: #1c1917;
  --text-secondary: #78716c;
  --text-tertiary: #a8a29e;
  --border-color: #e7e5e4;
  --border-color-light: #f5f5f4;
  --border-radius: 0.75rem;
  --font-family: 'Poppins', sans-serif;
}

/* System 2: Modern Vibrant - Dark Mode */
.design-system-vibrant[data-theme="dark"] {
  --primary-color: #60a5fa;
  --primary-hover: #3b82f6;
  --accent-color: #fbbf24;
  --background: #1c1917;
  --surface: #292524;
  --surface-secondary: #44403c;
  --text-primary: #fafaf9;
  --text-secondary: #d6d3d1;
  --text-tertiary: #a8a29e;
  --border-color: #44403c;
  --border-color-light: #57534e;
}

/* System 3: Elegant Sophisticated - Light Mode */
.design-system-sophisticated {
  --primary-color: #334155;
  --primary-hover: #1e293b;
  --accent-color: #f59e0b;
  --background: #ffffff;
  --surface: #f8fafc;
  --surface-secondary: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  --border-color: #e2e8f0;
  --border-color-light: #f1f5f9;
  --border-radius: 0.5rem;
  --font-family: 'Inter', sans-serif;
}

/* System 3: Elegant Sophisticated - Dark Mode */
.design-system-sophisticated[data-theme="dark"] {
  --primary-color: #64748b;
  --primary-hover: #334155;
  --accent-color: #fbbf24;
  --background: #0f172a;
  --surface: #1e293b;
  --surface-secondary: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --border-color: #334155;
  --border-color-light: #475569;
}

/* Apply system variables to components */
.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius);
  font-family: var(--font-family);
  transition: var(--transition-base);
  border: 1px solid var(--primary-color);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
}

.btn-secondary {
  background-color: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-family: var(--font-family);
  transition: var(--transition-base);
}

.btn-secondary:hover {
  background-color: var(--surface-secondary);
  border-color: var(--accent-color);
}

.card {
  background-color: var(--background);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-family: var(--font-family);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--border-color-light);
}

[data-theme="dark"] .card:hover {
  box-shadow: var(--shadow-md-dark);
}

.input {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-family: var(--font-family);
  background-color: var(--background);
  color: var(--text-primary);
  transition: var(--transition-base);
}

.input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(var(--primary-color) / 0.1);
}

.input::placeholder {
  color: var(--text-tertiary);
}

/* Dark mode specific adjustments */
[data-theme="dark"] {
  color-scheme: dark;
}

[data-theme="dark"] .card {
  box-shadow: var(--shadow-sm-dark);
}

/* Smooth transitions for theme switching */
* {
  transition: background-color 0.2s ease-in-out, 
              border-color 0.2s ease-in-out, 
              color 0.2s ease-in-out,
              box-shadow 0.2s ease-in-out;
}

/* Disable transitions during theme switching to prevent flashing */
.theme-transitioning * {
  transition: none !important;
}
```

---

## 🚀 Implementation Instructions for Next AI

### Step 1: Setup Design System Files
```bash
# Create design system files
mkdir -p src/config src/composables src/styles
touch src/config/designSystem.js
touch src/composables/useDesignSystem.js
touch src/components/DesignSystemToggle.vue
touch src/styles/design-systems.css
```

### Step 2: Install Required Dependencies
```bash
npm install @tailwindcss/forms @tailwindcss/typography
npm install @fontsource/inter @fontsource/poppins @fontsource/playfair-display
```

### Step 3: Configure Tailwind CSS
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          900: 'var(--primary-900)',
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
}
```

### Step 4: Integrate with Main App
```vue
<!-- App.vue -->
<template>
  <div id="app" :class="designSystemClass">
    <DesignSystemToggle />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDesignSystem } from '@/composables/useDesignSystem'
import DesignSystemToggle from '@/components/DesignSystemToggle.vue'

const { designSystem } = useDesignSystem()
const designSystemClass = computed(() => `design-system-${designSystem.value.id}`)
</script>

<style>
@import '@/styles/design-systems.css';
</style>
```

---

## 🎯 Key Features for Next AI to Implement

### 1. **Responsive Design**
- Mobile-first approach for all systems
- Consistent breakpoints across systems
- Touch-friendly interactions

### 2. **Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast modes

### 3. **Performance**
- CSS custom properties for theming
- Minimal bundle size impact
- Smooth transitions and animations
- Optimized font loading

### 4. **Developer Experience**
- Easy system switching
- Consistent component API
- Clear documentation
- TypeScript support

This design system provides a solid foundation for creating modern, sophisticated, and flexible Vue 3 applications that can easily adapt to different design requirements while maintaining consistency and quality.
