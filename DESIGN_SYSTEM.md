# Design System Documentation
## Lama & Álvaro Wedding Website

### Overview
A complete, accessible design system for the luxury wedding website with clear visual states for all interactive elements.

---

## 📐 Design Tokens

### Colors (WCAG AA Compliant)

#### Text Colors (on #F3EDE4 background)
- **Primary Text**: `#4A3A2A` (8.82:1) - Headings, main body text
- **Secondary Text**: `#6B7864` (4.63:1) - Secondary info, labels  
- **Tertiary Text**: `#8B7B6A` (4.51:1) - Muted text, captions
- **Disabled Text**: `#B5AFA5` (2.8:1) - Disabled states only

#### Brand Colors
- **Signature Olive**: `#5F6F51` (5.82:1) - Primary brand, selected states
- **Terracotta**: `#C27A52` (4.02:1) - Hover states, accents
- **Terracotta Dark**: `#B86F47` (4.51:1) - Deadlines, emphasis text
- **Terracotta Light**: `#D8A47C` - Borders, decorative elements

#### Background Colors
- **Primary**: `#F3EDE4` - Main page background (warm paper beige)
- **Secondary**: `#FAF6F0` - Cards, input fields (soft cream)
- **Tertiary**: `#E6D8C5` - Dividers, subtle accents (sand tone)

---

## 🎨 Component States

### Buttons

#### Primary Button (Main Actions)
- **Default**: Olive background (#5F6F51), warm ivory text (#FAF6F0), 1px solid olive border
- **Hover**: Darker olive background (#4F5F41), warm ivory text
- **Active**: Deep olive background (#46563A), warm ivory text
- **Disabled**: Sand border (#D6CEC2), sand text (#B5AFA5), transparent background, 50% opacity, not-allowed cursor

#### Secondary Button (Subtle Actions)
- **Default**: Transparent background, olive border (#5F6F51), olive text
- **Hover**: rgba(95, 111, 81, 0.06) background, olive text
- **Active**: rgba(95, 111, 81, 0.12) background, darker olive text (#4F5F41)
- **Disabled**: Sand border (#D6CEC2), sand text (#B5AFA5), transparent background, 50% opacity, not-allowed cursor

#### Text Button (Inline / Low Emphasis)
- **Default**: Transparent background, no border, olive text (#5F6F51)
- **Hover**: Text darkens to #4F5F41, underline optional
- **Active**: Text darkens further to #46563A
- **Disabled**: Text #B5AFA5, no underline, not-allowed cursor

### Selection Cards (Radio Options)

- **Unselected**: 
  - Background: #FAF6F0
  - Border: rgba(111, 127, 95, 0.2) - 1px
  - Text: #6B7864 (secondary grey-green)
  - Font weight: 400

- **Hover** (unselected only):
  - Border: #8A9A7C (lighter olive)
  - Text: #5F6F51 (signature olive)

- **Selected**:
  - Background: rgba(95, 111, 81, 0.05) - subtle olive tint
  - Border: #5F6F51 - 2px (thicker)
  - Text: #5F6F51 (signature olive)
  - Font weight: 500
  - Checkmark icon visible

- **Disabled**:
  - Background: rgba(243, 237, 228, 0.5)
  - Border: #B5AFA5
  - Text: #B5AFA5
  - Opacity: 60%
  - Cursor: not-allowed

### Form Inputs

- **Default**:
  - Background: #FAF6F0
  - Border: rgba(107, 120, 100, 0.25) - 1px
  - Text: #4A3A2A
  - Placeholder: lighter grey

- **Focus**:
  - Border: #5F6F51 (signature olive)
  - Box shadow: 0 0 0 3px rgba(95, 111, 81, 0.1)
  - No outline

- **Error**:
  - Border: #C27A52 (terracotta)
  - Helper text: #C27A52

- **Disabled**:
  - Background: rgba(243, 237, 228, 0.5)
  - Border: #B5AFA5
  - Text: #B5AFA5
  - Cursor: not-allowed

---

## 🔤 Typography

### Headings
- **Font**: Cormorant Garamond, serif
- **Weight**: 400 (regular)
- **Primary headings**: #4A3A2A (dark brown)
- **Section headings**: #5F6F51 (signature olive)
- **Accent headings**: #C27A52 (terracotta)

### Body Text
- **Font**: Inter, sans-serif
- **Weight**: 400 (regular)
- **Primary**: #4A3A2A
- **Secondary**: #6B7864
- **Tertiary**: #8B7B6A

### Labels
- **Font**: Inter, sans-serif
- **Size**: 0.875rem (14px)
- **Letter spacing**: 0.05em - 0.1em
- **Transform**: uppercase
- **Color**: #8B7B6A (tertiary) or #6B7864 (secondary when required)
- **Required fields**: Add * in terracotta, font-weight 500

---

## 📁 File Structure

### Core System
- `/src/app/utils/designSystem.ts` - Design tokens & helper functions
- `/src/app/components/ui/FormComponents.tsx` - Reusable UI components
- `/src/styles/theme.css` - CSS variables (updated for accessibility)
- `/src/styles/colors.css` - Color documentation

### Documentation
- `/src/app/components/DesignSystemDemo.tsx` - Visual documentation component
- `/ACCESSIBILITY_UPDATES.md` - Accessibility improvements log
- `/src/app/components/ColorGuide.tsx` - Color palette reference

---

## 🎯 Usage Guidelines

### When to Use Each Button Variant

**Primary (Olive)**
- Main form navigation (Continue, Next)
- Primary page actions
- "Before You Arrive" CTA

**Secondary (Taupe)**
- Back buttons
- Cancel actions
- Alternative options

**Accent (Terracotta)**
- Final submission (Submit RSVP)
- Important CTAs
- Emphasis actions

### Selection vs Buttons

**Use Selection Cards when:**
- Radio button choices (attendance, accommodation)
- Single choice from 2-3 options
- Visual emphasis needed on selection

**Use Regular Buttons when:**
- Multiple independent actions
- Form navigation
- Links to other pages/sections

### Accessibility Requirements

1. **All text must meet WCAG AA** (4.5:1 for normal, 3:1 for large 18px+)
2. **Focus states must be clearly visible** (olive border + shadow)
3. **Disabled states must be obvious** (reduced opacity + cursor change)
4. **Required fields must be marked** (asterisk + weight change)
5. **Interactive elements need hover states** (color/background change)

---

## 🚀 Implementation

### Using the Design System

```tsx
import { Button, SelectionCard, Input } from './components/ui/FormComponents';
import { DesignSystem } from './utils/designSystem';

// Primary button
<Button variant="primary" onClick={handleClick}>
  Continue
</Button>

// Selection card
<SelectionCard
  selected={value === 'option1'}
  onClick={() => setValue('option1')}
>
  Joyfully accept
</SelectionCard>

// Input with label
<Input
  label="First Name"
  value={firstName}
  onChange={setFirstName}
  required
/>
```

### Direct Style Application

```tsx
// Using design tokens
style={{
  color: DesignSystem.colors.text.primary,
  fontFamily: DesignSystem.typography.heading.primary.fontFamily,
  transition: DesignSystem.transition.medium
}}

// Using helper functions
const buttonStyles = getButtonStyles('primary', 'default', false);
const selectionStyles = getSelectionStyles(isSelected, isHovered, isDisabled);
```

---

## ✅ Component Checklist

When creating new components, ensure:

- [ ] Uses design system colors (no hardcoded colors)
- [ ] Implements all states (default, hover, active, disabled)
- [ ] Selected states are visually distinct (border + color + weight)
- [ ] Focus states are accessible (visible outline/shadow)
- [ ] Transitions are smooth (300ms standard)
- [ ] Typography follows system (Cormorant for headings, Inter for body)
- [ ] Spacing uses system tokens
- [ ] Meets WCAG AA contrast requirements
- [ ] Disabled states are properly styled and non-interactive

---

## 🎨 Visual Hierarchy

### Primary → Secondary → Tertiary

1. **Primary**: Main content, key actions, selected states
2. **Secondary**: Supporting content, unselected options, labels
3. **Tertiary**: Helper text, captions, disabled states

### Color Weight by Importance

- **Highest**: Dark brown (#4A3A2A) - Main text & headings
- **High**: Olive (#5F6F51) - Brand, selected, CTAs
- **Medium**: Grey-green (#6B7864) - Secondary text
- **Low**: Taupe (#8B7B6A) - Tertiary text
- **Lowest**: Light grey (#B5AFA5) - Disabled only

---

## 🔧 Maintenance

### Adding New Colors
1. Test contrast ratio on #F3EDE4 background
2. Must meet WCAG AA (4.5:1 minimum)
3. Add to `designSystem.ts` colors object
4. Document usage in this file

### Adding New Components
1. Create in `/src/app/components/ui/`
2. Import and use design tokens
3. Implement all required states
4. Add example to `DesignSystemDemo.tsx`
5. Document in this file

### Testing States
View all states at `/design-system` route:
- Check visual consistency
- Test hover/focus interactions
- Verify disabled states are non-interactive
- Ensure accessibility compliance

---

**Last Updated**: Design system fully implemented with accessible colors and consistent states across all components.
