/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"


import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { X } from "lucide-react"
import { TypeEvent } from "./constants"
import type { CalendarEvent } from "./types"
import { EventCard } from "./upcoming-event"
dayjs.extend(utc);

interface CreateEventModalProps {
    events: CalendarEvent[]
    onClose: () => void
    isOpen: boolean
}



export function EventListModal({ isOpen, events, onClose }: CreateEventModalProps) {


    if (!isOpen) return null

    return (
        <div className="fixed inset-0 w bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-2 h-full">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Events</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="space-y-3 overflow-y-auto h-[calc(100%-5rem)]">

                    {events.map((event) => {
                        const colors = [
                            "bg-[#FFE4C8] border-[#0F4C81]",
                            "bg-[#5684AE] border-[#F9BE81]",
                        ]

                        const bg = event.type === TypeEvent.APPOINTMENT ? colors[0] : colors[1]

                        return (
                            < div key={event.id} className={`rounded-lg border-l-4 ${bg} p-4`
                            }>
                                <EventCard event={event} />
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </div>
    )
}

