package dto


type DepartmentPaginatedRespDto struct{
    Code Integer `json:"code,omitempty"`;
    Message String `json:"message,omitempty"`;
    ErrorCode Integer `json:"errorCode,omitempty"`;
    Data DepartmentPagingDto `json:"data,omitempty"`;
}

