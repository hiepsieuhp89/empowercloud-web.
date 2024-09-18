// components/BeforeAfterImage.tsx
import React, { useState } from 'react'

interface SimulationImageProps {
  originalImage: string | null
  filteredImage: string | null
}

const SimulationImage: React.FC<SimulationImageProps> = ({
  originalImage,
  filteredImage,
}) => {
  // State for the slider value (range: 0 to 100)
  const [sliderValue, setSliderValue] = useState(50)

  // Calculate the percentage to hide the filtered image
  const imageWidth = `${sliderValue}%`

  return (
    <div className="relative size-full">
      {/* Original Image */}
      <img
        src={originalImage || ''}
        alt="Original"
        className="absolute left-0 top-0 z-10 h-auto w-full"
        style={{ clipPath: `inset(0 0 0 ${imageWidth})` }}
      />

      {/* Filtered Image */}
      <img
        src={filteredImage || ''}
        alt="Filtered"
        className="absolute left-0 top-0 h-auto w-full"
      />

      {/* Slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onChange={(e) => setSliderValue(Number(e.target.value))}
        className="absolute bottom-0 left-0 z-20 w-full cursor-pointer"
      />
    </div>
  )
}

export default SimulationImage
