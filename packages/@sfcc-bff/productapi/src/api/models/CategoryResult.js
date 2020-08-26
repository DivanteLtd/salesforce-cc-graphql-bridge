/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';
export default class CategoryResult {
    constructor(searchResult, ids, levels) {
        this.currentIds = ids ? ids : null;
        this.currentLevels = levels ? levels : null;

        this.limit = searchResult.limit;
        this.data = searchResult.data
    }
}
