export default function UtilsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full h-screen p-10">{children}</div>;
}
