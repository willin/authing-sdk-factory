import { String } from 'lodash';
import type { Enum } from './Enum';
import type { Schema } from './Schema';

export interface Model extends Schema {
    name: string;
    // for java
    prop?: string;
    prop_underscore?: string;
    name_underscore?: string;
    name_java_get?: string;
    name_java_set?: string;
    export: 'reference' | 'generic' | 'enum' | 'array' | 'dictionary' | 'interface' | 'one-of' | 'any-of' | 'all-of';
    type: string;
    type_python?: string;
    type_php?: string;
    base: string;
    base_java?: string;
    base_go?: string;
    template: string | null;
    link: Model | null;
    description: string | null;
    default?: string;
    imports: string[];
    enum: Enum[];
    enums: Model[];
    properties: Model[];
    isEnum?: boolean;
    base_csharp?: string;
}
