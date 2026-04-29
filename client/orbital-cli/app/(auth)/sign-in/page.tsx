"use client"

import LoginForm from '@/components/Login/login-form'
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const LoginPage = () => {
      const {data, isPending} = authClient.useSession()
      const router = useRouter();
    
      // always remember useEffects run after the component has 
      // rendered(in other words useeEffects are the last to run so think of them as
      // behind the last return function)
      // use a useEffect to check if the user has been signed in
      useEffect(() => {
        if(!isPending && data?.session && data?.user){
          return router.push('/')
        }
      }, [data, isPending, router])


        if(isPending){
          return(
            <div className="flex flex-col items-center justify-center h-screen">
            <Spinner />
          </div>
          ) 
        }

        if(data?.session && data?.user){
            return null
        }
      
    
  return (
    <div>
        <>
            <LoginForm />
        </>
    </div>
  )
}

export default LoginPage