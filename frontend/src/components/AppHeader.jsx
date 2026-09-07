import {
  BookOpenCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LogIn,
  MessageSquare,
} from "lucide-react";
import { Logo } from "./Shared";

const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "resumes", label: "Resumes", icon: FileText },
  { id: "jobs", label: "Jobs", icon: BriefcaseBusiness },
  { id: "paths", label: "Learning paths", icon: BookOpenCheck },
  { id: "interview", label: "Interview prep", icon: MessageSquare },
  { id: "assessment", label: "Assessment", icon: ClipboardCheck },
];

export default function AppHeader({ token, activeView, onNavigate, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <div className="brand-row">
          <Logo />
          <h1>SkillPath AI</h1>
        </div>
        <p>Resume analysis, tailored roadmaps, and interview readiness.</p>
      </div>
      {token && (
        <div className="topbar-actions">
          <nav className="main-nav" aria-label="Main navigation">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                className={activeView === id ? "active" : ""}
                onClick={() => onNavigate(id)}
                key={id}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </nav>
          <button className="ghost-button" onClick={onLogout}>
            <LogIn size={18} /> Sign out
          </button>
        </div>
      )}
    </header>
  );
}
