import { IVideo } from "@/models/Video";


export type videoFormData=Omit<IVideo,"_id">

type FetchOptions={
    method? :"GET"|"POST"|"PUT"|"DELETE",
    body?:any,
    headers? :Record<string,string>,
}

class ApiClient{
    private async fetch<T>(
        endpoint:string,
        options:{}
    ):Promise<T>{
        const {method="GET",body,headers={}}:FetchOptions=options;

        const defaultHeaders={
            "Content-Type":"application/json",
            ...headers
        }

        const response=await fetch(`/api${endpoint}`,{
            method,
            headers:defaultHeaders,
            body:body?JSON.stringify(body):undefined
        })

        if(!response.ok){
            throw new Error(`Error: ${response.statusText}`);
        }

        return response.json();
    }

    async getVideos(){
        return this.fetch<IVideo []>("/videos",{
        })
    }

    async getAVideo(id: string) {
        return this.fetch<IVideo>(`/videos/${id}`, {
            
        });
    }

    async createVideo(videoData:videoFormData){
        return this.fetch<IVideo>("/videos",{
            method:"POST",
            body:videoData
        })
    }
}

export const apiClient=new ApiClient();