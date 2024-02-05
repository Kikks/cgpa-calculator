'use client';
import { FormEvent, useContext, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Apple, GalleryThumbnailsIcon, Twitter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isEmpty, validateSignupPayload } from '@/lib/validators';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/user';
import toast from 'react-hot-toast';

const gradingSystems = [
  // { label: '4.0', value: '4.0' },
  { label: '5.0', value: '5.0' },
  { label: '7.0', value: '7.0' },
  // { label: '10.0', value: '10.0' },
];

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  school: '',
  password: '',
  confirmPassword: '',
  gradingSystem: '',
};

export default function Signup() {
  const router = useRouter();
  const { signupWithEmailAndPassword } = useContext(UserContext);
  const [payload, setPayload] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (
    event: FormEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setPayload({
      ...payload,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setErrors(initialState);

    const { valid, errors: validationErrors } = validateSignupPayload(payload);

    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await signupWithEmailAndPassword(payload);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error signing in: ', error);

      if (error?.code === 'auth/email-already-in-use') {
        toast.error('The email is already in use.');
        return;
      }

      if (error?.code === 'auth/invalid-email') {
        toast.error('The email is invalid.');
        return;
      }

      console.log({ code: error?.code, message: error.message });
      toast.error('There was an error signing in. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-7">
      <div className="flex w-full flex-col items-center space-y-1 text-center">
        <h1 className="text-4xl font-bold text-primary">Sign Up</h1>
        <span>Please fill in the form below to create an account.</span>
      </div>

      <form
        className="grid w-full grid-cols-1 gap-5 md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <div className="grid w-full grid-cols-1 items-center gap-1.5">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            disabled={isLoading}
            type="text"
            id="firstName"
            placeholder="Enter your last name"
            name="firstName"
            value={payload.firstName}
            onChange={handleChange}
          />
          {!isEmpty(errors.firstName) && (
            <span className="text-xs text-red-500">{errors.firstName}</span>
          )}
        </div>

        <div className="col-span-1 grid w-full items-center gap-1.5">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            disabled={isLoading}
            type="text"
            id="lastName"
            placeholder="Enter your last name"
            name="lastName"
            value={payload.lastName}
            onChange={handleChange}
          />
          {!isEmpty(errors.lastName) && (
            <span className="text-xs text-red-500">{errors.lastName}</span>
          )}
        </div>

        <div className="col-span-1 grid w-full items-center gap-1.5 md:col-span-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            disabled={isLoading}
            type="email"
            id="email"
            placeholder="example@email.com"
            name="email"
            value={payload.email}
            onChange={handleChange}
          />
          {!isEmpty(errors.email) && (
            <span className="text-xs text-red-500">{errors.email}</span>
          )}
        </div>

        <div className="col-span-1 grid w-full items-center gap-1.5 md:col-span-2">
          <Label htmlFor="school">School</Label>
          <Input
            disabled={isLoading}
            type="text"
            id="school"
            placeholder="Enter the name of your school"
            name="school"
            value={payload.school}
            onChange={handleChange}
          />
          {!isEmpty(errors.school) && (
            <span className="text-xs text-red-500">{errors.school}</span>
          )}
        </div>

        <div className="col-span-1 grid w-full items-center gap-1.5 md:col-span-2">
          <Label htmlFor="school">Grading System</Label>
          <Select
            disabled={isLoading}
            name="gradingSystem"
            value={payload.gradingSystem}
            onValueChange={(value) =>
              setPayload({
                ...payload,
                gradingSystem: value,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a grading system" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Grading Systems</SelectLabel>
                {gradingSystems.map((gradingSystem) => (
                  <SelectItem
                    key={gradingSystem.value}
                    value={gradingSystem.value}
                  >
                    {gradingSystem.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {!isEmpty(errors.gradingSystem) && (
            <span className="text-xs text-red-500">{errors.gradingSystem}</span>
          )}
        </div>

        <div className="col-span-1 grid w-full items-center gap-1.5 md:col-span-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              disabled={isLoading}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="********"
              name="password"
              value={payload.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-2 top-[50%] translate-y-[-50%]"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeClosedIcon fontSize={20} />
              ) : (
                <EyeOpenIcon fontSize={20} />
              )}
            </button>
          </div>
          {!isEmpty(errors.password) ? (
            <span className="text-xs text-red-500">{errors.password}</span>
          ) : (
            <span className="text-xs">
              It must be a combination of minimum 8 letters, numbers, and
              symbols.
            </span>
          )}
        </div>

        <div className="col-span-1 grid w-full items-center gap-1.5 md:col-span-2">
          <Label htmlFor="cofirm-password">Retype Password</Label>
          <div className="relative">
            <Input
              disabled={isLoading}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirm-password"
              placeholder="********"
              name="confirmPassword"
              value={payload.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-2 top-[50%] translate-y-[-50%]"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <EyeClosedIcon fontSize={20} />
              ) : (
                <EyeOpenIcon fontSize={20} />
              )}
            </button>
          </div>

          {!isEmpty(errors.confirmPassword) && (
            <span className="text-xs text-red-500">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <div className="col-span-1 flex w-full items-center justify-between md:col-span-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="forgot-password"
              checked={acceptedTerms}
              onClick={() => setAcceptedTerms((prev) => !prev)}
            />
            <label
              htmlFor="forgot-password"
              className="text-sm font-normal leading-none text-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I accept the terms and conditions of use.
            </label>
          </div>
        </div>

        <Button
          disabled={isLoading || !acceptedTerms}
          type="submit"
          className="col-span-1 !mt-7 w-full md:col-span-2"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>

      <hr />

      <div className="w-full space-y-5">
        <p className="mx-auto text-center text-sm">Or sign up with:</p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Button variant="outline" className="col-span-1">
            <GalleryThumbnailsIcon className="mr-3" />
            <span>Google</span>
          </Button>

          <Button variant="outline" className="col-span-1">
            <Apple className="mr-3" />
            <span>Apple</span>
          </Button>

          <Button variant="outline" className="col-span-1">
            <Twitter className="mr-3" />
            <span>Twitter</span>
          </Button>
        </div>
      </div>

      <hr />

      <div className="flex w-full items-center justify-center space-x-1 text-primary">
        <Link href="/auth/login" className="text-sm text-primary" scroll>
          Already have an account? Log In
        </Link>
      </div>
    </div>
  );
}
