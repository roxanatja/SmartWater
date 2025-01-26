import { Schedule } from "./Schedule"

export type Notification = {
    _id: string,
    actor: string,
    user: string,
    title: string,
    message: string,
    severity: "WARNING" | "ERROR",
    priority: string,
    type: string,
    read: boolean,
    data: ClaimData | DisconnectedData,
    created: string,
    updated: string
}

export interface ClaimData {
    loanId: string,
    status: string,
    reason: string,
    organization: string,
    timestamp: string
}

export interface DisconnectedData {
    isWithinSchedule: boolean,
    schedules: Schedule[],
    disconnectInfo: {
        day: string,
        time: string,
        timestamp: string
    }
}