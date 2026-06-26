export interface TestCase {
    _id: string;
    input: string;
    output: string;
}

export interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    editorial?: string;
    testcases: TestCase[];
    createdAt: string;
    updatedAt: string;
}

export interface EvaluationJob {
    submissionId: string;
    code: string;
    language: 'python' | 'cpp';
    problem: Problem;
}

export interface EvaluationResult {
    status: 'success' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error';
    output: string;
}