/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import type { CalendarEvent } from "./types"


type Props = {
  dayEvents: CalendarEvent[],
  handleViewEvent: (event: CalendarEvent) => void
}
const Event = ({ dayEvents, handleViewEvent }: Props) => {
  const [clickTimeout, setClickTimeout] = useState<number | null>(null);

  const handleClick = (event: CalendarEvent) => {
    if (clickTimeout) return;

    const timeout = setTimeout(() => {
      handleViewEvent(event)
      setClickTimeout(null);
    }, 250);

    setClickTimeout(timeout);
  };

  const handleDoubleClick = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }
    window.open("https://www.masterbranch.co/", "_blank");

  };

  return (
    <>
      {dayEvents.map((event: CalendarEvent, idx: number) => (
        idx < 2 && <button
          onClick={(e) => {
            e.stopPropagation()
            handleClick(event)
          }}
          onDoubleClick={(e) => {
            e.stopPropagation()
            handleDoubleClick()
          }}


          key={idx}
          className={`text-xs p-1 mr-2 rounded-sm ${event.type === "webinar"
            ? "bg-orange-200/80 text-orange-800 border-l-2 border-orange-500"
            : "bg-blue-200/80 text-blue-800 border-l-2 border-blue-500"
            }`}
        >
          {event.title}<button
            onClick={(e) => {
              e.stopPropagation()
              handleViewEvent(event)
            }}>
          </button>
          {/* {event.type === "appointment" && event.hasVideoCall && <Video className="inline-block ml-1 h-3 w-3" />} */}
        </button>
      ))}
      {dayEvents.length > 2 && <button className="text-xs p-1 rounded-sm bg-gray-200/80 text-gray-800">view more</button>}
    </>
  )
}

export default Event
