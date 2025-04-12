import { Connection } from "mongoose";
declare module 'daisyui';

declare global{
    var mongoose:{
        conn:Connection | null;
        promise: Promise<Connection> | null;
    }
}

export {}