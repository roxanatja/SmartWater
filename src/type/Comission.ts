export type ComissionData = {
    _id: string;
    code: string;
    user: {
        _id: string;
        role: "user" | "admin",
        email: string;
    };
    initialDate: string;
    endDate: string;
} & (
        | {
            type: 'general';
            percentage: number;
            totalBefore: number;
            totalAfter: number;
        }
        | {
            type: 'byuser';
            percentage: number;
            totalBefore: number;
            totalAfter: number;
        }
        | {
            type: 'specific';
            details: {
                product: string;
                percentageElem: number;
                totalBeforeElem: number;
                totalAfterElem: number;
            }[]
        }
    )

export type Comission<T extends ComissionData["type"]> = Extract<ComissionData, { type: T }>