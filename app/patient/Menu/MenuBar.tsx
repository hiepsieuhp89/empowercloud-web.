'use client'

interface MenuBarComponentProps {
  addSchedule: (value: string) => void
}

const MenuBarComponent: React.FC<MenuBarComponentProps> = ({ addSchedule }) => {
  const onClickFunction = () => {
    addSchedule('')
  }
  return (
    <div className="flex bg-primary-client py-4 text-black lg:px-16">
      <div className="mx-auto"></div>
      <div className="flex w-32 items-center">
        <button
          className="font-base rounded-2xl border-2 border-main-200 bg-gray-100 px-4 hover:bg-main-500 hover:text-white"
          onClick={onClickFunction}
        >
          新規予約
        </button>
      </div>
    </div>
  )
}

export { MenuBarComponent }
