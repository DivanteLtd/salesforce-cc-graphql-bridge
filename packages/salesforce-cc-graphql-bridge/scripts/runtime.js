import * as core from '@sfcc-core/core';
/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
/**
 * Import Dependencies
 */
import color from 'colors';
import passport from 'passport';
import * as graphqlPassport from 'graphql-passport';
import express from 'express';
import expressSession from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import * as CommerceSdk from 'commerce-sdk';
import cors from 'cors'
import { getCommerceClientConfig } from '@sfcc-core/apiconfig';

import { getBridgeApp } from '../app/bridge-app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Constants
 */
const port = process.env.PORT || 3001;
const mode = process.env.NODE_ENV || 'development';

const users = new Map();

function validateConfig(config) {
    const REQUIRED_KEYS = [
        'COMMERCE_API_PATH',
        'COMMERCE_CLIENT_API_SITE_ID',
        'COMMERCE_CLIENT_CLIENT_ID',
        'COMMERCE_CLIENT_REALM_ID',
        'COMMERCE_CLIENT_INSTANCE_ID',
        'COMMERCE_CLIENT_ORGANIZATION_ID',
        'COMMERCE_CLIENT_SHORT_CODE',
        'COMMERCE_SESSION_SECRET',
    ];

    REQUIRED_KEYS.forEach(KEY => {
        if (!config[KEY]) {
            console.log(
                `Make sure ${KEY} is defined within api.js or as an environment variable`
                    .red,
            );
            process.exit(1);
        }
    });
}

/**
 * Setup and Start Server
 */
(async () => {
    const bridgeApp = await getBridgeApp();
    const config = bridgeApp.apiConfig.config;
    validateConfig(config);
    //
    // Use this middleware when graphql-passport context.authenticate() are called
    // to retrieve a shopper token from the sdk. provide {id,token} to passport on success.
    //
    passport.use(
        new graphqlPassport.GraphQLLocalStrategy(function(user, pass, done) {
            const clientConfig = getCommerceClientConfig(config);
            CommerceSdk.helpers
                .getShopperToken(clientConfig, { type: 'guest' })
                .then(token => {
                    const customerId = token.getCustomerInfo().customerId;
                    done(null, {
                        id: customerId,
                        token: token.getBearerHeader(),
                    });
                })
                .catch(error => done(error));
        }),
    );

    passport.serializeUser(function(user, done) {
        users.set(user.id, user);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        done(null, users.get(id));
    });

    // Create Express Instance, register it with demo app and start demo app.
    bridgeApp.expressApplication = express();
    bridgeApp.expressApplication.use(cors())

    const sess = {
        secret: config.COMMERCE_SESSION_SECRET, // This is something new we add to the config
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: 'strict',
        },
    };

    if (mode === 'production') {
        bridgeApp.expressApplication.set('trust proxy', 1); // trust first proxy
        sess.cookie.secure = true; // serve secure cookies
    }

    bridgeApp.expressApplication.disable('x-powered-by');

    // generate cookie
    bridgeApp.expressApplication.use(expressSession(sess));

    bridgeApp.expressApplication.use(passport.initialize());
    bridgeApp.expressApplication.use(passport.session());

    bridgeApp.start();

    // start the server
    const server = bridgeApp.expressApplication.listen(port, () => {
        const portToTellUser =
            process.env.NODE_ENV === 'development'
                ? 3001
                : server.address().port;

        console.log('Welcome to SFCC GraphQL Bridge!');
        console.log(
            `🚀 Apollo GraphQL Server up on [http://localhost:${portToTellUser}${bridgeApp.apiConfig.config.COMMERCE_API_PATH}] 🚀`
                .blue,
        );
    });

    return server;
})();
