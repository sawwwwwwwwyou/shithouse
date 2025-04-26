"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastPositionRef = useRef({ x: 0, y: 0 })

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    // Set canvas size to match window
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Set drawing style
    context.strokeStyle = "rgba(231, 94, 168, 0.7)" // Pink color with 70% opacity
    context.lineWidth = 2 // Line width similar to the house drawing
    context.lineCap = "round"
    context.lineJoin = "round"

    const handleResize = () => {
      // Save current drawing
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      // Resize canvas
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Restore drawing style
      context.strokeStyle = "rgba(231, 94, 168, 0.7)"
      context.lineWidth = 2
      context.lineCap = "round"
      context.lineJoin = "round"

      // Restore drawing
      context.putImageData(imageData, 0, 0)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Drawing functions
  const startDrawing = (e: React.MouseEvent) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    setIsDrawing(true)

    const rect = canvas.getBoundingClientRect()
    lastPositionRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const rect = canvas.getBoundingClientRect()
    const currentPosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    context.beginPath()
    context.moveTo(lastPositionRef.current.x, lastPositionRef.current.y)
    context.lineTo(currentPosition.x, currentPosition.y)
    context.stroke()

    lastPositionRef.current = currentPosition
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Drawing canvas - below the house image */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      {/* Content container for house and text images */}
      <div className="flex flex-col items-center z-10 relative pointer-events-none">
        {/* House image */}
        <div className="w-full max-w-md px-4 mb-4">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ouse-W1GpsCzjyfBF6kprg3AM9Z3uucJH1l.png"
            alt="Simple house illustration"
            width={500}
            height={500}
            className="mx-auto"
            priority
          />
        </div>

        {/* Text image - now 25% bigger */}
        <div className="w-full max-w-md px-4">
          <Image src="/text-image.png" alt="Text illustration" width={500} height={125} className="mx-auto" />
        </div>
      </div>

      {/* UI Controls - highest z-index */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between z-20 pointer-events-none">
        {/* Clear button with delete icon */}
        <button
          onClick={clearCanvas}
          className="p-3 bg-white border border-gray-200 rounded-full shadow-sm pointer-events-auto hover:bg-gray-50 transition-all"
          aria-label="Clear all drawings"
        >
          <Image src="/delete-icon.svg" alt="Clear canvas" width={24} height={24} />
        </button>

        {/* X Link with new logo */}
        <Link
          href="https://x.com"
          className="p-3 bg-white border border-gray-200 rounded-full shadow-sm pointer-events-auto hover:bg-gray-50 transition-all"
          aria-label="Visit our X profile"
        >
          <Image src="/x-logo.svg" alt="X" width={20} height={20} />
        </Link>
      </div>
    </main>
  )
}
