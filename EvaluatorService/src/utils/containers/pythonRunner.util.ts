import { PYTHON_DOCKER_IMAGE } from "../constants";
import { createDockerContainer } from "./createContainer.utils";

export async function runPythonCode(code: string) {

    const runCommand = `echo '${code}' > solution.py && python3 solution.py`;
    console.log("Run command:", runCommand);

    const container = await createDockerContainer({
        imageName: PYTHON_DOCKER_IMAGE,
        cmdExecutable: ['/bin/sh', '-c', runCommand],
        memoryLimit: 256 * 1024 * 1024, // 256 MB
    });

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
}