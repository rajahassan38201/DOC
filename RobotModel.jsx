import React, { useRef, useMemo, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'; 

const MODEL_PATH = '/low_poly_humanoid_robot.glb';

export function RobotModel(props) {
  const group = useRef(); 
  
  const { animations, scene } = useGLTF(MODEL_PATH); 
  
  // --- Synchronous Filtering Logic to fix 'No target node found' warnings ---
  const { filteredAnimations } = useMemo(() => {
    
    const objectNames = new Set();
    scene.traverse((obj) => {
        objectNames.add(obj.name);
    });
    
    const filterTracks = (clip) => {
        const filteredTracks = clip.tracks.filter(track => {
            const trackName = track.name;
            const nodeName = trackName.split('.')[0];
            
            // Check if the node exists in the scene hierarchy
            return objectNames.has(nodeName); 
        });
        
        return new THREE.AnimationClip(clip.name, clip.duration, filteredTracks);
    };

    const finalFilteredAnimations = animations.map(clip => filterTracks(clip));
    
    const totalOriginalTracks = animations.reduce((sum, clip) => sum + clip.tracks.length, 0);
    const totalFilteredTracks = finalFilteredAnimations.reduce((sum, clip) => sum + clip.tracks.length, 0);
    console.log(`Debug: Animation Tracks Filtered. Original: ${totalOriginalTracks}, Remaining: ${totalFilteredTracks}`);

    return { 
        filteredAnimations: finalFilteredAnimations
    };

  }, [animations, scene]); 

  const { actions } = useAnimations(filteredAnimations, group);
  
  
  // --- Animation Playback & Smooth Looping Fix (Speed 1.5x) ---
  React.useEffect(() => {
    const walkAction = actions['walk'] || actions[Object.keys(actions)[0]];
    const fadeDuration = 0.3; 
    const walkSpeed = 1.5; // Animation ko 50% tez chalao

    if (walkAction) {
        walkAction.stop(); 
        walkAction.reset();

        walkAction.setEffectiveTimeScale(walkSpeed);
        
        walkAction.setLoop(THREE.LoopRepeat, Infinity); 
        
        // Pausing fix: Action ko apne hi upar cross-fade karte hain
        walkAction.crossFadeTo(walkAction, fadeDuration, true).play(); 
        
        walkAction.setEffectiveWeight(1);
        
        console.log(`SUCCESS: Animation running at ${walkSpeed}x speed.`);
    } else {
        console.error("Critical: Animation action 'walk' not found.");
    }
    
    return () => {
         if (walkAction) walkAction.fadeOut(fadeDuration);
    };
  }, [actions]); 

  // --- Movement (Sliding) Logic ---
  useFrame((state) => {
    if (group.current) {
        const speed = 0.1; // Sliding speed
        const pathLength = 6; 
        const newX = (state.clock.elapsedTime * speed) % pathLength; 
        group.current.position.x = newX - (pathLength / 2); 
    }
  });

  // --- Model Rendering ---
  return (
    <group ref={group} {...props} dispose={null} 
        position={[0, -0.1, 0]} 
        scale={[0.4, 0.4, 0.4]} 
        rotation={[0, Math.PI / 2, 0]}
    >
      <primitive object={scene} /> 
    </group>
  );
}

useGLTF.preload(MODEL_PATH);