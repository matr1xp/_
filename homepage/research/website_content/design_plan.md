# Matrix-Inspired Theme Design Plan for Marl Santos' Homepage

## Color Scheme

### Primary Colors
- **Background**: `#000000` (Black) - The classic dark background from the Matrix
- **Primary Text**: `#00FF41` (Matrix Green) - The iconic green text from the Matrix digital rain
- **Secondary Text**: `#008F11` (Darker Matrix Green) - For less emphasized text elements
- **Accent**: `#003B00` (Deep Green) - For backgrounds of containers and sections

### Additional Colors
- **Highlight**: `#FFFFFF` (White) - For important text and hover effects
- **Code Elements**: `#4CAF50` (Material Green) - For code snippets or technical elements
- **Warning/Error**: `#FF0000` (Red) - For error messages or warnings, as seen in Matrix alerts

### Opacity Variations
- Semi-transparent black overlays: `rgba(0, 0, 0, 0.7)` - For modal backgrounds
- Glowing effect for text: `0 0 10px rgba(0, 255, 65, 0.8)` - Text shadow for emphasis

## Typography

### Font Families
1. **Primary Font**: "Courier New", Courier, monospace
   - Perfect for the code-like appearance in the Matrix
   - Used for main content, navigation, and headers

2. **Secondary Font**: "Consolas", monospace
   - Alternative monospace font for variety
   - Used for code snippets and technical information

3. **Fallback Fonts**: monospace
   - Ensures consistent appearance across devices

### Font Sizes
- Headings:
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)
- Body Text: 1rem (16px)
- Small Text/Captions: 0.875rem (14px)
- Code Snippets: 0.9375rem (15px)

### Font Weights
- Regular: 400
- Bold: 700

### Line Heights
- Headings: 1.2
- Body Text: 1.6
- Code Blocks: 1.4

## Layout Structure

### Overall Layout
- Single-page design with smooth scrolling between sections
- Dark background with Matrix-inspired elements throughout
- Falling digital rain animation in the background (subtle, not distracting)

### Header Section
- Full-width hero area with Matrix digital rain animation
- Name and title with glowing green text effect
- Navigation menu with hover effects that mimic the Matrix "focus" effect

### About Section
- Professional headshot (if available) with Matrix-style filter/overlay
- Brief professional summary with typewriter animation effect
- Key skills displayed as Matrix-style code elements

### Experience Timeline
- Vertical timeline layout with Matrix-styled connection lines
- Each position displayed in a terminal-like container
- Hover effects that enhance the Matrix theme (glow, reveal additional details)

### Projects Section
- Grid layout for projects (responsive, adjusts based on screen size)
- Each project displayed in a "computer terminal" style card
- Project images with Matrix-style overlay effect
- Interactive elements that reveal more details on hover/click

### Skills Section
- Skills categorized and displayed as "code blocks"
- Progress bars or skill levels with Matrix green gradient
- Animated skill bars that "load" when scrolled into view

### Contact Section
- Contact form styled like a Matrix terminal interface
- Form inputs with glowing green borders and text
- Submit button with Matrix-style animation effect

### Footer
- Social media links with Matrix-themed icons
- Copyright information with Matrix-style text animation
- "Back to top" button with upward digital rain animation

## Responsive Design Approach

### Breakpoints
- Mobile: Up to 576px
- Tablet: 577px to 991px
- Desktop: 992px and above

### Mobile Considerations
- Simplified digital rain animation (less resource-intensive)
- Stacked layout for all sections
- Collapsible navigation menu
- Reduced animation effects to improve performance
- Larger touch targets for better usability

### Tablet Considerations
- Moderate digital rain animation
- Grid layouts adjust to 2 columns for projects
- Semi-expanded navigation
- Balanced animation effects

### Desktop Considerations
- Full digital rain animation
- Expanded layouts with 3+ columns where appropriate
- Horizontal navigation menu
- Complete animation effects

## Special Effects & Animations

### Matrix Digital Rain
- Customized digital rain animation in the background
- Variable opacity to ensure readability of content
- Speed adjustments based on scroll position and user interaction

### Text Animations
- Typewriter effect for introductory text
- Text scramble effect that transitions from random characters to actual text
- Glowing text effect on hover for navigation and important elements

### Interactive Elements
- Terminal-style cursor blinking in form fields
- "Loading" animations with Matrix-style progress indicators
- Hover effects that reveal additional information or change appearance

### Scroll Effects
- Parallax scrolling with digital rain moving at different speeds
- Elements that "decode" or "materialize" when scrolled into view
- Subtle background changes based on scroll position

## Accessibility Considerations
- Sufficient contrast between text and background (minimum 4.5:1 ratio)
- Alternative animations for users with reduced motion preferences
- Keyboard navigation support with visible focus states
- Screen reader compatible with appropriate ARIA attributes
- Text alternatives for all visual elements

## Performance Optimization
- Lazy loading for images and heavy animations
- Reduced animation complexity on mobile devices
- Optimized image sizes and formats
- Minimal use of heavy JavaScript libraries
- CSS animations where possible instead of JavaScript

## Implementation Notes
- Use CSS variables for consistent color application
- Implement the digital rain using canvas or optimized CSS
- Consider using IntersectionObserver for scroll-based animations
- Ensure all animations can be disabled for accessibility
- Test performance across various devices and browsers