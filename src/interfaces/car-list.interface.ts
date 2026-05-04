export interface ICarListQuery {
    page: number;
    limit: number;
    brandId?: string;
    modelId?: string;
    region?: string;
    minPrice?: number;
    maxPrice?: number;
}
