import { CPP_DOCKER_IMAGE, PYTHON_DOCKER_IMAGE } from "../utils/constants";

export const LANGUAGE_CONFIG = {
    python: {
        timeout: 4000,
        imageName: PYTHON_DOCKER_IMAGE
    },
    cpp: {
        timeout: 5000,
        imageName: CPP_DOCKER_IMAGE
    }
}