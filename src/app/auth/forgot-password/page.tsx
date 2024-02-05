import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

export default function ForgotPassword() {
  return (
    <div className="w-full space-y-7">
      <div className="flex w-full flex-col items-center space-y-1 text-center">
        <h1 className="text-4xl font-bold text-primary">
          Forgotten your password?
        </h1>
        <span>
          There is nothing to worry about, we&apos;ll send you a message to help
          you reset your password.
        </span>
      </div>

      <div className="w-full space-y-5">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input type="email" id="email" placeholder="example@email.com" />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Send Reset Link
      </Button>
    </div>
  );
}
