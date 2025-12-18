import express from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { startWorkers } from './workers/evaluation.worker';
import { pullAllImages } from './utils/containers/pullImage.util'; 
import { runCode } from './utils/containers/codeRunner.util';
const app = express();

app.use(express.json());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router); 


/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);


app.listen(serverConfig.PORT, async () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`Press Ctrl+C to stop the server.`);
    await startWorkers();
    logger.info("Background workers started successfully");
    await pullAllImages();
    console.log("Pulled all Docker images successfully");
    await testPythonCode()
});

async function testPythonCode() {
    const pythonCode = `
import time
i = 0
time.sleep(1)

while i > 3:
    i = i + 1
    print(f"Counting: {i}")
    time.sleep(1)
print("Bye!")
`;

    await runCode({
        code: pythonCode,   
        language: 'python',
        timeout: 5000
    });
}
