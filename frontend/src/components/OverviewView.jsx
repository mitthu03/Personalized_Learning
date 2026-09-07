import {
  BarChart3,
  BookOpenCheck,
  Check,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
} from "lucide-react";
import { Metric, SkillGroup } from "./Shared";

export default function OverviewView({
  paths,
  resumes,
  jobs,
  latestPath,
  completedSteps,
  analysis,
  readiness,
  form,
  setForm,
  resumeFileName,
  uploadResume,
  analyze,
  busy,
  updateStep,
  onSelectPath,
  onViewPaths,
}) {
  return (
    <>
      <section className="dashboard-panel">
        <div className="dashboard-heading">
          <div>
            <div className="panel-heading">
              <LayoutDashboard size={22} />
              <h2>Learning &amp; assessment dashboard</h2>
            </div>
            <p>
              Track your job readiness and keep every learning path in one
              place.
            </p>
          </div>
          <div className="dashboard-count">
            <strong>{paths.length}</strong>
            <span>saved paths</span>
          </div>
        </div>
        <div className="dashboard-metrics">
          <Metric
            icon={<Target />}
            label="Latest match"
            value={`${latestPath?.match_score ?? 0}%`}
          />
          <Metric
            icon={<TrendingUp />}
            label="Readiness"
            value={`${latestPath?.readiness_percentage ?? 0}%`}
          />
          <Metric
            icon={<BookOpenCheck />}
            label="Completed steps"
            value={completedSteps}
          />
        </div>
        <div className="dashboard-summary">
          <div className="summary-copy">
            <span>Workspace activity</span>
            <strong>
              {resumes.length} resumes · {jobs.length} target jobs
            </strong>
            <p>
              {latestPath
                ? `Your latest plan targets ${latestPath.job_title || "your selected role"}.`
                : "Create your first analysis to start building a personalized plan."}
            </p>
          </div>
          <div className="progress-track">
            <span
              style={{ width: `${latestPath?.readiness_percentage ?? 0}%` }}
            />
          </div>
          <div className="summary-actions">
            <button
              className="primary-button"
              onClick={() =>
                document
                  .querySelector(".intake-panel")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Create analysis
            </button>
            <button className="ghost-button" onClick={onViewPaths}>
              View learning paths
            </button>
          </div>
        </div>
        {latestPath && (
          <div className="dashboard-insights">
            <div>
              <span className="history-label">ATS resume score</span>
              <strong>{latestPath.ats_score ?? latestPath.match_score}%</strong>
              <p>
                {latestPath.ats_feedback?.[0] ||
                  "Review your resume alignment with the target role."}
              </p>
            </div>
            <div>
              <span className="history-label">Suggested roles</span>
              <div className="chips">
                {(latestPath.suggested_roles || []).map((role) => (
                  <span className="chip neutral" key={role}>
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        {paths.length > 0 && (
          <div className="path-history">
            <span className="history-label">Recent paths</span>
            {paths.slice(0, 4).map((path) => (
              <button
                className={
                  analysis?.id === path.id ? "path-item active" : "path-item"
                }
                key={path.id}
                onClick={() => onSelectPath(path)}
              >
                <span>{path.job_title || "Untitled role"}</span>
                <strong>{path.readiness_percentage}% ready</strong>
              </button>
            ))}
          </div>
        )}
      </section>
      <section className="workspace-grid">
        <form className="panel intake-panel" onSubmit={analyze}>
          <div className="panel-heading">
            <ClipboardList size={22} />
            <h2>Intake</h2>
          </div>
          <div className="two-col">
            <label>
              Resume title
              <input
                value={form.resume_title}
                onChange={(event) =>
                  setForm({ ...form, resume_title: event.target.value })
                }
              />
            </label>
            <label>
              Target role
              <input
                value={form.job_title}
                onChange={(event) =>
                  setForm({ ...form, job_title: event.target.value })
                }
                required
              />
            </label>
          </div>
          <div className="two-col">
            <label>
              Company
              <input
                value={form.company}
                onChange={(event) =>
                  setForm({ ...form, company: event.target.value })
                }
              />
            </label>
            <label>
              Roadmap weeks
              <input
                type="number"
                min="1"
                max="26"
                value={form.weeks}
                onChange={(event) =>
                  setForm({ ...form, weeks: Number(event.target.value) })
                }
              />
            </label>
          </div>
          <label>
            Resume text
            <span className="file-upload">
              <Upload size={18} />
              <span>{resumeFileName || "Upload PDF, DOCX, or TXT"}</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={uploadResume}
              />
            </span>
            <textarea
              value={form.resume_text}
              onChange={(event) =>
                setForm({ ...form, resume_text: event.target.value })
              }
              required
            />
          </label>
          <label>
            Job description
            <textarea
              value={form.job_description}
              onChange={(event) =>
                setForm({ ...form, job_description: event.target.value })
              }
              required
            />
          </label>
          <button className="primary-button" disabled={busy}>
            {busy ? (
              <Loader2 className="spin" size={18} />
            ) : (
              <Sparkles size={18} />
            )}
            Run analysis
          </button>
        </form>
        <section className="results-stack">
          <div className="metric-band">
            <Metric
              icon={<Target />}
              label="Match"
              value={`${analysis?.match_score ?? 0}%`}
            />
            <Metric
              icon={<BarChart3 />}
              label="Readiness"
              value={`${readiness}%`}
            />
            <Metric
              icon={<BookOpenCheck />}
              label="Steps"
              value={analysis?.steps?.length ?? 0}
            />
          </div>
          {analysis ? (
            <>
              <div className="panel">
                <div className="panel-heading">
                  <Target size={22} />
                  <h2>Skill Gap</h2>
                </div>
                <p className="analysis-text">{analysis.analysis}</p>
                <SkillGroup
                  title="Matched"
                  skills={analysis.matched_skills}
                  tone="good"
                />
                <SkillGroup
                  title="Missing"
                  skills={analysis.missing_skills}
                  tone="warn"
                />
                <SkillGroup
                  title="Extra"
                  skills={analysis.extra_skills}
                  tone="neutral"
                />
              </div>
              <div className="panel">
                <div className="panel-heading">
                  <BookOpenCheck size={22} />
                  <h2>Learning Roadmap</h2>
                </div>
                <div className="steps">
                  {analysis.steps.map((step) => (
                    <article className="step-card" key={step.id}>
                      <div>
                        <span className="week">Week {step.week}</span>
                        <h3>{step.title}</h3>
                        <p>{step.objective}</p>
                        <p className="project">{step.project}</p>
                        <div className="step-resources">
                          {step.resources?.map((resource) =>
                            resource.url ? (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noreferrer"
                                key={resource.title}
                              >
                                {resource.title}
                              </a>
                            ) : (
                              <span key={resource.title}>{resource.title}</span>
                            ),
                          )}
                        </div>
                      </div>
                      <button
                        className={
                          step.status === "completed"
                            ? "complete-button done"
                            : "complete-button"
                        }
                        onClick={() =>
                          updateStep(
                            step.id,
                            step.status === "completed"
                              ? "pending"
                              : "completed",
                          )
                        }
                      >
                        <Check size={16} />{" "}
                        {step.status === "completed" ? "Done" : "Mark done"}
                      </button>
                    </article>
                  ))}
                </div>
              </div>
              <div className="panel">
                <div className="panel-heading">
                  <ClipboardList size={22} />
                  <h2>Interview Prep</h2>
                </div>
                <ul className="question-list">
                  {analysis.interview_questions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Sparkles size={38} />
              <h2>No analysis yet</h2>
              <p>Submit the intake form to generate a personalized path.</p>
            </div>
          )}
        </section>
      </section>
    </>
  );
}
