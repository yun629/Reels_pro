import mongoose ,{Schema,model,models} from "mongoose";
import bcrypt from "bcryptjs";


export const VIDEO_DIMENSIONS={
    width:1080,
    height:1920
} as const;



export interface IVideo{
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailURL: string;
    controls?: boolean;
    createdAt?: Date; 
    updatedAt?: Date;  
    transformation?:{
        height:number,
        width:number,
        quality:number
    }
}


const videoSchema=new Schema<IVideo>({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    videoUrl:{
        type:String,
        required:true,
        trim:true,
    },
    thumbnailURL:{
        type:String,
        required:true,
        trim:true,
    },
    controls:{
        type:Boolean,
        default:false
    },
    transformation:{
        height:{
            type:Number,
            default:VIDEO_DIMENSIONS.height
        },
        width:{
            type:Number,
            default:VIDEO_DIMENSIONS.width
        },
        quality:{
            type:Number,
            min:1,
            max:100
        }
    },

    createdAt:{
        type:Date,
        default:Date.now    
    },
    updatedAt:{
        type:Date,
        default:Date.now    
    }
},{timestamps:true});

const Video=models?.Video || model<IVideo>("Video",videoSchema);    
export default Video;