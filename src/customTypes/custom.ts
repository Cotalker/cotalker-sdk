export type ObjectId = string

export type GenericQueryParams = {
  page?: number;
  limit?: number;
  count?: boolean;
  isActive?: 'true' | 'false' | 'all';
}

export type DateQueryParams = {
  modified?: string; 
  modified_gt?: string;
  modified_gte?: string;
  modified_lt?: string;
  modified_lte?: string;
  created?: string;
  created_gt?: string;
  creatd_gte?: string;
  created_lt?: string;
  created_lte?: string;
}
