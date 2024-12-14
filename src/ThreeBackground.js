import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

const ThreeBackground = () => {
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box args={[1, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial attach="material" color="orange" />
      </Box>
      <OrbitControls />
    </Canvas>
  );
};

export default ThreeBackground;