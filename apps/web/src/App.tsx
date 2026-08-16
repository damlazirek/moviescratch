import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { HomePage } from "@/pages/HomePage";
import { ListIntroPage } from "@/pages/ListIntroPage";
import { ListsPage } from "@/pages/ListsPage";
import { ScratchPage } from "@/pages/ScratchPage";
import { WatchedPage } from "@/pages/WatchedPage";

export default function App() {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="lists" element={<ListsPage />} />
            <Route path="lists/:listId" element={<ListIntroPage />} />
            <Route path="lists/:listId/scratch" element={<ScratchPage />} />
            <Route path="watched" element={<WatchedPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LocaleProvider>
  );
}
