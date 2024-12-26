export const formatDateTime = (date: string, year: Intl.DateTimeFormatOptions['year'], month: Intl.DateTimeFormatOptions['month'], day: Intl.DateTimeFormatOptions['day'], addTime: boolean = false) => {       //Formatea la fecha
    var dateToFormat = new Date(date);
    var options: Intl.DateTimeFormatOptions = { year, month, day };

    if (addTime) {
        options.hour12 = true
        options.hour = '2-digit'
        options.minute = '2-digit'
    }

    var dateFormated = dateToFormat.toLocaleDateString('es-AR', options);
    return dateFormated;
};