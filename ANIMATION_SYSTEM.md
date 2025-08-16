# HomeHive Animation System Documentation

## Overview

This document outlines the comprehensive animation system implemented across the HomeHive website using Motion.dev (Framer Motion) to create smooth, engaging user experiences.

## 🎨 Animation Features

### Page Transitions

- **Smooth page transitions** with different variants based on route
- **Route-specific animations**:
  - Home page: `fadeInUp`
  - Authentication pages: `scaleIn`
  - Listing pages: `slideInRight`

### Component Animations

- **Scroll-triggered animations** for sections as they enter the viewport
- **Stagger animations** for lists and grids
- **Hover animations** for interactive elements
- **Button animations** with scale and tap effects
- **Card animations** with lift and scale effects
- **Floating animations** for background elements

## 🛠 Animation Components

### Core Animation Components

Located in `src/components/common/AnimatedComponents.jsx`:

#### `PageWrapper`

Provides consistent page-level animations with multiple variants.

```jsx
<PageWrapper variant='fadeInUp'>
  <YourPageContent />
</PageWrapper>
```

#### `ScrollReveal`

Animates elements as they scroll into view.

```jsx
<ScrollReveal direction='up' delay={0.2}>
  <YourContent />
</ScrollReveal>
```

#### `StaggerContainer` & `StaggerItem`

Creates staggered animations for lists and grids.

```jsx
<StaggerContainer staggerDelay={0.1}>
  {items.map((item) => (
    <StaggerItem key={item.id}>
      <ItemContent />
    </StaggerItem>
  ))}
</StaggerContainer>
```

#### `AnimatedButton`

Enhanced buttons with hover and tap animations.

```jsx
<AnimatedButton onClick={handleClick} className='btn-primary'>
  Click Me
</AnimatedButton>
```

#### `AnimatedCard`

Cards with hover effects and customizable animation properties.

```jsx
<AnimatedCard hoverScale={1.03} hoverY={-8}>
  <CardContent />
</AnimatedCard>
```

#### `FloatingElement`

Creates floating animations for background elements.

```jsx
<FloatingElement direction='y' distance={20} duration={4}>
  <BackgroundElement />
</FloatingElement>
```

## 📁 File Structure

```
src/
├── components/
│   └── common/
│       └── AnimatedComponents.jsx    # Core animation components
├── utils/
│   ├── animations.js                 # Animation variants and utilities
│   └── animationConfig.js           # Global animation configuration
├── hooks/
│   └── useAnimations.js             # Custom animation hooks
```

## ⚙️ Animation Configuration

### Global Settings

Located in `src/utils/animationConfig.js`:

- **Durations**: Consistent timing across all animations
- **Easings**: Custom easing curves for smooth motion
- **Delays**: Standardized delay values
- **Springs**: Spring animation configurations
- **Scroll Triggers**: Intersection Observer settings

### Custom Easings

- `smooth`: `[0.25, 0.46, 0.45, 0.94]` - General purpose
- `bouncy`: `[0.68, -0.55, 0.265, 1.55]` - Playful animations
- `elastic`: `[0.175, 0.885, 0.32, 1.275]` - Elastic effects

## 🎯 Implementation Examples

### Enhanced Components

#### Hero Section

- **Left content**: Slides in from left with staggered child animations
- **Right image**: Slides in from right with floating card overlays
- **Stats**: Staggered animation with individual delays
- **CTA buttons**: Enhanced hover and tap effects

#### Featured Properties

- **Header section**: Scroll-triggered reveal animation
- **Property cards**: Staggered grid with hover effects
- **Background elements**: Floating animations

#### Navigation

- **Mobile menu**: Smooth slide-down animation
- **Buttons**: Scale and tap animations
- **Logo**: Hover scale effect

#### Footer

- **Sections**: Staggered reveal animations
- **Social links**: Bounce hover effects
- **Background**: Floating gradient animation

## 🚀 Performance Optimizations

### Viewport-Based Animations

- Uses `useInView` hook to trigger animations only when elements are visible
- Prevents unnecessary animations for off-screen content

### Animation Cleanup

- Properly handles component unmounting
- Prevents memory leaks with animation cleanup

### Hardware Acceleration

- Uses `transform` and `opacity` properties for GPU acceleration
- Avoids layout-triggering properties for smooth performance

## 🎨 Animation Variants

### Direction-Based Reveals

- `up`, `down`, `left`, `right`, `scale`
- Customizable delay, duration, and easing

### Page Transitions

- `fadeInUp`: Gentle upward fade
- `slideInRight`: Horizontal slide transition
- `scaleIn`: Scale-based entrance

### Hover Effects

- `scale`: Scale transformation on hover
- `lift`: Vertical lift effect
- `glow`: Shadow-based glow effect

## 📱 Responsive Considerations

- Animations adapt to different screen sizes
- Reduced motion support for accessibility
- Touch-friendly hover states for mobile devices

## 🔧 Customization

### Adding New Animations

1. Define variants in `animationConfig.js`
2. Create component in `AnimatedComponents.jsx`
3. Import and use in your components

### Modifying Existing Animations

- Update timing in `animationConfig.js`
- Adjust component props for different effects
- Customize easing curves for unique feel

## 🎭 Best Practices

1. **Consistent Timing**: Use predefined durations and delays
2. **Meaningful Motion**: Animations should enhance UX, not distract
3. **Performance First**: Use GPU-accelerated properties
4. **Accessibility**: Respect user preferences for reduced motion
5. **Progressive Enhancement**: Ensure content works without animations

## 🔄 Future Enhancements

### Planned Features

- **Page loading animations**: Skeleton screens and progressive loading
- **Form animations**: Input focus states and validation feedback
- **Image animations**: Lazy loading with fade-in effects
- **Micro-interactions**: Button feedback and state changes

### Advanced Animations

- **SVG animations**: Icon morphing and path animations
- **3D effects**: CSS transforms for depth
- **Particle systems**: Background decorative animations
- **Scroll-parallax**: Multi-layer scrolling effects

## 📚 Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Motion.dev Guide](https://motion.dev/)
- [Animation Principles](https://material.io/design/motion/understanding-motion.html)
- [Web Animations Performance](https://developers.google.com/web/fundamentals/design-and-ux/animations)

---

For questions or contributions to the animation system, please refer to the component files and configuration documentation.
