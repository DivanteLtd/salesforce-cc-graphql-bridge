/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import * as CommerceSdk from 'commerce-sdk';
import { getCommerceClientConfig } from '@sfcc-core/apiconfig';
import CategoryResult from '../models/CategoryResult';

import {
    getUserFromContext,
    requestWithTokenRefresh,
} from '@sfcc-core/core-graphql';

const getSearchClient = async (config, context, refresh = false) => {
    const clientConfig = getCommerceClientConfig(config);
    clientConfig.headers.authorization = (
        await getUserFromContext(context, refresh)
    ).token;
    return new CommerceSdk.Product.ShopperProducts(clientConfig);
};

const categories = async (config, ids, levels, context) => {
    return requestWithTokenRefresh(async refresh => {
        // Clear any basketId when we get a new shopper token.
        if (refresh) {
            context.setSessionProperty('basketId', undefined);
        }

        const searchClient = await getSearchClient(config, context, refresh);
        return searchClient.getCategories({
            parameters: {
                ids,
                levels
            },
        });
    });
};

export const resolver = config => {
    return {
        Query: {
            categories: async (_, { ids, levels }, context) => {
                const result = await categories(
                    config,
                    ids,
                    levels,
                    context,
                    false,
                );

                return new CategoryResult(result, ids, levels);
            },
        },
    };
};
