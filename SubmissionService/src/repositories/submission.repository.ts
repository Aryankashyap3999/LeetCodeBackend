import { ISubmission, SubmissionStatus } from "../models/submission.model";

export interface ISubmissionRepository {
    create(submissionData: Partial<ISubmission>): Promise<ISubmission>;
    findById(id: string): Promise<ISubmission | null>;
    findByProblemId(id: string): Promise<ISubmission[]>;
    deleteById(id: string): Promise<boolean>;
    updateStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null>;
}

export class SubmissionRepository implements ISubmissionRepository {
    private submissionModel = require("../models/submission.model").SubmissionModel;

    async create(submissionData: Partial<ISubmission>): Promise<ISubmission> {
        const submission = new this.submissionModel(submissionData);
        return await submission.save();
    }

    async findById(id: string): Promise<ISubmission | null> {
        return await this.submissionModel.findById(id).exec();
    }

    async findByProblemId(problemId: string): Promise<ISubmission[]> {
        return await this.submissionModel.find({ problemId }).exec();
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await this.submissionModel.deleteOne({ _id: id }).exec();
        return result.deletedCount === 1;
    }

    async updateStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null> {
        return await this.submissionModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).exec();       
    }
} 