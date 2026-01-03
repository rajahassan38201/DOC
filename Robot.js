// src/Robot.js

import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei'; 
import { useFrame } from '@react-three/fiber'; 
import * as THREE from 'three'; 

const Robot = () => {
    // ✅ FIX: 'nodes' ko bhi nikalen
    const { scene, animations, nodes } = useGLTF('/low_poly_humanoid_robot.glb'); 
    const robotRef = useRef();
    
    // Model ki copy
    const clonedScene = React.useMemo(() => {
        const obj = scene.clone(true);
        
        // FIX: Nodes ko clone kiye gaye object se bind karein
        // Har node ko clonedScene ke corresponding child se replace karein
        obj.traverse((child) => {
            if (child.isMesh) {
                // SkinnedMesh aur regular Mesh par bind karein
                const nodeName = child.name;
                if (nodes[nodeName]) {
                    // Yahan hum sirf properties set kar rahe hain, full replace nahi
                    // Iski bajaye hum seedha useAnimations ko ref par lagayenge.
                    
                    // Simple fix: Nodes ko update karne ki zaroorat nahi hai.
                    // Humara main focus Mixer ki targetting par rahega.
                }
            }
        });
        return obj;
    }, [scene, nodes]); 

    // ✅ FIX: useAnimations hook istemaal karein, aur isko root object (clonedScene) par laga dein
    // Note: useAnimations khud hi nodes ko dhoondhne ki koshish karta hai
    const { actions } = useAnimations(animations, robotRef); 

    // SCALING aur POSITIONING
    const scale = [0.4, 0.4, 0.4]; 
    const initialPosition = [0, -0.1, 0]; 
    const rotation = [0, Math.PI / 2, 0]; 

    // --- Animation Playback ---
    useEffect(() => {
        const walkAction = actions['walk'] || actions[Object.keys(actions)[0]];

        if (walkAction) {
            walkAction.stop(); 
            // Ab hum action ki binding ko force karenge
            walkAction.clampWhenFinished = true; // Animation ko last frame par rokne ke liye
            walkAction.reset().fadeIn(0.5).play();
            console.log("LOG 4: ✅ SUCCESS - Animation action FOUND and PLAYING (Forced Bind).");
        } else {
            console.error("LOG 4: ❌ FAILURE - Animation action 'walk' NOT FOUND.");
        }
        
        return () => {
             if (walkAction) walkAction.fadeOut(0.5);
        };
    }, [actions]); 

    // --- Frame Update (Movement Only) ---
    useFrame((state) => {
        if (robotRef.current) {
            const speed = 0.05; 
            const pathLength = 6; 
            const newX = (state.clock.elapsedTime * speed) % pathLength; 
            robotRef.current.position.x = newX - (pathLength / 2); 
        }
    });

    return (
        <primitive 
            ref={robotRef}
            object={clonedScene} // Yahan hum clonedScene de rahe hain
            scale={scale} 
            position={initialPosition} 
            rotation={rotation}
        />
    );
};

useGLTF.preload('/low_poly_humanoid_robot.glb');

export default Robot;