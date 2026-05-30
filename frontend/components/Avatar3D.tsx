import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

interface BoneGroup {
  group: THREE.Group;
  initialRot: THREE.Euler;
}

interface AvatarSkeleton {
  head: BoneGroup;
  torso: THREE.Group;
  leftUpperArm: BoneGroup;
  leftLowerArm: BoneGroup;
  rightUpperArm: BoneGroup;
  rightLowerArm: BoneGroup;
  leftUpperLeg: BoneGroup;
  leftLowerLeg: BoneGroup;
  rightUpperLeg: BoneGroup;
  rightLowerLeg: BoneGroup;
}

interface Keyframe {
  time: number;
  rotations: Partial<Record<keyof AvatarSkeleton, [number, number, number]>>;
}

interface AnimationDef {
  keyframes: Keyframe[];
}

const ANIMATIONS: Record<string, AnimationDef> = {
  hello: {
    keyframes: [
      { time: 0, rotations: { rightUpperArm: [0, 0, 0], rightLowerArm: [0, 0, 0] } },
      { time: 0.3, rotations: { rightUpperArm: [-0.8, -0.5, 0], rightLowerArm: [-0.5, 0, 0] } },
      { time: 0.6, rotations: { rightUpperArm: [-0.8, 0.5, 0], rightLowerArm: [-0.5, 0, 0] } },
      { time: 0.9, rotations: { rightUpperArm: [-0.8, -0.5, 0], rightLowerArm: [-0.5, 0, 0] } },
      { time: 1.2, rotations: { rightUpperArm: [-0.8, 0.5, 0], rightLowerArm: [-0.5, 0, 0] } },
      { time: 1.5, rotations: { rightUpperArm: [0, 0, 0], rightLowerArm: [0, 0, 0] } },
    ],
  },
  thank_you: {
    keyframes: [
      { time: 0, rotations: { rightUpperArm: [0, 0, 0], rightLowerArm: [0, 0, 0], leftUpperArm: [0, 0, 0], leftLowerArm: [0, 0, 0] } },
      { time: 0.3, rotations: { rightUpperArm: [-1.2, 0.3, 0], rightLowerArm: [-0.8, 0, 0], leftUpperArm: [-1.2, -0.3, 0], leftLowerArm: [-0.8, 0, 0] } },
      { time: 0.8, rotations: { rightUpperArm: [-0.5, 0.5, 0], rightLowerArm: [-0.3, 0, 0], leftUpperArm: [-0.5, -0.5, 0], leftLowerArm: [-0.3, 0, 0] } },
      { time: 1.2, rotations: { rightUpperArm: [-1.2, 0.3, 0], rightLowerArm: [-0.8, 0, 0], leftUpperArm: [-1.2, -0.3, 0], leftLowerArm: [-0.8, 0, 0] } },
      { time: 1.8, rotations: { rightUpperArm: [0, 0, 0], rightLowerArm: [0, 0, 0], leftUpperArm: [0, 0, 0], leftLowerArm: [0, 0, 0] } },
    ],
  },
  yes: {
    keyframes: [
      { time: 0, rotations: { head: [0, 0, 0] } },
      { time: 0.2, rotations: { head: [0.3, 0, 0] } },
      { time: 0.5, rotations: { head: [-0.1, 0, 0] } },
      { time: 0.8, rotations: { head: [0.3, 0, 0] } },
      { time: 1.0, rotations: { head: [0, 0, 0] } },
    ],
  },
  no: {
    keyframes: [
      { time: 0, rotations: { head: [0, 0, 0] } },
      { time: 0.2, rotations: { head: [0, 0.4, 0] } },
      { time: 0.5, rotations: { head: [0, -0.4, 0] } },
      { time: 0.8, rotations: { head: [0, 0.4, 0] } },
      { time: 1.0, rotations: { head: [0, 0, 0] } },
    ],
  },
  please: {
    keyframes: [
      { time: 0, rotations: { rightUpperArm: [0, 0, 0], rightLowerArm: [0, 0, 0] } },
      { time: 0.3, rotations: { rightUpperArm: [-0.3, 0, 0], rightLowerArm: [-0.8, 0, 0] } },
      { time: 0.6, rotations: { rightUpperArm: [-0.3, 0.3, 0], rightLowerArm: [-0.5, 0, 0] } },
      { time: 0.9, rotations: { rightUpperArm: [-0.3, -0.3, 0], rightLowerArm: [-0.5, 0, 0] } },
      { time: 1.2, rotations: { rightUpperArm: [-0.3, 0, 0], rightLowerArm: [-0.8, 0, 0] } },
      { time: 1.5, rotations: { rightUpperArm: [0, 0, 0], rightLowerArm: [0, 0, 0] } },
    ],
  },
  good: {
    keyframes: [
      { time: 0, rotations: { rightUpperArm: [0, 0, 0], rightLowerArm: [0, 0, 0] } },
      { time: 0.3, rotations: { rightUpperArm: [-1.5, 0, 0.3], rightLowerArm: [-1.0, 0, 0] } },
      { time: 0.8, rotations: { rightUpperArm: [-1.5, 0, 0.3], rightLowerArm: [-1.0, 0, 0] } },
      { time: 1.2, rotations: { rightUpperArm: [0, 0, 0], rightLowerArm: [0, 0, 0] } },
    ],
  },
  bad: {
    keyframes: [
      { time: 0, rotations: { rightUpperArm: [0, 0, 0], rightLowerArm: [0, 0, 0] } },
      { time: 0.3, rotations: { rightUpperArm: [0.5, 0, 0.3], rightLowerArm: [0.3, 0, 0] } },
      { time: 0.8, rotations: { rightUpperArm: [0.3, 0, 0], rightLowerArm: [0.5, 0, 0] } },
      { time: 1.2, rotations: { rightUpperArm: [0, 0, 0], rightLowerArm: [0, 0, 0] } },
    ],
  },
};


function createLimb(parent: THREE.Group, length: number, radius: number, color: number): THREE.Group {
  const g = new THREE.Group();
  const geo = new THREE.CylinderGeometry(radius, radius, length, 8);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = -length / 2;
  g.add(mesh);
  const jointGeo = new THREE.SphereGeometry(radius * 0.9, 8, 8);
  const jointMat = new THREE.MeshStandardMaterial({ color: 0xf5cba7, roughness: 0.8 });
  const joint = new THREE.Mesh(jointGeo, jointMat);
  joint.position.y = 0;
  g.add(joint);
  parent.add(g);
  return g;
}

interface Avatar3DProps {
  animationNames?: string[];
}

export function Avatar3D({ animationNames }: Avatar3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animTimeRef = useRef(0);
  const currentAnimIdxRef = useRef(0);
  const skeletonRef = useRef<AvatarSkeleton | null>(null);

  const buildSkeleton = useCallback((scene: THREE.Scene): AvatarSkeleton => {
    const torso = new THREE.Group();
    const torsoGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.6, 8);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.6 });
    const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    torsoMesh.position.y = 0.3;
    torso.add(torsoMesh);
    scene.add(torso);

    const headGroup = new THREE.Group();
    headGroup.position.y = 0.75;
    const headGeo = new THREE.SphereGeometry(0.15, 12, 12);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xf5cba7, roughness: 0.8 });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headGroup.add(headMesh);
    torso.add(headGroup);

    const leftUpperArm = createLimb(torso, 0.3, 0.06, 0x2c3e50);
    leftUpperArm.position.set(-0.28, 0.5, 0);
    const leftLowerArm = createLimb(leftUpperArm, 0.3, 0.05, 0x34495e);
    leftLowerArm.position.set(0, -0.3, 0);
    const rightUpperArm = createLimb(torso, 0.3, 0.06, 0x2c3e50);
    rightUpperArm.position.set(0.28, 0.5, 0);
    const rightLowerArm = createLimb(rightUpperArm, 0.3, 0.05, 0x34495e);
    rightLowerArm.position.set(0, -0.3, 0);

    const leftUpperLeg = createLimb(torso, 0.3, 0.08, 0x1a252f);
    leftUpperLeg.position.set(-0.12, 0, 0);
    const leftLowerLeg = createLimb(leftUpperLeg, 0.3, 0.06, 0x2c3e50);
    leftLowerLeg.position.set(0, -0.3, 0);
    const rightUpperLeg = createLimb(torso, 0.3, 0.08, 0x1a252f);
    rightUpperLeg.position.set(0.12, 0, 0);
    const rightLowerLeg = createLimb(rightUpperLeg, 0.3, 0.06, 0x2c3e50);
    rightLowerLeg.position.set(0, -0.3, 0);

    const s: AvatarSkeleton = {
      head: { group: headGroup, initialRot: headGroup.rotation.clone() },
      torso,
      leftUpperArm: { group: leftUpperArm, initialRot: leftUpperArm.rotation.clone() },
      leftLowerArm: { group: leftLowerArm, initialRot: leftLowerArm.rotation.clone() },
      rightUpperArm: { group: rightUpperArm, initialRot: rightUpperArm.rotation.clone() },
      rightLowerArm: { group: rightLowerArm, initialRot: rightLowerArm.rotation.clone() },
      leftUpperLeg: { group: leftUpperLeg, initialRot: leftUpperLeg.rotation.clone() },
      leftLowerLeg: { group: leftLowerLeg, initialRot: leftLowerLeg.rotation.clone() },
      rightUpperLeg: { group: rightUpperLeg, initialRot: rightUpperLeg.rotation.clone() },
      rightLowerLeg: { group: rightLowerLeg, initialRot: rightLowerLeg.rotation.clone() },
    };
    return s;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth || 300;
    const h = container.clientHeight || 300;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f4f8);
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 10);
    camera.position.set(0, 0.3, 2.5);
    camera.lookAt(0, 0.3, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(1, 2, 2);
    scene.add(dir);

    const skeleton = buildSkeleton(scene);
    skeletonRef.current = skeleton;

    let running = true;
    const clock = new THREE.Clock();

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);
      const dt = clock.getDelta();

      if (animationNames && animationNames.length > 0) {
        const idx = currentAnimIdxRef.current;
        const name = animationNames[idx]?.toLowerCase().replace(/\s/g, '_') || '';
        const anim = ANIMATIONS[name] || ANIMATIONS.hello;
        const duration = anim.keyframes[anim.keyframes.length - 1]?.time || 1;
        animTimeRef.current += dt;

        if (animTimeRef.current >= duration) {
          animTimeRef.current = 0;
          currentAnimIdxRef.current = (idx + 1) % animationNames.length;
        }

        const t = animTimeRef.current;
        const kfs = anim.keyframes;
        for (let i = 0; i < kfs.length - 1; i++) {
          const a = kfs[i];
          const b = kfs[i + 1];
          if (t >= a.time && t <= b.time) {
            const p = (t - a.time) / (b.time - a.time);
            for (const [boneName, targetRot] of Object.entries(b.rotations)) {
              const bone = skeleton[boneName as keyof AvatarSkeleton] as BoneGroup | undefined;
              if (bone && a.rotations[boneName as keyof typeof a.rotations]) {
                const from = a.rotations[boneName as keyof typeof a.rotations]!;
                const to = targetRot as [number, number, number];
                bone.group.rotation.x = from[0] + (to[0] - from[0]) * p;
                bone.group.rotation.y = from[1] + (to[1] - from[1]) * p;
                bone.group.rotation.z = from[2] + (to[2] - from[2]) * p;
              }
            }
            break;
          }
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 300;
      const nh = container.clientHeight || 300;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      running = false;
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [animationNames, buildSkeleton]);

  return (
    <div
      ref={containerRef}
      className="w-full h-72 bg-gray-100 rounded-lg overflow-hidden"
    />
  );
}
