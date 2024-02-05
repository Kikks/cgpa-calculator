'use client';
import { FormEvent, useContext, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Apple, GalleryThumbnailsIcon, Twitter } from 'lucide-react';
import { UserContext } from '@/context/user';
import { isEmpty, validateLoginPayload } from '@/lib/validators';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const initialState = {
  email: '',
  password: '',
};

export default function Login() {
  const router = useRouter();
  const [payload, setPayload] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const { loginWithEmailAndPassword } = useContext(UserContext);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    setPayload({
      ...payload,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setErrors(initialState);

    const { valid, errors: validationErrors } = validateLoginPayload(payload);

    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoggingIn(true);
    try {
      await loginWithEmailAndPassword(payload);
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

      if (error?.code === 'auth/invalid-credential') {
        toast.error('The email or password is invalid.');
        return;
      }

      if (error?.code === 'auth/too-many-requests') {
        toast.error(
          'Too many requests. Please try again later or reset your password.',
        );
        return;
      }

      console.log({ code: error?.code, message: error.message });
      toast.error('There was an error signing in. Please try again later.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="w-full space-y-7">
      <div className="flex w-full flex-col items-center space-y-1 text-center">
        <h1 className="text-4xl font-bold text-primary">Welcome</h1>
        <span>Please login to continue</span>
      </div>

      <form className="w-full space-y-5" onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            disabled={isLoggingIn}
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

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              disabled={isLoggingIn}
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

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="forgot-password" />
            <label
              htmlFor="forgot-password"
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>

          <Link href="/auth/forgot-password" className="text-sm text-primary">
            Forgot password?
          </Link>
        </div>

        <Button disabled={isLoggingIn} type="submit" className="!mt-7 w-full">
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <hr />

      <div className="w-full space-y-5">
        <p className="mx-auto text-center text-sm">Or login with:</p>

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
        <Link href="/auth/signup" className="text-sm text-primary" scroll>
          No account yet? Sign up
        </Link>
      </div>
    </div>
  );
}
