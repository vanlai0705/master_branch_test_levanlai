/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import Event from "./event"
import { CreateEventModal } from "./event-modal"
import useLocalStorage from "./hooks/useLocalStorage"
import type { CalendarEvent } from "./types"
import UpcomingEvent from "./upcoming-event"
import { EventListModal } from "./event-list-modal"

const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: 1,
    type: "appointment",
    title: "Hello, I'm LAi",
    startTime: "2025-02-20T09:00:00Z",
    endTime: "2025-02-20T10:00:00Z",

    clientName: "Alex Stan",
    hasVideoCall: true,
    clientAvatar: "/placeholder.svg",
  },
  {
    id: 2,
    type: "webinar",
    title: "This is my test",
    startTime: "2025-02-20T09:00:00Z",
    endTime: "2025-02-20T10:00:00Z",
    organizer: "Professional Development Institute",
    category: "Professional Development",
    description: "Learn essential strategies for managing workplace trauma",
  },
]

type ViewType = "week" | "month" | "year"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>("month")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [clickedDate, setClickedDate] = useState<Date>(new Date())
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date())
  const [events, setEvents] = useLocalStorage("events", SAMPLE_EVENTS);
  const [isViewEvent, setIsViewEvent] = useState<boolean>(true);
  const [event, setEvent] = useState<CalendarEvent>();
  const [eventsInModal, setEventsInModal] = useState<CalendarEvent[]>([])
  const [isEventsModal, setIsEventsModal] = useState<boolean>(false)

  const handleDateClick = (date: Date) => {
    setClickedDate(date)
    setIsViewEvent(false)
    setIsCreateModalOpen(true)
  }

  const handleViewEvent = (event: CalendarEvent) => {
    setIsViewEvent(true)
    setIsCreateModalOpen(true)
    setEvent(event)
  }

  const handleCreateEvent = (newEvent: CalendarEvent) => {

    const eventWithId = {
      ...newEvent,
      id: events.length + 1,
    }
    setEvents([...events, eventWithId])
  }

  const handleUpdateEvent = (event: CalendarEvent) => {
    const newEvent = events.map((item: CalendarEvent) => item.id === event.id ? event : item)
    setEvents(newEvent)
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
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center py-1">
            {day}
          </div>
        ))}
      </div>,
    )

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
      const isToday = day === dayjs().date()
      cells.push(
        <div key={day} className="text-center py-1">
          <button
            onClick={() => setSelectedDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth(), day))}
            className={`w-6 h-6 rounded-full text-sm
              ${isSelected
                ? "bg-[#5684AE] text-white"
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
            onClick={() => {
              const date = dayjs(day).startOf('day');
              handleDateClick(date.toDate())
            }
            }
          >
            <div className="flex flex-col items-center mb-2">
              <span className="text-sm text-gray-500">{day.toLocaleDateString("en-US", { weekday: "short" })}</span>
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center mt-1
                ${day.getDate() === selectedDate.getDate() ? "bg-[#5684AE] text-white" : ""}`}
              >
                {day.getDate()}
              </span>
            </div>
            <div className="space-y-1">
              {events
                .filter((event: CalendarEvent) => new Date(event.startTime).toDateString() === day.toDateString())
                .map((event: CalendarEvent) => (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewEvent(event)
                    }}
                    key={event.id}
                    className={`text-xs p-2 rounded ${event.type === "webinar" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div>
                      {dayjs.utc(event.startTime).format("hh:mm A")}
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
      const dayEvents = events.filter((event: CalendarEvent) => dayjs(event.startTime).isSame(dayjs(date), 'day'))

      days.push(
        <div
          key={`prev-${day}`}
          className="border border-gray-200 p-2 min-h-[120px] cursor-pointer"
          onClick={() => handleDateClick(date)}
        >
          <div className="flex items-center justify-between ">
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center
               text-gray-400`}
            >
              {day}
            </button>
          </div>
          <div className="mt-1 space-y-1 gap-2">
            <Event dayEvents={dayEvents} handleViewEvent={handleViewEvent} />
          </div>
        </div>,
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)

      const isSelected = day === selectedDate.getDate()


      const dayEvents = events.filter((event: CalendarEvent) => dayjs(event.startTime).isSame(dayjs(date), 'day'))

      const bgColor = day % 7 === 2 || day % 7 === 3 || day % 7 === 4 ? "bg-green-50/50" : "bg-white"

      days.push(
        <div
          key={day}
          className={`border border-gray-200 p-2 min-h-[120px] ${bgColor} ${isSelected ? "bg-blue-50" : ""
            } cursor-pointer`}
          onClick={() => handleDateClick(date)}
        >
          <div className="flex items-center justify-between ">
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center
                ${isSelected ? "bg-[#5684AE] text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {day}
            </button>
          </div>
          <div className="mt-1 space-y-1">
            <Event dayEvents={dayEvents} handleViewEvent={handleViewEvent} />
          </div>
        </div>,
      )
    }

    // Next month days
    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
      const dayEvents = events.filter((event: CalendarEvent) => dayjs(event.startTime).isSame(dayjs(date), 'day'))

      days.push(
        <div
          key={`next-${i}`}
          className="border border-gray-200 p-2 min-h-[120px] cursor-pointer"
          onClick={() => handleDateClick(date)}
        >
          <div className="flex items-center justify-between ">
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center
               text-gray-400`}
            >
              {i}
            </button>
          </div>
          <div className="mt-1 space-y-1">
            <Event dayEvents={dayEvents} handleViewEvent={handleViewEvent} />
          </div>
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
          // onClick={() => {
          //   setCurrentDate(month)
          //   setViewType("month")
          // }}
          >
            <h3 className="font-semibold mb-2">{month.toLocaleDateString("en-US", { month: "long" })}</h3>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1).map((day) => {
                const date = new Date(month.getFullYear(), month.getMonth(), day)
                const hasEvents = events.some((event: CalendarEvent) => new Date(event.startTime).toDateString() === date.toDateString())
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
      default:

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
      default:
        setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)))
        break
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const renderCalendarView = () => {
    switch (viewType) {
      case "week":
        return renderWeekView()
      case "year":
        return renderYearView()
      default:
        return renderMonthView()
    }
  }

  return (
    <div className="flex gap-6 p-4 max-w-[1400px] mx-auto bg-blue-50/30">
      <div className="w-80 space-y-2">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-3 flex-row items-center justify-center w-full">
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() =>
                  setMiniCalendarDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth() - 1))
                }
              >
                <ChevronLeft className="h-5 w-5 text-[#0F4C81]" />
              </button>
              <span className="text-[#0F4C81] font-semibold">
                {miniCalendarDate.toLocaleString("default", { month: "long", year: "numeric" })}
              </span>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() =>
                  setMiniCalendarDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth() + 1))
                }
              >
                <ChevronRight className="h-5 w-5 text-[#0F4C81]" />
              </button>
            </div>
          </div>
          {renderMiniCalendar()}
        </div>
        <UpcomingEvent events={events} selectedDate={selectedDate} openEventList={(events) => {
          setIsEventsModal(true)
          setEventsInModal(events)
        }} />
      </div>
      <div className="flex-1 bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-1.5 rounded-full text-sm bg-white text-[#5684AE]  border border-[#5684AE] hover:bg-gray-50"
                onClick={handleToday}
              >
                Today
              </button>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-full hover:bg-gray-100" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4 text-[#0F4C81]" />
                </button>
                <button className="p-1.5 rounded-full hover:bg-gray-100" onClick={handleNext}>
                  <ChevronRight className="h-4 w-4 text-[#0F4C81]" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-[#0F4C81]">
                {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {/* {(["week", "month", "year"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setViewType(view)}
                  className={`px-4 py-1.5 rounded-lg text-sm ${viewType === view ? "bg-[#5684AE] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))} */}
              <select value={viewType} onChange={(e) => setViewType(e.target.value as ViewType)} id="countries" className="bg-[#5684AE] text-white border border-[#5684AE] text-sm rounded-lg block w-200 p-2">
                {(["week", "month", "year"] as const).map((view) => (
                  <option key={view} value={view}>{view.charAt(0).toUpperCase() + view.slice(1)}</option>
                ))}

              </select>
            </div>
          </div>
        </div>

        <div className="p-4">{renderCalendarView()}</div>
      </div>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEvent(undefined)
        }}
        onCreateEvent={handleCreateEvent}
        onUpdateEvent={handleUpdateEvent}
        isView={isViewEvent}
        event={event}
        selectedDate={clickedDate}
      />

      <EventListModal
        isOpen={isEventsModal}
        events={eventsInModal}
        onClose={() => {
          setIsEventsModal(false)
        }}
      />
    </div>
  )
}

export default Calendar
