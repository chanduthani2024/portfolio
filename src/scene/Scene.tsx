import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, MeshDistortMaterial, Float } from '@react-three/drei'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { damp, damp3 } from 'maath/easing'
import { store } from '../hooks/store'
import { orbitSkills } from '../data/content'

const LIME = new THREE.Color('#d6ff3f')
const HOT = new THREE.Color('#ff5a36')
const VIOLET = new THREE.Color('#7a5cff')
const CYAN = new THREE.Color('#38d9ff')

/** Per-section pose of the hero core: [x, y, z, scale, color]. */
const ANCHORS: { p: [number, number, number]; s: number; c: THREE.Color }[] = [
  { p: [2.4, 0.1, 0], s: 1.7, c: LIME }, // hero
  { p: [-2.9, 0, -1], s: 1.1, c: VIOLET }, // about
  { p: [0, 0, -5], s: 0.55, c: CYAN }, // skills
  { p: [3.2, 0, -2], s: 0.95, c: HOT }, // experience
  { p: [3.8, 0.8, -3], s: 0.9, c: LIME }, // projects
  { p: [0, 1.8, -7], s: 0.8, c: VIOLET }, // life
  { p: [3.4, 0.2, -1.5], s: 1.35, c: HOT }, // contact
]

const smooth = (t: number) => t * t * (3 - 2 * t)
const near = (s: number, i: number, r = 0.9) => Math.max(0, 1 - Math.abs(s - i) / r)

function Core() {
  const group = useRef<THREE.Group>(null!)
  const mat = useRef<THREE.MeshStandardMaterial & { distort: number }>(null!)
  const wire = useRef<THREE.MeshBasicMaterial>(null!)
  const rings = useRef<THREE.Group>(null!)
  const { size } = useThree()
  const target = useMemo(() => new THREE.Vector3(), [])
  const color = useMemo(() => new THREE.Color(), [])

  useFrame((state, dt) => {
    const wide = size.width > 900
    const s = store.section
    const i = Math.min(ANCHORS.length - 2, Math.floor(s))
    const f = smooth(Math.min(1, s - i))
    const a = ANCHORS[i]
    const b = ANCHORS[i + 1]

    target.set(
      THREE.MathUtils.lerp(a.p[0], b.p[0], f) * (wide ? 1 : 0.12),
      THREE.MathUtils.lerp(a.p[1], b.p[1], f),
      THREE.MathUtils.lerp(a.p[2], b.p[2], f) - (wide ? 0 : 2.2),
    )
    // mouse parallax on the core itself
    target.x += store.mouse.x * 0.35
    target.y += store.mouse.y * 0.25
    damp3(group.current.position, target, 0.35, dt)

    const sc = THREE.MathUtils.lerp(a.s, b.s, f) * (wide ? 1 : 0.8)
    damp(group.current.scale, 'x', sc, 0.3, dt)
    damp(group.current.scale, 'y', sc, 0.3, dt)
    damp(group.current.scale, 'z', sc, 0.3, dt)

    color.copy(a.c).lerp(b.c, f)
    mat.current.color.lerp(color, 0.08)
    mat.current.emissive.lerp(color, 0.08)
    wire.current.color.lerp(color, 0.08)

    // scroll velocity-ish excitement: distort more mid-transition
    const excite = 0.38 + Math.sin(f * Math.PI) * 0.35
    mat.current.distort = THREE.MathUtils.lerp(mat.current.distort, excite, 0.06)

    group.current.rotation.y += dt * 0.25 + (store.mouse.x * 0.4 - group.current.rotation.y * 0) * 0.002
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + store.mouse.y * 0.2
    rings.current.rotation.z += dt * 0.35
    rings.current.rotation.x += dt * 0.12
  })

  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1, 24]} />
          <MeshDistortMaterial
            ref={mat as never}
            color="#d6ff3f"
            emissive="#d6ff3f"
            emissiveIntensity={0.18}
            roughness={0.12}
            metalness={0.9}
            distort={0.45}
            speed={2.2}
            envMapIntensity={1.2}
          />
        </mesh>
        <mesh scale={1.32}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial ref={wire} wireframe transparent opacity={0.22} color="#d6ff3f" />
        </mesh>
        <group ref={rings}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.75, 0.008, 8, 160]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
          </mesh>
          <mesh rotation={[Math.PI / 2.8, 0.6, 0]}>
            <torusGeometry args={[2.1, 0.006, 8, 160]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
          <mesh rotation={[0.4, 0.2, 1]}>
            <torusGeometry args={[2.5, 0.005, 8, 160]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
          </mesh>
        </group>
      </Float>
    </group>
  )
}

function Galaxy() {
  const ref = useRef<THREE.Points>(null!)
  const { geometry } = useMemo(() => {
    const n = window.innerWidth < 800 ? 3200 : 6500
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    const palette = [LIME, HOT, VIOLET, CYAN, new THREE.Color('#ffffff')]
    for (let i = 0; i < n; i++) {
      const r = Math.pow(Math.random(), 0.6) * 22 + 1.5
      const branch = (i % 5) / 5
      const angle = branch * Math.PI * 2 + r * 0.45
      const spread = Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? -1 : 1) * r * 0.22
      pos[i * 3] = Math.cos(angle) * r + spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9 * Math.exp(-r * 0.05)
      pos[i * 3 + 2] = Math.sin(angle) * r + spread - 6
      const c = palette[(Math.random() * palette.length) | 0].clone().multiplyScalar(0.55 + Math.random() * 0.6)
      col.set([c.r, c.g, c.b], i * 3)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return { geometry: g }
  }, [])

  useFrame((_, dt) => {
    const p = ref.current
    p.rotation.y += dt * 0.02
    damp(p.rotation, 'x', store.mouse.y * 0.06 + store.section * 0.05, 0.6, dt)
    damp(p.position, 'y', store.section * 0.45 - 1, 0.8, dt)
    damp(p.position, 'x', -store.mouse.x * 0.4, 0.8, dt)
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function makeLabel(text: string) {
  const c = document.createElement('canvas')
  c.width = 384
  c.height = 96
  const g = c.getContext('2d')!
  g.fillStyle = 'rgba(12,11,20,0.78)'
  g.strokeStyle = 'rgba(255,255,255,0.35)'
  g.lineWidth = 3
  g.beginPath()
  g.roundRect(6, 6, 372, 84, 42)
  g.fill()
  g.stroke()
  g.fillStyle = '#f2efe8'
  g.font = '600 38px "Space Grotesk", system-ui, sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(text, 192, 50)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function TechOrbit() {
  const group = useRef<THREE.Group>(null!)
  const labels = useMemo(() => {
    const n = orbitSkills.length
    return orbitSkills.map((text, i) => {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = i * Math.PI * (3 - Math.sqrt(5))
      return { text, pos: new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(3.4), tex: makeLabel(text) }
    })
  }, [])

  useFrame((_, dt) => {
    const k = smooth(near(store.section, 2.25, 0.5))
    const g = group.current
    g.visible = k > 0.001
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, 0.3 + k * 1.05, 0.2))
    g.rotation.y += dt * (0.18 + k * 0.1) + store.mouse.x * dt * 0.4
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, store.mouse.y * 0.3, 0.05)
    labels.forEach((_, i) => {
      const s = g.children[i] as THREE.Sprite
      if (s) (s.material as THREE.SpriteMaterial).opacity = k
    })
  })

  return (
    <group ref={group} position={[0, 0, -2]}>
      {labels.map((l) => (
        <sprite key={l.text} position={l.pos} scale={[1.9, 0.475, 1]}>
          <spriteMaterial map={l.tex} transparent depthWrite={false} />
        </sprite>
      ))}
    </group>
  )
}

function Terrain() {
  const mat = useRef<THREE.MeshBasicMaterial>(null!)
  const mesh = useRef<THREE.Mesh>(null!)
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(60, 40, 90, 60)
    g.rotateX(-Math.PI / 2)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const z = p.getZ(i)
      const h =
        Math.sin(x * 0.35) * Math.cos(z * 0.3) * 1.4 +
        Math.sin(x * 0.9 + z * 0.6) * 0.35 +
        Math.max(0, 3.2 - Math.hypot(x - 6, z + 4) * 0.6) * 1.6
      p.setY(i, h)
    }
    return g
  }, [])

  useFrame((_, dt) => {
    const k = Math.max(smooth(near(store.section, 5, 1.1)), smooth(near(store.section, 6, 0.8)) * 0.6)
    mat.current.opacity = THREE.MathUtils.lerp(mat.current.opacity, k * 0.38, 0.08)
    mesh.current.position.z = ((performance.now() * 0.0006) % 1) * 0.67 - 8
    void dt
  })

  return (
    <mesh ref={mesh} geometry={geo} position={[0, -5, -8]}>
      <meshBasicMaterial ref={mat} wireframe color="#d6ff3f" transparent opacity={0} />
    </mesh>
  )
}

function Rig() {
  const { camera } = useThree()
  useFrame((_, dt) => {
    const s = store.section
    // gentle dolly + parallax, plus a push-in when the contact section arrives
    const targetZ = 8 - smooth(near(s, 6, 1)) * 2.2
    damp(camera.position, 'z', targetZ, 0.6, dt)
    damp(camera.position, 'x', store.mouse.x * 0.6, 0.5, dt)
    damp(camera.position, 'y', store.mouse.y * 0.4, 0.5, dt)
    camera.lookAt(0, 0, -2)
  })
  return null
}

export default function Scene() {
  return (
    <div className="scene" aria-hidden>
      <Canvas
        dpr={[1, window.innerWidth < 800 ? 1.4 : 1.75]}
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 80 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#07060c']} />
        <fog attach="fog" args={['#07060c', 12, 34]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[6, 4, 4]} intensity={60} color="#d6ff3f" />
        <pointLight position={[-6, -3, 3]} intensity={50} color="#7a5cff" />
        <Suspense fallback={null}>
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={4} position={[0, 5, -5]} scale={[12, 3, 1]} color="#ffffff" />
            <Lightformer form="rect" intensity={3} position={[-6, 0, 2]} scale={[2, 8, 1]} color="#ff5a36" />
            <Lightformer form="rect" intensity={3} position={[6, 0, 2]} scale={[2, 8, 1]} color="#38d9ff" />
            <Lightformer form="ring" intensity={2} position={[0, -4, 3]} scale={5} color="#d6ff3f" />
          </Environment>
          <Rig />
          <Galaxy />
          <Core />
          <TechOrbit />
          <Terrain />
        </Suspense>
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.35} luminanceSmoothing={0.4} mipmapBlur />
          <Noise opacity={0.045} />
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
