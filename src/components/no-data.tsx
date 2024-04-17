import React, { ReactNode } from "react"
import { HiXMark } from "react-icons/hi2"

export const NoData: React.FC<{ text: string; icon: ReactNode }> = ({
  text,
  icon,
}) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
        <div className="relative">
          {icon}
          <div className="absolute -right-[8px] -top-[5px] flex h-4 w-4 items-center justify-center rounded-full bg-gray-400 text-white">
            <HiXMark size={10} />
          </div>
        </div>
        <span className="text-sm font-medium">{text}</span>
      </div>
    </div>
  )
}
