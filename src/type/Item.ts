import { CategoryProduct } from "./Products/Category";
import { UnitMeasure } from "./Products/UnitMeasure";

export type Item = {
    _id: string;
    name: string;
    description: string;
    imageUrl?: string;
    category?: Partial<CategoryProduct>,
    unitMeasure?: Partial<UnitMeasure>
}