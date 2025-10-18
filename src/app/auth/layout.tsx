import OmniAuthLeftSide from "@/components/OmniAuthLeftSide";
import OmniAuthRightSide from "@/components/OmniAuthRightSide";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid h-screen lg:grid-cols-2">
      <OmniAuthLeftSide>{children}</OmniAuthLeftSide>
      <OmniAuthRightSide />
    </main>
  );
}
