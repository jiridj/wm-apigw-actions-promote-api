const fs = require('fs');
const index = require('./index');
const sdk = require('@jiridj/wm-apigw-config-sdk');

jest.mock('@jiridj/wm-apigw-config-sdk');

const mockedSdk = jest.mocked(sdk, true);

const api = JSON.parse(fs.readFileSync('resources/api-details.json'));
const stage = JSON.parse(fs.readFileSync('resources/stage-details.json'));

describe('test promoteApi', () => {

    beforeAll(() => {
        index.setupLogger(false);
    });

    it('should succeed', async () => {
        mockedSdk.findStage.mockResolvedValueOnce(stage);
        mockedSdk.findApiByNameAndVersion.mockResolvedValueOnce([{ "api": api }]);
        mockedSdk.promoteApi.mockResolvedValueOnce({ name: `${api.apiName} : ${api.apiVersion} -> ${stage.name}` });

        await index.promoteApi(
            api.apiName,
            api.apiVersion,
            stage.name
        );
    });

    it('should fail because the API does not exist', async () => {
        const message = `Failed to find an API with name ${api.apiName} and version ${api.apiVersion}!`;
        mockedSdk.findStage.mockResolvedValueOnce(stage);
        mockedSdk.findApiByNameAndVersion.mockRejectedValueOnce(message);
        
        try{
            await index.promoteApi(
                api.apiName,
                api.apiVersion,
                stage.name
            );
        }
        catch(error) {
            expect(error).toBe(message);
        }
    });

    it('should fail because the stage does not exist', async () => {
        const message = `Stage with name ${stage.name} does not exist!`;
        mockedSdk.findStage.mockRejectedValueOnce(message);

        try{
            await index.promoteApi(
                api.apiName,
                api.apiVersion,
                stage.name
            );
        }
        catch(error) {
            expect(error).toBe(message);
        }
    });

});

describe('test run', () => {

    it('should succeed', async () => {
        // GitHub Actions inputs are passed into the step as environment variables
        process.env['INPUT_APIGW-URL'] = 'http://localhost:5555';
        process.env['INPUT_APIGW-USERNAME'] = 'Administrator';
        process.env['INPUT_APIGW-PASSWORD'] = 'manage';
        process.env['INPUT_API-NAME'] = api.apiName;
        process.env['INPUT_API-VERSION'] = api.apiVersion;
        process.env['INPUT_STAGE-NAME'] = stage.name;
        process.env['INPUT_DEBUG'] = true;

        mockedSdk.findStage.mockResolvedValueOnce(stage);
        mockedSdk.findApiByNameAndVersion.mockResolvedValueOnce([{ "api": api }]);
        mockedSdk.promoteApi.mockResolvedValueOnce({ name: `${api.apiName} : ${api.apiVersion} -> ${stage.name}` });

        await index.run();
    });

});