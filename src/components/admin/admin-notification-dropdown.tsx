"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { BsBell } from "react-icons/bs"
import { HiXMark } from "react-icons/hi2"

import { getAllOrders } from "@/app/actions/order"

import { useViewport } from "../hooks/useViewport"
import { Dropdown, DropdownContent, DropdownTrigger } from "../ui/dropdown"
import { NotificationCard } from "./notification-card"

export function AdminNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const viewport = useViewport()
  const dateNow = new Date()

  const newOrders = useQuery(
    ["newOrders"],
    async () => await getAllOrders(dateNow)
  )

  return (
    <Dropdown open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DropdownTrigger asChild>
        <button className="relative">
          <BsBell className="h-4 w-4 lg:h-5 lg:w-5" />
          {newOrders.data?.length && (
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-600" />
          )}
        </button>
      </DropdownTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownContent asChild align="center" sideOffset={20}>
            <motion.div
              initial={{ height: "50px", opacity: 0 }}
              animate={{
                height: viewport.width > 500 ? "300px" : "100vh",
                opacity: 1,
              }}
              exit={{ height: "50px", opacity: 0 }}
              className="z-40 h-screen w-screen overflow-y-scroll rounded-lg border-t bg-white dark:border-neutral-700  dark:bg-neutral-900 lg:h-80 lg:w-72 lg:border"
            >
              <div className="sticky top-0 flex items-center border-b bg-white px-4 py-2 dark:border-b-neutral-600 dark:bg-neutral-900 lg:justify-normal">
                <div className="flex w-full items-center gap-4 lg:justify-between">
                  <h5 className="font-medium">Notification</h5>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-sm font-semibold text-white">
                    {newOrders.data?.length}
                  </span>
                </div>
                <button onClick={() => setIsOpen(false)} className="lg:hidden">
                  <HiXMark size={16} />
                </button>
              </div>
              <div className="flex w-full flex-col">
                {newOrders.data?.map((order) => (
                  <NotificationCard
                    key={order.id}
                    id={order.id}
                    invoice={order.invoice}
                    created_at={order.created_at}
                    productCount={order._count.products}
                  />
                ))}
              </div>
            </motion.div>
          </DropdownContent>
        )}
      </AnimatePresence>
    </Dropdown>
  )
}
