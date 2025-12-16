import mongoose, { Document } from 'mongoose';

export interface ITestcase {
    input: string;
    output: string;
}

export interface IProblem extends Document {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    createdAt: Date;
    updatedAt: Date;
    editorial?: string;
    testcases: ITestcase[];
}

const TestCaseSchema = new mongoose.Schema<ITestcase>({
    input: {
        type: String,
        required: [true, "Testcase input is required"],
        trim: true
    },
    output: {
        type: String,
        required: [true, "Testcase output is required"],
        trim: true
    }
}, { 
    // _id: false // Disable _id for subdocuments if not needed

});        


const ProblemSchema = new mongoose.Schema<IProblem>({
    title: {
        type: String,
        required: [true, "Problem title is required"],
        trim: true,
        maxlength: [100, "Problem title should not exceed 100 characters"]
    }, 
    description: {
        type: String,
        required: [true, "Problem description is required"],
        trim: true
    },
    difficulty: {
        type: String,
        required: [true, "Problem difficulty is required"],
        enum: {
            values: ['easy', 'medium', 'hard'],
            message: "Difficulty must be either 'easy', 'medium', or 'hard'"
        },
        default: 'easy'
    },
    editorial: {
        type: String,
        trim: true
    },
    testcases: {
        type: [TestCaseSchema],
        default: []
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

ProblemSchema.index({ title: 1 }, { unique: true });
ProblemSchema.index({ difficulty: 1 });

const ProblemModel = mongoose.model<IProblem>('Problem', ProblemSchema);

export default ProblemModel; 


