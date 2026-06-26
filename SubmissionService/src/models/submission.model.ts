import mongoose, { Document } from "mongoose";

export enum SubmissionStatus {
    COMPLETED = "completed",
    PENDING = "pending",
}

export enum SubmissionLanguage {    
    PYTHON = "python",
    CPP = "cpp",
}  

// Map of testcase id -> verdict (e.g. { "<testcaseId>": "AC" | "WA" | "TLE" | "Error" })
export type ISubmissionData = Record<string, string>;

export interface ISubmission extends Document {
    problemId: string;
    code: string;
    language: SubmissionLanguage;
    status: SubmissionStatus;
    submissionData: ISubmissionData;
    createdAt: Date;
    updatedAt: Date;
}

const submissionSchema = new mongoose.Schema<ISubmission>({
    problemId: { 
        type: String,
        required: [ true, "Problem ID is required" ] 
    },
    code: { type: String, required: [ true, "Code is required" ] },  
    language: { type: String, required: [ true, "Programming language is required" ], enum: Object.values(SubmissionLanguage) },
    status: { 
        type: String, 
        required: true,
        enum: Object.values(SubmissionStatus), 
        default: SubmissionStatus.PENDING 
    },
    submissionData: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
        default: {}
    }
}, { 
    timestamps: true,
    toJSON: {
        transform: (_, record: any) => {
            delete (record as any).__v;
            record.id = record._id;
            delete record._id;
            return record;
        }
    }
});

submissionSchema.index({ problemId: 1 });

export const SubmissionModel = mongoose.model<ISubmission>("Submission", submissionSchema); 

