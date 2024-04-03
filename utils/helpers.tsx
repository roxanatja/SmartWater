export const formatDateTime = (date: string, year: string, month: string, day: string) => {       //Formatea la fecha
    var dateToFormat = new Date(date);
    var options: Intl.DateTimeFormatOptions = { year: year as Intl.DateTimeFormatOptions['year'], month: month as Intl.DateTimeFormatOptions['month'], day: day as Intl.DateTimeFormatOptions['day'] };
    var dateFormated = dateToFormat.toLocaleDateString('es-AR', options);
    return dateFormated;
};