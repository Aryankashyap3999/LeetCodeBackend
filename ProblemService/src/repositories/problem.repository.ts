import ProblemModel, { IProblem } from "../models/problem.model";

export interface IProblemRepository {
    createProblem(problemData: Partial<IProblem>): Promise<IProblem>;
    getProblemById(id: string): Promise<IProblem | null>;
    updateProblem(id: string, updateData: Partial<IProblem>): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<Boolean>;
    listProblems(filter?: Partial<IProblem>, limit?: number, skip?: number): Promise<{ problems: IProblem[]; total: number }>;
    findByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<IProblem[]>;
    searchProblems(query: string): Promise<IProblem[]>;  
}

export class ProblemRepository implements IProblemRepository {
    async createProblem(problemData: Partial<IProblem>): Promise<IProblem> {
        const newProblem = new ProblemModel(problemData);
        return await newProblem.save();

    }
    async getProblemById(id: string): Promise<IProblem | null> {
        const problem = await ProblemModel.findById(id)
        return problem;
        throw new Error("Method not implemented.");
    }
    async listProblems(filter?: Partial<IProblem>, limit?: number, skip?: number): Promise<{ problems: IProblem[]; total: number }> {
        const problems = await ProblemModel.find().sort({ createdAt: -1});
        const total = await ProblemModel.countDocuments();
        return { problems, total };
    }

    async updateProblem(id: string, updateData: Partial<IProblem>): Promise<IProblem | null> {
        const updatedProblem = await ProblemModel.findByIdAndUpdate(id, updateData, { new: true});
        return updatedProblem;
    }

    async deleteProblem(id: string): Promise<Boolean> {
        const deleteProblem = await ProblemModel.findByIdAndDelete(id);
        return deleteProblem !== null;
    }

    async findByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<IProblem[]> {
        const problems = await ProblemModel.find({ difficulty }).sort({ createdAt: -1});
        return problems;
    } 

    async searchProblems(query: string): Promise<IProblem[]> {
        const problems = await ProblemModel.find({ 
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1});
        return problems;
    }
}