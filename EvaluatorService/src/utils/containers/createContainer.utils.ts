import logger from "../../config/logger.config";
import Docker from "dockerode";

export interface CreateContainerOptions {
    imageName: string;
    cmdExecutable: string[];
    memoryLimit: number;
}

export async function createDockerContainer(options: CreateContainerOptions) {
    try {
        const docker = new Docker();

        const container = await docker.createContainer({
            Image: options.imageName,
            Cmd: options.cmdExecutable,
            AttachStderr: true,
            AttachStdout: true,
            AttachStdin: true,
            Tty: false,
            OpenStdin: true,
            HostConfig: {
                Memory: options.memoryLimit,
                PidsLimit: 100,
                CpuQuota: 50000, // Limit to 50% of CPU
                CpuPeriod: 100000,
                SecurityOpt: ['no-new-privileges'],
                NetworkMode: 'none'
            }
        });

        logger.info(`Docker container created with ID: ${container.id}`);
        return container;
    } catch (error) {
        logger.error("Error creating Docker container:", error);
        return null;
    }
}