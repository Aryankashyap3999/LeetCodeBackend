import logger from "../config/logger.config";
import { SubmissionLanguage } from "../models/submission.model";
import submissionQueue from "../queues/submission.queues";

export interface ISubmissionJob {
    submissionId: string;
    problemId: string;
    code: string;
    language: SubmissionLanguage
}

export async function addSubmissionJobToQueue(data: ISubmissionJob): Promise<string | null> {
    try {
        const job = await submissionQueue.add("execute-submission", data);
        logger.info(`Added submission job ${job.id} to the queue`);

        return job.id || null;
    } catch (error) {
        logger.error(`Error adding submission job to queue: ${error}`);
        return null;
    }
}