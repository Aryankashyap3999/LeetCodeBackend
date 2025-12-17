import axios, { AxiosResponse } from "axios";
import { InternalServerError } from "../utils/errors/app.error";
import logger from "../config/logger.config";

export interface ITestcase {
    input: string;
    expectedOutput: string;
}

export interface IProblemDetails {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    editorial?: string;
    testcases: ITestcase[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IProblemResponse {
    data: IProblemDetails;
    message: string;
    success: boolean;
}

export async function getProblemById(problemId: string): Promise<IProblemDetails | null> {
    try{
        const response: AxiosResponse<IProblemResponse> 
            = await axios.get(`${process.env.PROBLEM_SERVICE_URL}/problems/${problemId}`);
        if(response.data && response.data.success) {
            return response.data.data;
        }
        throw new InternalServerError(`Failed to fetch problem with id ${problemId}`);    
    } catch (error) {
        logger.error(`Error fetching problem by ID: ${error}`);
        return null;
    }
}