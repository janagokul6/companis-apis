export interface Company {
  id: string;
  companyName: string;
  website: string | null;
  industry: string;
  employeeCount: number;
  createdAt: string;
}

export interface CreateCompanyInput {
  companyName: string;
  website?: string;
  industry: string;
  employeeCount: number;
}
