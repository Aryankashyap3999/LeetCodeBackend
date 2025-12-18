import dockerode from 'dockerode';
import { CPP_DOCKER_IMAGE, PYTHON_DOCKER_IMAGE } from '../constants';
import logger from '../../config/logger.config';


export async function pullImage(image: string) {
    const docker = new dockerode();

    return new Promise((res, rej) => {
        docker.pull(image, (err: Error, stream: NodeJS.ReadableStream) => {
            if(err) return err;

            docker.modem.followProgress(
                stream, 
                function onFinished(finalErr, output) {
                    if(finalErr) return rej(finalErr);
                    res(output);
                },
                function onProgress(event) {
                    console.log(event.status);
                }
            )
        })
    })
}

export async function pullAllImages() {
    const images = [PYTHON_DOCKER_IMAGE, CPP_DOCKER_IMAGE];

    const pullPromises = images.map(image => pullImage(image));

    try {
        await Promise.all(pullPromises);
        logger.info("All Docker images pulled successfully");
    } catch (error) {
        logger.error("Error pulling Docker images:", error);
    }
    
    
}