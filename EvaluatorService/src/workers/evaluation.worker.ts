import { Worker } from "bullmq"
import { SUBMISSION_QUEUE_NAME } from "../utils/constants"
import { createNewRedisClient } from "../config/redis.config";
import logger from "../config/logger.config";

async function setUpEvaluationWorker(){
    const worker = new Worker(SUBMISSION_QUEUE_NAME, async (job) => {
        // Job processing logic here
        logger.info(`Processing job ${job.id} with data: ${JSON.stringify(job.data)}`);
    }, {
        connection: createNewRedisClient()
    });

    worker.on("error", (error) => {     
        logger.error("Evaluation Worker Error:", error);
    });

    worker.on("completed", (job) => {
        console.log(`Job ${job.id} has been completed`);
    });

    worker.on("failed", (job, err) => {
        console.error(`Job ${job?.id} has failed with error ${err.message}`);
    });     
}

export async function startWorkers() {
    await setUpEvaluationWorker();
}