'use client';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import React, { createContext, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { auth, firestore } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type User = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  school: string;
  gradingSystem: string;
};

type UserObject = {
  user: User | null;
  loading: boolean;
};

type LoginAction = {
  type: 'LOGIN';
  userData: User;
};

type LogoutAction = {
  type: 'LOGOUT';
};

type SetLoadingAction = {
  type: 'SET_LOADING';
  loading: boolean;
};

type ActionType = LoginAction | LogoutAction | SetLoadingAction;

const InitialState: UserObject = {
  user: null,
  loading: true,
};

const UserContext: React.Context<{
  user: User | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  loginWithEmailAndPassword: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<User>;
  signupWithEmailAndPassword: ({
    firstName,
    lastName,
    email,
    school,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    school: string;
    password: string;
  }) => Promise<User>;
  logout: () => void;
}> = createContext({
  user: null as User | null,
  loading: true as boolean,
  setLoading: (_loading) => {},
  loginWithEmailAndPassword: (_userData) => new Promise(() => {}),
  signupWithEmailAndPassword: (_userData) => new Promise(() => {}),
  logout: () => {},
});

const UserReducer = (state: UserObject, action: ActionType) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.userData,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading,
      };

    default:
      return state;
  }
};

const UserProvider = (props: any) => {
  const [state, dispatch] = useReducer(UserReducer, InitialState);

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', loading: true });

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        dispatch({ type: 'LOGOUT' });
        dispatch({ type: 'SET_LOADING', loading: false });
        return;
      }

      const userRef = doc(firestore, `users/${user.uid}`);
      const storedUser = await getDoc(userRef);

      if (!storedUser.exists()) {
        dispatch({ type: 'LOGOUT' });
        dispatch({ type: 'SET_LOADING', loading: false });
        return;
      }

      dispatch({
        type: 'LOGIN',
        userData: { ...storedUser.data(), uid: user.uid } as User,
      });
      dispatch({ type: 'SET_LOADING', loading: false });
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmailAndPassword = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const userRef = doc(firestore, `users/${user.uid}`);
      const storedUser = await getDoc(userRef);

      dispatch({
        type: 'LOGIN',
        userData: storedUser.data() as User,
      });
      return user;
    } catch (error: any) {
      throw error;
    }
  };

  const signupWithEmailAndPassword = async ({
    firstName,
    lastName,
    email,
    school,
    password,
    gradingSystem,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    school: string;
    password: string;
    gradingSystem: string;
  }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      const userRef = doc(firestore, `users/${user.uid}`);
      await setDoc(userRef, {
        uid: user.uid,
        firstName,
        lastName,
        email,
        school,
        gradingSystem,
      });

      const storedUser = await getDoc(userRef);

      dispatch({
        type: 'LOGIN',
        userData: storedUser.data() as User,
      });
      return user;
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error: any) {
      console.error('Error signing out: ', error);
      toast.error('There was an error signing out. Please try again later.');
    }
  };

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        loginWithEmailAndPassword,
        signupWithEmailAndPassword,
        logout,
      }}
      {...props}
    />
  );
};

export { UserContext, UserProvider };
