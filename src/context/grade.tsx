'use client';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { firestore } from '@/lib/firebase';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
  Timestamp,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { UserContext } from './user';
import { calculateGpa } from '@/lib/gpa';

export type Weight = {
  unit: number;
  grade: string;
  courseCode: string;
};

export type Grade = {
  uid: string;
  level: string;
  semester: string;
  weights: Weight[];
  user: string;
  created: number;
  tnu: number;
  tcp: number;
};

type GradeObject = {
  grades: Grade[];
  lastGPA?: null | number;
  cgpa?: null | number;
  loading: boolean;
};

type SetGradesAction = {
  type: 'SET_GRADES';
  grades: Grade[];
};

type ClearGradesActions = {
  type: 'CLEAR_GRADES';
};

type SetLoadingAction = {
  type: 'SET_LOADING';
  loading: boolean;
};

type SetCGPA = {
  type: 'SET_CGPA';
  cgpa?: number | null;
};

type SetLastGPA = {
  type: 'SET_LAST_GPA';
  gpa?: number | null;
};

type ActionType =
  | SetGradesAction
  | ClearGradesActions
  | SetLoadingAction
  | SetLastGPA
  | SetCGPA;

const InitialState: GradeObject = {
  grades: [],
  lastGPA: null as null | number,
  cgpa: null as null | number,
  loading: true,
};

const GradeContext: React.Context<{
  grades: Grade[];
  loading: boolean;
  lastGPA: number | null;
  cgpa: number | null;
  setLoading: (loading: boolean) => void;
  setGrades: (grades: Grade[]) => void;
  clearGrades: () => void;
  getGrades: () => Promise<void>;
  createGrade: (grade: Partial<Grade>) => Promise<void>;
  updateGrade: (grade: Partial<Grade>) => Promise<void>;
}> = createContext({
  grades: [] as Grade[],
  loading: true as boolean,
  lastGPA: null as number | null,
  cgpa: null as number | null,
  setLoading: (_loading) => {},
  setGrades: (_grades: Grade[]) => {},
  clearGrades: () => {},
  getGrades: () => new Promise(() => {}),
  createGrade: (_grade) => new Promise(() => {}),
  updateGrade: (_grade) => new Promise(() => {}),
});

const GradeReducer = (state: GradeObject, action: ActionType): GradeObject => {
  switch (action.type) {
    case 'SET_GRADES':
      return {
        ...state,
        grades: action.grades,
      };

    case 'CLEAR_GRADES':
      return {
        ...state,
        grades: [],
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading,
      };

    case 'SET_CGPA':
      return {
        ...state,
        cgpa: action.cgpa,
      };

    case 'SET_LAST_GPA':
      return {
        ...state,
        lastGPA: action.gpa,
      };

    default:
      return state;
  }
};

const GradeProvider = (props: any) => {
  const [state, dispatch] = useReducer(GradeReducer, InitialState);
  const { user } = useContext(UserContext);

  const getGrades = async () => {
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      const gradesRef = collection(firestore, 'grades');
      const gradesQuery = query(
        gradesRef,
        where('user', '==', user?.uid),
        orderBy('created', 'desc'),
      );
      let grades: Grade[] = [];
      const documentSnapshot = await getDocs(gradesQuery);
      documentSnapshot.forEach((doc) => {
        if (doc?.data()) grades.push({ uid: doc.id, ...doc.data() } as Grade);
      });

      const totalTNU = grades.reduce((acc, curr) => (acc += curr?.tnu || 0), 0);
      const totalTCP = grades.reduce((acc, curr) => (acc += curr?.tcp || 0), 0);

      dispatch({
        type: 'SET_GRADES',
        grades,
      });

      dispatch({
        type: 'SET_CGPA',
        cgpa: totalTCP / (totalTNU || 1),
      });

      dispatch({
        type: 'SET_LAST_GPA',
        gpa: (grades?.[0]?.tcp || 0) / (grades?.[0]?.tnu || 1) || null,
      });
    } catch (error) {
      toast.error('Could not get grades. Pleas try again later.');
      console.error(error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  const clearGrades = () => dispatch({ type: 'CLEAR_GRADES' });

  const createGrade = async (grade: Partial<Grade>) => {
    try {
      const gradeRef = collection(firestore, 'grades');

      const existingGradeQuery = query(
        gradeRef,
        where('user', '==', user?.uid),
        where('semester', '==', grade.semester),
        where('level', '==', grade.level),
      );
      const existingGradeSnapshot = await getDocs(existingGradeQuery);
      if (!existingGradeSnapshot.empty) {
        throw new Error(
          `Result for level: ${grade.level} and semester: ${grade.semester} already exists.`,
        );
      }

      const { tnu, tcp } = calculateGpa(
        grade?.weights || [],
        user?.gradingSystem === '7.0' ? 7 : 5,
      );
      await addDoc(gradeRef, {
        ...grade,
        user: user?.uid,
        created: Timestamp.now(),
        tnu,
        tcp,
      });
      await getGrades();
    } catch (error) {
      throw error;
    }
  };

  const updateGrade = async (grade: Partial<Grade>) => {
    try {
      const gradeRef = doc(firestore, `grades/${grade.uid}`);
      const storedGrade = await getDoc(gradeRef);

      if (!storedGrade.exists()) {
        throw new Error(`Result does not exist or has been deleted.`);
      }

      const { tnu, tcp } = calculateGpa(
        grade?.weights || [],
        user?.gradingSystem === '7.0' ? 7 : 5,
      );

      await setDoc(gradeRef, {
        ...grade,
        user: user?.uid,
        updated: Timestamp.now(),
        tnu,
        tcp,
      });
      await getGrades();
    } catch (error) {
      throw error;
    }
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', loading });
  };

  const setGrades = (grades: Grade[]) => {
    dispatch({ type: 'SET_GRADES', grades });
  };

  useEffect(() => {
    if (state.grades.length === 0 && user?.uid) {
      getGrades();
    }
  }, [state.grades.length, user?.uid]);

  return (
    <GradeContext.Provider
      value={{
        grades: state.grades,
        lastGPA: state.lastGPA,
        cgpa: state.cgpa,
        loading: state.loading,
        getGrades,
        clearGrades,
        createGrade,
        updateGrade,
      }}
      {...props}
    />
  );
};

export { GradeContext, GradeProvider };
