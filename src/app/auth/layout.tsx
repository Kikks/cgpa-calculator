export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white bg-cover bg-fixed bg-center bg-no-repeat p-0 md:bg-primary/60 md:bg-[url(/assets/images/auth-bg.png)] md:p-20">
      <div className="flex w-full flex-col items-center rounded-md bg-white p-5 py-10 md:w-[650px] md:p-10 lg:px-20">
        {children}
      </div>
    </main>
  );
}
