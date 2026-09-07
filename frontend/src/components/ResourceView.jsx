import { useState } from "react";
import {
  BookOpenCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  FileText,
  MessageSquare,
  Route,
} from "lucide-react";
import { EmptyPage, PageHeading } from "./Shared";

export default function ResourceView({
  activeView,
  resumes,
  jobs,
  paths,
  analysis,
  onSelectPath,
}) {
  const [assessmentAnswers, setAssessmentAnswers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("assessmentAnswers") || "{}");
    } catch {
      return {};
    }
  });

  function saveAssessmentAnswer(question, answer) {
    const nextAnswers = { ...assessmentAnswers, [question]: answer };
    setAssessmentAnswers(nextAnswers);
    localStorage.setItem("assessmentAnswers", JSON.stringify(nextAnswers));
  }

  if (activeView === "assessment") {
    const questions =
      analysis?.assessment_questions || paths[0]?.assessment_questions || [];
    return (
      <section className="content-page">
        <PageHeading
          icon={<ClipboardCheck />}
          title="Skill assessment"
          description="Test the knowledge areas connected to your resume and target role."
        />
        {questions.length ? (
          <div className="question-grid">
            {questions.map((question, index) => (
              <article className="question-card" key={question}>
                <span>Assessment {index + 1}</span>
                <h3>{question}</h3>
                <textarea
                  className="assessment-answer"
                  value={assessmentAnswers[question] || ""}
                  onChange={(event) =>
                    setAssessmentAnswers({
                      ...assessmentAnswers,
                      [question]: event.target.value,
                    })
                  }
                  placeholder="Write your answer or learning notes..."
                />
                <button
                  className="ghost-button"
                  onClick={() =>
                    saveAssessmentAnswer(
                      question,
                      assessmentAnswers[question] || "",
                    )
                  }
                >
                  Save response
                </button>
              </article>
            ))}
          </div>
        ) : (
          <EmptyPage
            icon={<ClipboardCheck />}
            title="No assessment yet"
            text="Run an analysis to generate a skill assessment."
          />
        )}
      </section>
    );
  }

  if (activeView === "interview") {
    const questions =
      analysis?.interview_questions || paths[0]?.interview_questions || [];
    return (
      <section className="content-page">
        <PageHeading
          icon={<MessageSquare />}
          title="Interview preparation"
          description="Practice questions tailored to your latest target role and skill gaps."
        />
        {questions.length ? (
          <div className="question-grid">
            {questions.map((question, index) => (
              <article className="question-card" key={question}>
                <span>Question {index + 1}</span>
                <h3>{question}</h3>
                <p>
                  Use your own project experience and connect the answer to the
                  target role.
                </p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyPage
            icon={<MessageSquare />}
            title="No interview set yet"
            text="Run a career gap analysis to generate personalized questions."
          />
        )}
      </section>
    );
  }

  if (activeView === "paths") {
    return (
      <section className="content-page">
        <PageHeading
          icon={<BookOpenCheck />}
          title="Learning paths"
          description="Review every roadmap and continue building the skills your target roles require."
        />
        <div className="resource-grid">
          {paths.length ? (
            paths.map((path) => (
              <button
                className={
                  analysis?.id === path.id
                    ? "resource-card selected"
                    : "resource-card"
                }
                key={path.id}
                onClick={() => onSelectPath(path)}
              >
                <div className="resource-icon">
                  <Route size={20} />
                </div>
                <div>
                  <h3>{path.job_title || "Target role"}</h3>
                  <p>{path.missing_skills?.length || 0} skills to develop</p>
                </div>
                <strong>{path.readiness_percentage}%</strong>
              </button>
            ))
          ) : (
            <EmptyPage
              icon={<BookOpenCheck />}
              title="No learning paths yet"
              text="Start an analysis from Overview to create your first roadmap."
            />
          )}
        </div>
      </section>
    );
  }

  const items = activeView === "resumes" ? resumes : jobs;
  const isResume = activeView === "resumes";
  return (
    <section className="content-page">
      <PageHeading
        icon={isResume ? <FileText /> : <BriefcaseBusiness />}
        title={isResume ? "Resume library" : "Target jobs"}
        description={
          isResume
            ? "Your uploaded resumes and extracted skills."
            : "Job descriptions you have analyzed against your experience."
        }
      />
      <div className="resource-grid">
        {items.length ? (
          items.map((item) => (
            <article className="resource-card" key={item.id}>
              <div className="resource-icon">
                {isResume ? (
                  <FileText size={20} />
                ) : (
                  <BriefcaseBusiness size={20} />
                )}
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>
                  {isResume
                    ? `${item.extracted_skills?.length || 0} skills extracted`
                    : item.company || "Company not specified"}
                </p>
              </div>
              <span className="resource-date">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </article>
          ))
        ) : (
          <EmptyPage
            icon={isResume ? <FileText /> : <BriefcaseBusiness />}
            title={isResume ? "No resumes yet" : "No target jobs yet"}
            text="Complete an analysis from Overview to populate this library."
          />
        )}
      </div>
    </section>
  );
}
