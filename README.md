# master-branch

# 1. Propose a data structure to use for this screen. How the backend should return data

# --Ans: Here's a proposed data structure for the backend API response:

# export interface BaseEvent {

# id: number;

# title: string;

# startTime: string;

# endTime: string;

# description?: string;

}

# export interface Appointment extends BaseEvent {

# type: "appointment";

# clientName: string;

# clientAvatar?: string;

# hasVideoCall: boolean;

}

# export interface WebinarEvent extends BaseEvent {

# type: "webinar";

# organizer: string;

# category: string;

# thumbnail?: string;

}

# export type CalendarEvent = Appointment | WebinarEvent;

# **Events Array**: The `events` array contains all the events for the requested time range. Each event includes all the necessary information to display it in the calendar, regardless of its type.

# 4: Let us know what you have learned from this project

# Ans: - UI Components and Styling

# - Date Handling,User Experience,State Management
