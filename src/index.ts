import { HttpClient } from './HttpClient';
import { Indent } from './Indent';
import { parse as parseV2 } from './openApi/v2';
import { parse as parseV3 } from './openApi/v3';
import { getOpenApiSpec } from './utils/getOpenApiSpec';
import { getOpenApiVersion, OpenApiVersion } from './utils/getOpenApiVersion';
import { isString } from './utils/isString';
import { postProcessClient } from './utils/postProcessClient';
import { registerHandlebarTemplates } from './utils/registerHandlebarTemplates';
import { registerHandlebarTemplatesForCSharp } from './utils/registerHandlebarTemplatesForCSharp';
import { registerHandlebarTemplatesForGo } from './utils/registerHandlebarTemplatesForGo';
import { registerHandlebarTemplatesForJava } from './utils/registerHandlebarTemplatesForJava';
import { registerHandlebarTemplatesForPHP } from './utils/registerHandlebarTemplatesForPHP';
import { registerHandlebarTemplatesForPython } from './utils/registerHandlebarTemplatesForPython';
import { registerHandlebarTemplatesForWeb } from './utils/registerHandlebarTemplatesWeb';
import { writeClient } from './utils/writeClient';

export { HttpClient } from './HttpClient';
export { Indent } from './Indent';

export type Options = {
    input: string | Record<string, any>;
    output: string;
    httpClient?: HttpClient;
    clientName?: string;
    useOptions?: boolean;
    useUnionTypes?: boolean;
    exportCore?: boolean;
    exportServices?: boolean;
    exportModels?: boolean;
    exportSchemas?: boolean;
    indent?: Indent;
    postfix?: string;
    request?: string;
    write?: boolean;
    lang?: 'ts' | 'java' | 'python';
    isAuthClient?: boolean;
};

/**
 * Generate the OpenAPI client. This method will read the OpenAPI specification and based on the
 * given language it will generate the client, including the typed models, validation schemas,
 * service layer, etc.
 * @param input The relative location of the OpenAPI spec
 * @param output The relative location of the output directory
 * @param httpClient The selected httpClient (fetch, xhr, node or axios)
 * @param clientName Custom client class name
 * @param useOptions Use options or arguments functions
 * @param useUnionTypes Use union types instead of enums
 * @param exportCore Generate core client classes
 * @param exportServices Generate services
 * @param exportModels Generate models
 * @param exportSchemas Generate schemas
 * @param indent Indentation options (4, 2 or tab)
 * @param postfix Service name postfix
 * @param request Path to custom request file
 * @param write Write the files to disk (true or false)
 */
export const generate = async ({
    input,
    output,
    httpClient = HttpClient.FETCH,
    clientName,
    useOptions = false,
    useUnionTypes = false,
    exportCore = true,
    exportServices = true,
    exportModels = true,
    exportSchemas = false,
    indent = Indent.SPACE_4,
    postfix = 'Service',
    request,
    write = true,
    lang = 'ts',
    isAuthClient = false,
}: Options): Promise<void> => {
    const openApi = isString(input) ? await getOpenApiSpec(input) : input;
    const openApiVersion = getOpenApiVersion(openApi);

    let templates;
    if (lang === 'ts') {
        templates = registerHandlebarTemplates({
            httpClient,
            useUnionTypes,
            useOptions,
        });
    } else if (lang === 'java') {
        templates = registerHandlebarTemplatesForJava({
            httpClient,
            useUnionTypes,
            useOptions,
        });
    } else if (lang === 'python') {
        templates = registerHandlebarTemplatesForPython({
            httpClient,
            useUnionTypes,
            useOptions,
        });
    } else if (lang === 'csharp') {
        templates = registerHandlebarTemplatesForCSharp({
            httpClient,
            useUnionTypes,
            useOptions,
        });
    } else if (lang === 'go') {
        templates = registerHandlebarTemplatesForGo({
            httpClient,
            useUnionTypes,
            useOptions,
        });
    } else if (lang === 'php') {
        templates = registerHandlebarTemplatesForPHP({
            httpClient,
            useUnionTypes,
            useOptions,
        });
    } else if (lang === 'web') {
        templates = registerHandlebarTemplatesForWeb({
            httpClient,
            useUnionTypes,
            useOptions,
        });
    } else {
        throw new Error('not supported lang');
    }

    switch (openApiVersion) {
        case OpenApiVersion.V3: {
            const client = parseV3(openApi);
            const clientFinal = postProcessClient(client);
            if (!write) break;
            await writeClient({
                client: clientFinal,
                templates,
                output,
                httpClient,
                useOptions,
                useUnionTypes,
                exportCore,
                exportServices,
                exportModels,
                exportSchemas,
                indent,
                postfix,
                clientName,
                request,
                lang,
                isAuthClient,
            });
            break;
        }
    }
};

export default {
    HttpClient,
    generate,
};
