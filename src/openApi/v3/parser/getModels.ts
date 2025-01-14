import type { Model } from '../../../client/interfaces/Model';
import { camelizeAndFirstCharUpperCase } from '../../../utils/camelize';
import type { OpenApi } from '../interfaces/OpenApi';
import { getModel } from './getModel';
import { getType } from './getType';
import { OperationParameter } from '../../../client/interfaces/OperationParameter';
import { getPattern } from '../../../utils/getPattern';
import { Operation } from '../../../client/interfaces/Operation';

const javaTypeMap: any = {
    string: 'String',
    number: 'Integer',
    boolean: 'Boolean',
    any: 'Object',
};

const goTypeMap: any = {
    string: 'string',
    number: 'int',
    boolean: 'bool',
    any: 'interface{}',
};

const goTypeListMap: any = {
    string: '[]string',
    number: '[]int',
    boolean: '[]bool',
    any: '[]interface{}',
};

const csharpTypeMap: any = {
    string: 'string',
    number: 'long',
    boolean: 'bool',
    any: 'object',
};

const getGoType = (base: string, exportType: string) => {
    if (exportType === 'array') {
        return goTypeListMap[base];
    } else {
        return goTypeMap[base];
    }
};

export const getModels = (openApi: OpenApi): Model[] => {
    const models: Model[] = [];
    if (openApi.components) {
        for (const definitionName in openApi.components.schemas) {
            if (openApi.components.schemas.hasOwnProperty(definitionName)) {
                const definition = openApi.components.schemas[definitionName];
                const definitionType = getType(definitionName);
                const model = getModel(openApi, definition, true, definitionType.base);

                if (model.properties.length) {
                    model.properties.forEach(p => {
                        const { name, base, export: exportType } = p;
                        p.name_java_get = `get${camelizeAndFirstCharUpperCase(name)}`;
                        p.name_java_set = `set${camelizeAndFirstCharUpperCase(name)}`;
                        if (javaTypeMap[base]) {
                            p.base_java = javaTypeMap[base];
                        } else {
                            p.base_java = base;
                        }
                        if (getGoType(base, exportType)) {
                            p.base_go = getGoType(base, exportType)
                        } else {
                            p.base_go = base;
                        }
                        if (csharpTypeMap[base]) {
                            p.base_csharp = csharpTypeMap[base];
                        } else {
                            p.base_csharp = base;
                        }
                        if (p.enum?.length > 0) {
                            p.isEnum = true;
                        }
                    });
                }

                models.push(model);
            }
        }
    }
    return models;
};

// for java
export const getModelByParameter = (parameter: OperationParameter): Model => {
    const model: Model = {
        name: parameter.name,
        prop: parameter.prop,
        export: 'interface',
        type: parameter.type,
        base: parameter.base,
        template: null,
        link: null,
        description: parameter.description || null,
        isDefinition: false,
        isReadOnly: false,
        isNullable: true,
        isRequired: false,
        imports: [],
        enum: [],
        enums: [],
        properties: [],
        name_java_set: `set${camelizeAndFirstCharUpperCase(parameter.name)}`,
        name_java_get: `get${camelizeAndFirstCharUpperCase(parameter.name)}`,
        base_java: '',
        base_go: '',
        base_csharp: '',
    };

    if (javaTypeMap[parameter.base]) {
        model.base_java = javaTypeMap[parameter.base];
    } else {
        model.base_java = parameter.base;
    }

    if (getGoType(parameter.base, parameter.export)) {
        model.base_go = getGoType(parameter.base, parameter.export);
    } else {
        model.base_go = parameter.base;
    }

    if (csharpTypeMap[parameter.base]) {
        model.base_csharp = csharpTypeMap[parameter.base];
    } else {
        model.base_csharp = parameter.base;
    }

    return model;
};

// for java
export const getModelByOperation = (op: Operation): Model => {
    var path = op.path;
    path = path.replace(/\/api\/v3\//g, '');
    var name = `${camelizeAndFirstCharUpperCase(path)}Dto`;
    name = name.replace(/-/g, '');

    const model: Model = {
        name: name,
        export: 'interface',
        type: 'any',
        base: 'any',
        template: null,
        link: null,
        description: op.description || null,
        isDefinition: false,
        isReadOnly: false,
        isNullable: true,
        isRequired: false,
        imports: [],
        enum: [],
        enums: [],
        properties: [],
        name_java_set: `set${camelizeAndFirstCharUpperCase(op.name)}`,
        name_java_get: `get${camelizeAndFirstCharUpperCase(op.name)}`,
        base_java: '',
        base_csharp: '',
    };

    model.base_java = name;
    model.base_go = name;
    model.base = name;
    model.base_csharp = name;

    return model;
};
