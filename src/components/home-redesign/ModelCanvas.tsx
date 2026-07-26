'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface ModelCanvasProps {
  stageValue: number // 0.0 (Hero) -> 1.0 (Philosophy) -> 2.0 (Creations) -> 3.0 (Disappear after 3rd section)
}

export default function ModelCanvas({ stageValue }: ModelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const modelGroupRef = useRef<THREE.Group | null>(null)
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Target positions/rotations for smooth interpolation (lerp)
  const targetState = useRef({
    x: 0,
    y: -0.25,
    z: 0,
    rotX: 0.12,
    rotY: 0,
    rotZ: 0,
    scale: 1,
    blur: 7, // Initial blur for hero text readability
    opacity: 0.75,
    keyLightX: 5, // Light position X
  })

  // Current interpolated state
  const currentState = useRef({
    x: 0,
    y: -0.25,
    z: 0,
    rotX: 0.12,
    rotY: 0,
    rotZ: 0,
    scale: 1,
    blur: 7,
    opacity: 0.75,
    keyLightX: 5,
  })

  // Calculate target state based on section stageValue (0.0 to 3.0)
  useEffect(() => {
    const v = Math.max(0, Math.min(3, stageValue))
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

    if (isMobile) {
      // MOBILE DEVICES: Keep model in the middle (x: 0) with consistent blur (7px) & soft opacity (0.75)
      if (v <= 2.0) {
        // Sections 1 to 3 (Hero through Signature Creations)
        targetState.current = {
          x: 0,
          y: -0.25,
          z: 0,
          rotX: 0.12,
          rotY: v * 1.8,
          rotZ: 0,
          scale: 1.0,
          blur: 7, // Consistent blur on mobile
          opacity: 0.75, // Consistent opacity on mobile
          keyLightX: 0,
        }
      } else {
        // Exiting immediately after 3rd section (Signature Creations)
        const t = v - 2.0 // 0 to 1
        targetState.current = {
          x: 0,
          y: -0.25 - t * 0.35,
          z: -t * 1.6,
          rotX: 0.12 + t * 0.25,
          rotY: 3.6 + t * 1.4,
          rotZ: 0,
          scale: Math.max(0.01, 1 - t * 0.4),
          blur: 7 + t * 17, // Blur from 7px up to 24px
          opacity: Math.max(0, 0.75 * (1 - t * 1.25)), // Fades to 0
          keyLightX: 0,
        }
      }
    } else {
      // DESKTOP DEVICES: Translate Right -> Left -> Disappear immediately after 3rd section
      if (v <= 1.0) {
        // Stage 0 -> Stage 1: Hero Center (0.0) to Right (1.0)
        const t = v // 0 to 1
        const targetX = 2.45

        const blurAmount = Math.max(0, 7 * (1 - Math.min(1, t / 0.35)))
        const opacityAmount = 0.75 + 0.25 * Math.min(1, t / 0.35)
        const lightX = 5 + (-8 - 5) * t

        targetState.current = {
          x: targetX * t,
          y: -0.25 + t * 0.05,
          z: 0,
          rotX: 0.12 + t * 0.06,
          rotY: t * 1.8, // Smooth showcase turn
          rotZ: -0.04 * t,
          scale: 1.0 + t * 0.15,
          blur: blurAmount,
          opacity: opacityAmount,
          keyLightX: lightX,
        }
      } else if (v <= 2.0) {
        // Stage 1 -> Stage 2: Right (1.0) to Left (2.0) (3rd Section: Signature Creations)
        const t = v - 1.0 // 0 to 1
        const startX = 2.45
        const endX = -2.45

        const lightX = -8 + (8 - -8) * t

        targetState.current = {
          x: startX + (endX - startX) * t,
          y: -0.2 - t * 0.05,
          z: 0,
          rotX: 0.18 - t * 0.06,
          rotY: 1.8 + t * 1.8,
          rotZ: -0.04 + t * 0.08,
          scale: 1.15 + t * 0.05,
          blur: 0,
          opacity: 1,
          keyLightX: lightX,
        }
      } else {
        // Stage 2 -> Stage 3: Disappear immediately after 3rd section (Signature Creations)
        const t = v - 2.0 // 0 to 1
        const startX = -2.45
        const lightX = 8 + (0 - 8) * t

        targetState.current = {
          x: startX * (1 - t), // Return toward center as it recedes
          y: -0.25 - t * 0.35,
          z: -t * 1.6,
          rotX: 0.12 + t * 0.25,
          rotY: 3.6 + t * 1.4,
          rotZ: 0.04 * (1 - t),
          scale: 1.2 * Math.max(0.01, 1 - t * 0.4),
          blur: t * 24, // Blur up to 24px
          opacity: Math.max(0, 1 - t * 1.25), // Fades out completely to 0
          keyLightX: lightX,
        }
      }
    }
  }, [stageValue])

  // Setup Three.js scene & load GLTF model
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 8)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.55
    rendererRef.current = renderer

    container.appendChild(renderer.domElement)

    // Lighting (Dynamic studio setup)
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 2.0)
    scene.add(ambientLight)

    // Key Light (Dynamic directional light shining from text direction)
    const keyLight = new THREE.DirectionalLight(0xffedd5, 3.5)
    keyLight.position.set(5, 10, 6)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 2048
    keyLight.shadow.mapSize.height = 2048
    scene.add(keyLight)
    keyLightRef.current = keyLight

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0xfce4ec, 2.0)
    fillLight.position.set(0, 5, 4)
    scene.add(fillLight)

    // Rim/Highlight Light
    const rimLight = new THREE.DirectionalLight(0xffffff, 3.0)
    rimLight.position.set(0, 8, -5)
    scene.add(rimLight)

    // Dessert Glaze Point Highlight
    const goldHighlight = new THREE.PointLight(0xffdfa9, 2.5, 15)
    goldHighlight.position.set(0, 3, 4)
    scene.add(goldHighlight)

    // Create group for GLTF model
    const modelGroup = new THREE.Group()
    scene.add(modelGroup)
    modelGroupRef.current = modelGroup

    // Load GLTF Model
    const loader = new GLTFLoader()
    loader.load(
      '/models/scene.gltf',
      (gltf) => {
        const model = gltf.scene

        // Center model geometry at origin
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        model.position.x = -center.x
        model.position.y = -center.y
        model.position.z = -center.z

        // Normalize initial size to viewport
        const maxDim = Math.max(size.x, size.y, size.z)
        const scaleFactor = 3.2 / (maxDim || 1)
        model.scale.set(scaleFactor, scaleFactor, scaleFactor)

        const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()

        // Enable shadows & texture quality
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            mesh.castShadow = true
            mesh.receiveShadow = true

            if (mesh.material) {
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
              materials.forEach((mat) => {
                if (mat instanceof THREE.MeshStandardMaterial) {
                  if (mat.map) mat.map.anisotropy = maxAnisotropy
                  if (mat.normalMap) mat.normalMap.anisotropy = maxAnisotropy
                  if (mat.roughnessMap) mat.roughnessMap.anisotropy = maxAnisotropy
                  mat.roughness = Math.max(0.12, mat.roughness ?? 0.35)
                  mat.metalness = Math.min(0.2, mat.metalness ?? 0.1)
                  mat.needsUpdate = true
                } else if (mat instanceof THREE.MeshPhongMaterial) {
                  if (mat.map) mat.map.anisotropy = maxAnisotropy
                  if (mat.normalMap) mat.normalMap.anisotropy = maxAnisotropy
                  mat.needsUpdate = true
                }
              })
            }
          }
        })

        modelGroup.add(model)
        setIsLoading(false)
      },
      (xhr) => {
        // Loading progress
      },
      (error) => {
        console.error('Error loading scene.gltf model:', error)
        setLoadError('Failed to load 3D model')
        setIsLoading(false)
      }
    )

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // Animation Render Loop with Lerp (smooth interpolation)
    let animationFrameId: number
    let lastTime = performance.now()
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate)

      const delta = (currentTime - lastTime) / 1000
      lastTime = currentTime
      const elapsedTime = (currentTime - startTime) / 1000
      const lerpSpeed = Math.min(1, delta * 8) // Responsive lerp speed

      // Lerp current values to target values
      const cur = currentState.current
      const tar = targetState.current

      cur.x += (tar.x - cur.x) * lerpSpeed
      cur.y += (tar.y - cur.y) * lerpSpeed
      cur.z += (tar.z - cur.z) * lerpSpeed
      cur.rotX += (tar.rotX - cur.rotX) * lerpSpeed
      cur.rotY += (tar.rotY - cur.rotY) * lerpSpeed
      cur.rotZ += (tar.rotZ - cur.rotZ) * lerpSpeed
      cur.scale += (tar.scale - cur.scale) * lerpSpeed
      cur.blur += (tar.blur - cur.blur) * lerpSpeed
      cur.opacity += (tar.opacity - cur.opacity) * lerpSpeed
      cur.keyLightX += (tar.keyLightX - cur.keyLightX) * lerpSpeed

      // Dynamic key light position from text direction
      if (keyLightRef.current) {
        keyLightRef.current.position.x = cur.keyLightX
      }

      // Apply to Three.js model group
      if (modelGroupRef.current) {
        modelGroupRef.current.position.set(cur.x, cur.y, cur.z)
        modelGroupRef.current.rotation.set(
          cur.rotX,
          cur.rotY + elapsedTime * 0.15, // Subtle continuous ambient rotation
          cur.rotZ
        )
        modelGroupRef.current.scale.set(cur.scale, cur.scale, cur.scale)
      }

      // Apply CSS filter blur, opacity, and visibility
      if (containerRef.current) {
        containerRef.current.style.filter = `blur(${cur.blur}px)`
        containerRef.current.style.opacity = `${cur.opacity}`
        containerRef.current.style.display = cur.opacity <= 0.005 ? 'none' : 'block'
      }

      renderer.render(scene, camera)
    }

    animate(performance.now())

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* 3D WebGL Canvas Wrapper */}
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 pointer-events-none transition-all duration-75 ease-out"
        style={{ willChange: 'transform, filter, opacity' }}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-cream/60 backdrop-blur-sm z-10 transition-opacity duration-300">
          <div className="w-12 h-12 border-4 border-brand-black/20 border-t-brand-black rounded-full animate-spin mb-4" />
          <p className="font-heading text-lg font-semibold text-brand-black">
            Crafting 3D Experience...
          </p>
        </div>
      )}

      {/* Load Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-cream/80 z-10 p-6 text-center">
          <p className="text-sm font-medium text-brand-muted">
            Could not render 3D model preview ({loadError}).
          </p>
        </div>
      )}
    </div>
  )
}
