export interface IMockComissions {
    _id: string;
    initialDate: string;
    finalDate: string;
    name: string;
    sales: number;
    percent: number;
    commission: number;
}

export const fisicos_saldos: IMockComissions[] = [
    {
        _id: "2135498791",
        initialDate: "2023-09-14T23:43",
        finalDate: "2023-09-14T23:45",
        name: "Juan Perez",
        sales: 400,
        percent: 10,
        commission: 500
    },
    {
        _id: "2135498792",
        initialDate: "2023-09-14T23:43",
        finalDate: "2023-09-14T23:45",
        name: "Juan Perez",
        sales: 500,
        percent: 10,
        commission: 500
    }
]