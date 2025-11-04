// Color palette showcase component
export default function ColorPalette() {
  const colors = [
    { name: 'Pure Black', hex: '#000000', class: 'bg-neutral-950' },
    { name: 'Main Blue', hex: '#4A70A9', class: 'bg-primary-500' },
    { name: 'Light Blue', hex: '#8FABD4', class: 'bg-primary-300' },
    { name: 'Cream/Beige', hex: '#EFECE3', class: 'bg-secondary-100' },
  ];

  const variations = [
    { name: 'Primary Scale', colors: ['bg-primary-50', 'bg-primary-100', 'bg-primary-300', 'bg-primary-500', 'bg-primary-700', 'bg-primary-950'] },
    { name: 'Secondary Scale', colors: ['bg-secondary-50', 'bg-secondary-100', 'bg-secondary-300', 'bg-secondary-500', 'bg-secondary-700', 'bg-secondary-900'] },
    { name: 'Neutral Scale', colors: ['bg-neutral-50', 'bg-neutral-100', 'bg-neutral-300', 'bg-neutral-500', 'bg-neutral-700', 'bg-neutral-950'] },
  ];

  return (
    <div className="p-8 bg-secondary-50 min-h-screen">
      <h1 className="text-3xl font-bold text-neutral-950 mb-8">Indorunners Purwakarta - Color Palette</h1>
      
      {/* Main Palette */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">Main Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {colors.map((color) => (
            <div key={color.name} className="bg-white rounded-lg shadow-md p-6 border border-primary-200">
              <div className={`w-full h-24 rounded-lg ${color.class} mb-4 border border-neutral-200`}></div>
              <h3 className="font-semibold text-neutral-900">{color.name}</h3>
              <p className="text-neutral-600 font-mono text-sm">{color.hex}</p>
              <p className="text-neutral-500 text-sm">{color.class}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Color Variations */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">Color Variations</h2>
        {variations.map((variation) => (
          <div key={variation.name} className="mb-8">
            <h3 className="text-lg font-medium text-neutral-700 mb-4">{variation.name}</h3>
            <div className="flex flex-wrap gap-2">
              {variation.colors.map((colorClass, index) => (
                <div key={colorClass} className="text-center">
                  <div className={`w-16 h-16 rounded-lg ${colorClass} border border-neutral-200`}></div>
                  <p className="text-xs text-neutral-600 mt-1">{colorClass.split('-')[2]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Gradient Examples */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">Brand Gradients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-gradient h-32 rounded-lg flex items-center justify-center">
            <p className="text-white font-semibold">Brand Gradient</p>
          </div>
          <div className="bg-hero-gradient h-32 rounded-lg flex items-center justify-center">
            <p className="text-white font-semibold">Hero Gradient</p>
          </div>
          <div className="bg-subtle-gradient h-32 rounded-lg flex items-center justify-center">
            <p className="text-neutral-800 font-semibold">Subtle Gradient</p>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">Usage Examples</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card Example */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-primary-200">
            <h3 className="text-xl font-bold text-primary-500 mb-3">Event Card</h3>
            <p className="text-neutral-700 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="flex gap-3">
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors">
                Primary Action
              </button>
              <button className="bg-secondary-100 hover:bg-secondary-200 text-primary-500 px-4 py-2 rounded-lg transition-colors border border-primary-300">
                Secondary Action
              </button>
            </div>
          </div>

          {/* Navigation Example */}
          <div className="bg-primary-500 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Navigation Style</h3>
            <div className="space-y-2">
              <div className="bg-primary-400 text-white px-3 py-2 rounded-lg">Active Link</div>
              <div className="text-primary-100 hover:text-white px-3 py-2 rounded-lg transition-colors cursor-pointer">Regular Link</div>
              <div className="text-primary-200 px-3 py-2 rounded-lg">Disabled Link</div>
            </div>
          </div>

          {/* Alert Examples */}
          <div className="space-y-4">
            <div className="bg-success-50 border border-primary-300 text-primary-700 px-4 py-3 rounded-lg">
              <strong>Success:</strong> Registration completed successfully!
            </div>
            <div className="bg-warning-50 border border-warning-500 text-warning-600 px-4 py-3 rounded-lg">
              <strong>Warning:</strong> Please verify your email address.
            </div>
            <div className="bg-error-50 border border-error-500 text-error-600 px-4 py-3 rounded-lg">
              <strong>Error:</strong> Something went wrong. Please try again.
            </div>
            <div className="bg-info-50 border border-info-500 text-primary-600 px-4 py-3 rounded-lg">
              <strong>Info:</strong> New event registration is now open!
            </div>
          </div>

          {/* Form Example */}
          <div className="bg-secondary-50 rounded-xl shadow-lg p-6 border border-secondary-200">
            <h3 className="text-xl font-bold text-neutral-950 mb-4">Form Elements</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Email address"
                className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <select className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option>Select event type</option>
                <option>5K Run</option>
                <option>10K Run</option>
                <option>Half Marathon</option>
              </select>
              <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg transition-colors">
                Submit Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}