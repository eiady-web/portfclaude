# Portfolio Landing Page - Implementation Guide

## 📋 Complete Feature Breakdown

### 1. LOADING SCREEN (Fixed Overlay)
**Purpose**: Engaging entrance animation with progress counter

**Key Props**:
- Duration: 2700ms (100%)
- Cycles: "Design" → "Create" → "Inspire" (900ms each)
- Counter: 000 → 100 (padded, monospaced)
- Progress bar: scaleX(0 → 1) with accent gradient

**Animation Timeline**:
```
0ms    → Label fades in from top
100ms  → Words start cycling
2700ms → Counter reaches 100
2800ms → onComplete callback fires
```

### 2. NAVBAR (Fixed, Always Visible)
**Structure**:
```
[Logo] | [Links] | [Say hi]
```

**Features**:
- Backdrop blur with 10% white border
- Shadow appears when scroll > 100px
- Logo: 36×36px circle, accent gradient border, "JA" text
- Links: Active state uses stroke/50 background
- Say hi button: Gradient border appears on hover

**Responsive**:
- Mobile: Single-column, hidden dividers
- Desktop: Three-column layout with dividers

### 3. HERO SECTION (Full Viewport)
**Layout**:
```
Video Background
├── Dark Overlay (bg-black/20)
├── Bottom Fade (gradient-to-t from-bg)
└── Centered Content
    ├── COLLECTION '26 (blur-in animation)
    ├── Michael Smith (name-reveal)
    ├── Role Line (cycling)
    ├── Description (blur-in)
    ├── Buttons (blur-in)
    └── Scroll Indicator (bouncing)
```

**GSAP Timeline (ease: power3.out)**:
- name-reveal: opacity 0→1, y 50→0 (1.2s, delay 0.1s)
- blur-in (x3): opacity 0→1, filter blur(10px)→blur(0), y 20→0 (1s, stagger 0.1s, delay 0.3s)

**Button Styles**:
- "See Works": Solid bg-text-primary → hover: text-bg with gradient ring
- "Reach out...": Outline → hover: gradient ring, no border

### 4. SELECTED WORKS (Bento Grid)
**Grid Layout**:
```
[Col 7]  [Col 5]
[Col 5]  [Col 7]
```
(Adjusts to single column on mobile)

**Card Features**:
- Aspect ratio: 4/3 for wider cards, square for narrower
- Image: object-cover, hover:scale-105 (700ms transition)
- Halftone overlay: 4px radial pattern, opacity-20
- Hover: bg-bg/70 with backdrop-blur-lg, fade-in overlay
- Label pill: animated gradient border on hover

**Entry Animation** (Framer Motion):
- viewport: once=true, margin="-50px"
- staggerChildren: 0.1s delay

### 5. JOURNAL SECTION
**Card Layout**: 2-column grid (1 column on mobile)
```
[Image] [Title]
        [Read time • Date]
```

**Features**:
- Rounded pills: 40px on mobile, full rounded on desktop
- Hover: scale 1.02, bg-surface (darker)
- Small text: read time + date
- Images: 64×64px, rounded-full

### 6. STATS SECTION
**3-Column Layout**:
```
[20+]          [95+]           [200%]
Years          Projects        Satisfied
Experience     Done            Clients
```

**Animations**:
- Stagger in on scroll
- Scale 1.05 on whileInView
- Number: font-display italic, text-5xl md:text-7xl

### 7. CONTACT & FOOTER
**Layout**:
```
Background Video (flipped)
├── Dark Overlay (bg-black/60)
├── GSAP Marquee (40s duration)
├── Email Button
└── Social Links + Availability
```

**Marquee**:
- Text: "BUILDING THE FUTURE •"
- Repeats: 10×
- GSAP: xPercent -50, duration 40s, ease "none", repeat -1
- Matches hero video but vertically flipped (scaleY-[-1])

**CTA Button**:
- Large scale (px-10 py-4, text-lg)
- Gradient ring on hover
- mailto: link to hello@michaelsmith.com

**Footer**:
- 4 social links (Twitter, LinkedIn, Dribbble, GitHub)
- Green pulsing dot (animate-pulse)
- "Available for projects" text

---

## 🎨 Color Palette Reference

### Dark Mode Only
| Role | Value | Hex |
|------|-------|-----|
| Background | hsl(0 0% 4%) | #0A0A0A |
| Surface | hsl(0 0% 8%) | #141414 |
| Text | hsl(0 0% 96%) | #F5F5F5 |
| Muted | hsl(0 0% 53%) | #878787 |
| Stroke | hsl(0 0% 12%) | #1F1F1F |
| Accent Gradient | #89AACC → #4E85BF | Blue gradient |

### Gradient Ring Effect (Reusable Pattern)
```jsx
<motion.div className="absolute inset-0 -inset-[2px] bg-gradient-to-r from-[#89AACC] to-[#4E85BF] rounded-full opacity-0 group-hover:opacity-100 -z-10" />
```

---

## 📱 Responsive Breakpoints

```
Mobile:  < 640px   (sm)
Tablet:  640px–768px
Desktop: 768px+    (md), 1024px+ (lg)
```

### Key Changes:
- **Hero title**: text-6xl (sm) → text-8xl (md) → text-9xl (lg)
- **Navbar**: Hidden dividers on mobile, full layout on md+
- **Projects grid**: 1 col → 12 col with staggered spans
- **Padding**: px-4 (mobile) → px-6 md:px-10 lg:px-16

---

## 🔄 Animation Composition Patterns

### Pattern 1: GSAP Timeline (Hero)
```javascript
const tl = gsap.timeline();
tl.to(".element", { property: value, duration, ease }, startTime)
  .to(".another", { ... }, otherStartTime)
```

### Pattern 2: Framer Motion WhileInView
```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, ease: [0.25,0.1,0.25,1] }}
  viewport={{ once: true, margin: "-100px" }}
/>
```

### Pattern 3: Hover with Gradient Ring
```jsx
<motion.button className="group relative overflow-hidden" whileHover="hover">
  <motion.div className="absolute gradient-ring opacity-0 group-hover:opacity-100 -z-10" />
  <div className="relative bg-surface rounded-full">Content</div>
</motion.button>
```

---

## 🎬 Video Integration Details

### HLS.js Setup
```javascript
if (Hls.isSupported()) {
  const hls = new Hls();
  hls.loadSource(videoUrl);
  hls.attachMedia(videoRef.current);
} else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
  videoRef.current.src = videoUrl;
}
```

### Video Container Positioning
```jsx
<video
  ref={videoRef}
  autoPlay muted loop playsInline
  className="absolute inset-0 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full"
  style={{ left: "50%", top: "50%" }}
/>
```
Why: Centers video even if dimensions differ from viewport

---

## ⚡ Performance Optimizations

### 1. Animation Performance
- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- GSAP uses `will-change` internally for transforms

### 2. Image Optimization
- Use `object-cover` for consistent aspect ratios
- Lazy-load journal/project images with `loading="lazy"`
- Unsplash/Pexels images auto-optimize

### 3. Bundle Size
- GSAP Core: ~35KB (minified)
- Framer Motion: ~40KB
- hls.js: ~120KB
- Total JS: ~195KB (before gzip)

### 4. CSS
- Tailwind: ~15KB (purged for production)
- Custom keyframes in index.css
- No unused utilities included

---

## 🔧 Common Customizations

### Change Accent Color
```css
/* index.css */
--accent: 220 90% 60%; /* New HSL */

/* Then update gradient */
.accent-gradient {
  background: linear-gradient(90deg, hsl(var(--accent)), hsl(var(--accent) / 0.8));
}
```

### Adjust Animation Speed
```javascript
// Slow down GSAP
const tl = gsap.timeline({ timeScale: 0.8 }); // 20% slower

// Framer Motion
transition={{ duration: 1.5 }} // was 1s
```

### Add Parallax to Images
```javascript
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(".parallax-image", {
    y: -100,
    scrollTrigger: { trigger: ".section", scrub: 1 }
  });
}, []);
```

---

## 📊 Layout Measurements

### Navbar (Pill shape)
- Inner padding: px-2 py-2
- Logo: 36×36px (w-9 h-9)
- Gap between sections: mx-1 or mx-2
- Border radius: rounded-full

### Hero Section
- Viewport height: min-h-screen
- Content max-width: max-w-4xl
- Title line-height: leading-[0.9]
- Eyebrow spacing: mb-8
- Buttons: gap-4 flex-col sm:flex-row

### Project Cards
- Border radius: rounded-3xl
- Gap between cards: gap-5 md:gap-6
- Border: 1px (border-stroke)

---

## 🧪 Testing Checklist

- [ ] Loading screen completes after 2.7s
- [ ] Navbar appears on scroll > 100px shadow
- [ ] Hero video loads and plays on different browsers
- [ ] Role text cycles every 2s smoothly
- [ ] Project cards scale and overlay on hover
- [ ] Marquee loops infinitely without jump
- [ ] Email button links to mailto:
- [ ] Scroll animations trigger at correct viewport position
- [ ] Mobile layout stacks correctly
- [ ] TypeScript has no errors

---

## 🚀 Deployment Checklist

- [ ] Replace placeholder images with real project images
- [ ] Update email address in Contact section
- [ ] Add real social media links
- [ ] Replace Mux video URL with hosted content
- [ ] Test video playback on mobile
- [ ] Verify all links work
- [ ] Run lighthouse audit
- [ ] Test on multiple devices
- [ ] Set up analytics (Google Analytics, Mixpanel, etc.)
- [ ] Enable form submissions (Formspree, Netlify Forms)

---

## 📈 SEO Metadata

Add to `index.html` `<head>`:
```html
<meta name="description" content="Michael Smith - Creative Fullstack Designer & Developer">
<meta property="og:title" content="Michael Smith - Portfolio">
<meta property="og:image" content="https://yoursite.com/og-image.jpg">
<meta name="theme-color" content="#0A0A0A">
```

---

## 💡 Advanced Enhancements

### Add Dark/Light Mode Toggle
```javascript
const [isDark, setIsDark] = useState(true);
useEffect(() => {
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}, [isDark]);
```

### Add Sound Effects
```javascript
import Tone from 'tone';
const beep = new Tone.Synth().toDestination();
beep.triggerAttackRelease("C4", "8n");
```

### Add Cursor Tracking
```javascript
useEffect(() => {
  const handleMouseMove = (e) => {
    gsap.to(".cursor-dot", { x: e.clientX, y: e.clientY, duration: 0.1 });
  };
  window.addEventListener("mousemove", handleMouseMove);
}, []);
```

### Add Page Transitions
```jsx
<motion.div
  key={location.pathname}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
/>
```

---

## 📞 Support & Resources

- **GSAP Docs**: https://gsap.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind**: https://tailwindcss.com/docs
- **React**: https://react.dev
- **Vite**: https://vitejs.dev/guide/

---

Generated: May 2026
Portfolio Version: 1.0.0
