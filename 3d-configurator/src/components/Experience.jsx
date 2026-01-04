import { PresentationControls, Stage, ContactShadows } from '@react-three/drei'
import Shoe from './Shoe'

export default function Experience() {
  return (
    <PresentationControls
      speed={1.5}
      global
      polar={[-0.1, Math.PI / 4]}
      rotation={[Math.PI / 8, Math.PI / 4, 0]}
    >
      {/* Stage handles the professional lighting automatically */}
      <Stage environment="city" intensity={0.8} contactShadow={false}>
          <Shoe />
      </Stage>

      {/* The Shadow makes it feel grounded */}
      <ContactShadows 
        position={[0, -1.4, 0]} 
        opacity={0.7} 
        scale={10} 
        blur={2} 
        far={4} 
        color="#000000"
      />
    </PresentationControls>
  )
}