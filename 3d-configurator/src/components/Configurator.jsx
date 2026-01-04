import { useStore } from '../store/useStore'

const colorOptions = [
  { name: 'Cyber Yellow', hex: '#FFD700' },
  { name: 'Neon Red', hex: '#FF0000' },
  { name: 'Matrix Green', hex: '#00FF41' },
  { name: 'Deep Purple', hex: '#8A2BE2' },
  { name: 'Stealth Black', hex: '#111111' },
  { name: 'Clean White', hex: '#FFFFFF' },
]

export default function Configurator() {
  const { colors, setColor } = useStore()

  return (
    <div className="absolute top-20 right-10 flex flex-col gap-6 p-6 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl w-80 text-white">
      <h2 className="text-2xl font-bold border-b border-white/20 pb-2">CUSTOMIZE</h2>

      {/* 1. SOLE SECTION */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Sole Color</h3>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((opt) => (
            <button
              key={opt.hex}
              onClick={() => setColor('sole', opt.hex)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                colors.sole === opt.hex ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: opt.hex }}
            />
          ))}
        </div>
      </div>

      {/* 2. BODY SECTION */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Main Body</h3>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((opt) => (
            <button
              key={opt.hex}
              onClick={() => setColor('mesh', opt.hex)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                colors.mesh === opt.hex ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: opt.hex }}
            />
          ))}
        </div>
      </div>

      {/* 3. LACES SECTION */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Laces / Detail</h3>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((opt) => (
            <button
              key={opt.hex}
              onClick={() => setColor('laces', opt.hex)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                colors.laces === opt.hex ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: opt.hex }}
            />
          ))}
        </div>
      </div>
      {/* 4. INNER MATERIAL SECTION (New) */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Inside Material</h3>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((opt) => (
            <button
              key={opt.hex}
              onClick={() => setColor('inner', opt.hex)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                colors.inner === opt.hex ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: opt.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}