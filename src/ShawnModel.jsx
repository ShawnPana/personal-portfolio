import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const MODEL_URL = '/models/shawnfullbodyglb.glb'

// Cheap capability probe: does this browser/device actually give us a WebGL context?
// Runs before we ever touch three.js, so unsupported browsers fall straight back to the avatar.
export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

/**
 * Renders the rotating 3D model. Signals failure through onFail() so the parent
 * can show the avatar instead — the model never leaves a blank box behind.
 */
export default function ShawnModel({ onFail, onReady }) {
  const mountRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Bail immediately if WebGL isn't available.
    if (!hasWebGL()) {
      onFail?.()
      return
    }

    let renderer
    let frameId
    let disposed = false

    try {
      const scene = new THREE.Scene()

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
      camera.position.set(0, 1, 3.5)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      mount.appendChild(renderer.domElement)

      scene.add(new THREE.AmbientLight(0xffffff, 1))
      const dir = new THREE.DirectionalLight(0xffffff, 0.8)
      dir.position.set(5, 10, 7.5)
      scene.add(dir)

      // Keep the renderer matched to its container at all times.
      const resize = () => {
        const w = mount.clientWidth || 1
        const h = mount.clientHeight || 1
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(mount)

      // If the GPU context is lost (tab backgrounded, driver reset, etc.), fall back gracefully.
      const onContextLost = (e) => {
        e.preventDefault()
        onFail?.()
      }
      renderer.domElement.addEventListener('webglcontextlost', onContextLost)

      // Drag-to-rotate with inertia + gentle auto-rotation.
      let isDragging = false
      let previousX = 0
      let velocity = 0
      const onDown = (e) => {
        isDragging = true
        previousX = e.clientX
      }
      const onMove = (e) => {
        if (!isDragging) return
        const delta = e.clientX - previousX
        previousX = e.clientX
        velocity = delta * 0.005
        scene.rotation.y += velocity
      }
      const onUp = () => {
        isDragging = false
      }
      mount.addEventListener('pointerdown', onDown)
      mount.addEventListener('pointermove', onMove)
      mount.addEventListener('pointerup', onUp)
      mount.addEventListener('pointerleave', onUp)

      new GLTFLoader().load(
        MODEL_URL,
        (gltf) => {
          if (disposed) return
          gltf.scene.position.set(0, -0.2, 0)
          gltf.scene.scale.set(1.2, 1.2, 1.2)
          scene.add(gltf.scene)
          setReady(true)
          onReady?.()
        },
        undefined,
        () => onFail?.(),
      )

      const animate = () => {
        frameId = requestAnimationFrame(animate)
        if (!isDragging) {
          scene.rotation.y += velocity + 0.01
          velocity *= 0.95
        }
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        disposed = true
        cancelAnimationFrame(frameId)
        ro.disconnect()
        renderer.domElement.removeEventListener('webglcontextlost', onContextLost)
        mount.removeEventListener('pointerdown', onDown)
        mount.removeEventListener('pointermove', onMove)
        mount.removeEventListener('pointerup', onUp)
        mount.removeEventListener('pointerleave', onUp)
        renderer.dispose()
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement)
        }
      }
    } catch {
      onFail?.()
    }
  }, [onFail, onReady])

  return (
    <div
      ref={mountRef}
      className="model-canvas"
      style={{ opacity: ready ? 1 : 0 }}
      aria-hidden="true"
    />
  )
}
