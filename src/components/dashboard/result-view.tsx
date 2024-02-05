import { Grade } from '@/context/grade';
import React, { FC, useContext, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { sevenPointGrades, fivePointGrades } from '@/lib/constants';
import { Button } from '../ui/button';
import { UserContext } from '@/context/user';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import EditCGPAModal from './edit-gpa-modal';

const ResultViewer: FC<Grade & { className?: string }> = ({
  created,
  level,
  semester,
  tcp,
  tnu,
  uid,
  weights,
  user: userId,
  className,
}) => {
  const { user } = useContext(UserContext);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <AccordionItem
        value={uid}
        className={`flex w-full flex-col items-start justify-center space-y-3 self-stretch rounded-lg border border-input bg-background p-4 shadow-sm ${className ?? ''}`}
      >
        <AccordionTrigger className="flex w-full justify-between">
          <h2 className="mr-auto text-xl font-bold text-primary lg:text-2xl">
            {level} - {semester} Semester
          </h2>
        </AccordionTrigger>

        <AccordionContent className="flex !w-full flex-col space-y-3 overflow-hidden rounded-md border border-input bg-white">
          <div className="grid w-full grid-cols-[repeat(3,minmax(100px,1fr))] gap-2 bg-[#f2f4f8] px-2 py-4">
            <p className="text-sm font-semibold">Course Code</p>
            <p className="text-sm font-semibold">Grade</p>
            <p className="text-sm font-semibold">Course Unit</p>
          </div>

          {weights.map((item, index) => (
            <div
              key={index}
              className="grid w-full grid-cols-[repeat(3,minmax(100px,1fr))] gap-2 px-2"
            >
              <Input
                disabled
                name="courseCode"
                placeholder="CSC407"
                value={item.courseCode}
              />

              <Select disabled name="grade" value={item.grade}>
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
                disabled
                name="unit"
                value={item.unit}
                placeholder="3"
                type="number"
                max={12}
                min={0}
              />
            </div>
          ))}

          <div className="flex w-full items-center justify-between p-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase text-foreground/50">
                Calculated GPA
              </p>
              <h1 className="text-2xl font-bold lg:text-3xl">
                {((tcp || 0) / (tnu || 1)).toFixed(2)}
              </h1>
            </div>

            <Button
              variant="destructive"
              onClick={() => setShowEditModal(true)}
            >
              Update Result
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      <EditCGPAModal
        open={showEditModal}
        setOpen={setShowEditModal}
        grade={{
          created,
          level,
          semester,
          tcp,
          tnu,
          uid,
          weights,
          user: userId,
        }}
      />
    </>
  );
};

export default ResultViewer;
