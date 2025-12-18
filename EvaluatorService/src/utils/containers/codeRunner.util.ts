import { PYTHON_DOCKER_IMAGE } from "../constants";
import { commands } from "./commands.utils";
import { createDockerContainer } from "./createContainer.utils";

const allowedLanguages = ['python'];

export interface RunCodeOptions {
    code: string;
    language: 'python';
    timeout: number;
}

export async function runCode(options: RunCodeOptions) {

    const { code, language, timeout } = options;

    if(!allowedLanguages.includes(language)) {
        throw new Error(`Language ${language} is not supported.`);
    }


    const container = await createDockerContainer({
        imageName: PYTHON_DOCKER_IMAGE,
        cmdExecutable: commands[language](code),
        memoryLimit: 256 * 1024 * 1024, // 256 MB
    });

    const timeLimitExccedTimeout = setTimeout(() => {
        console.error("Time limit exceeded. Stopping container:", container?.id);
        container?.kill();
    }, timeout);

    console.log("Created container with ID:", container?.id);

    await container?.start();

    const status = await container?.wait();
    console.log("Container exited with status:", status);
    
    const output = await container?.logs({
        stdout: true,
        stderr: true,
        follow: false
    });

    const outputLogs = output?.toString('utf-8');
    console.log("Container output:\n", outputLogs);

    await container?.remove();

    clearTimeout(timeLimitExccedTimeout);

    if(status.StatusCode == 0) {
        console.log("Python code executed successfully");
    } else {
        console.error("Python code execution failed");
    }
}