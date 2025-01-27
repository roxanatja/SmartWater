import moment from "moment";

export const formatDateTime = (date: string, year: Intl.DateTimeFormatOptions['year'], month: Intl.DateTimeFormatOptions['month'], day: Intl.DateTimeFormatOptions['day'], addTime: boolean = false, keepLocal: boolean = false) => {       //Formatea la fecha
    let dateToFormat: Date
    if (keepLocal) {
        dateToFormat = moment.utc(date).local(true).toDate();
    } else {
        dateToFormat = new Date(date);
    }

    const options: Intl.DateTimeFormatOptions = { year, month, day };

    if (addTime) {
        options.hour12 = true
        options.hour = '2-digit'
        options.minute = '2-digit'
    }

    const dateFormated = dateToFormat.toLocaleDateString('es-AR', options);
    return dateFormated;
};

export const convertTo12HourIntl = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);

    const date = new Date();
    date.setHours(hours, minutes);

    const formatter = new Intl.DateTimeFormat('es-AR', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    return formatter.format(date);
}

export function popUpWasBlocked(popUp: Window | null) {
    return !popUp || popUp.closed || typeof popUp.closed === 'undefined'
}