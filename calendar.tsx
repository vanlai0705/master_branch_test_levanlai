import { useState } from "react"
import { ChevronLeft, ChevronRight, Video, Plus } from "lucide-react"
import type { CalendarEvent } from "./types"
import { CreateEventModal } from "./event-modal"

const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    type: "appointment",
    title: "First Session with L",
    start: "2021-04-05T09:00:00Z",
    end: "2021-04-05T09:30:00Z",
    clientName: "Alex Stan",
    hasVideoCall: true,
    clientAvatar: "/placeholder.svg",
  },
  {
    id: "2",
    type: "webinar",
    title: "Webinar: How to cope with trauma in professional life",
    start: "2021-04-12T09:00:00Z",
    end: "2021-04-12T10:30:00Z",
    organizer: "Professional Development Institute",
    category: "Professional Development",
    description: "Learn essential strategies for managing workplace trauma",
  },
  {
    id: "3",
    type: "appointment",
    title: "Chemistry Session",
    start: "2021-04-17T11:00:00Z",
    end: "2021-04-17T12:00:00Z",
    clientName: "Maria Chen",
    hasVideoCall: true,
    clientAvatar: "/placeholder.svg",
  },
]

type ViewType = "week" | "month" | "year"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date()) // April 4, 2021
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>(SAMPLE_EVENTS)
  const [viewType, setViewType] = useState<ViewType>("month")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [clickedDate, setClickedDate] = useState<Date>(new Date())
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date()) // April 2021

  const handleDateClick = (date: Date) => {
    setClickedDate(date)
    setIsCreateModalOpen(true)
  }

  const handleCreateEvent = (newEvent: Omit<CalendarEvent, "id">) => {
    const eventWithId = {
      ...newEvent,
      id: Math.random().toString(36).substr(2, 9),
    }
    setEvents([...events, eventWithId])
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const renderMiniCalendar = () => {
    const days = []
    const daysInMonth = getDaysInMonth(miniCalendarDate)
    const firstDay = getFirstDayOfMonth(miniCalendarDate)

    // Weekday headers
    days.push(
      <div key="weekdays" className="grid grid-cols-7 text-xs text-gray-500 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div key={day} className="text-center py-1">
            {day}
          </div>
        ))}
      </div>,
    )

    // Calendar grid
    const cells = []

    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="text-center py-1"></div>)
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        day === selectedDate.getDate() &&
        miniCalendarDate.getMonth() === selectedDate.getMonth() &&
        miniCalendarDate.getFullYear() === selectedDate.getFullYear()
      const isToday = day === 4 // Assuming April 4th is "today"
      cells.push(
        <div key={day} className="text-center py-1">
          <button
            onClick={() => setSelectedDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth(), day))}
            className={`w-6 h-6 rounded-full text-sm
              ${isSelected
                ? "bg-blue-600 text-white"
                : isToday
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {day}
          </button>
        </div>,
      )
    }

    // Next month days
    const remainingCells = 42 - (firstDay + daysInMonth)
    for (let i = 1; i <= remainingCells; i++) {
      cells.push(<div key={`next-${i}`} className="text-center py-1"></div>)
    }

    days.push(
      <div key="days" className="grid grid-cols-7 gap-1">
        {cells}
      </div>,
    )

    return days
  }

  const renderWeekView = () => {
    const weekStart = new Date(currentDate)
    weekStart.setDate(currentDate.getDate() - currentDate.getDay())
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      return day
    })

    return (
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="border rounded-lg p-4 min-h-[200px] cursor-pointer"
            onClick={() => handleDateClick(day)}
          >
            <div className="flex flex-col items-center mb-2">
              <span className="text-sm text-gray-500">{day.toLocaleDateString("en-US", { weekday: "short" })}</span>
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center mt-1
                ${day.getDate() === selectedDate.getDate() ? "bg-blue-600 text-white" : ""}`}
              >
                {day.getDate()}
              </span>
            </div>
            <div className="space-y-1">
              {events
                .filter((event) => new Date(event.start).toDateString() === day.toDateString())
                .map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-2 rounded ${event.type === "webinar" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div>
                      {new Date(event.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderMonthView = () => {
    const days = []
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)

    // Previous month days
    const prevMonthDays = firstDay
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    const prevMonthLastDay = getDaysInMonth(prevMonth)

    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day)
      days.push(
        <div
          key={`prev-${day}`}
          className="border border-gray-200 p-2 min-h-[120px] cursor-pointer"
          onClick={() => handleDateClick(date)}
        >
          <span className="text-gray-400">{day}</span>
        </div>,
      )
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const isSelected = day === selectedDate.getDate()
      const dayEvents = events.filter((event) => new Date(event.start).getDate() === day)

      const bgColor = day % 7 === 2 || day % 7 === 3 || day % 7 === 4 ? "bg-green-50/50" : "bg-white"

      days.push(
        <div
          key={day}
          className={`border border-gray-200 p-2 min-h-[120px] ${bgColor} ${isSelected ? "bg-blue-50" : ""
            } cursor-pointer`}
          onClick={() => handleDateClick(date)}
        >
          <div className="flex items-center justify-between">
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center
                ${isSelected ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {day}
            </button>
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.map((event, idx) => (
              <div
                key={idx}
                className={`text-xs p-1 rounded-sm ${event.type === "webinar"
                  ? "bg-orange-200/80 text-orange-800 border-l-2 border-orange-500"
                  : "bg-blue-200/80 text-blue-800 border-l-2 border-blue-500"
                  }`}
                onClick={(e) => e.stopPropagation()}
              >
                {event.title}
                {event.type === "appointment" && event.hasVideoCall && <Video className="inline-block ml-1 h-3 w-3" />}
              </div>
            ))}
          </div>
        </div>,
      )
    }

    // Next month days
    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
      days.push(
        <div
          key={`next-${i}`}
          className="border border-gray-200 p-2 min-h-[120px] cursor-pointer"
          onClick={() => handleDateClick(date)}
        >
          <span className="text-gray-400">{i}</span>
        </div>,
      )
    }

    return (
      <div className="grid grid-cols-7">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-sm font-medium text-gray-500 text-center border border-gray-200">
            {day}
          </div>
        ))}
        {days}
      </div>
    )
  }

  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(currentDate.getFullYear(), i, 1))

    return (
      <div className="grid grid-cols-4 gap-4">
        {months.map((month) => (
          <div
            key={month.toISOString()}
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => {
              setCurrentDate(month)
              setViewType("month")
            }}
          >
            <h3 className="font-semibold mb-2">{month.toLocaleDateString("en-US", { month: "long" })}</h3>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1).map((day) => {
                const date = new Date(month.getFullYear(), month.getMonth(), day)
                const hasEvents = events.some((event) => new Date(event.start).toDateString() === date.toDateString())
                return (
                  <div key={day} className={`text-center text-xs p-1 ${hasEvents ? "bg-blue-100 rounded" : ""}`}>
                    {day}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const handlePrevious = () => {
    switch (viewType) {
      case "week":
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))
        break
      case "month":
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
        break
      case "year":
        setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)))
        break
    }
  }

  const handleNext = () => {
    switch (viewType) {
      case "week":
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))
        break
      case "month":
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
        break
      case "year":
        setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)))
        break
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date()) // Set to April 4, 2021 as "today"
    setSelectedDate(new Date())
  }

  const renderCalendarView = () => {
    switch (viewType) {
      case "week":
        return renderWeekView()
      // case "month":
      //   return renderMonthView()
      case "year":
        return renderYearView()
      default:
        return renderMonthView()
    }
  }

  return (
    <div className="flex gap-6 p-4 max-w-[1400px] mx-auto bg-blue-50/30">
      {/* Left sidebar */}
      <div className="w-80 space-y-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-blue-900 font-semibold">
              {miniCalendarDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <div className="flex gap-1">
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() =>
                  setMiniCalendarDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth() - 1))
                }
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() =>
                  setMiniCalendarDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth() + 1))
                }
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          {renderMiniCalendar()}
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Today, {currentDate.getDate()} {currentDate.toLocaleString("default", { month: "short" })}
            </h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {events
              .filter((event) => new Date(event.start) >= new Date())
              .slice(0, 3)
              .map((event) => (
                <div
                  key={event.id}
                  className={`rounded-lg p-4 ${event.type === "appointment"
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : "bg-orange-50 border-l-4 border-orange-400"
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(event.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        GMT+8
                      </p>
                    </div>
                    {event.type === "appointment" && event.hasVideoCall && (
                      <button className="p-1 hover:bg-blue-100 rounded">
                        <Video className="h-4 w-4 text-blue-600" />
                      </button>
                    )}
                  </div>
                  {event.type === "appointment" && (
                    <div className="flex items-center mt-3 gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <img
                          src={event.clientAvatar || "/placeholder.svg"}
                          alt={event.clientName}
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <button className="text-sm text-blue-600 hover:underline">View Client Profile</button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Main calendar */}
      <div className="flex-1 bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-1.5 rounded-full text-sm bg-white border border-gray-200 hover:bg-gray-50"
                onClick={handleToday}
              >
                Today
              </button>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-full hover:bg-gray-100" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="p-1.5 rounded-full hover:bg-gray-100" onClick={handleNext}>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-blue-900">
                {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {(["week", "month", "year"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setViewType(view)}
                  className={`px-4 py-1.5 rounded-lg text-sm ${viewType === view ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4">{renderCalendarView()}</div>
      </div>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        selectedDate={clickedDate}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  )
}

export default Calendar
