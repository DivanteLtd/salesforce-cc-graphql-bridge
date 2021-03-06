/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
// SFRA Core Extension module
import { core, API_EXTENSIONS_KEY } from '@sfcc-core/core';
import { resolverFactory } from '@sfcc-core/core-graphql';

import {
    productDetailsTypeDef,
    productDetailsResolver,
    productSearchTypeDef,
    productSearchResolver,
    categoriesTypeDef,
    categoriesResolver
} from './api';

export { getPrices } from './api/schema/priceHelpers';
export class ProductAPI {
    constructor(core) {
        this.core = core;
        this.core.logger.log('ProductAPI.constructor(core)');
    }

    get typeDefs() {
        core.logger.log(
            'ProductAPI.typeDefs()'
        );
        return [productDetailsTypeDef, productSearchTypeDef, categoriesTypeDef];
    }

    getResolvers(config) {
        core.logger.log('ProductAPI.getResolvers()', config);
        return resolverFactory(config, [
            productDetailsResolver,
            productSearchResolver,
            categoriesResolver
        ]);
    }
}

core.registerExtension(API_EXTENSIONS_KEY, function() {
    const productAPI = new ProductAPI(core);
    return productAPI;
});
