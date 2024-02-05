'use client';
import { FC, FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2Icon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserContext } from '@/context/user';
import { fivePointGrades, semesters, sevenPointGrades } from '@/lib/constants';
import { isEmpty } from '@/lib/validators';
import { calculateGpa } from '@/lib/gpa';
import toast from 'react-hot-toast';
import { Grade, GradeContext } from '@/context/grade';

interface CreateCGPAModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  grade: Grade;
}

const EditCGPAModal: FC<CreateCGPAModalProps> = ({ open, setOpen, grade }) => {
  const { user } = useContext(UserContext);
  const { updateGrade } = useContext(GradeContext);
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

  const handleEditGPA = async () => {
    setIsLoading(true);

    try {
      await updateGrade({
        ...grade,
        level,
        semester,
        weights: payload.map((item) => ({
          courseCode: item.courseCode,
          grade: item.grade,
          unit: Number(item.unit),
        })),
      });

      setOpen(false);
      setLevel('');
      setSemester('');
      setPayload([
        {
          courseCode: '',
          grade: '',
          unit: '',
        },
      ]);
      toast.success('GPA record editted successfully.');
    } catch (error: any) {
      toast.error(
        error?.message ??
          'Could not create GPA record. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (grade?.weights) {
      setPayload(
        grade?.weights?.map((item) => ({
          ...item,
          unit: String(item.unit),
        })) || [],
      );
      setLevel(grade.level);
      setSemester(grade.semester);
    }
  }, [grade?.weights]);

  const disableAdd = payload.some(
    (item) =>
      isEmpty(item.courseCode) || isEmpty(item.grade) || isEmpty(item.unit),
  );

  const disableSubmit = disableAdd || isEmpty(level) || isEmpty(semester);

  return (
    <Dialog open={open} onOpenChange={isLoading ? () => {} : setOpen}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Calculate CGPA</DialogTitle>
          <DialogDescription>
            Fill in the form below to calculate your CGPA.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] w-full space-y-4 overflow-y-auto px-2 py-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-1 grid w-full items-center gap-1.5">
              <Label htmlFor="level">Level</Label>
              <Input
                disabled={isLoading}
                type="text"
                id="level"
                placeholder="100 Level"
                name="level"
                value={level}
                onChange={(e) => setLevel(e.currentTarget.value)}
              />
            </div>

            <div className="col-span-1 grid w-full items-center gap-1.5">
              <Label htmlFor="school">Semester</Label>
              <Select
                disabled={isLoading}
                name="semester"
                value={semester}
                onValueChange={(value) => setSemester(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Semesters</SelectLabel>
                    {semesters.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <hr className="!my-7" />

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

          <Button
            variant="outline"
            onClick={handleAdd}
            className="justify-self-start"
            disabled={disableAdd || isLoading}
          >
            Add Course
          </Button>
        </div>

        <DialogFooter className="w-full flex-row items-center justify-between space-x-3 sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase text-foreground/50">
              Calculated GPA
            </p>
            <h1 className="text-2xl font-bold lg:text-3xl">
              {gpa.gpa.toFixed(2)}
            </h1>
          </div>

          <Button
            size="lg"
            type="submit"
            disabled={disableSubmit || isLoading}
            onClick={handleEditGPA}
          >
            {isLoading ? 'Updating' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCGPAModal;
