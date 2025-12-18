import { ISubmission, SubmissionStatus } from "../models/submission.model";
import { ISubmissionRepository } from "../repositories/submission.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { getProblemById } from "../apis/problem.api";
import { addSubmissionJobToQueue } from "../producers/submission.producers";
import logger from "../config/logger.config";

export interface ISubmissionService {
    createSubmission(submissionData: Partial<ISubmission>): Promise<ISubmission>;
    getSubmissionById(id: string): Promise<ISubmission | null>;
    getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]>;
    deleteSubmissionById(id: string): Promise<boolean>;
    updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null>;
}

export class SubmissionService implements ISubmissionService {
    private submissionRepository: ISubmissionRepository

    constructor(repository: ISubmissionRepository) {
        this.submissionRepository = repository;
    }

    async createSubmission(submissionData: Partial<ISubmission>): Promise<ISubmission> {
        // check whether problem exsits

        if(!submissionData.problemId) {
            throw new BadRequestError("Problem ID is required to create a submission");
        }

        if(!submissionData.code) {
            throw new BadRequestError("Code is required to create a submission");
        }

        if(!submissionData.language) {
            throw new BadRequestError("Programming language is required to create a submission");
        }   

        const problem = await getProblemById(submissionData.problemId);
        if(!problem) throw new NotFoundError(`Problem with id ${submissionData.problemId} not found`);
        // add submission payload to db

        const submission = await this.submissionRepository.create(submissionData);

        // submission to redis queue 
        const jobId = await addSubmissionJobToQueue({
            submissionId: submission._id.toString(),        // add submission payload to db
            problem: problem,
            code: submission.code,
            language: submission.language
        });

        logger.info(`Submission job added to queue with job id: ${jobId}`);

        return submission;
    }

    async getSubmissionById(id: string): Promise<ISubmission | null> {
        const submission = await this.submissionRepository.findById(id);
        if(!submission) {
            throw new NotFoundError(`Submission with id ${id} not found`);
        }
        return submission;
    }

    async getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]> {
        return await this.submissionRepository.findByProblemId(problemId);
    }

    async deleteSubmissionById(id: string): Promise<boolean> {
        const result = await this.submissionRepository.deleteById(id);
        if(!result) {   
           throw new NotFoundError(`Submission with id ${id} not found`);
        }
        return result;
    }

    async updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null> {
        const submission = await this.submissionRepository.updateStatus(id, status);
        if(!submission) {
            throw new NotFoundError(`Submission with id ${id} not found`);
        }
        return submission;
    }
}