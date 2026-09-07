import { Logo } from "./Shared";

export default function AppFooter({ authenticated }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="brand-row">
            <Logo compact />
            <strong>SkillPath AI</strong>
          </div>
          <p>
            Build a focused plan from where you are to the role you want next.
          </p>
        </div>
        <div className="footer-column">
          <h3>Platform</h3>
          <span>Resume intake</span>
          <span>Skill-gap analysis</span>
          <span>Learning roadmaps</span>
        </div>
        <div className="footer-column">
          <h3>Progress</h3>
          <span>Readiness metrics</span>
          <span>Path tracking</span>
          <span>Interview preparation</span>
        </div>
        <div className="footer-column">
          <h3>Access</h3>
          <span>
            {authenticated
              ? "Authenticated workspace"
              : "Registration required"}
          </span>
          <span>PDF, DOCX, and TXT support</span>
          <span>Secure personal data views</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>SkillPath AI</span>
        <span>Career development workspace</span>
      </div>
    </footer>
  );
}
