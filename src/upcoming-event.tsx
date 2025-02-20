import { Video } from "lucide-react"
import { CalendarEvent } from "./types"
import { TypeEvent } from "./constants"
import dayjs from "dayjs"
import { useMemo } from "react"


// 1) bg-[#5684AE]; Light Blue
// 2) #0F4C81; Dark Blue
// 3) #FFE4C8; Light Orange
// 4) #F9BE81; Dark Orange
// 5) #E4F6ED; Calendar Tile Color


interface Props {
  events: CalendarEvent[]
  selectedDate: Date
  openEventList: (events: CalendarEvent[]) => void
}

export const EventCard = ({ event }: { event: CalendarEvent }) => {
  return <>
    <div className="flex justify-between items-start">
      <div>
        <h3 className={`font-medium ${event.type === TypeEvent.APPOINTMENT ? "text-[#0F4C81]" : "text-white"}`}>{event.title}</h3>
        <p className={`mt-1 text-xs text-neutral-400`}>
          {dayjs.utc(event.startTime).format("hh:mm A")} — {dayjs.utc(event.endTime).format("hh:mm A")}
        </p>
      </div>
      {event.type === TypeEvent.APPOINTMENT && event.hasVideoCall && (
        <div className={`p-2 rounded-full bg-[#5684AE]`}>
          <Video className={`h-4 w-4 text-white`} />
        </div>
      )}
    </div>
    {
      event.type === TypeEvent.APPOINTMENT && (
        <div className="flex items-center gap-2 mt-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={"https://gravatar.com/avatar/003c34ad3c5d0d935b60f108934fafef?s=400&d=robohash&r=x"}
              alt="Client avatar"
              className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"

            />
            {/* <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <svg className="absolute w-6 h-6 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                      </div> */}
          </div>
          <button
            className={`text-xs ${event.type !== TypeEvent.APPOINTMENT ? "text-gray-100 hover:text-white" : "text-[#0F4C81] underline hover:text-blue-700"
              }`}
          >
            View Client Profile
          </button>
        </div>
      )
    }
  </>
}

const UpcomingEvent = ({ events, selectedDate, openEventList }: Props) => {
  const eventsToday = useMemo(() => {

    return events.filter(event => {
      const day1 = dayjs(event.startTime);
      const day2 = dayjs(selectedDate);
      return day1.isSame(day2, 'day');
    })
  }
    , [events, selectedDate])

  const dateTitle = useMemo(() => {
    const date = dayjs(selectedDate);
    return date.format('ddd, D MMM');
  }, [selectedDate])

  return (
    <div className="w-full max-w-md bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[#0F4C81] text-xl font-semibold">Upcoming Events</h1>
        <button className="px-4 py-1.5 bg-[#0F4C81] hover:bg-[#5684AE] text-white text-xs font-medium rounded-3xl" onClick={() => {
          openEventList(eventsToday)
        }}>
          View All
        </button>
      </div>

      <h2 className="text-[#6B7280] text-base font-[16px] mb-4">{dateTitle}</h2>

      <div className="space-y-3 ">
        {eventsToday.length !== 0 ? eventsToday.map((event, index) => {
          const colors = [
            "bg-[#FFE4C8] border-[#0F4C81]",
            "bg-[#5684AE] border-[#F9BE81]",
          ]

          const bg = event.type === TypeEvent.APPOINTMENT ? colors[0] : colors[1]

          return (
            index < 3 && < div key={event.id} className={`rounded-lg border-l-4 ${bg} p-4`
            }>
              <EventCard event={event} />
            </div>
          )
        }) : <h1 className="text-[#0F4C81] font-[24px] text-center">No events</h1>}
      </div>
    </div >
  )
}


export default UpcomingEvent