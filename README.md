# Michael Smith - Dark Portfolio Landing Page

A sophisticated, high-performance dark portfolio landing page built with React, Vite, Tailwind CSS, TypeScript, GSAP, and Framer Motion.

## 🎨 Features

- **Dark Design System**: Custom HSL color variables for consistent theming
- **Smooth Animations**: GSAP timeline effects and Framer Motion transitions
- **HLS Video Backgrounds**: Streaming video with hls.js for hero and contact sections
- **Responsive Bento Grid**: Dynamic project showcase with hover effects
- **Loading Screen**: Animated counter with cycling keywords
- **Parallax Effects**: Scroll-driven animations for visual depth
- **Performance Optimized**: Vite bundling for fast load times

## 📦 Stack

- **React 18** - UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety
- **GSAP 3** - Advanced animations
- **Framer Motion** - Component-based motion
- **hls.js** - HLS streaming video support

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server will open at `http://localhost:3000` by default.

## 📁 Project Structure

```
├── main.tsx              # Entry point
├── portfolio-landing.jsx # Main App component with all sections
├── index.html           # HTML template
├── index.css            # Global styles & animations
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS setup
├── vite.config.js       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies & scripts
```

## 🎯 Key Sections

### 1. **Loading Screen** (0-100% counter)
- Animated entrance with fade-in effect
- Cycling keywords: Design, Create, Inspire
- Progress bar with accent gradient

### 2. **Navbar** (Fixed top)
- Logo with accent gradient border
- Navigation links with hover states
- "Say hi" button with gradient ring

### 3. **Hero Section** (Full viewport)
- HLS video background (Mux stream)
- Dynamic role cycling every 2s
- Call-to-action buttons with hover effects
- Scroll indicator with animation

### 4. **Selected Works** (Bento Grid)
- 4-column grid layout with alternating spans
- Hover overlay with project details
- Halftone texture overlay
- Smooth image zoom on hover

### 5. **Journal Section** (Recent Thoughts)
- 2x2 grid of article cards
- Images with metadata (read time, date)
- Hover scale effect

### 6. **Stats Section**
- 3-column stat display
- Animated number reveals
- Clean typography hierarchy

### 7. **Contact & Footer** (Video background)
- HLS video (vertically flipped)
- GSAP marquee animation
- Email CTA with gradient hover
- Social links + availability indicator

## 🎨 Design System

### Colors (HSL)
```css
--bg: 0 0% 4%;           /* Deep black background */
--surface: 0 0% 8%;      /* Slightly lighter surface */
--text: 0 0% 96%;        /* Off-white text */
--muted: 0 0% 53%;       /* Gray for secondary content */
--stroke: 0 0% 12%;      /* Border/divider color */
```

### Accent Gradient
```
linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)
```
Used for logo, hover borders, and progress indicators.

### Fonts
- **Body**: Inter (300-700 weights)
- **Display**: Instrument Serif (italic for emphasis)

## ⚙️ Configuration

### Tailwind Custom Colors
All colors defined via CSS custom properties for seamless dark theme switching.

```js
// tailwind.config.js
colors: {
  bg: 'hsl(var(--bg))',
  surface: 'hsl(var(--surface))',
  'text-primary': 'hsl(var(--text))',
  muted: 'hsl(var(--muted))',
  stroke: 'hsl(var(--stroke))',
}
```

### Custom Animations
- `scroll-down`: Looping vertical movement
- `role-fade-in`: Opacity + Y-axis fade
- `gradient-shift`: Background position shift

## 🎬 Animation Details

### GSAP Timeline (Hero)
- `.name-reveal`: opacity 0→1, y 50→0 (1.2s, delay 0.1s)
- `.blur-in`: opacity 0→1, blur(10px)→blur(0px), y 20→0 (1s, stagger 0.1s, delay 0.3s)

### Framer Motion (Scroll sections)
- `whileInView`: opacity 0→1, y 30→0
- `transition`: 1s duration, ease [0.25,0.1,0.25,1]
- `viewport`: once: true, margin: "-100px"

### GSAP ScrollTrigger
- Used for parallax effects and pinned sections
- Configured for smooth scroll-driven animations

## 🎥 Video Setup

The portfolio uses HLS streaming video:
```
https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8
```

Videos are embedded with:
- `hls.js` for HLS support
- Fallback to native browser HLS
- Autoplay, muted, loop enabled
- Object-cover for proper scaling

## 🔄 Component Features

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Hidden elements on mobile (dividers, desktop nav)
- Flexible spacing and typography scaling

### Performance
- Code-splitting via Vite
- Tree-shaking for unused CSS
- Lazy-loaded images with object-cover
- Hardware-accelerated animations (transform, opacity)

### Accessibility
- Semantic HTML structure
- Proper contrast ratios
- Keyboard-navigable nav
- Smooth scroll behavior

## 🚀 Deployment

### Vercel
```bash
npm run build
# Push to git, Vercel will auto-build
```

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📝 Customization

### Change Colors
Edit CSS variables in `index.css`:
```css
:root {
  --bg: 0 0% 4%;        /* Change background brightness */
  --text: 0 0% 96%;     /* Change text color */
  /* ... etc */
}
```

### Modify Content
Update hardcoded strings in `portfolio-landing.jsx`:
- Hero name: "Michael Smith"
- Role cycling array
- Project titles and images
- Journal entries
- Stats

### Video URL
Replace Mux streaming URL with your own HLS stream:
```javascript
const videoUrl = "https://your-hls-stream.m3u8";
```

## 🐛 Troubleshooting

### Video not playing
1. Check browser HLS support (Chrome, Safari, Edge all support)
2. Verify CORS headers on video source
3. Use HTTPS in production (HLS requires it)

### Animations stuttering
1. Check GPU acceleration: `will-change: transform`
2. Reduce particle count in effects
3. Profile with DevTools Performance tab

### TypeScript errors
1. Run `npm install` to ensure type definitions installed
2. Check `tsconfig.json` includes all source files

## 📚 Resources

- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [GSAP Docs](https://gsap.com)
- [Framer Motion](https://www.framer.com/motion)
- [hls.js](https://github.com/video-dev/hls.js)
- [Mux Video](https://www.mux.com)

## 📄 License

This portfolio template is open source and available under the MIT License.

---

Built with ❤️ using React, GSAP, and Framer Motion
