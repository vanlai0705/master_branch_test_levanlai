"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, ChevronDown, Video } from "lucide-react"
import type { CalendarEvent } from "./types"

interface CreateEventModalProps {
    isOpen: boolean
    onClose: () => void
    selectedDate: Date
    onCreateEvent: (event: Omit<CalendarEvent, "id">) => void
}

export function CreateEventModal({ isOpen, onClose, selectedDate, onCreateEvent }: CreateEventModalProps) {
    const [eventType, setEventType] = useState<"appointment" | "webinar">("appointment")
    const [title, setTitle] = useState("")
    const [startDate, setStartDate] = useState<Date>(selectedDate)
    const [startTime, setStartTime] = useState("09:00")
    const [endTime, setEndTime] = useState("10:00")
    const [description, setDescription] = useState("")
    const [hasVideoCall, setHasVideoCall] = useState(true)
    const [clientName, setClientName] = useState("")
    const [organizer, setOrganizer] = useState("")
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false)

    useEffect(() => {
        setStartDate(selectedDate)
    }, [selectedDate])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const baseEvent = {
            title,
            start: new Date(`${startDate.toISOString().split("T")[0]}T${startTime}:00`).toISOString(),
            end: new Date(`${startDate.toISOString().split("T")[0]}T${endTime}:00`).toISOString(),
            description,
        }

        if (eventType === "appointment") {
            onCreateEvent({
                ...baseEvent,
                type: "appointment",
                clientName,
                hasVideoCall,
                clientAvatar: "/placeholder.svg",
            })
        } else {
            onCreateEvent({
                ...baseEvent,
                type: "webinar",
                organizer,
                category: "Professional Development",
            })
        }

        onClose()
        resetForm()
    }

    const resetForm = () => {
        setTitle("")
        setStartTime("09:00")
        setEndTime("10:00")
        setDescription("")
        setHasVideoCall(true)
        setClientName("")
        setOrganizer("")
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Create New Event</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="event-type" className="block text-sm font-medium text-gray-700">
                            Event Type
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                            >
                                {eventType === "appointment" ? "Appointment" : "Webinar"}
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </button>
                            {isTypeDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
                                    <button
                                        type="button"
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            setEventType("appointment")
                                            setIsTypeDropdownOpen(false)
                                        }}
                                    >
                                        Appointment
                                    </button>
                                    <button
                                        type="button"
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            setEventType("webinar")
                                            setIsTypeDropdownOpen(false)
                                        }}
                                    >
                                        Webinar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                value={startDate.toISOString().split("T")[0]}
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Time</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <span>to</span>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {eventType === "appointment" ? (
                        <>
                            <div className="space-y-2">
                                <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                                    Client Name
                                </label>
                                <input
                                    id="client"
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Video className="h-5 w-5 text-gray-400" />
                                    <label htmlFor="video-call" className="text-sm font-medium text-gray-700">
                                        Video Call
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={hasVideoCall}
                                    onClick={() => setHasVideoCall(!hasVideoCall)}
                                    className={`${hasVideoCall ? "bg-blue-600" : "bg-gray-200"
                                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`${hasVideoCall ? "translate-x-5" : "translate-x-0"
                                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                    />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
                                    Organizer
                                </label>
                                <input
                                    id="organizer"
                                    type="text"
                                    value={organizer}
                                    onChange={(e) => setOrganizer(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

