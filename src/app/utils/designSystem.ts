/**
 * Design System for Lama & Álvaro Wedding Website
 * Accessible, consistent states for all interactive elements
 */

export const DesignSystem = {
  // ============ COLOR TOKENS ============
  colors: {
    // Backgrounds
    background: {
      primary: '#F3EDE4',      // Main page background
      secondary: '#FAF6F0',    // Card/section background
      tertiary: '#E6D8C5',     // Subtle accents
    },
    
    // Text
    text: {
      primary: '#4A3A2A',      // Main headings & body (8.82:1)
      secondary: '#6B7864',    // Secondary text (4.63:1)
      tertiary: '#8B7B6A',     // Tertiary/muted text (4.51:1)
      disabled: '#B5AFA5',     // Disabled text (2.8:1)
    },
    
    // Signature/Brand
    signature: {
      olive: '#5F6F51',        // Primary brand color (5.82:1)
      oliveLight: '#8A9A7C',   // Lighter olive for subtle states
      terracotta: '#C27A52',   // Secondary brand/hover
      terracottaDark: '#B86F47', // Emphasis/deadlines
      terracottaLight: '#D8A47C', // Borders/decorative
    },
    
    // Interactive States
    state: {
      default: '#4A3A2A',
      hover: '#C27A52',
      active: '#B86F47',
      disabled: '#B5AFA5',
      selected: '#5F6F51',
    }
  },

  // ============ BUTTON STATES ============
  button: {
    primary: {
      default: {
        backgroundColor: 'transparent',
        borderColor: '#5F6F51',
        color: '#5F6F51',
        borderWidth: '1px',
      },
      hover: {
        backgroundColor: '#5F6F51',
        borderColor: '#5F6F51',
        color: '#FAF6F0',
      },
      active: {
        backgroundColor: '#4F5F41',
        borderColor: '#4F5F41',
        color: '#FAF6F0',
      },
      disabled: {
        backgroundColor: 'transparent',
        borderColor: '#B5AFA5',
        color: '#B5AFA5',
        cursor: 'not-allowed',
        opacity: 0.5,
      }
    },
    
    secondary: {
      default: {
        backgroundColor: 'transparent',
        borderColor: '#8B7B6A',
        color: '#8B7B6A',
        borderWidth: '1px',
      },
      hover: {
        backgroundColor: '#8B7B6A',
        borderColor: '#8B7B6A',
        color: '#FAF6F0',
      },
      active: {
        backgroundColor: '#7B6B5A',
        borderColor: '#7B6B5A',
        color: '#FAF6F0',
      },
      disabled: {
        backgroundColor: 'transparent',
        borderColor: '#B5AFA5',
        color: '#B5AFA5',
        cursor: 'not-allowed',
        opacity: 0.5,
      }
    },
    
    accent: {
      default: {
        backgroundColor: 'transparent',
        borderColor: '#C27A52',
        color: '#C27A52',
        borderWidth: '1px',
      },
      hover: {
        backgroundColor: '#C27A52',
        borderColor: '#C27A52',
        color: '#FAF6F0',
      },
      active: {
        backgroundColor: '#B86F47',
        borderColor: '#B86F47',
        color: '#FAF6F0',
      },
      disabled: {
        backgroundColor: 'transparent',
        borderColor: '#B5AFA5',
        color: '#B5AFA5',
        cursor: 'not-allowed',
        opacity: 0.5,
      }
    }
  },

  // ============ SELECTION STATES (Radio, Checkbox, Cards) ============
  selection: {
    unselected: {
      backgroundColor: '#FAF6F0',
      borderColor: 'rgba(111, 127, 95, 0.2)',
      color: '#6B7864',
      borderWidth: '1px',
    },
    hover: {
      backgroundColor: 'rgba(250, 246, 240, 1)',
      borderColor: '#8A9A7C',
      color: '#5F6F51',
    },
    selected: {
      backgroundColor: 'rgba(95, 111, 81, 0.05)',
      borderColor: '#5F6F51',
      color: '#5F6F51',
      borderWidth: '2px',
    },
    disabled: {
      backgroundColor: 'rgba(243, 237, 228, 0.5)',
      borderColor: '#B5AFA5',
      color: '#B5AFA5',
      cursor: 'not-allowed',
      opacity: 0.6,
    }
  },

  // ============ INPUT STATES ============
  input: {
    default: {
      backgroundColor: '#FAF6F0',
      borderColor: 'rgba(107, 120, 100, 0.25)',
      color: '#4A3A2A',
      borderWidth: '1px',
    },
    focus: {
      backgroundColor: '#FAF6F0',
      borderColor: '#5F6F51',
      color: '#4A3A2A',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(95, 111, 81, 0.1)',
    },
    error: {
      backgroundColor: '#FAF6F0',
      borderColor: '#C27A52',
      color: '#4A3A2A',
    },
    disabled: {
      backgroundColor: 'rgba(243, 237, 228, 0.5)',
      borderColor: '#B5AFA5',
      color: '#B5AFA5',
      cursor: 'not-allowed',
    }
  },

  // ============ TYPOGRAPHY ============
  typography: {
    heading: {
      primary: {
        fontFamily: 'Cormorant Garamond, serif',
        color: '#4A3A2A',
        fontWeight: 400,
      },
      secondary: {
        fontFamily: 'Cormorant Garamond, serif',
        color: '#5F6F51',
        fontWeight: 400,
      },
      accent: {
        fontFamily: 'Cormorant Garamond, serif',
        color: '#C27A52',
        fontWeight: 400,
      }
    },
    body: {
      primary: {
        fontFamily: 'Inter, sans-serif',
        color: '#4A3A2A',
        fontWeight: 400,
      },
      secondary: {
        fontFamily: 'Inter, sans-serif',
        color: '#6B7864',
        fontWeight: 400,
      },
      tertiary: {
        fontFamily: 'Inter, sans-serif',
        color: '#8B7B6A',
        fontWeight: 400,
      }
    },
    label: {
      default: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.875rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        color: '#8B7B6A',
        fontWeight: 400,
      },
      required: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.875rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        color: '#6B7864',
        fontWeight: 500,
      }
    }
  },

  // ============ SPACING ============
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px
  },

  // ============ TRANSITIONS ============
  transition: {
    fast: '150ms ease-in-out',
    medium: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  }
};

// ============ HELPER FUNCTIONS ============

/**
 * Apply button styles based on variant and state
 */
export function getButtonStyles(
  variant: 'primary' | 'secondary' | 'accent',
  state: 'default' | 'hover' | 'active' | 'disabled' = 'default',
  isDisabled: boolean = false
) {
  const effectiveState = isDisabled ? 'disabled' : state;
  return {
    ...DesignSystem.button[variant][effectiveState],
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    transition: DesignSystem.transition.medium,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
  };
}

/**
 * Apply selection card styles based on state
 */
export function getSelectionStyles(
  isSelected: boolean,
  isHovered: boolean = false,
  isDisabled: boolean = false
) {
  if (isDisabled) return DesignSystem.selection.disabled;
  if (isSelected) return DesignSystem.selection.selected;
  if (isHovered) return DesignSystem.selection.hover;
  return DesignSystem.selection.unselected;
}

/**
 * Apply input styles based on state
 */
export function getInputStyles(
  state: 'default' | 'focus' | 'error' | 'disabled' = 'default',
  isDisabled: boolean = false
) {
  const effectiveState = isDisabled ? 'disabled' : state;
  return {
    ...DesignSystem.input[effectiveState],
    fontFamily: 'Inter, sans-serif',
    fontSize: '1rem',
    padding: '0.75rem 1rem',
    transition: DesignSystem.transition.fast,
  };
}
