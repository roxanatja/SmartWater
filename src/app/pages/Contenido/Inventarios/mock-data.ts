export interface IMockInventories {
    _id: string;
    initialDate: string;
    finalDate: string;
    name: string;
    status: boolean;
    system: number;
    difference: number;
}

export const fisicos_saldos: IMockInventories[] = [
    {
        _id: "2135498791",
        initialDate: "2023-09-14T23:43",
        finalDate: "2023-09-14T23:45",
        name: "Juan Perez",
        status: true,
        system: 250,
        difference: 0
    },
    {
        _id: "2135498792",
        initialDate: "2023-09-14T23:43",
        finalDate: "2023-09-14T23:45",
        name: "Juan Perez",
        status: false,
        system: 250,
        difference: 0
    }
]

export interface IMockInOuts {
    _id: string;
    initialDate: string,
    comment: string,
    type: 'production' | 'fixing',
    quantity: number
}

export const otros_invetarios: IMockInOuts[] = [
    {
        _id: "2135498793",
        initialDate: "2023-09-14T23:43",
        comment: "Recibido tarde",
        type: 'production',
        quantity: 20
    },
    {
        _id: "2135498794",
        initialDate: "2023-09-14T23:43",
        comment: "Por error",
        type: 'fixing',
        quantity: 5
    },
]