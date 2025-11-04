# Panduan Penggunaan Color Palette - Indorunners Purwakarta

## Palet Warna Utama

Aplikasi menggunakan 4 warna utama yang telah ditentukan:

### Warna Dasar
- **#000000** - Pure Black (Hitam Murni)
- **#4A70A9** - Main Blue (Biru Utama) 
- **#8FABD4** - Light Blue (Biru Muda)
- **#EFECE3** - Cream/Beige (Krem/Beige)

## Skema Warna Tailwind CSS

### Primary Colors (Biru sebagai warna utama)
```css
primary-50: #f0f6ff    /* Very light blue */
primary-100: #e0ecff   /* Light blue tint */
primary-200: #b8daff   /* Lighter version of 8FABD4 */
primary-300: #8FABD4   /* Your light blue */
primary-400: #6a8bc7   /* Between light and dark blue */
primary-500: #4A70A9   /* Your main blue */
primary-600: #3d5d8f   /* Darker version */
primary-700: #314a75   /* Even darker */
primary-800: #263a5e   /* Very dark blue */
primary-900: #1a2940   /* Almost black blue */
primary-950: #000000   /* Your black */
```

### Secondary Colors (Krem/Beige sebagai warna sekunder)
```css
secondary-50: #fefefe    /* Almost white */
secondary-100: #EFECE3  /* Your cream/beige */
secondary-200: #e6e1d5  /* Slightly darker cream */
secondary-300: #ddd6c7  /* Medium cream */
secondary-400: #d4cab9  /* Darker cream */
secondary-500: #c5b8a3  /* Brown tint */
secondary-600: #b0a088  /* Light brown */
secondary-700: #8f8169  /* Medium brown */
secondary-800: #6e624b  /* Dark brown */
secondary-900: #4d432e  /* Very dark brown */
```

### Neutral Colors (Berdasarkan hitam)
```css
neutral-50: #f9f9f9     /* Almost white */
neutral-100: #f1f1f1    /* Very light gray */
neutral-200: #e5e5e5    /* Light gray */
neutral-300: #d1d1d1    /* Medium light gray */
neutral-400: #a3a3a3    /* Medium gray */
neutral-500: #737373    /* Medium dark gray */
neutral-600: #525252    /* Dark gray */
neutral-700: #404040    /* Very dark gray */
neutral-800: #262626    /* Almost black */
neutral-900: #171717    /* Very dark */
neutral-950: #000000    /* Your pure black */
```

## Gradient yang Tersedia

### Brand Gradients
```css
bg-brand-gradient     /* linear-gradient(135deg, #4A70A9 0%, #8FABD4 100%) */
bg-hero-gradient      /* linear-gradient(135deg, #000000 0%, #4A70A9 50%, #8FABD4 100%) */
bg-subtle-gradient    /* linear-gradient(135deg, #EFECE3 0%, #8FABD4 100%) */
```

## Panduan Penggunaan

### 1. Warna Background
- **Utama**: `bg-secondary-50` (untuk body/container utama)
- **Card/Surface**: `bg-white` 
- **Hero Section**: `bg-hero-gradient`

### 2. Warna Text
- **Heading**: `text-primary-600` atau `text-neutral-950`
- **Body Text**: `text-neutral-700`
- **Secondary Text**: `text-neutral-600`
- **Muted Text**: `text-neutral-500`

### 3. Button Styles
- **Primary Button**: `bg-primary-500 hover:bg-primary-600 text-white`
- **Secondary Button**: `bg-secondary-100 hover:bg-secondary-200 text-primary-500`
- **Outline Button**: `border-primary-300 text-primary-500 hover:bg-primary-50`

### 4. Border dan Divider
- **Card Border**: `border-primary-200`
- **Input Border**: `border-primary-300 focus:border-primary-500`
- **Divider**: `border-primary-200`

### 5. States dan Feedback
- **Success**: `bg-primary-50 border-primary-300 text-primary-700`
- **Warning**: `bg-warning-50 border-warning-500 text-warning-600`
- **Error**: `bg-error-50 border-error-500 text-error-600`
- **Info**: `bg-info-50 border-info-500 text-primary-600`

### 6. Navigation
- **Active Link**: `text-primary-500`
- **Hover State**: `hover:text-primary-500 hover:bg-secondary-50`
- **Background**: `bg-white border-primary-200`

## Contoh Implementasi

### Card Component
```tsx
<div className="bg-white border border-primary-200 rounded-lg shadow-sm hover:shadow-md">
  <div className="p-6">
    <h3 className="text-xl font-semibold text-primary-600 mb-2">Title</h3>
    <p className="text-neutral-700 mb-4">Description text</p>
    <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg">
      Action Button
    </button>
  </div>
</div>
```

### Form Elements
```tsx
<input 
  className="w-full px-4 py-2 border border-primary-300 rounded-lg 
             focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
  placeholder="Enter text..."
/>
```

### Alert/Notification
```tsx
<div className="bg-primary-50 border border-primary-300 text-primary-700 px-4 py-3 rounded-lg">
  <strong>Success:</strong> Operation completed successfully!
</div>
```

## Dark Mode Support

Aplikasi mendukung dark mode dengan automatic detection:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #000000;     /* Your black for dark background */
    --foreground: #EFECE3;     /* Your cream for dark text */
    --primary: #8FABD4;        /* Your light blue as primary in dark */
    --primary-light: #4A70A9;  /* Your dark blue as accent */
    --surface: #1a2940;        /* Very dark blue for surfaces */
    --border: #4A70A9;         /* Dark blue for borders */
    --muted: #404040;          /* Dark muted tone */
  }
}
```

## File yang Telah Diupdate

1. `tailwind.config.ts` - Konfigurasi warna lengkap
2. `src/app/globals.css` - CSS variables dan dark mode
3. `src/components/ui/button.tsx` - Button dengan skema baru
4. `src/components/ui/card.tsx` - Card dengan border dan shadow baru
5. `src/components/navigation.tsx` - Navigation dengan warna brand
6. `src/app/page.tsx` - Homepage dengan gradient dan styling baru
7. `src/app/layout.tsx` - Layout dengan background baru
8. `src/components/ColorPalette.tsx` - Showcase component
9. `src/app/colors/page.tsx` - Halaman untuk melihat palette

## Akses Color Showcase

Untuk melihat implementasi lengkap color palette, buka:
`http://localhost:3000/colors`

## Best Practices

1. **Konsistensi**: Selalu gunakan skala warna yang telah didefinisikan
2. **Kontras**: Pastikan kontras yang cukup untuk aksesibilitas
3. **Hierarchy**: Gunakan intensitas warna untuk menunjukkan hierarki
4. **Brand Identity**: Pertahankan identitas brand dengan warna primary
5. **User Experience**: Gunakan warna untuk membantu navigasi dan feedback