
export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}
export interface PaginationQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    [key: string]: any;
}
export interface BaseSchema {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}
export interface ApiErrorResponse {
    data: {
        success: boolean;
        error_code: number;
        message: string;
    };
}

export interface AddressRequest {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: number;
}

export interface AddressResponse extends AddressRequest, BaseSchema {};

export interface DocumentRequest {
  name?: string;
  documentNumber?: string;
  url: string;
}

export interface DocumentResponse extends BaseSchema, DocumentRequest {}
