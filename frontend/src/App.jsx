import AuthView from "./components/AuthView";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import OverviewView from "./components/OverviewView";
import ResourceView from "./components/ResourceView";
import useAppController from "./hooks/useAppController";
import "./styles.css";

export default function App() {
  const controller = useAppController();
  const {
    token,
    authMode,
    setAuthMode,
    auth,
    setAuth,
    busy,
    error,
    activeView,
    setActiveView,
    paths,
    resumes,
    jobs,
    analysis,
    form,
    setForm,
    latestPath,
    completedSteps,
    readiness,
    resumeFileName,
    login,
    register,
    analyze,
    uploadResume,
    updateStep,
    selectPath,
    logout,
  } = controller;

  return (
    <main className="app-shell">
      <AppHeader
        token={token}
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={logout}
      />
      {error && <div className="error-banner">{error}</div>}
      {!token ? (
        <AuthView
          authMode={authMode}
          setAuthMode={setAuthMode}
          auth={auth}
          setAuth={setAuth}
          busy={busy}
          login={login}
          register={register}
        />
      ) : activeView === "overview" ? (
        <OverviewView
          paths={paths}
          resumes={resumes}
          jobs={jobs}
          latestPath={latestPath}
          completedSteps={completedSteps}
          analysis={analysis}
          readiness={readiness}
          form={form}
          setForm={setForm}
          resumeFileName={resumeFileName}
          uploadResume={uploadResume}
          analyze={analyze}
          busy={busy}
          updateStep={updateStep}
          onSelectPath={selectPath}
          onViewPaths={() => setActiveView("paths")}
        />
      ) : (
        <ResourceView
          activeView={activeView}
          resumes={resumes}
          jobs={jobs}
          paths={paths}
          analysis={analysis}
          onSelectPath={selectPath}
        />
      )}
      <AppFooter authenticated={Boolean(token)} />
    </main>
  );
}
