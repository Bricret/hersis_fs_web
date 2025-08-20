import { MainSideBar } from "@/presentation/components/ui/main-sidebar";
import { SidebarProvider } from "@/presentation/components/ui/sidebar";
import { Providers } from "@/presentation/providers/QueryProvider";
import { ProtectedRoute } from "@/presentation/components/common/ProtectedRoute";
import { NotificationProvider } from "@/presentation/providers/NotificationProvider";

export default function MainPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <ProtectedRoute>
        <NotificationProvider>
          <div className="flex h-screen w-full">
            <MainSideBar />
            <Providers>{children}</Providers>
          </div>
        </NotificationProvider>
      </ProtectedRoute>
    </SidebarProvider>
  );
}
