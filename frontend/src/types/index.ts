
interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}
interface PaginationQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    [key: string]: any;
}
interface BaseSchema {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}
interface ApiErrorResponse {
    data: {
        success: boolean;
        error_code: number;
        message: string;
    };
}

interface AddressRequest {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: number;
}

interface AddressResponse extends AddressRequest, BaseSchema {};

interface DocumentRequest {
  name?: string;
  documentNumber?: string;
  url: string;
}

interface DocumentResponse extends BaseSchema, DocumentRequest {}
