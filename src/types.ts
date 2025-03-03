export interface BaseEvent {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface Appointment extends BaseEvent {
  type: "appointment";
  clientName: string;
  clientAvatar?: string;
  hasVideoCall: boolean;
}

export interface WebinarEvent extends BaseEvent {
  type: "webinar";
  organizer: string;
  category: string;
  thumbnail?: string;
}

export type CalendarEvent = Appointment | WebinarEvent;
