export interface IScheduleBody {
    data: {
        startTime: string;
        endTime: string;
        days: string[];
    };
}

export interface IAssignScheduleBody {
    userId: string
    data: {
        schedules: string[];
    };
}

export interface IScheduleFilter {
    scheduleId: string;
}
