const core = require('@actions/core');
const sdk = require('@jiridj/wm-apigw-config-sdk');
const winston = require('winston');

let logger;

/**
 * Promote the given API version to the specified stage.
 * 
 * @param {*} apiName 
 * @param {*} apiVersion 
 * @param {*} stageName 
 */
async function promoteApi(apiName, apiVersion, stageName) {
    // Get the stage details
    const stage = await sdk.findStage(stageName);
    
    
    // Get the API version to promote
    const versions = await sdk.findApiByNameAndVersion(apiName, apiVersion);
    const api = versions[0];
    
    // Promote the api
    await sdk.promoteApi(
        `${apiName} : ${apiVersion} -> ${stageName}`,
        api.id,
        stage.id
    );
}

/**
 * Configures a logger for this action. 
 * 
 * @param {Boolean} debug     Enable debug logging.
 */
 function setupLogger(debug) {
    logger = winston.createLogger({
        transports: [ 
            new winston.transports.Console({
                level: debug ? 'debug' : 'info',
                timestamp: true,
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.colorize(),
                    winston.format.printf(log => `${log.timestamp} - ${log.level} ${log.message}`)
                )
            })
         ]
    });    
}

/**
 * Main logic for the GitHub Action step which parses inputs, invokes the 
 * proper function and sets outputs.
 */
 async function run() {
    try {
        // Setup logging
        setupLogger((core.getInput('debug').toLowerCase() == 'true'));

        // Setup the API Gateway connection parameters
        logger.debug(`Setup connection to ${core.getInput('apigw-url')}`);
        sdk.setup(
            core.getInput('apigw-url'), 
            core.getInput('apigw-username'), 
            core.getInput('apigw-password')
        );

        promoteApi(
            core.getInput('api-name'),
            core.getInput('api-version'),
            core.getInput('stage-name')
        );
    }
    catch(error) {
        logger.error(error);
        core.setFailed(error);
    }
}

module.exports = {
    promoteApi,
    setupLogger,
    run
};

if (require.main === module) {
    run();
}