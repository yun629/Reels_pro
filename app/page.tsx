"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface IVideo {
  _id?: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailURL: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality: number;
  };
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [videos, setVideos] = useState<IVideo[]>([]);
  const router = useRouter();

  const isAuthenticated = status === "authenticated";

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/videos");
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Error fetching videos", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchVideos();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint =
      authMode === "register" ? "/api/auth/register" : "/api/auth/login";

    const payload =
      authMode === "register"
        ? { email, password, name }
        : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.refresh(); // Refresh session
    } catch (err) {
      console.error(err);
      setError("An error occurred");
    }
  };

  if (status === "loading") return <div className="p-10 text-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {!isAuthenticated ? (
          <div className="card shadow-xl bg-base-100 p-8">
            <h1 className="text-4xl font-bold mb-6 text-center capitalize">
              {authMode}
            </h1>

            {error && <div className="alert alert-error mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === "register" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input input-bordered w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="btn btn-primary w-full">
                {authMode === "register" ? "Create Account" : "Login"}
              </button>
            </form>

            <div className="text-center mt-6">
              {authMode === "login" ? (
                <p>
                  Don&apos;t have an account?{" "}
                  <button
                    className="link link-primary"
                    onClick={() => setAuthMode("register")}
                  >
                    Register
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    className="link link-primary"
                    onClick={() => setAuthMode("login")}
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold mb-2">
                Welcome, {session.user?.name || session.user?.email}
              </h1>
              <p className="text-lg text-gray-500">Enjoy your videos below 👇</p>
            </div>

            {videos.length === 0 ? (
              <div className="text-center text-gray-500">No videos found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {videos.map((video) => (
                  <div key={video._id} className="card bg-base-100 shadow-lg">
                    <figure>
                      <img
                        src={video.thumbnailURL}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">{video.title}</h2>
                      <p>{video.description}</p>
                      <video
                        src={video.videoUrl}
                        controls
                        className="w-full mt-4 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
