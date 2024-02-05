'use client';
import { GradeContext } from '@/context/grade';
import useMediaQuery from '@/hooks/useMediaQuery';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { FC, useContext, useEffect, useState } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface GradeDistributionProps {
  className?: string;
}

const GradeDistribution: FC<GradeDistributionProps> = ({ className }) => {
  const { grades } = useContext(GradeContext);

  const largeScreen = useMediaQuery('(min-width: 1200px)');
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const config: {
    options: ApexOptions;
  } = {
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
            },
          },
        },
      ],
      legend: {
        position: largeScreen ? 'right' : 'bottom',
      },
    },
  };

  useEffect(() => {
    const gradeMap = new Map<string, number>();

    for (let i = 0; i < grades.length; i++) {
      const grade = grades?.[i];

      if (!grade) continue;

      for (let j = 0; j < (grade?.weights || [])?.length; j++) {
        const weight = grade?.weights?.[j];

        if (!weight) continue;

        gradeMap.set(weight.grade, (gradeMap.get(weight.grade) || 0) + 1);
      }
    }

    setLabels(Array.from(gradeMap.keys()).map((item) => `- ${item}s`));
    setSeries(Array.from(gradeMap.values()));
  }, [grades]);

  return (
    <div
      className={`flex cursor-pointer flex-col items-start justify-center space-y-3 self-stretch rounded-lg border border-input bg-background p-4 shadow-sm ${className ?? ''}`}
    >
      <h3 className="text-xl font-semibold text-primary">Grade Distribution</h3>

      <div className="w-full flex-1 lg:min-h-[250px]">
        {series.length === 0 ? (
          <p className="my-40 text-center font-semibold text-foreground">
            No data yet.
          </p>
        ) : (
          <ReactApexChart
            options={{
              ...config.options,
            }}
            series={series}
            type="pie"
            height={300}
            width="100%"
          />
        )}
      </div>
    </div>
  );
};

export default GradeDistribution;
