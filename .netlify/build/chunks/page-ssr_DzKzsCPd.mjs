import { createClient } from '@sanity/client';

const sanityClient = createClient(
            {"apiVersion":"v2023-08-24","projectId":"0f5m14sf","dataset":"production","useCdn":false}
          );

globalThis.sanityClient = sanityClient;

export { sanityClient as s };
