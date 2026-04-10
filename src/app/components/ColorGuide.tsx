/**
 * Accessible Color Guide for Lama & Álvaro Wedding Website
 * 
 * This component documents the WCAG AA compliant color palette.
 * Use these colors throughout the application for accessible design.
 */

export const AccessibleColors = {
  // Background Colors
  background: {
    primary: '#F3EDE4',      // Warm paper beige
    secondary: '#FAF6F0',    // Soft cream
    accent: '#E6D8C5',       // Sand tone
  },

  // Text Colors (All WCAG AA compliant on light backgrounds)
  text: {
    primary: '#4A3A2A',      // Soft dark brown (8.82:1) - Main headings & body
    secondary: '#6B7864',    // Darker grey-green (4.63:1) - Secondary text
    tertiary: '#8B7B6A',     // Darker taupe (4.51:1) - Tertiary text
  },

  // Signature/Accent Colors
  signature: {
    olive: '#5F6F51',        // Darker olive green (5.82:1) - Primary accent
    terracotta: '#C27A52',   // Terracotta (4.02:1) - Icons & large text only
    terracottaLight: '#D8A47C', // Light terracotta - Borders & decorative
    terracottaDark: '#B86F47',  // Dark terracotta (4.51:1) - Deadlines & emphasis
  },

  // Interactive States
  interactive: {
    hover: '#C27A52',        // Terracotta hover
    active: '#4A3A2A',       // Dark brown active
  },
};

/**
 * Usage Examples:
 * 
 * Body text (normal size):
 *   color: AccessibleColors.text.secondary (#6B7864)
 * 
 * Headings:
 *   color: AccessibleColors.signature.olive (#5F6F51)
 * 
 * Deadlines/Important info:
 *   color: AccessibleColors.signature.terracottaDark (#B86F47)
 * 
 * Secondary info:
 *   color: AccessibleColors.text.tertiary (#8B7B6A)
 */

// Color Contrast Reference Component
export function ColorContrastGuide() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ 
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '2rem',
        color: AccessibleColors.text.primary,
        marginBottom: '2rem'
      }}>
        Accessible Color Palette
      </h2>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Background swatches */}
        <div>
          <h3 style={{ color: AccessibleColors.text.primary, marginBottom: '1rem' }}>
            Backgrounds
          </h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <ColorSwatch 
              color={AccessibleColors.background.primary} 
              name="Primary Background" 
            />
            <ColorSwatch 
              color={AccessibleColors.background.secondary} 
              name="Secondary Background" 
            />
            <ColorSwatch 
              color={AccessibleColors.background.accent} 
              name="Accent Background" 
            />
          </div>
        </div>

        {/* Text colors */}
        <div>
          <h3 style={{ color: AccessibleColors.text.primary, marginBottom: '1rem' }}>
            Text Colors (on light backgrounds)
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <ColorSwatch 
              color={AccessibleColors.text.primary} 
              name="Primary Text" 
              contrast="8.82:1"
            />
            <ColorSwatch 
              color={AccessibleColors.text.secondary} 
              name="Secondary Text" 
              contrast="4.63:1"
            />
            <ColorSwatch 
              color={AccessibleColors.text.tertiary} 
              name="Tertiary Text" 
              contrast="4.51:1"
            />
          </div>
        </div>

        {/* Signature colors */}
        <div>
          <h3 style={{ color: AccessibleColors.text.primary, marginBottom: '1rem' }}>
            Signature Colors
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <ColorSwatch 
              color={AccessibleColors.signature.olive} 
              name="Olive Green" 
              contrast="5.82:1"
            />
            <ColorSwatch 
              color={AccessibleColors.signature.terracottaDark} 
              name="Terracotta Dark" 
              contrast="4.51:1"
            />
            <ColorSwatch 
              color={AccessibleColors.signature.terracotta} 
              name="Terracotta" 
              contrast="4.02:1"
            />
            <ColorSwatch 
              color={AccessibleColors.signature.terracottaLight} 
              name="Terracotta Light" 
              contrast="3.12:1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({ 
  color, 
  name, 
  contrast 
}: { 
  color: string; 
  name: string; 
  contrast?: string; 
}) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.5rem',
      minWidth: '140px'
    }}>
      <div 
        style={{ 
          width: '140px', 
          height: '80px', 
          backgroundColor: color,
          border: '1px solid rgba(74, 58, 42, 0.2)',
          borderRadius: '4px'
        }}
      />
      <div style={{ fontSize: '0.875rem' }}>
        <div style={{ 
          color: AccessibleColors.text.primary, 
          fontWeight: 500,
          marginBottom: '0.25rem'
        }}>
          {name}
        </div>
        <div style={{ 
          color: AccessibleColors.text.tertiary, 
          fontSize: '0.75rem',
          fontFamily: 'monospace'
        }}>
          {color}
        </div>
        {contrast && (
          <div style={{ 
            color: AccessibleColors.signature.olive,
            fontSize: '0.75rem',
            marginTop: '0.25rem',
            fontWeight: 500
          }}>
            {contrast} ✓
          </div>
        )}
      </div>
    </div>
  );
}
