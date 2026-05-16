# Requirements Document

## Introduction

This document defines the requirements for the **Futuristic CNC Solutions** website — an ultra-premium, futuristic industrial 3D web experience for a Bangalore-based CNC engineering company with 10+ years of expertise. The website must deliver a cinematic, immersive experience inspired by Tesla, Apple, and SpaceX aesthetics, combining WebGL 3D visuals, GSAP animations, Three.js, and glassmorphism UI to position the brand as a world-class precision engineering leader.

---

## Glossary

- **Website**: The complete single-page or multi-section web application delivered as static HTML/CSS/JS files.
- **Hero_Section**: The fullscreen opening section of the Website featuring video background, 3D model, and animated text.
- **3D_Engine**: The Three.js-based rendering system responsible for all WebGL 3D visuals.
- **Animation_System**: The GSAP-based system responsible for all scroll-triggered and cinematic transitions.
- **Particle_System**: The WebGL particle effect layer rendering floating particles and smoke effects.
- **Magnetic_Cursor**: The custom cursor component that magnetically attracts to interactive elements.
- **Navigation**: The fixed top navigation bar with glassmorphism styling.
- **Services_Section**: The section displaying all eight CNC service offerings.
- **Machine_Showcase**: The interactive 3D machine display section with rotating models.
- **Industries_Section**: The section displaying the six industry verticals served.
- **Gallery_Section**: The visual portfolio section displaying project and machine imagery.
- **Why_Choose_Us**: The section highlighting competitive differentiators and statistics.
- **Contact_Section**: The section containing contact form, address, phone, and map.
- **Footer**: The bottom section containing company info, links, and legal details.
- **Counter_Animation**: The animated number counter component used in statistics displays.
- **Scroll_Controller**: The smooth-scroll and parallax orchestration system.
- **Glassmorphism**: A UI style using frosted-glass translucent panels with blur and border effects.
- **Neon_Accent**: The neon blue (#00D4FF) glow color used for highlights, borders, and interactive states.
- **Viewport**: The visible browser window area.

---

## Requirements

### Requirement 1: Project Foundation and Technology Stack

**User Story:** As a developer, I want a well-structured project with all required dependencies configured, so that the website can be built, run, and maintained reliably.

#### Acceptance Criteria

1. THE Website SHALL be built using HTML5, CSS3, and vanilla JavaScript with no server-side runtime required for production.
2. THE Website SHALL include Three.js (r160+) loaded via CDN or bundled for all 3D rendering.
3. THE Website SHALL include GSAP (3.12+) with ScrollTrigger and ScrollSmoother plugins for all animation orchestration.
4. THE Website SHALL include a `package.json` defining all development dependencies and build scripts.
5. THE Website SHALL be deployable as a static site by opening `index.html` in a browser or serving via any static file server.
6. THE Website SHALL load all critical above-the-fold content within 3 seconds on a standard broadband connection (50 Mbps).
7. IF a required WebGL feature is unavailable in the user's browser, THEN THE Website SHALL display a graceful fallback with static imagery and CSS animations.

---

### Requirement 2: Global Visual Design System

**User Story:** As a visitor, I want a consistent ultra-premium dark industrial aesthetic throughout the site, so that the brand feels world-class and trustworthy.

#### Acceptance Criteria

1. THE Website SHALL use a primary background color of `#0A0A0A` (near-black matte) across all sections.
2. THE Website SHALL use `#00D4FF` as the primary Neon_Accent color for glows, borders, and interactive highlights.
3. THE Website SHALL use metallic silver (`#C0C0C0` to `#E8E8E8`) for secondary text and decorative elements.
4. THE Website SHALL use a premium sans-serif typeface (Orbitron or Rajdhani for headings, Inter or Roboto for body text) loaded via Google Fonts.
5. THE Website SHALL apply Glassmorphism panels using `backdrop-filter: blur(20px)`, semi-transparent backgrounds (`rgba(255,255,255,0.05)`), and `1px solid rgba(0,212,255,0.2)` borders.
6. THE Website SHALL render a persistent animated industrial grid background using CSS or Canvas, with subtle Neon_Accent colored grid lines at 5% opacity.
7. WHEN any interactive element (button, card, link) receives hover focus, THE Website SHALL apply a Neon_Accent glow effect (`box-shadow: 0 0 20px rgba(0,212,255,0.6)`) within 200ms.
8. THE Website SHALL maintain WCAG AA contrast ratio (minimum 4.5:1) for all body text against its background.

---

### Requirement 3: Magnetic Custom Cursor

**User Story:** As a visitor, I want a custom magnetic cursor that reacts to interactive elements, so that the experience feels premium and futuristic.

#### Acceptance Criteria

1. THE Magnetic_Cursor SHALL replace the default browser cursor with a custom circular cursor (16px diameter, Neon_Accent color) on desktop viewports wider than 1024px.
2. THE Magnetic_Cursor SHALL render a larger outer ring (40px diameter, 1px Neon_Accent border) that follows the cursor with a smooth lag (0.1s ease-out interpolation).
3. WHEN the Magnetic_Cursor moves within 60px of a button or interactive element, THE Magnetic_Cursor SHALL magnetically snap toward that element's center using a lerp attraction force.
4. WHEN the Magnetic_Cursor hovers over a clickable element, THE Magnetic_Cursor SHALL scale the outer ring to 60px diameter and fill with `rgba(0,212,255,0.15)`.
5. WHEN the Magnetic_Cursor hovers over text content, THE Magnetic_Cursor SHALL morph into a text-cursor indicator shape.
6. ON touch devices and viewports below 1024px, THE Magnetic_Cursor SHALL be hidden and the default cursor SHALL be restored.

---

### Requirement 4: Smooth Scroll and Parallax System

**User Story:** As a visitor, I want buttery-smooth scrolling with parallax depth effects, so that the site feels cinematic and immersive.

#### Acceptance Criteria

1. THE Scroll_Controller SHALL implement smooth momentum-based scrolling using GSAP ScrollSmoother with a `smooth` value of 1.5 and `effects` enabled.
2. THE Scroll_Controller SHALL apply parallax depth offsets to background layers, with foreground elements moving at 1x speed and background elements at 0.4x speed.
3. WHEN the user scrolls past a section threshold, THE Animation_System SHALL trigger section-specific entrance animations using GSAP ScrollTrigger.
4. THE Scroll_Controller SHALL support keyboard navigation (arrow keys, Page Up/Down) with the same smooth interpolation.
5. WHEN the user is on a touch device, THE Scroll_Controller SHALL use native smooth scrolling (`scroll-behavior: smooth`) instead of GSAP ScrollSmoother.
6. THE Navigation SHALL change from fully transparent to a Glassmorphism frosted-glass style WHEN the user scrolls more than 80px from the top of the page.

---

### Requirement 5: Hero Section

**User Story:** As a visitor, I want a fullscreen cinematic hero section with a 3D CNC machine and dramatic effects, so that I am immediately captivated by the brand.

#### Acceptance Criteria

1. THE Hero_Section SHALL occupy 100% of the Viewport height and width on initial page load.
2. THE Hero_Section SHALL render a looping HTML5 `<video>` background showing CNC machining footage (sparks, metal cutting), muted and autoplaying, with a dark overlay (`rgba(0,0,0,0.6)`).
3. THE 3D_Engine SHALL render an interactive 3D CNC machine model (GLTF/GLB format) centered in the Hero_Section using Three.js WebGLRenderer.
4. THE 3D_Engine SHALL continuously auto-rotate the CNC machine model at 0.3 degrees per frame around the Y-axis.
5. WHEN the user moves the mouse within the Hero_Section, THE 3D_Engine SHALL tilt the CNC machine model up to ±15 degrees on X and Y axes following cursor position.
6. THE Particle_System SHALL render a minimum of 500 floating particles in the Hero_Section using Three.js Points, with random drift velocities and Neon_Accent color at varying opacities.
7. THE Particle_System SHALL render a smoke/fog effect using layered semi-transparent plane meshes with animated opacity and position offsets.
8. WHEN the page first loads, THE Animation_System SHALL execute a logo reveal animation: the company name fades in letter-by-letter over 1.5 seconds using GSAP stagger.
9. THE Hero_Section SHALL display the heading "FUTURISTIC CNC SOLUTIONS" in Orbitron font at a minimum of 48px on desktop.
10. THE Hero_Section SHALL display the subheading "Precision Engineering Redefined" in metallic silver below the main heading.
11. THE Hero_Section SHALL display the paragraph "10+ Years of Expertise in CNC Services, Retrofitting, Drive Repair & Advanced Industrial Engineering Solutions."
12. THE Hero_Section SHALL display two CTA buttons: "Explore Services" (primary, Neon_Accent filled) and "Contact Us" (secondary, Glassmorphism outlined).
13. WHEN the "Explore Services" button is clicked, THE Scroll_Controller SHALL smoothly scroll to the Services_Section.
14. WHEN the "Contact Us" button is clicked, THE Scroll_Controller SHALL smoothly scroll to the Contact_Section.
15. THE Hero_Section SHALL display a scroll-down indicator (animated chevron or line) at the bottom center that fades out WHEN the user scrolls more than 100px.

---

### Requirement 6: Navigation

**User Story:** As a visitor, I want a fixed navigation bar that lets me jump to any section, so that I can explore the site efficiently.

#### Acceptance Criteria

1. THE Navigation SHALL be fixed to the top of the Viewport and remain visible during all scroll positions.
2. THE Navigation SHALL display the company logo/wordmark on the left and section links on the right.
3. THE Navigation SHALL contain links to: Hero, About, Services, Machine Showcase, Industries, Gallery, Why Choose Us, Contact.
4. WHEN a Navigation link is clicked, THE Scroll_Controller SHALL smoothly animate to the target section.
5. THE Navigation SHALL highlight the active section link with Neon_Accent color as the user scrolls through sections.
6. ON viewports below 768px, THE Navigation SHALL collapse into a hamburger menu icon that reveals a full-screen overlay menu WHEN clicked.
7. THE Navigation overlay menu on mobile SHALL animate open with a slide-down or fade-in transition over 300ms.

---

### Requirement 7: About Company Section

**User Story:** As a visitor, I want to learn about Futuristic CNC Solutions' history and values, so that I can trust the company's expertise.

#### Acceptance Criteria

1. THE Website SHALL render an About section with a two-column layout on desktop: text content on the left, visual element (3D or image) on the right.
2. THE About section SHALL display the company founding story, mission, and 10+ years of experience narrative.
3. THE About section SHALL display four animated Counter_Animation statistics: "10+ Years Experience", "500+ Machines Serviced", "200+ Clients", "98% Uptime Guarantee".
4. WHEN the About section enters the Viewport, THE Counter_Animation SHALL count up from 0 to the target value over 2 seconds using GSAP.
5. THE About section SHALL display a Glassmorphism card panel containing the company's key values or differentiators.
6. WHEN the About section enters the Viewport, THE Animation_System SHALL animate text blocks sliding in from the left and the visual element from the right using GSAP ScrollTrigger.

---

### Requirement 8: Services Section

**User Story:** As a visitor, I want to see all CNC services clearly presented, so that I can identify which services meet my needs.

#### Acceptance Criteria

1. THE Services_Section SHALL display all eight services: CNC Machine Services, VMC/HMC/VTL Machine Services, CNC Retrofitting, Servo Drive Repair, Spindle Drive Repair, Industrial Electronics Repair, CNC Spare Parts Supply, Automation Support.
2. THE Services_Section SHALL render each service as a Glassmorphism card with an icon, title, and brief description.
3. WHEN a service card receives hover focus, THE Services_Section SHALL animate the card with a 3D perspective tilt (CSS `perspective` + `rotateX`/`rotateY` up to 10 degrees) following cursor position within the card.
4. WHEN a service card receives hover focus, THE Services_Section SHALL display an expanded description overlay with a smooth height transition over 300ms.
5. THE Services_Section SHALL arrange service cards in a responsive grid: 4 columns on desktop (≥1200px), 2 columns on tablet (768px–1199px), 1 column on mobile (<768px).
6. WHEN the Services_Section enters the Viewport, THE Animation_System SHALL stagger-animate each card appearing from below with a 100ms delay between cards.
7. THE Services_Section SHALL display a section heading "OUR SERVICES" with a Neon_Accent underline accent.

---

### Requirement 9: Machine Showcase Section

**User Story:** As a visitor, I want to interact with 3D machine models, so that I can visually understand the equipment Futuristic CNC Solutions works with.

#### Acceptance Criteria

1. THE Machine_Showcase SHALL render a minimum of three interactive 3D machine representations using Three.js (procedural geometry or GLTF models).
2. THE Machine_Showcase SHALL display each machine with dynamic metallic PBR materials (MeshStandardMaterial with metalness ≥ 0.8 and roughness ≤ 0.3).
3. THE 3D_Engine SHALL apply dynamic point lights and directional lights to create realistic metallic reflections on machine models.
4. WHEN a machine model is hovered, THE 3D_Engine SHALL increase the model's rotation speed and add a Neon_Accent rim light effect.
5. WHEN a machine model is clicked, THE Machine_Showcase SHALL display an animated specification panel sliding in from the right with machine details (type, axis count, spindle speed, applications).
6. THE Machine_Showcase SHALL allow the user to drag-rotate each machine model using mouse/touch drag interactions (OrbitControls or custom implementation).
7. THE Machine_Showcase SHALL display animated specification tags floating around each machine model using CSS absolute positioning synchronized with the 3D canvas.
8. WHEN the Machine_Showcase enters the Viewport, THE Animation_System SHALL trigger a cinematic camera zoom-in effect on the active machine model.

---

### Requirement 10: Industries Served Section

**User Story:** As a visitor, I want to see which industries Futuristic CNC Solutions serves, so that I can confirm relevance to my sector.

#### Acceptance Criteria

1. THE Industries_Section SHALL display all six industry verticals: Automotive, Aerospace, Manufacturing, Tool Rooms, Heavy Engineering, Precision Component Industries.
2. THE Industries_Section SHALL render each industry as a hexagonal or card tile with an industry icon, name, and one-line description.
3. WHEN an industry tile receives hover focus, THE Industries_Section SHALL animate the tile with a Neon_Accent border glow and scale transform (1.05x) over 200ms.
4. WHEN the Industries_Section enters the Viewport, THE Animation_System SHALL animate tiles appearing with a staggered fade-and-scale entrance.
5. THE Industries_Section SHALL display a section heading "INDUSTRIES WE SERVE" with animated Neon_Accent accent lines.

---

### Requirement 11: Gallery Section

**User Story:** As a visitor, I want to browse a visual gallery of machines and projects, so that I can assess the quality of work.

#### Acceptance Criteria

1. THE Gallery_Section SHALL display a minimum of 12 gallery items in a masonry or grid layout.
2. THE Gallery_Section SHALL support horizontal scroll or a lightbox interaction for viewing full-size images.
3. WHEN a gallery item is hovered, THE Gallery_Section SHALL apply a zoom-in effect (scale 1.08x) and overlay a Neon_Accent tinted gradient with the item title.
4. WHEN a gallery item is clicked, THE Gallery_Section SHALL open a fullscreen lightbox modal with the image, navigation arrows, and a close button.
5. THE Gallery_Section lightbox SHALL support keyboard navigation (left/right arrow keys to navigate, Escape to close).
6. THE Gallery_Section SHALL include placeholder/stock industrial imagery with descriptive alt text for accessibility.
7. WHEN the Gallery_Section enters the Viewport, THE Animation_System SHALL animate gallery items appearing with a staggered reveal.

---

### Requirement 12: Why Choose Us Section

**User Story:** As a visitor, I want to understand Futuristic CNC Solutions' competitive advantages, so that I can make an informed decision to engage them.

#### Acceptance Criteria

1. THE Why_Choose_Us section SHALL display a minimum of six differentiator points (e.g., 10+ years expertise, pan-India service, genuine spare parts, 24/7 support, certified engineers, fast turnaround).
2. THE Why_Choose_Us section SHALL render each differentiator as an icon + heading + description card with Glassmorphism styling.
3. THE Why_Choose_Us section SHALL display a large animated background number or geometric shape behind the content for visual depth.
4. WHEN the Why_Choose_Us section enters the Viewport, THE Animation_System SHALL animate each differentiator card with a staggered slide-in from alternating left and right sides.
5. THE Why_Choose_Us section SHALL display a prominent CTA banner at the bottom: "Ready to Upgrade Your CNC Operations?" with a "Get a Free Consultation" button linking to the Contact_Section.

---

### Requirement 13: Contact Section

**User Story:** As a potential client, I want to easily contact Futuristic CNC Solutions, so that I can inquire about services or request a quote.

#### Acceptance Criteria

1. THE Contact_Section SHALL display the company phone numbers: +91 7760126696 and +91 8123814692 as clickable `tel:` links.
2. THE Contact_Section SHALL display the full address: #7/B, 1st Main Road, Vigneshwara Nagar, Near Aralimara Circle, Andrahalli, Bangalore - 560091.
3. THE Contact_Section SHALL display the GST number: 29FACPM7312G1ZN.
4. THE Contact_Section SHALL render a contact form with fields: Name (required), Company Name, Phone (required), Email (required), Service Interest (dropdown with all 8 services), Message.
5. WHEN the contact form is submitted with all required fields valid, THE Contact_Section SHALL display a success confirmation message with a Neon_Accent animated checkmark.
6. WHEN the contact form is submitted with missing required fields, THE Contact_Section SHALL highlight invalid fields with a red border and display inline error messages.
7. THE Contact_Section SHALL include an embedded Google Maps iframe showing the Andrahalli, Bangalore location.
8. THE Contact_Section SHALL display social media or WhatsApp contact links as icon buttons with Neon_Accent hover glow.
9. WHEN the Contact_Section enters the Viewport, THE Animation_System SHALL animate the form sliding in from the left and the contact info from the right.

---

### Requirement 14: Footer

**User Story:** As a visitor, I want a complete footer with company information and quick links, so that I can find key information without scrolling back up.

#### Acceptance Criteria

1. THE Footer SHALL display the company name "Futuristic CNC Solutions" with the tagline "Precision Engineering Redefined".
2. THE Footer SHALL display quick navigation links to all major sections.
3. THE Footer SHALL display the company address, phone numbers, and GST number.
4. THE Footer SHALL display a copyright notice: "© 2024 Futuristic CNC Solutions. All Rights Reserved."
5. THE Footer SHALL display the company location: Bangalore, India.
6. THE Footer SHALL apply a top border with a Neon_Accent gradient line.
7. WHEN a Footer link is hovered, THE Footer SHALL apply a Neon_Accent color transition over 200ms.

---

### Requirement 15: Responsive Design and Accessibility

**User Story:** As a visitor on any device, I want the website to be fully usable and visually consistent, so that I can access it from mobile, tablet, or desktop.

#### Acceptance Criteria

1. THE Website SHALL be fully responsive across three breakpoints: mobile (<768px), tablet (768px–1199px), desktop (≥1200px).
2. THE Website SHALL render correctly in the latest versions of Chrome, Firefox, Safari, and Edge.
3. THE Website SHALL use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) for all structural content.
4. THE Website SHALL provide descriptive `alt` attributes for all `<img>` elements.
5. THE Website SHALL ensure all interactive elements are keyboard-focusable with a visible focus indicator.
6. THE Website SHALL not trigger horizontal scrollbars on any supported viewport width.
7. ON mobile viewports, THE 3D_Engine SHALL reduce particle count to 100 and disable the most performance-intensive post-processing effects to maintain 30fps minimum.
8. THE Website SHALL include a `<meta name="viewport" content="width=device-width, initial-scale=1.0">` tag.

---

### Requirement 16: Performance and Loading Experience

**User Story:** As a visitor, I want a fast, smooth loading experience with a premium preloader, so that the site feels polished from the first moment.

#### Acceptance Criteria

1. THE Website SHALL display a fullscreen preloader on initial load featuring the company logo, an animated progress bar, and a percentage counter.
2. WHEN all critical assets are loaded, THE Animation_System SHALL transition the preloader out with a cinematic split-screen wipe or fade over 800ms.
3. THE Website SHALL lazy-load all gallery images using the `loading="lazy"` attribute or an Intersection Observer.
4. THE Website SHALL compress and optimize all static image assets to WebP format where supported.
5. THE Website SHALL achieve a Lighthouse Performance score of 70 or above on desktop.
6. THE 3D_Engine SHALL use `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` to cap pixel ratio and prevent excessive GPU load on high-DPI displays.
7. WHEN the browser tab loses focus, THE 3D_Engine SHALL pause the animation loop to conserve resources, and resume WHEN the tab regains focus.
