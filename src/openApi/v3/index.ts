import _ from 'lodash';

import type { Client } from '../../client/interfaces/Client';
import { camelToSnakeCase } from '../../utils';
import type { OpenApi } from './interfaces/OpenApi';
import { getModels } from './parser/getModels';
import { getServer } from './parser/getServer';
import { getServices } from './parser/getServices';
import { getServiceVersion } from './parser/getServiceVersion';

const pythonTypeMap: Record<string, any> = {
    string: 'str',
    number: 'int',
    boolean: 'bool',
    object: 'Object',
    array: 'list',
};

/**
 * Parse the OpenAPI specification to a Client model that contains
 * all the models, services and schema's we should output.
 * @param openApi The OpenAPI spec  that we have loaded from disk.
 */
export const parse = (openApi: OpenApi): Client => {
    const version = getServiceVersion(openApi.info.version);
    const server = getServer(openApi);
    const models = getModels(openApi);
    const services = getServices(openApi);
    services.forEach(service => {
        service.operations.forEach(op => {
            const { parameters, method } = op;
            if (parameters.length) {
                if (method === 'GET') {
                    parameters.forEach(p => {
                        p.type_python = pythonTypeMap[p.type] || '';
                    });
                } else if (method === 'POST') {
                    const type = parameters[0].type;
                    const model = _.find(models, (m: any) => m.name === type);
                    const properties = (model?.properties || []).sort(p => (p.isRequired ? -1 : 1));
                    properties.forEach(p => {
                        p.name_underscore = camelToSnakeCase(p.name);
                        if (p.export === 'generic') {
                            p.type_python = pythonTypeMap[p.type] || '';
                        } else if (p.export === 'array') {
                            p.type_python = 'list';
                        } else if (p.export === 'enum') {
                            p.type_python = 'str';
                        } else if (p.export === 'interface') {
                            p.type_python = 'dict';
                        } else if (p.export === 'all-of') {
                            p.type_python = 'dict';
                        } else {
                            p.type_python = pythonTypeMap[p.type] || '';
                        }
                    });
                    op.parametersRaw = {
                        python: properties,
                    };
                }
            }
        });
    });
    return { version, server, models, services };
};
