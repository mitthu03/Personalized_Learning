import { useEffect, useMemo, useState } from "react";
import { api, API_BASE } from "../api/client";

const AI_BASE = import.meta.env.VITE_AI_API_BASE_URL || "http://localhost:8001";

const sampleResume =
  "Python backend developer with 3 years of experience building Django REST Framework APIs, PostgreSQL schemas, JWT authentication, Docker deployments, and React dashboards.";
const sampleJob =
  "We need a Backend AI Engineer with Python, Django, FastAPI, Redis, Celery, PostgreSQL, vector database experience, LLM integrations, REST APIs, WebSocket updates, and testing discipline.";

export default function useAppController() {
  const [token, setToken] = useState(
    () => localStorage.getItem("accessToken") || "",
  );
  const [authMode, setAuthMode] = useState("login");
  const [auth, setAuth] = useState({ username: "", email: "", password: "" });
  const [form, setForm] = useState({
    resume_title: "My Resume",
    resume_text: sampleResume,
    job_title: "Backend AI Engineer",
    company: "Acme Learning",
    job_description: sampleJob,
    weeks: 8,
  });
  const [analysis, setAnalysis] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [paths, setPaths] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    function handleAuthExpired() {
      setToken("");
      setAnalysis(null);
      setError("Your session expired. Please log in again.");
    }

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => window.removeEventListener("auth-expired", handleAuthExpired);
  }, []);

  useEffect(() => {
    if (!token) {
      setPaths([]);
      setResumes([]);
      setJobs([]);
      return;
    }

    Promise.all([
      api("/paths/", { token }),
      api("/resumes/", { token }),
      api("/jobs/", { token }),
    ])
      .then(([savedPaths, savedResumes, savedJobs]) => {
        setPaths(savedPaths);
        setResumes(savedResumes);
        setJobs(savedJobs);
      })
      .catch((err) => setError(err.message));
  }, [token]);

  const readiness = useMemo(
    () => analysis?.readiness_percentage ?? 0,
    [analysis],
  );
  const latestPath = paths[0];
  const completedSteps = paths.reduce(
    (total, path) =>
      total +
      (path.steps?.filter((step) => step.status === "completed").length || 0),
    0,
  );

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await fetch(`${API_BASE}/auth/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: auth.username,
          password: auth.password,
        }),
      });
      if (!result.ok)
        throw new Error("Login failed. Check username and password.");
      const data = await result.json();
      localStorage.setItem("accessToken", data.access);
      setToken(data.access);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function register(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/users/", { method: "POST", body: JSON.stringify(auth) });
      await login(event);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function analyze(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        payload.append(key, value),
      );
      if (resumeFile) payload.append("resume_file", resumeFile);
      const data = await api("/analyze/", {
        method: "POST",
        token,
        body: payload,
      });
      setAnalysis(data);
      setPaths((current) => [
        data,
        ...current.filter((path) => path.id !== data.id),
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function uploadResume(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    setBusy(true);
    setError("");
    try {
      const payload = new FormData();
      payload.append("file", file);
      const result = await fetch(`${AI_BASE}/parse`, {
        method: "POST",
        body: payload,
      });
      if (!result.ok) {
        const data = await result.json().catch(() => ({}));
        throw new Error(data.detail || "Resume upload failed.");
      }
      const profile = await result.json();
      setForm((current) => ({
        ...current,
        resume_text: profile.raw_text || "",
      }));
      setResumeFileName(file.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function updateStep(stepId, status) {
    try {
      await api(`/path-steps/${stepId}/status/`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ status }),
      });
      const refreshed = await api(`/paths/${analysis.id}/`, { token });
      setAnalysis(refreshed);
      setPaths((current) =>
        current.map((path) => (path.id === refreshed.id ? refreshed : path)),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  function selectPath(path) {
    api(`/paths/${path.id}/`, { token })
      .then(setAnalysis)
      .catch((err) => setError(err.message));
  }

  function logout() {
    localStorage.removeItem("accessToken");
    setToken("");
    setAnalysis(null);
    setPaths([]);
    setResumes([]);
    setJobs([]);
    setActiveView("overview");
  }

  return {
    token,
    authMode,
    setAuthMode,
    auth,
    setAuth,
    form,
    setForm,
    analysis,
    busy,
    error,
    resumeFileName,
    paths,
    resumes,
    jobs,
    activeView,
    setActiveView,
    readiness,
    latestPath,
    completedSteps,
    login,
    register,
    analyze,
    uploadResume,
    updateStep,
    selectPath,
    logout,
  };
}
