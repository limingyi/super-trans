export type FormSchema = {
  label: string;
  field: string;
  component: "Input" | "Select" | "DatePicker" | "InputNumber";
  componentProps: any;
  required: boolean;
};

export type TableColumn = {
  title: string;
  dataIndex: string;
  format?: string;
};

/** OpenAPI 参数定义 */
export type OpenAPIParameter = {
  name: string;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: OpenAPISchemaObject;
  example?: any;
};

/** 引用） */
type SchemaRef = {
  $ref: string;
};

export type SwaggerTypes =
  | "object"
  | "array"
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "null";
export type SwaggerFormat =
  | "int32"
  | "int64"
  | "float"
  | "double"
  | "date"
  | "date-time"
  | "email"
  | "uuid";

/** OpenAPI 模式定义（核心类型） */
export type OpenAPISchemaObject = SchemaRef & {
  type?: SwaggerTypes;
  format?: SwaggerFormat;
  required?: string[];
  properties?: {
    [key: string]: OpenAPISchemaObject;
  };
  items?: OpenAPISchemaObject;
  enum?: any[];
  default?: any;
  description?: string;
  example?: any;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
};

/** OpenAPI 响应内容 */
export type OpenAPIContent = {
  description: string;
  content?: {
    [mimeType: string]: {
      schema?: OpenAPISchemaObject;
      example?: any;
    };
  };
};

/** OpenAPI 操作定义（路径+方法对应的具体接口） */
export type OpenAPIOperation = {
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIContent & {
    required?: boolean;
  };
  responses: {
    [statusCode: string]: OpenAPIContent;
  };
  deprecated?: boolean;
};

export type OpenAPIComponent = {
  [key: string]: OpenAPISchemaObject;
};

/** 完整 OpenAPI 文档结构 */
export type OpenAPIDocument = {
  info: {
    title: string;
    description: string;
    version: string;
  };
  paths: {
    [path: string]: {
      [method: string]: OpenAPIOperation;
    };
  };
  components?: {
    schemas?: OpenAPIComponent;
  };
};

export type TansResult = {
  formSchema: FormSchema[];
  tableColumns: TableColumn[];
};
