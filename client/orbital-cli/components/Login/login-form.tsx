"use client"

import React from 'react';
import Image from 'next/image';
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card"
import { authClient } from "@/lib/auth-client"
import { useState } from "react";
import { useRouter } from 'next/navigation';
 
const LoginForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  

  // better-auth sign-in
  const logIn = () => {
        authClient.signIn.social({
          provider: "github",
          callbackURL: "http://localhost:3000" //we use callbackURL because we want to redirect the user back to localhost:3000
          //if not added you would be redirected to localhost:3005 which is the server since better-auth connects with the server
         })
  }

   return (
     <div className="flex flex-col gap-6 justify-center items-center">
        <div className='flex flex-col justify-center items-center space-y-6'>
          <Image src={"/login.svg"} alt="Login" height={500} width={500}/>
          <h1 className="text-6xl font-extrabold text-indigo-400">Welcome Back! to Orbital Cli</h1>
          <p className='text-base font-medium text-zinc-400'>Login to your account for allowing device flow</p>
        </div>

        <Card className='border-dashed border-2'>
          <CardContent>
            <div className='grid gap-6'>
              <div className='flex flex-col gap-4'>
                <Button 
                  variant={"outline"}
                  className="w-full h-full p-2"
                  type="button"
                  onClick={logIn}
                >
                  {/* we just use "/" when defining the image because we put the image in public folder */}
                  <Image src={'/github.svg'} alt="Github" height={16} width={16} className="size-4 dark:invert"/>
                  Continue With Github
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
     </div>
   )
 } 
  
 export default LoginForm;