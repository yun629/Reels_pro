"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface IVideo {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailURL: string;
  controls?: boolean;
  transformation?: {
    height?: number;
    width?: number;
    quality?: number;
  };
}

export default function VideosPage() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [form, setForm] = useState<IVideo>({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailURL: "",
    controls: true,
    transformation: { quality: 100 },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Fetch videos on load
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("Failed to fetch videos", err);
      }
    };

    fetchVideos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("transformation.")) {
      const key = name.split(".")[1] as keyof IVideo["transformation"];
      setForm((prev) => ({
        ...prev,
        transformation: {
          ...prev.transformation,
          [key]: Number(value),
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to upload video");
        return;
      }

      setVideos((prev) => [data, ...prev]);
      setForm({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailURL: "",
        controls: true,
        transformation: { quality: 100 },
      });
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Upload a Video</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="input input-bordered w-full"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="url"
          name="videoUrl"
          placeholder="Video URL"
          className="input input-bordered w-full"
          value={form.videoUrl}
          onChange={handleChange}
          required
        />

        <input
          type="url"
          name="thumbnailURL"
          placeholder="Thumbnail URL"
          className="input input-bordered w-full"
          value={form.thumbnailURL}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="transformation.quality"
          placeholder="Quality (default: 100)"
          className="input input-bordered w-full"
          value={form.transformation?.quality ?? ""}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">All Videos</h2>
      <div className="space-y-4">
        {videos.map((video, index) => (
          <div key={index} className="card card-bordered p-4">
            <h3 className="text-lg font-bold">{video.title}</h3>
            <p>{video.description}</p>
            <img
              src={video.thumbnailURL}
              alt={video.title}
              className="w-full h-auto mt-2 rounded-md"
            />
            <video
              src={video.videoUrl}
              controls
              className="mt-4 w-full rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
