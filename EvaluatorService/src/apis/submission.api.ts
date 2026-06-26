import axios from "axios";
import { InternalServerError } from "../utils/errors/app.error";
import logger from "../config/logger.config";



export async function updateSubmission (submissionId: string, status: string, output: Record<string, string>) {
    try{
        const url = `${process.env.SUBMISSION_SERVICE_URL}/submissions/${submissionId}/status`;

        const response
            = await axios.patch(url, {
                status,
                submissionData: output
            });
        if(response.status !== 200) {
            throw new InternalServerError(`Failed to update submission with id ${submissionId}`);
        }
        console.log(response.data);
        return;
    } catch (error) {
        logger.error(`Error updating submission status: ${error}`);
        return null;
    }
}