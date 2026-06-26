import { Worker } from "bullmq"
import { SUBMISSION_QUEUE_NAME } from "../utils/constants"
import { createNewRedisClient } from "../config/redis.config";
import logger from "../config/logger.config";
import { EvaluationJob, EvaluationResult, TestCase } from "../interfaces/evaluation.interface";
import { runCode } from "../utils/containers/codeRunner.util";
import { LANGUAGE_CONFIG } from "../config/language.config";
import { updateSubmission } from "../apis/submission.api";

function matchTestCasesWithResults(testCases: TestCase[], results: EvaluationResult[]) {
    const output: Record<string, string> = {};
    if(testCases.length !== results.length) {  
        console.log("WA") 
        return output;
    }

    testCases.forEach( (testcase, index) => {
        let retval = "";
        if(results[index].status === "time_limit_exceeded") {
            retval = "TLE";
        } else if(results[index].status === "compilation_error") {
            retval = "Error";
        } else {
            if(results[index].output.trim() === testcase.output.trim()) {
                retval = "AC";
            } else {
                retval = "WA";
            }
        }
        console.log(`Testcase ${testcase._id}: ${retval}`);
        output[testcase._id] = retval;
    })

    return output;    
}

async function setUpEvaluationWorker(){
    const worker = new Worker(SUBMISSION_QUEUE_NAME, async (job) => {
        // Job processing logic here
        logger.info(`Processing job ${job.id} with data: ${JSON.stringify(job.data)}`);
        const data: EvaluationJob = job.data;
        console.log("Job data:", data);

        try {
           const testCasesRunnerPromises = data.problem.testcases.map( testcase => {
                return runCode({
                    code: data.code,   
                    language: data.language,
                    timeout: LANGUAGE_CONFIG[data.language].timeout,
                    imageName: LANGUAGE_CONFIG[data.language].imageName,
                    input: testcase.input
                })
            });

            const testCasesRunnerResults = await Promise.all(testCasesRunnerPromises);

            console.log("Test cases results:", testCasesRunnerResults);

            const output = matchTestCasesWithResults(data.problem.testcases, testCasesRunnerResults as EvaluationResult[]);
            
            console.log("Final output for submission:", output);

            await updateSubmission(data.submissionId, "completed", output);
        } catch (error) {
            logger.error(`Error processing job ${job.id}: ${(error as Error).message}`);
            return;
        }
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