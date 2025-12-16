import { Request, Response } from "express";
import { ProblemRepository } from "../repositories/problem.repository";
import { ProblemService } from "../services/problem.service";

// export interface IproblemController {
//     createProblem(req: Request, res: Response): Promise<void>;
//     getProblemById(req: Request, res: Response): Promise<void>;
//     updateProblem(req: Request, res: Response): Promise<void>;
//     deleteProblem(req: Request, res: Response): Promise<void>;
//     listProblems(req: Request, res: Response): Promise<void>;
//     findProblemsByDifficulty(req: Request, res: Response): Promise<void>;
//     searchProblems(req: Request, res: Response): Promise<void>;
// }

const problemRepository = new ProblemRepository();
const problemService = new ProblemService(problemRepository);

export const ProblemController = {

    async createProblem(req: Request, res: Response): Promise<void> {
        const problem = await problemService.createProblem(req.body);
        res.status(201).json({
            message: 'Problem created successfully',
            data: problem,
            success: true
        });
    },
      
    async getProblemById(req: Request, res: Response): Promise<void> {
        const problem = await problemService.getProblemById(req.params.id);
        res.status(200).json({
            message: 'Problem fetched successfully',
            data: problem,
            success: true
        });     

    },

    async listProblems(req: Request, res: Response): Promise<void> {
        const { problems, total } = await problemService.listProblems();
        res.status(200).json({
            message: 'Problems fetched successfully',
            data: problems,
            total,
            success: true
        });
    },

    async updateProblem(req: Request, res: Response): Promise<void> {
        const updatedProblem = await problemService.updateProblem(req.params.id, req.body);
        res.status(200).json({
            message: 'Problem updated successfully',
            data: updatedProblem,
            success: true
        });
    },

    async deleteProblem(req: Request, res: Response): Promise<void> {
        const isDeleted = await problemService.deleteProblem(req.params.id);
        res.status(200).json({
            message: 'Problem deleted successfully',
            data: isDeleted,
            success: true
        });
    },

    async findProblemsByDifficulty(req: Request, res: Response): Promise<void> {
        const difficulty = req.params.difficulty as 'easy' | 'medium' | 'hard';
        const problems = await problemService.findProblemsByDifficulty(difficulty);
        res.status(200).json({
            message: 'Problems fetched successfully',
            data: problems,
            success: true
        });
    },

    async searchProblems(req: Request, res: Response): Promise<void> {
        const problems = await problemService.searchProblems(req.query.query as string);
        res.status(200).json({
            message: 'Problems fetched successfully',
            data: problems,
            success: true
        });
    }

}