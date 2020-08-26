/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Query {
        categories(ids: String = "", levels: String = ""): CategoryResult
    }

    type CategoryResult {
        limit: Int
        total: Int
        data: [Category]
    }

    type Category {
        categories: [Category]
        description: String
        name: String
        id: String
        parentCategoryId: String
        pageTitle: String
        thumbnail: String
    }
`;
