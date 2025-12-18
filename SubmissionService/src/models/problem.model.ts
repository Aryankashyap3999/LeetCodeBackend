import { Document } from 'mongoose';

export interface ITestcase {
    input: string;
    output: string;
}

export interface IProblem extends Document {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    createdAt: Date;
    updatedAt: Date;
    editorial?: string;
    testcases: ITestcase[];
}

       


