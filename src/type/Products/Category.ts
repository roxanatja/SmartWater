export type CategoryProduct = {
    _id: string;
    name: string;
    description: string;
    hiddenClient?: boolean;
    desactivated?: boolean | null;
}