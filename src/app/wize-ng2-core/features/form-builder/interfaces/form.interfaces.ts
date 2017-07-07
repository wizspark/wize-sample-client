export interface CustomFormData {
  attribute: Attribute[],
  settings?: Settings
}

export interface Attribute {
  key?:string,//added since used in control.group.service
  type: 'STRING' | 'TEXT' | 'INTEGER' | 'BIGINT' | 'FLOAT'| 'REAL' | 'DOUBLE'| 'DECIMAL'| 'BOOLEAN'| 'DATE'| 'DATEONLY'| 'JSON'| 'JSONB'| 'BLOB'| 'ENUM'| 'ARRAY'| 'WIZE_CODE'| 'WIZE_MONEY'| 'WIZE_TIME' | 'WIZE_URL'
  name: string
  title?: string
  placeholder?: string
  value?: any
  order?: number
  emitChanges?: boolean
  options?: Array<{value: string | number, name: string, disabled: boolean}>
  validation?: Array<Validation>
  required:boolean
}

export interface Settings {
  submitButton?: boolean
  submitButtonText?: string
  submitButtonExtraValidation?: boolean
  singleErrorMessage?: boolean
  showValidation?: boolean
  errorOnDirty?: boolean
}

export interface Classes {
  form?: string | Array<string>
  submit?: string | Array<string>
}

export interface Validation {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom' | 'match'
  value?: any
  message?: string
}
