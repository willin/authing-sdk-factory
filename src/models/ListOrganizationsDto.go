package dto


type ListOrganizationsDto struct{
    Page Integer `json:"page,omitempty"`;
    Limit Integer `json:"limit,omitempty"`;
}

