import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience'
import Configurator from './components/Configurator' // <--- 1. Import it

export default function App() {
  return (
    <div className="h-screen w-full bg-[#111] relative"> {/* relative is important */}
      
      {/* The 3D World */}
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
        <Experience />
      </Canvas>

      {/* The UI Overlay */}
      <Configurator /> 

    </div>
  )
}