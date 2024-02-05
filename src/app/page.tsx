'use client';
import Demo from '@/components/home/demo';
import { Button } from '@/components/ui/button';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const largeScreen = useMediaQuery('(min-width: 1200px)');

  return (
    <div className="w-full space-y-5">
      <div className="col-span-1 flex flex-col space-y-5 overflow-hidden bg-[#05007E] bg-[url(/assets/images/dashboard-bg.png)] bg-cover p-5 md:col-span-6 md:p-28 lg:p-36">
        <h1 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
          CGPA Calculator
        </h1>

        <p className="max-w-[50ch] text-white">
          Calculate and track your CGPA effortlessly with our user-friendly CGPA
          Calculator.
        </p>

        <div className="flex items-center space-x-3">
          <>
            <Button
              size={largeScreen ? 'lg' : 'sm'}
              className="lg:min-w-[150px]"
              variant="secondary"
              onClick={() => router.push('/auth/login')}
            >
              Get Started
            </Button>
            <Button
              size={largeScreen ? 'lg' : 'sm'}
              className="lg:min-w-[150px]"
              variant="white-outline"
              onClick={() => router.push('/#demo')}
            >
              Try Demo
            </Button>
          </>
        </div>
      </div>

      <div
        id="demo"
        className="mx-auto w-full max-w-7xl space-y-20 p-5 md:col-span-6 md:p-10 lg:p-36"
      >
        <div className="flex w-full flex-col items-center space-y-5">
          <h1 className="text-3xl font-bold text-primary">
            Demo GPA Calculator
          </h1>
          <span className="max-w-[60ch] text-center text-sm">
            Try out the GPA calculator to see how it works. You can add, remove
            and calculate your GPA. Sign up to save your grades and track your
            CGPA.
          </span>
        </div>
        <Demo />
      </div>
    </div>
  );
}
