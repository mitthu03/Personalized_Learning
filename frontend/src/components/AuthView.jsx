import {
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  FileText,
  LayoutDashboard,
  LogIn,
  MessageSquare,
  Target,
  TrendingUp,
  UserPlus,
  Loader2,
} from "lucide-react";
import { FeatureCard } from "./Shared";

export default function AuthView({
  authMode,
  setAuthMode,
  auth,
  setAuth,
  busy,
  login,
  register,
}) {
  return (
    <section className="public-dashboard">
      <div className="public-dashboard-intro">
        <div className="landing-hero">
          <span className="eyebrow">
            AI-powered career development platform
          </span>
          <h2>Turn your career goal into a clear learning path.</h2>
          <p>
            Analyze your resume against a target role, discover missing skills,
            build a sequenced roadmap, and prepare for interviews in one focused
            workspace.
          </p>
          <div className="landing-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => setAuthMode("register")}
            >
              <UserPlus size={18} /> Create your account
            </button>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setAuthMode("login")}
            >
              <LogIn size={18} /> Sign in
            </button>
          </div>
        </div>
        <div className="landing-section-heading">
          <LayoutDashboard size={20} />
          <h3>Everything needed to move toward your target role</h3>
        </div>
        <div className="feature-grid">
          <FeatureCard
            icon={<FileText />}
            title="Resume & job intake"
            text="Upload a PDF or DOCX resume and provide the job description you want to target."
            onClick={() => setAuthMode("register")}
          />
          <FeatureCard
            icon={<BriefcaseBusiness />}
            title="AI skill extraction"
            text="Structure experience, technologies, roles, and requirements from your documents."
            onClick={() => setAuthMode("register")}
          />
          <FeatureCard
            icon={<Target />}
            title="Skill-gap matching"
            text="See matched skills, missing skills, extra strengths, and an overall match score."
            onClick={() => setAuthMode("register")}
          />
          <FeatureCard
            icon={<BookOpenCheck />}
            title="Adaptive learning path"
            text="Get a week-by-week roadmap sequenced around dependencies and missing skills."
            onClick={() => setAuthMode("register")}
          />
          <FeatureCard
            icon={<TrendingUp />}
            title="Progress & readiness"
            text="Mark roadmap steps complete and watch your readiness percentage improve."
            onClick={() => setAuthMode("register")}
          />
          <FeatureCard
            icon={<MessageSquare />}
            title="Interview preparation"
            text="Practice personalized questions based on your target job and skill gaps."
            onClick={() => setAuthMode("register")}
          />
        </div>
        <div className="workflow-strip">
          <strong>How it works</strong>
          <span>1. Register</span>
          <span>2. Upload your resume</span>
          <span>3. Add a target job</span>
          <span>4. Follow your roadmap</span>
        </div>
        <div className="audience-strip">
          <div>
            <strong>For individual learners</strong>
            <span>
              Start with a free resume ATS check and unlock personalized
              guidance.
            </span>
          </div>
          <div>
            <strong>For schools and training teams</strong>
            <span>
              Support students and cohorts with measurable skill development.
            </span>
          </div>
        </div>
      </div>
      <form
        className="panel auth-panel"
        onSubmit={authMode === "login" ? login : register}
      >
        <div className="auth-panel-heading">
          <span className="eyebrow">Member access</span>
          <h2>
            {authMode === "login" ? "Welcome back" : "Start your career plan"}
          </h2>
          <p>
            {authMode === "login"
              ? "Sign in to continue your saved analyses and learning progress."
              : "Create a free account to unlock the complete platform workspace."}
          </p>
        </div>
        <div className="segmented">
          <button
            type="button"
            className={authMode === "login" ? "active" : ""}
            onClick={() => setAuthMode("login")}
          >
            <LogIn size={16} /> Login
          </button>
          <button
            type="button"
            className={authMode === "register" ? "active" : ""}
            onClick={() => setAuthMode("register")}
          >
            <UserPlus size={16} /> Register
          </button>
        </div>
        <label>
          Username
          <input
            value={auth.username}
            onChange={(event) =>
              setAuth({ ...auth, username: event.target.value })
            }
            required
          />
        </label>
        {authMode === "register" && (
          <label>
            Email
            <input
              type="email"
              value={auth.email}
              onChange={(event) =>
                setAuth({ ...auth, email: event.target.value })
              }
            />
          </label>
        )}
        <label>
          Password
          <input
            type="password"
            value={auth.password}
            onChange={(event) =>
              setAuth({ ...auth, password: event.target.value })
            }
            required
          />
        </label>
        <button className="primary-button" disabled={busy}>
          {busy ? (
            <Loader2 className="spin" size={18} />
          ) : authMode === "login" ? (
            <LogIn size={18} />
          ) : (
            <UserPlus size={18} />
          )}
          {authMode === "login" ? "Login" : "Create account"}
        </button>
        <div className="auth-panel-note">
          <Check size={16} />
          <span>
            Your personal resumes, target jobs, roadmaps, and readiness data
            stay inside your account.
          </span>
        </div>
      </form>
    </section>
  );
}
