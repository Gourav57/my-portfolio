import { useGLTF } from '@react-three/drei'
import { useStore } from '../store/useStore'

export default function Shoe() {
  const { nodes, materials } = useGLTF('/shoe-draco.glb')
  const colors = useStore((state) => state.colors)

  return (
    <group dispose={null} scale={3} position={[0, -1, 0]}>
      {/* 1. Laces */}
      <mesh 
        geometry={nodes.shoe.geometry} 
        material={materials.laces} 
        material-color={colors.laces} 
      />
      {/* 2. Main Mesh */}
      <mesh 
        geometry={nodes.shoe_1.geometry} 
        material={materials.mesh} 
        material-color={colors.mesh} 
      />
      {/* 3. Toe Cap (Part of Sole group) */}
      <mesh 
        geometry={nodes.shoe_2.geometry} 
        material={materials.caps} 
        material-color={colors.sole} 
      />
      {/* 4. Inner Sole */}
      <mesh 
        geometry={nodes.shoe_3.geometry} 
        material={materials.inner} 
        material-color={colors.inner}
      />
      
      {/* --- THE MISSING PARTS --- */}
      
      {/* 5. THE MAIN SOLE */}
      <mesh 
        geometry={nodes.shoe_4.geometry} 
        material={materials.sole} 
        material-color={colors.sole} 
      />
      {/* 6. Stripes */}
      <mesh 
        geometry={nodes.shoe_5.geometry} 
        material={materials.stripes} 
        material-color={colors.laces} 
      />
      {/* 7. Band */}
      <mesh 
        geometry={nodes.shoe_6.geometry} 
        material={materials.band} 
        material-color={colors.sole} 
      />
      {/* 8. Patch */}
      <mesh 
        geometry={nodes.shoe_7.geometry} 
        material={materials.patch} 
        material-color={colors.sole} 
      />
    </group>
  )
}