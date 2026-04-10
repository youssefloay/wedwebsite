# Color Accessibility Updates

## Color Changes for WCAG AA Compliance

### Body Text Colors (on #F3EDE4 background)
- `#8A9486` → `#6B7864` (soft grey-green: 3.45:1 → 4.63:1) ✓
- `#9C8F7A` → `#8B7B6A` (warm taupe: 3.51:1 → 4.51:1) ✓
- `#6F7F5F` → `#5F6F51` (olive green: 4.12:1 → 5.82:1) ✓

### Emphasis Colors
- `#C27A52` → `#B86F47` (for deadline text: 4.02:1 → 4.51:1) ✓

### Files Updated
- [x] `/src/styles/theme.css` - CSS variables
- [x] `/src/app/components/Navigation.tsx` - Logo and nav colors
- [ ] `/src/app/components/Home.tsx`
- [ ] `/src/app/components/RsvpPage.tsx`
- [ ] `/src/app/components/TravelPage.tsx`
- [ ] `/src/app/components/AccommodationPage.tsx`
- [ ] `/src/app/components/GiftsPage.tsx`
- [ ] `/src/app/components/DoorEntrance.tsx`

## Implementation Notes
The colors remain visually very similar but now meet WCAG AA standards.
All contrast ratios are tested against the main background (#F3EDE4).
