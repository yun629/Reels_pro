"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Register = () => {

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [error,setError]=useState("");

    const router=useRouter();

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(password!==confirmPassword){
            setError("Your Password does not match");
            return;
        }

        try{
            const res=await fetch("/api/auth/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email,
                    password
                })

            })
            const data=await res.json();
            if(!res.ok){
                setError("Registration failed");
                return;
            }
            router.push("/login"); 
        }catch(err){
            setError("Something went wrong");
            console.log(err);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
          <div className="w-full max-w-md bg-base-100 shadow-xl rounded-xl p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
    
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}
    
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
    
              <div>
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
    
              <div>
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
    
              <button type="submit" className="btn btn-primary w-full">
                Register
              </button>
            </form>
    
            <p className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <span
                className="text-primary cursor-pointer underline"
                onClick={() => router.push("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      );
}

export default Register
