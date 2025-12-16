import { ITestcase } from "../models/problem.model";

export interface CreateProblemDTO {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    editorial?: string;
    testcases: ITestcase[];
}

export interface UpdateProblemDTO {
    title?: string;
    description?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    editorial?: string;
    testcases?: ITestcase[];
}       

export interface ProblemListDTO {
    problems: CreateProblemDTO[];
    total: number;
}   

export interface ProblemFilterDTO {
    difficulty?: 'easy' | 'medium' | 'hard';
    searchQuery?: string;
    limit?: number;
    skip?: number;
}

export interface ProblemResponseDTO {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    editorial?: string;
    testcases: ITestcase[];
    createdAt: Date;
    updatedAt: Date;
}   

export interface ProblemSearchDTO {
    query: string;
}   

export interface ProblemByDifficultyDTO {
    difficulty: 'easy' | 'medium' | 'hard';
   problems: CreateProblemDTO[];
}   

export interface ProblemFilterDTO {
    difficulty?: 'easy' | 'medium' | 'hard';
    searchQuery?: string;
}   



