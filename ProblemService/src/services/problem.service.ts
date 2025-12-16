import { CreateProblemDTO, ProblemByDifficultyDTO, ProblemFilterDTO, ProblemListDTO, UpdateProblemDTO } from "../dtos/problem.dto";
import { santize } from "../helpers/markdown.santizer";
import { IProblem } from "../models/problem.model";
import { IProblemRepository } from "../repositories/problem.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";

export interface IProblemService {
    createProblem(problem: CreateProblemDTO): Promise<IProblem>;
    getProblemById(id: string): Promise<IProblem | null>;
    updateProblem(id: string, updateData: UpdateProblemDTO): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<Boolean>;
    listProblems(filter?: ProblemFilterDTO, limit?: number, skip?: number): Promise<ProblemListDTO>;
    findProblemsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<ProblemByDifficultyDTO>;
    searchProblems(query: string): Promise<IProblem[]>;
}

export class ProblemService implements IProblemService {
    private problemRepository: IProblemRepository;

    constructor(problemRepository: IProblemRepository) {
        this.problemRepository = problemRepository;
    }

    async createProblem(problem: CreateProblemDTO): Promise<IProblem> {
        const santizedPayload = {
            ...problem,
            description: await santize(problem.description),
            editorial: problem.editorial ? await santize(problem.editorial) : undefined
        }
        const createdProblem = await this.problemRepository.createProblem(santizedPayload);
        return createdProblem;
    }

    async getProblemById(id: string): Promise<IProblem | null> {
        const problem = await this.problemRepository.getProblemById(id);
        if (!problem) {
            throw new NotFoundError(`Problem with id ${id} not found`);
        }
        return problem;
    }
    
    async listProblems(filter?: ProblemFilterDTO, limit?: number, skip?: number): Promise<ProblemListDTO> {
        const { problems, total } = await this.problemRepository.listProblems(filter, limit, skip);
        return { problems, total };
    }

    async updateProblem(id: string, updateData: UpdateProblemDTO): Promise<IProblem | null> {
        const updatedProblem = await this.problemRepository.getProblemById(id);
        if (!updatedProblem) {
            throw new NotFoundError(`Problem with id ${id} not found`);
        }

        const santizedPayload = {
            ...updateData,
            description: updateData.description ? await santize(updateData.description) : undefined,
            editorial: updateData.editorial ? await santize(updateData.editorial) : undefined
        }

        return await this.problemRepository.updateProblem(id, santizedPayload);
    }

    async deleteProblem(id: string): Promise<Boolean> {
        const isDeleted = await this.problemRepository.deleteProblem(id);
        if (!isDeleted) {
            throw new NotFoundError(`Problem with id ${id} not found`);
        }
        return isDeleted;
    }

    async findProblemsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<ProblemByDifficultyDTO> {
        const problems = await this.problemRepository.findByDifficulty(difficulty);
        return { difficulty, problems };
    }

    async searchProblems(query: string): Promise<IProblem[]> {
        if(!query || query.trim() === '') {
            throw new BadRequestError('Search query cannot be empty');
        }
        const problems = await this.problemRepository.searchProblems(query);
        return problems;
    }   

}