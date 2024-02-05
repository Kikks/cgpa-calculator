'use client';
import React, { useContext, useState } from 'react';
import { UserContext } from '@/context/user';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import useMediaQuery from '@/hooks/useMediaQuery';
import DisplayCard from '@/components/dashboard/display-card';
import { Calculator } from 'lucide-react';
import CGPABarChart from '@/components/dashboard/cgpa-bar-chart';
import GradeDistribution from '@/components/dashboard/grade-distribution';
import { Skeleton } from '@/components/ui/skeleton';
import CreateCGPAModal from '@/components/dashboard/create-gpa-modal';
import { GradeContext } from '@/context/grade';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useContext(UserContext);
  const {
    grades,
    lastGPA,
    cgpa,
    loading: gradesLoading,
  } = useContext(GradeContext);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const largeScreen = useMediaQuery('(min-width: 1200px)');

  return (
    <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-6">
      <div className="col-span-1 flex flex-col space-y-5 overflow-hidden rounded-lg bg-[url(/assets/images/dashboard-bg.png)] bg-cover p-5 md:col-span-6 md:p-10 lg:p-14">
        <h1 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
          CGPA Calculator
        </h1>

        <p className="max-w-[50ch] text-white">
          Welcome,{' '}
          <span className="font-bold">
            {user?.firstName} {user?.lastName}.
          </span>{' '}
          <br />
          Start tracking your GPA and plan your academic success!
          <br />
          <br />
          What would you like to do today?
        </p>

        <div className="flex items-center space-x-3">
          {loading ? (
            <>
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </>
          ) : (
            <>
              <Button
                size={largeScreen ? 'lg' : 'sm'}
                variant="secondary"
                onClick={() => setShowCreateModal(true)}
              >
                Calculate CGPA
              </Button>
              <Button
                size={largeScreen ? 'lg' : 'sm'}
                variant="white-outline"
                onClick={() => router.push('/dashboard/summary')}
              >
                View Grade Summary
              </Button>
            </>
          )}
        </div>
      </div>

      {loading || gradesLoading ? (
        <>
          <Skeleton className="col-span-1 min-h-[150px] w-full bg-black/10 md:col-span-3 xl:col-span-2" />
          <Skeleton className="col-span-1 min-h-[150px] w-full bg-black/10 md:col-span-3 xl:col-span-2" />
          <Skeleton className="col-span-1 min-h-[150px] w-full bg-black/10 md:col-span-3 xl:col-span-2" />
          <Skeleton className="col-span-1 min-h-[250px] w-full bg-black/10 md:col-span-3" />
          <Skeleton className="col-span-1 min-h-[250px] w-full bg-black/10 md:col-span-3" />
        </>
      ) : (
        <>
          <DisplayCard
            className="col-span-1 md:col-span-3 xl:col-span-2"
            title="Grading System"
            subtitle="Your current grading system"
            Icon={Calculator}
            value={user?.gradingSystem || 'N/A'}
          />

          <DisplayCard
            className="col-span-1 md:col-span-3 xl:col-span-2"
            title="Last GPA"
            subtitle={`${grades?.[0]?.level} - ${grades?.[0]?.semester || '-'} Semester`}
            Icon={Calculator}
            value={lastGPA?.toFixed(2) || 'N/A'}
          />

          <DisplayCard
            className="col-span-1 md:col-span-3 xl:col-span-2"
            title="Current CGPA"
            subtitle="You Cumulative Grade Point Average"
            Icon={Calculator}
            value={cgpa?.toFixed(2) || 'N/A'}
          />

          <CGPABarChart className="col-span-1 md:col-span-3" />

          <GradeDistribution className="col-span-1 md:col-span-3" />
        </>
      )}

      <CreateCGPAModal open={showCreateModal} setOpen={setShowCreateModal} />
    </div>
  );
}
