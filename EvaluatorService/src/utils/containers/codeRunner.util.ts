import { commands } from "./commands.utils";
import { createDockerContainer } from "./createContainer.utils";

const allowedLanguages = ['python', 'cpp'];

export interface RunCodeOptions {
    code: string;
    language: 'python' | 'cpp';
    timeout: number;
    imageName: string;
    input?: string
}

export async function runCode(options: RunCodeOptions) {

    const { code, language, timeout, imageName, input } = options;

    if(!allowedLanguages.includes(language)) {
        throw new Error(`Language ${language} is not supported.`);
    }


    const container = await createDockerContainer({
        imageName: imageName ,
        cmdExecutable: commands[language](code, input || ""),
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

    // Remove Docker log frame headers (null bytes) and control characters
    // Keep only printable text and standard whitespace
    const logsString = processingLogs(output?.toString('utf-8'));
    console.log("logsString", logsString);

    await container?.remove();


    clearTimeout(timeLimitExccedTimeout);

    if(status.StatusCode == 0) {
        console.log("Code executed successfully");
    } else {
        console.error("Code execution failed");
    }
}

function processingLogs(logs: string | undefined): string {
    return logs ? logs
        .replace(/\x00/g, '') // Remove null bytes
        .replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, '') // Remove control characters except tab/newline
        .trim() : "";
}   