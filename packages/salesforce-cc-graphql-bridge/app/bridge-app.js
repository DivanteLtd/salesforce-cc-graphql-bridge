/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
//
// SFCC Core registry and core extensions/services
//
import { core, LOGGER_KEY } from '@sfcc-core/core';
import '@sfcc-core/logger';
import '@sfcc-core/apiconfig';
import '@sfcc-core/core-graphql';

//
// SFRA Extensions/Services
//
import '@sfcc-bff/productapi';
import '@sfcc-bff/basketapi';
//
// Import Keys needed to access core services end extensions
//
import { CORE_GRAPHQL_KEY, EXPRESS_KEY } from '@sfcc-core/core-graphql';
import { API_CONFIG_KEY } from '@sfcc-core/apiconfig';

class SampleApp {
    /**
     * Initialize the Application
     */
    constructor(config) {
        //
        // Need to set api config data before any API extensions are instantiated.
        //
        this.apiConfig = core.getService(API_CONFIG_KEY);
        Object.assign(config, this.apiConfig.config);
        this.apiConfig.config = config;
        this.logger = core.getService(LOGGER_KEY);
        if (this.apiConfig.config.COMMERCE_LOG_LEVEL) {
            this.logger.setLevel(this.apiConfig.config.COMMERCE_LOG_LEVEL);
        }
    }

    set expressApplication(expressApp) {
        core.registerService(EXPRESS_KEY, function() {
            return expressApp;
        });
    }

    get expressApplication() {
        return core.getService(EXPRESS_KEY);
    }

    start() {
        let myapp = this;
        //
        // Start Apollo/GraphQL and register Apollo with Express Middleware
        //
        core.getService(CORE_GRAPHQL_KEY).start();

        this.status();
    }

    // Just some development output
    status() {
        Object.getOwnPropertySymbols(core.services).forEach(key => {
            this.logger.debug(`Registered Core Service: ${key.toString()}.`);
        });

        Object.getOwnPropertySymbols(core.extensions).forEach(key => {
            this.logger.debug(
                `Registered Core Extensions: ${key.toString()}. ${
                    core.getExtension(key).length
                } Extensions Registered.`,
            );
        });
    }
}

export async function getBridgeApp() {
    let API_CONFIG_DATA = {
        COMMERCE_API_PATH: process.env.COMMERCE_API_PATH,
        COMMERCE_CLIENT_API_SITE_ID: process.env.COMMERCE_CLIENT_API_SITE_ID,
        COMMERCE_CLIENT_CLIENT_ID: process.env.COMMERCE_CLIENT_CLIENT_ID,
        COMMERCE_CLIENT_REALM_ID: process.env.COMMERCE_CLIENT_REALM_ID,
        COMMERCE_CLIENT_INSTANCE_ID: process.env.COMMERCE_CLIENT_INSTANCE_ID,
        COMMERCE_CLIENT_ORGANIZATION_ID: process.env.COMMERCE_CLIENT_ORGANIZATION_ID,
        COMMERCE_CLIENT_SHORT_CODE: process.env.COMMERCE_CLIENT_SHORT_CODE,
        COMMERCE_LOG_LEVEL: process.env.COMMERCE_LOG_LEVEL,
        COMMERCE_SESSION_SECRET: process.env.COMMERCE_SESSION_SECRET
    };
    try {
        const API = await import('./api.js');
        API_CONFIG_DATA = API.default;
    } catch (e) {
        console.warn(
            "WARNING: There is no api.js found! Copy the api.example.js in api.js and customize with your own variables - otherwise use the process.env variables: \nCOMMERCE_API_PATH,\nCOMMERCE_CLIENT_API_SITE_ID,\nCOMMERCE_CLIENT_CLIENT_ID,\nCOMMERCE_CLIENT_REALM_ID,\nCOMMERCE_CLIENT_INSTANCE_ID,\nCOMMERCE_CLIENT_ORGANIZATION_ID,\nCOMMERCE_CLIENT_SHORT_CODE,\nCOMMERCE_LOG_LEVEL,\nCOMMERCE_SESSION_SECRET,".yellow,
        );
    }
    return new SampleApp(API_CONFIG_DATA);
}

