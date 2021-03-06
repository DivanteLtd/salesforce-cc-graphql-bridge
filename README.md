# Salesforce Commerce Cloud GraphQL Bridge (Proof of Concept)

This is a GraphQL bridge over the SFCC Shopper API. It's a part of [Vue Storefront Next SFCC integration](https://github.com/pkarw/vue-storefront/tree/next/packages/salesforce-cc-poc).

Implementing the headless Salesforce Commerce Cloud application you need a gateway over SFCC API. It might be provided via [Mulesoft](https://www.mulesoft.com/) gateway or ... actually by this **GraphQL Bridge**. **It's a great starting point for adding your own data endpoints**.

The application back end is built on the new Salesforce Commerce API (a RESTful headless API). It uses GraphQL and the Salesforce Commerce Node.js SDK.  Read more about the  application [architecture](docs/architecture.md).

![productSearch endpoint example](docs/productSearch.png)

![product endpoint example](docs/product.png)

## The project history

This project is based on [SFCC Sample Apps](https://github.com/SalesforceCommerceCloud/sfcc-sample-apps/). We removed the original frontend sample application and just kept the GraphQL API. 

We took the original sample application and extended it by adding:
- category listing,
- additional product details,

## Prerequisites
1. Download and install [Node.js v12](https://nodejs.org/en/download/).
2. Install yarn: 
`npm install yarn -g`

## Setup

To set up the application:

1. Clone the `salesforce-cc-graphql-bridge` repository:
`git clone https://github.com/DivanteLtd/salesforce-cc-graphql-bridge.git`

2. Change into the `salesforce-cc-graphql-bridge` folder:
`cd salesforce-cc-graphql-bridge`

3. Copy the `api.example.js` file located at `/packages/salesforce-cc-graphql-bridge/app/`, save it as `api.js`, and make sure `api.js` is added to your `.gitignore` file.

4. In the `api.js` file, provide values for the following variables:
<table>
<tr><th>Variable</th><th>Description</th></tr>
<tr><td><code>COMMERCE_CLIENT_API_SITE_ID</code></td><td>Unique site ID (for example, RefArch or SiteGenesis).</td></tr>
<tr><td><code>COMMERCE_CLIENT_CLIENT_ID</code></td><td>Unique ID used exclusively for API access. See <a href="https://documentation.b2c.commercecloud.salesforce.com/DOC1/topic/com.demandware.dochelp/content/b2c_commerce/topics/account_manager/b2c_account_manager_add_api_client_id.html">Add a Client API</a> for more information.</td></tr>
<tr><td><code>COMMERCE_CLIENT_REALM_ID</code></td><td>Unique four-character realm ID (for example, bblx).</td></tr>
<tr><td><code>COMMERCE_CLIENT_INSTANCE_ID</code></td><td>Unique instance ID within a realm (for example, 015 for an on-demand sandbox).</td></tr>
<tr><td><code>COMMERCE_CLIENT_SHORT_CODE</code></td><td>Unique region-specific merchant ID (for example, staging-001).</td></tr>
<tr><td><code>COMMERCE_SESSION_SECRET</code></td><td>Unique ID for session management (for example, thisisasecretkey).</td></tr>
<tr><td><code>COMMERCE_CORS</code></td><td>Optionally enable <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">CORS</a> for GraphQL on the defined domains (for example, enable all domains with "\*").</td></tr>
</table>

Note: You can obtain these values from your Account Executive (AE) or Customer Support Manager (CSM), except for COMMERCE_SESSSION_SECRET, which is an arbitrary unique value that you create yourself. If the COMMERCE_SESSION_SECRET key is not unique per customer application, session information can be unintentionally shared between ecommerce sites. 

5. Install dependencies:
`yarn`

6. Build the sample application:
`yarn build`

7. Start the sample application:
`yarn start:dev` (development mode) or
`yarn start` (production mode)

8. To access the GraphQL Playground, open the browser to http://localhost:3001/api

## Debug

We recommend Visual Studio Code inbuilt debugger to troubleshoot the code. The `.vscode` launch configuration is included in the repo. To debug using VSCode, see [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging).

## Configuration
* You can change the logging levels by modifying the `COMMERCE_LOG_LEVEL` property in `api.js`. The supported log levels are:
    * `TRACE`
    * `DEBUG`
    * `INFO`
    * `WARN`
    * `ERROR`
    * `SILENT`
* You can also change the server listening port by changing the `port` property in `sfcc-sample-apps/packages/salesforce-cc-graphql-bridge/scripts/runtime.js`.

### Learn More About Supporting Technologies
* [NodeJS](https://nodejs.org/en/docs/)
* [ECMAScript 6](https://hacks.mozilla.org/category/es6-in-depth/)
* [Sass](https://sass-lang.com/guide)
* [GraphQL](https://graphql.org/learn/)
* [Apollo](https://www.apollographql.com/docs/tutorial/introduction/)
* [Jest](https://jestjs.io/docs/en/getting-started)
* [Visual Studio Code](https://code.visualstudio.com/docs)


## Contributing

* See [Contributing](CONTRIBUTING.md)
