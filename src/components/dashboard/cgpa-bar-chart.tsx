'use client';
import { GradeContext } from '@/context/grade';
import { ApexOptions } from 'apexcharts';
import { FC, useContext, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface CGPABarChartProps {
  className?: string;
}

const CGPABarChart: FC<CGPABarChartProps> = ({ className }) => {
  const { grades } = useContext(GradeContext);
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [xAxes, setXAxes] = useState<string[]>([]);

  const config: {
    options: ApexOptions;
  } = {
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: xAxes,
        title: {
          text: 'Levels',
        },
      },
      yaxis: {
        title: {
          text: 'Grade Points',
        },
        labels: {
          formatter: function (val: any) {
            return Number(val).toFixed(2);
          },
        },
      },
      legend: {
        position: 'top',
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return Number(val)?.toFixed(2);
          },
        },
      },
    },
  };

  useEffect(() => {
    if (grades) {
      const reverseGrades = grades.slice().reverse();

      const harmattan = reverseGrades.filter(
        (grade) => grade.semester === 'Harmattan',
      );
      const rain = reverseGrades.filter((grade) => grade.semester === 'Rain');
      setSeries([
        {
          name: 'Harmattan Semester',
          data: harmattan.map((grade) => (grade?.tcp || 0) / (grade?.tnu || 1)),
        },
        {
          name: 'Rain Semester',
          data: rain.map((grade) => (grade?.tcp || 0) / (grade?.tnu || 1)),
        },
      ]);
      setXAxes(harmattan.map((grade) => grade.level));
    }
  }, [grades]);

  return (
    <div
      className={`flex cursor-pointer flex-col items-start justify-center space-y-3 self-stretch rounded-lg border border-input bg-background p-4 shadow-sm ${className ?? ''}`}
    >
      <h3 className="text-xl font-semibold text-primary">CGPA Scale</h3>

      <div className="w-full flex-1 lg:min-h-[250px]">
        {series.length === 0 ? (
          <p className="my-auto text-center font-semibold text-foreground">
            No data yet.
          </p>
        ) : (
          <ReactApexChart
            options={{
              ...config.options,
            }}
            series={series}
            type="bar"
            height={350}
          />
        )}
      </div>
    </div>
  );
};

export default CGPABarChart;
