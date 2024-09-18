import React, { useCallback } from 'react'

interface FilledButtonProps {
  text: string
  handleClick?: () => void
  className?: string
  buttonClass?: string
}

const FilledButton: React.FC<FilledButtonProps> = ({
  text,
  handleClick,
  className,
  buttonClass,
}) => {
  const onClick = useCallback(() => {
    if (handleClick) {
      handleClick()
    }
  }, [handleClick])

  return (
    <div className={className}>
      <button onClick={onClick} className={buttonClass}>
        {text}
      </button>
    </div>
  )
}

export default FilledButton
