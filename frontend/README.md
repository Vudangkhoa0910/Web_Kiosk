# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Robot Delivery Frontend

## 🚀 Dự Án Robot Delivery System

Đây là frontend cho hệ thống giao hàng robot tự động với giao diện hiện đại, thân thiện và tối ưu cho màn hình cảm ứng.

### ✨ Tính Năng

- **Giao diện hiện đại**: Thiết kế theo tông màu bạc xám tinh tế với logo Alpha Asimov
- **Responsive Design**: Tối ưu cho cả desktop và màn hình cảm ứng lớn
- **5 Section chính**:
  - 🏠 **Home**: Trang chủ với store categories và featured stores
  - 🤖 **Robots**: Quản lý và theo dõi trạng thái robot
  - 🗺️ **Maps**: Bản đồ và điều khiển vị trí
  - 📋 **Orders**: Giao diện đặt hàng
  - 📊 **Live Orders**: Theo dõi đơn hàng real-time

### 🛠️ Technology Stack

- **React 18** + **TypeScript**
- **Vite** (Fast build tool)
- **TailwindCSS** (Utility-first CSS)
- **Framer Motion** (Animations)
- **Lucide React** (Modern icons)
- **Socket.IO Client** (Real-time communication)
- **Leaflet** (Maps integration)

### 🎨 Design System

#### Color Palette
- **Primary**: Shades of blue (#2563EB - #0f172a)
- **Accent**: Gray tones (#6b7280 - #111827) 
- **Surface**: White to light gray (#ffffff - #212121)

#### Typography
- **Font**: Inter (Google Fonts)
- **Scales**: Text-sm to text-6xl with proper hierarchy

#### Components
- **Cards**: Soft shadows with hover effects
- **Buttons**: Primary, secondary, ghost variants
- **Badges**: Status indicators with colors
- **Inputs**: Focus states with ring effects

### 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── index.ts
│   ├── layout/             # Layout components
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   └── sections/           # Main sections
│       ├── HomeSection.tsx
│       ├── RobotsSection.tsx
│       ├── MapsSection.tsx
│       ├── OrdersSection.tsx
│       └── LiveOrdersSection.tsx
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript definitions
├── utils/                  # Utility functions
└── App.tsx                 # Main app component
```

### 🚀 Development

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

### 🎯 Next Steps

1. **Maps Integration**: Implement Leaflet maps with robot tracking
2. **Socket.IO**: Connect with backend for real-time updates
3. **Order Management**: Complete order flow with forms
4. **Robot Control**: MQTT integration for robot commands
5. **Deployment**: Setup for Netlify/Vercel

### 📱 Touch-Friendly Features

- Large touch targets (min 44px)
- Clear visual feedback
- Smooth animations
- Gesture support
- High contrast text
- Easy navigation

### 🌟 Key Highlights

- **Modern aesthetics** with subtle gradients and shadows
- **Smooth animations** powered by Framer Motion
- **Consistent branding** with Alpha Asimov logo integration
- **Scalable architecture** for easy feature additions
- **Type-safe** development with TypeScript
- **Performance optimized** with Vite and lazy loading

This frontend provides an excellent foundation for the robot delivery demo system!

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
