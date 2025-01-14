import fs from 'fs';
import { resolve } from 'path';

import type { Client } from '../client/interfaces/Client';
import type { HttpClient } from '../HttpClient';
import type { Indent } from '../Indent';
import { mkdir, rmdir } from './fileSystem';
import { isDefined } from './isDefined';
import { isSubDirectory } from './isSubdirectory';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientClass } from './writeClientClass';
import { writeClientCore } from './writeClientCore';
import { writeClientIndex } from './writeClientIndex';
import { writeClientModels } from './writeClientModels';
import { writeClientSchemas } from './writeClientSchemas';
import { writeManagementClient } from './writeClientServices';

/**
 * Write our OpenAPI client, using the given templates at the given output
 * @param client Client object with all the models, services, etc.
 * @param templates Templates wrapper with all loaded Handlebars templates
 * @param output The relative location of the output directory
 * @param httpClient The selected httpClient (fetch, xhr, node or axios)
 * @param useOptions Use options or arguments functions
 * @param useUnionTypes Use union types instead of enums
 * @param exportCore Generate core client classes
 * @param exportServices Generate services
 * @param exportModels Generate models
 * @param exportSchemas Generate schemas
 * @param exportSchemas Generate schemas
 * @param indent Indentation options (4, 2 or tab)
 * @param postfix Service name postfix
 * @param clientName Custom client class name
 * @param request Path to custom request file
 */
export const writeClient = async (params: {
    client: Client;
    templates: Templates;
    output: string;
    httpClient: HttpClient;
    useOptions: boolean;
    useUnionTypes: boolean;
    exportCore: boolean;
    exportServices: boolean;
    exportModels: boolean;
    exportSchemas: boolean;
    indent: Indent;
    postfix: string;
    clientName?: string;
    request?: string;
    lang?: string;
    isAuthClient?: boolean;
}): Promise<void> => {
    const {
        client,
        templates,
        output,
        httpClient,
        useOptions,
        useUnionTypes,
        exportCore,
        exportModels,
        exportSchemas,
        exportServices,
        indent,
        postfix,
        clientName,
        request,
        lang,
        isAuthClient = false,
    } = params;
    const outputPath = resolve(process.cwd(), output);
    const outputPathCore = resolve(outputPath, 'core');
    const outputPathModels = resolve(outputPath, 'models');
    const outputPathSchemas = resolve(outputPath, 'schemas');
    const outputPathServices = resolve(outputPath, 'services');

    if (!isSubDirectory(process.cwd(), output)) {
        throw new Error(`Output folder is not a subdirectory of the current working directory`);
    }

    // if (exportCore) {
    //     await writeClientCore(client, templates, outputPathCore, httpClient, indent, clientName, request);
    // }

    for (const model of client.models) {
        if (model.name.includes('/')) {
            model.name = model.name.split('/')[1];
        }
    }

    const traversedOperationNames: string[] = [];
    for (const service of client.services) {
        const operations = service.operations;
        for (let i = 0; i <= operations.length - 1; i++) {
            const op = operations[i];
            if (!traversedOperationNames.includes(op.name)) {
                traversedOperationNames.push(op.name);
            } else {
                operations.splice(i, 1);
            }
        }
    }

    for (const operation of client.services.map(x => x.operations).flat()) {
        if (operation.parametersDto?.includes('/')) {
            operation.parametersDto = operation.parametersDto.split('/')[1];
        }
    }

    if (exportServices) {
        // await rmdir(outputPathServices);
        // await mkdir(outputPathServices);
        await writeManagementClient({
            services: client.services,
            templates,
            outputPath,
            httpClient,
            useUnionTypes,
            useOptions,
            indent,
            postfix,
            clientName,
            lang,
            isAuthClient,
        });
    }

    // if (exportSchemas) {
    //     await rmdir(outputPathSchemas);
    //     await mkdir(outputPathSchemas);
    //     await writeClientSchemas(client.models, templates, outputPathSchemas, httpClient, useUnionTypes, indent);
    // }

    if (exportModels) {
        await rmdir(outputPathModels);
        await mkdir(outputPathModels);
        await writeClientModels(client.models, templates, outputPathModels, httpClient, useUnionTypes, indent, lang!);
    }

    // if (isDefined(clientName)) {
    //     await mkdir(outputPath);
    //     await writeClientClass(client, templates, outputPath, httpClient, clientName, indent, postfix);
    // }

    // if (exportCore || exportServices || exportSchemas || exportModels) {
    //     await mkdir(outputPath);
    //     await writeClientIndex(
    //         client,
    //         templates,
    //         outputPath,
    //         useUnionTypes,
    //         exportCore,
    //         exportServices,
    //         exportModels,
    //         exportSchemas,
    //         postfix,
    //         clientName
    //     );
    // }

    // 复制 templates 目录到 generated
};
