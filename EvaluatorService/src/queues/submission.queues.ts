import { Queue } from "bullmq";
import { createNewRedisClient } from "../config/redis.config";
import logger from "../config/logger.config";

export const submissionQueue = new Queue("submission", {
    connection: createNewRedisClient(),
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000
        }
    }
});

submissionQueue.on("error", (error) => {
    logger.error("Submission Queue Error:", error);
});    

submissionQueue.on("waiting", (job) => {
    logger.info(`Job ${job.id} is waiting to be processed`);
})

export default submissionQueue;