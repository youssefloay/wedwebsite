import { DesignSystem } from '../utils/designSystem';
import { Button, SelectionCard, Input, Textarea, Select } from './ui/FormComponents';
import { useState } from 'react';

/**
 * Design System Documentation & Examples
 * View at /design-system (add route if needed)
 */

export function DesignSystemDemo() {
  const [selectedOption, setSelectedOption] = useState('option1');
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  return (
    <div style={{ backgroundColor: DesignSystem.colors.background.primary, minHeight: '100vh', padding: '4rem 2rem' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: 400,
              color: DesignSystem.colors.text.primary,
              marginBottom: '1rem'
            }}
          >
            Design System
          </h1>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              color: DesignSystem.colors.text.secondary,
              lineHeight: 1.7
            }}
          >
            Lama & Álvaro Wedding Website
          </p>
        </div>

        {/* Color Palette */}
        <section className="mb-16">
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2rem',
              fontWeight: 400,
              color: DesignSystem.colors.signature.olive,
              marginBottom: '2rem'
            }}
          >
            Color Palette
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Text Colors */}
            <ColorSwatch
              name="Primary Text"
              color={DesignSystem.colors.text.primary}
              contrast="8.82:1"
              usage="Headings, main body text"
            />
            <ColorSwatch
              name="Secondary Text"
              color={DesignSystem.colors.text.secondary}
              contrast="4.63:1"
              usage="Secondary information, labels"
            />
            <ColorSwatch
              name="Tertiary Text"
              color={DesignSystem.colors.text.tertiary}
              contrast="4.51:1"
              usage="Muted text, captions"
            />

            {/* Brand Colors */}
            <ColorSwatch
              name="Signature Olive"
              color={DesignSystem.colors.signature.olive}
              contrast="5.82:1"
              usage="Primary brand, selected states"
            />
            <ColorSwatch
              name="Terracotta"
              color={DesignSystem.colors.signature.terracotta}
              contrast="4.02:1"
              usage="Hover states, accents"
            />
            <ColorSwatch
              name="Terracotta Dark"
              color={DesignSystem.colors.signature.terracottaDark}
              contrast="4.51:1"
              usage="Deadlines, emphasis"
            />

            {/* Backgrounds */}
            <ColorSwatch
              name="Primary Background"
              color={DesignSystem.colors.background.primary}
              usage="Main page background"
            />
            <ColorSwatch
              name="Secondary Background"
              color={DesignSystem.colors.background.secondary}
              usage="Cards, input fields"
            />
            <ColorSwatch
              name="Tertiary Background"
              color={DesignSystem.colors.background.tertiary}
              usage="Dividers, subtle accents"
            />
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2rem',
              fontWeight: 400,
              color: DesignSystem.colors.signature.olive,
              marginBottom: '2rem'
            }}
          >
            Buttons
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Primary Buttons */}
            <div>
              <h3
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: DesignSystem.colors.text.tertiary,
                  marginBottom: '1.5rem'
                }}
              >
                Primary
              </h3>
              <div className="space-y-4">
                <Button variant="primary">Default State</Button>
                <Button variant="primary" disabled>Disabled State</Button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <h3
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: DesignSystem.colors.text.tertiary,
                  marginBottom: '1.5rem'
                }}
              >
                Secondary
              </h3>
              <div className="space-y-4">
                <Button variant="secondary">Default State</Button>
                <Button variant="secondary" disabled>Disabled State</Button>
              </div>
            </div>

            {/* Accent Buttons */}
            <div>
              <h3
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: DesignSystem.colors.text.tertiary,
                  marginBottom: '1.5rem'
                }}
              >
                Accent
              </h3>
              <div className="space-y-4">
                <Button variant="accent">Default State</Button>
                <Button variant="accent" disabled>Disabled State</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Selection Cards */}
        <section className="mb-16">
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2rem',
              fontWeight: 400,
              color: DesignSystem.colors.signature.olive,
              marginBottom: '2rem'
            }}
          >
            Selection Cards
          </h2>

          <div className="space-y-4 max-w-md">
            <SelectionCard
              selected={selectedOption === 'option1'}
              onClick={() => setSelectedOption('option1')}
            >
              Selected State (with checkmark)
            </SelectionCard>
            <SelectionCard
              selected={selectedOption === 'option2'}
              onClick={() => setSelectedOption('option2')}
            >
              Unselected State (hover to see effect)
            </SelectionCard>
            <SelectionCard
              selected={false}
              disabled={true}
            >
              Disabled State
            </SelectionCard>
          </div>
        </section>

        {/* Form Inputs */}
        <section className="mb-16">
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2rem',
              fontWeight: 400,
              color: DesignSystem.colors.signature.olive,
              marginBottom: '2rem'
            }}
          >
            Form Inputs
          </h2>

          <div className="space-y-6 max-w-md">
            <Input
              label="Text Input"
              value={inputValue}
              onChange={setInputValue}
              placeholder="Enter text..."
              required
            />
            
            <Input
              label="Disabled Input"
              value="Cannot edit this"
              onChange={() => {}}
              disabled
            />

            <Textarea
              label="Textarea"
              value=""
              onChange={() => {}}
              placeholder="Enter longer text..."
              rows={4}
            />

            <Select
              label="Select Dropdown"
              value={selectValue}
              onChange={setSelectValue}
              placeholder="Choose an option..."
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' }
              ]}
              required
            />
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2rem',
              fontWeight: 400,
              color: DesignSystem.colors.signature.olive,
              marginBottom: '2rem'
            }}
          >
            Typography
          </h2>

          <div className="space-y-8">
            {/* Headings */}
            <div>
              <h1
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '3rem',
                  fontWeight: 400,
                  color: DesignSystem.colors.text.primary,
                  marginBottom: '0.5rem'
                }}
              >
                Heading 1 - Cormorant Garamond
              </h1>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: DesignSystem.colors.text.tertiary
                }}
              >
                Used for main page titles and hero sections
              </p>
            </div>

            <div>
              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '2rem',
                  fontWeight: 400,
                  color: DesignSystem.colors.signature.olive,
                  marginBottom: '0.5rem'
                }}
              >
                Heading 2 - Signature Color
              </h2>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: DesignSystem.colors.text.tertiary
                }}
              >
                Used for section headings
              </p>
            </div>

            <div>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  color: DesignSystem.colors.text.primary,
                  lineHeight: 1.7,
                  marginBottom: '0.5rem'
                }}
              >
                Body Text - Inter Regular
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: DesignSystem.colors.text.tertiary
                }}
              >
                Used for general body copy throughout the site
              </p>
            </div>

            <div>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: DesignSystem.colors.text.tertiary,
                  marginBottom: '0.5rem'
                }}
              >
                LABEL TEXT - UPPERCASE
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: DesignSystem.colors.text.tertiary
                }}
              >
                Used for form labels and section markers
              </p>
            </div>
          </div>
        </section>

        {/* State Indicators */}
        <section className="mb-16">
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2rem',
              fontWeight: 400,
              color: DesignSystem.colors.signature.olive,
              marginBottom: '2rem'
            }}
          >
            Interactive States
          </h2>

          <div
            className="p-6 border"
            style={{
              backgroundColor: DesignSystem.colors.background.secondary,
              borderColor: DesignSystem.colors.background.tertiary,
              borderRadius: '4px'
            }}
          >
            <div className="space-y-4">
              <StateExample label="Default" color={DesignSystem.colors.state.default} />
              <StateExample label="Hover" color={DesignSystem.colors.state.hover} />
              <StateExample label="Selected" color={DesignSystem.colors.state.selected} />
              <StateExample label="Active" color={DesignSystem.colors.state.active} />
              <StateExample label="Disabled" color={DesignSystem.colors.state.disabled} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Helper Components

function ColorSwatch({
  name,
  color,
  contrast,
  usage
}: {
  name: string;
  color: string;
  contrast?: string;
  usage?: string;
}) {
  return (
    <div>
      <div
        style={{
          width: '100%',
          height: '80px',
          backgroundColor: color,
          border: `1px solid ${DesignSystem.colors.background.tertiary}`,
          borderRadius: '4px',
          marginBottom: '0.75rem'
        }}
      />
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <p
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: DesignSystem.colors.text.primary,
            marginBottom: '0.25rem'
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            color: DesignSystem.colors.text.tertiary,
            marginBottom: '0.25rem'
          }}
        >
          {color}
        </p>
        {contrast && (
          <p
            style={{
              fontSize: '0.75rem',
              color: DesignSystem.colors.signature.olive,
              fontWeight: 500,
              marginBottom: '0.25rem'
            }}
          >
            {contrast} ✓ WCAG AA
          </p>
        )}
        {usage && (
          <p
            style={{
              fontSize: '0.75rem',
              color: DesignSystem.colors.text.secondary,
              lineHeight: 1.4
            }}
          >
            {usage}
          </p>
        )}
      </div>
    </div>
  );
}

function StateExample({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-4">
      <div
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: color,
          border: `2px solid ${color}`,
          borderRadius: '4px'
        }}
      />
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <p
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: DesignSystem.colors.text.primary,
            marginBottom: '0.125rem'
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            color: DesignSystem.colors.text.tertiary
          }}
        >
          {color}
        </p>
      </div>
    </div>
  );
}
