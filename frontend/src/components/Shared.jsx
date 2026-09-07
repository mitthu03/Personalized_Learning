import { GraduationCap } from "lucide-react";

export function Logo({ compact = false }) {
  return (
    <span
      className={compact ? "logo-mark compact" : "logo-mark"}
      aria-label="SkillPath AI logo"
    >
      <GraduationCap size={compact ? 18 : 24} />
    </span>
  );
}

export function FeatureCard({ icon, title, text, onClick }) {
  return (
    <button type="button" className="feature-card" onClick={onClick}>
      <span className="resource-icon">{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </button>
  );
}

export function PageHeading({ icon, title, description }) {
  return (
    <div className="page-heading">
      <div className="panel-heading">
        {icon}
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
    </div>
  );
}

export function EmptyPage({ icon, title, text }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{icon}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

export function Metric({ icon, label, value }) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function SkillGroup({ title, skills, tone }) {
  return (
    <div className="skill-group">
      <h3>{title}</h3>
      <div className="chips">
        {(skills.length ? skills : ["None detected"]).map((skill) => (
          <span className={`chip ${tone}`} key={skill}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
