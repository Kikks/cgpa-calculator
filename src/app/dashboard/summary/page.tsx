'use client';
import React, { useContext, useMemo, useState } from 'react';
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
import ResultViewer from '@/components/dashboard/result-view';
import { Accordion } from '@/components/ui/accordion';

export default function Summary() {
  const { user, loading } = useContext(UserContext);
  const { grades, cgpa, loading: gradesLoading } = useContext(GradeContext);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-6">
      <div className="col-span-1 md:col-span-6">
        <h1 className="text-xl font-bold text-primary lg:text-3xl">
          Grade Summary
        </h1>
      </div>

      {loading || gradesLoading ? (
        <>
          <Skeleton className="col-span-1 min-h-[250px] w-full bg-black/10 md:col-span-3" />
          <Skeleton className="col-span-1 min-h-[250px] w-full bg-black/10 md:col-span-3" />
          <Skeleton className="col-span-1 min-h-[200px] w-full bg-black/10 md:col-span-3" />
          <Skeleton className="col-span-1 min-h-[200px] w-full bg-black/10 md:col-span-3" />

          <Skeleton className="col-span-1 min-h-[350px] w-full bg-black/10 md:col-span-3 xl:col-span-6" />
          <Skeleton className="col-span-1 min-h-[350px] w-full bg-black/10 md:col-span-3 xl:col-span-6" />
          <Skeleton className="col-span-1 min-h-[350px] w-full bg-black/10 md:col-span-3 xl:col-span-6" />
        </>
      ) : (
        <>
          <CGPABarChart className="col-span-1 md:col-span-3" />

          <GradeDistribution className="col-span-1 md:col-span-3" />

          <DisplayCard
            className="col-span-1 md:col-span-3 xl:col-span-3"
            title="Grading System"
            subtitle="Your current grading system"
            Icon={Calculator}
            value={user?.gradingSystem || 'N/A'}
          />

          <DisplayCard
            className="col-span-1 md:col-span-3 xl:col-span-3"
            title="Current CGPA"
            subtitle="You Cumulative Grade Point Average"
            Icon={Calculator}
            value={cgpa?.toFixed(2) || 'N/A'}
          />

          <Accordion
            type="multiple"
            className="col-span-1 w-full space-y-5 md:col-span-6"
          >
            {grades.map((grade) => (
              <ResultViewer key={grade.uid} {...{ ...grade }} />
            ))}
          </Accordion>
        </>
      )}

      <CreateCGPAModal open={showCreateModal} setOpen={setShowCreateModal} />
    </div>
  );
}
