import { GradeContext } from '@/context/grade';
import { UserContext } from '@/context/user';
import { semesters, sevenPointGrades, fivePointGrades } from '@/lib/constants';
import { calculateGpa } from '@/lib/gpa';
import { isEmpty } from '@/lib/validators';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';
import { Trash2Icon } from 'lucide-react';
import React, { FormEvent, useContext, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const Demo = () => {
  const { user } = useContext(UserContext);
  const { createGrade } = useContext(GradeContext);
  const [level, setLevel] = useState('');
  const [semester, setSemester] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState<
    {
      courseCode: string;
      grade: string;
      unit: string;
      [key: string]: string;
    }[]
  >([
    {
      courseCode: '',
      grade: '',
      unit: '',
    },
  ]);

  const handleChange = (
    index: number,
    event: FormEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.currentTarget;
    const list = [...payload];
    list[index][name] = value;
    setPayload(list);
  };

  const gpa = useMemo(() => {
    return calculateGpa(payload, user?.gradingSystem === '7.0' ? 7 : 5);
  }, [payload, user?.gradingSystem]);

  const handleDelete = (index: number) => {
    const list = [...payload];
    list.splice(index, 1);
    setPayload(list);
  };

  const handleAdd = () => {
    setPayload([...payload, { courseCode: '', grade: '', unit: '' }]);
  };

  const handleCreateGPA = async () => {
    setIsLoading(true);

    try {
      await createGrade({
        level,
        semester,
        weights: payload.map((item) => ({
          courseCode: item.courseCode,
          grade: item.grade,
          unit: Number(item.unit),
        })),
      });

      setLevel('');
      setSemester('');
      setPayload([
        {
          courseCode: '',
          grade: '',
          unit: '',
        },
      ]);
      toast.success('GPA record created successfully.');
    } catch (error: any) {
      toast.error(
        error?.message ??
          'Could not create GPA record. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const disableAdd = payload.some(
    (item) =>
      isEmpty(item.courseCode) || isEmpty(item.grade) || isEmpty(item.unit),
  );

  const disableSubmit = disableAdd || isEmpty(level) || isEmpty(semester);

  return (
    <div className="max-h-[70vh] w-full space-y-4 overflow-y-auto px-2 py-4">
      <div className="grid w-full grid-cols-[repeat(3,minmax(100px,1fr))_50px] gap-2">
        <p className="text-sm font-semibold">Course Code</p>
        <p className="text-sm font-semibold">Grade</p>
        <p className="text-sm font-semibold">Course Unit</p>
      </div>

      {payload.map((item, index) => (
        <div
          key={index}
          className="grid w-full grid-cols-[repeat(3,minmax(100px,1fr))_50px] gap-2"
        >
          <Input
            disabled={isLoading}
            name="courseCode"
            placeholder="CSC407"
            value={item.courseCode}
            onChange={(e) => handleChange(index, e)}
          />

          <Select
            disabled={isLoading}
            name="grade"
            value={item.grade}
            onValueChange={(e: any) =>
              handleChange(index, {
                // @ts-ignore
                currentTarget: {
                  name: 'grade',
                  value: e,
                },
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Grades</SelectLabel>
                {(user?.gradingSystem === '7.0'
                  ? sevenPointGrades
                  : fivePointGrades
                ).map((gradingSystem) => (
                  <SelectItem
                    key={gradingSystem.grade}
                    value={gradingSystem.grade}
                  >
                    {gradingSystem.grade}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            disabled={isLoading}
            name="unit"
            value={item.unit}
            placeholder="3"
            type="number"
            max={12}
            min={0}
            onChange={(e) => handleChange(index, e)}
          />

          {payload.length > 1 && (
            <Button
              disabled={isLoading}
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(index)}
            >
              <Trash2Icon className="text-destructive" />
            </Button>
          )}
        </div>
      ))}

      <div className="flex w-full items-center justify-between">
        <Button
          variant="outline"
          onClick={handleAdd}
          className="justify-self-start"
          disabled={disableAdd || isLoading}
        >
          Add Course
        </Button>

        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase text-foreground/50">
            Calculated GPA
          </p>
          <h1 className="text-2xl font-bold lg:text-3xl">
            {gpa.gpa.toFixed(2)}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Demo;
