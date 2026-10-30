import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "@/app/RequireAuth";
import { RequireOnboarding } from "@/app/RequireOnboarding";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { ConfirmAccountPage } from "@/pages/ConfirmAccountPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { HomePage } from "@/pages/HomePage";
import { PatientsPage } from "@/pages/PatientsPage";
import { PatientFormPage } from "@/pages/PatientFormPage";
import { PatientChartPage } from "@/pages/PatientChartPage";
import { NewSessionPage } from "@/pages/NewSessionPage";
import { SessionPage } from "@/pages/SessionPage";
import { SessionsPage } from "@/pages/SessionsPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { ReportConfigurePage } from "@/pages/ReportConfigurePage";
import { ReportDetailPage } from "@/pages/ReportDetailPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AccountPage } from "@/pages/AccountPage";
import { PlanPage } from "@/pages/PlanPage";
import { ClinicPage } from "@/pages/ClinicPage";
import { ClinicTherapistsPage } from "@/pages/ClinicTherapistsPage";
import { InvitationsPage } from "@/pages/InvitationsPage";
import { AppShell } from "@/shared/ui/AppShell";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/entrar" element={<LoginPage />} />
      <Route path="/criar-conta" element={<SignupPage />} />
      <Route path="/recuperar-senha" element={<ResetPasswordPage />} />
      <Route path="/recuperar-senha/codigo" element={<ResetPasswordPage />} />
      <Route path="/recuperar-senha/nova" element={<ResetPasswordPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/confirmar-conta" element={<ConfirmAccountPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<RequireOnboarding />}>
          <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="/pacientes" element={<PatientsPage />} />
          <Route path="/pacientes/novo" element={<PatientFormPage />} />
          <Route path="/pacientes/:id" element={<PatientChartPage />} />
          <Route path="/pacientes/:id/editar" element={<PatientFormPage />} />
          <Route path="/sessoes" element={<SessionsPage />} />
          <Route path="/sessoes/nova" element={<NewSessionPage />} />
          <Route path="/sessoes/:id" element={<SessionPage />} />
          <Route path="/relatorios" element={<ReportsPage />} />
          <Route path="/relatorios/novo" element={<ReportConfigurePage />} />
          <Route path="/relatorios/:id" element={<ReportDetailPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="/configuracoes/conta" element={<AccountPage />} />
          <Route path="/configuracoes/plano" element={<PlanPage />} />
          <Route path="/configuracoes/clinica" element={<ClinicPage />} />
          <Route path="/configuracoes/terapeutas" element={<ClinicTherapistsPage />} />
          <Route path="/configuracoes/convites" element={<InvitationsPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
