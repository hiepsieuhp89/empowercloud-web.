import React, { useRef } from 'react'

interface ColorSelectionParams {
  color: string
  setColor: (value: string) => void
}
const ColorSelection: React.FC<ColorSelectionParams> = ({
  color,
  setColor,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }
  return (
    <div
      className="mx-auto flex w-16 items-center justify-center border px-2"
      onClick={handleClick}
    >
      <input
        type="color"
        className="m-2 h-6 w-8"
        color={color}
        defaultValue={color}
        onChange={(e) => setColor(e.target.value)}
        ref={inputRef}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
    </div>
  )
}

export default ColorSelection
