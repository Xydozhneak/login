'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Start() {
    const router = useRouter();
  return (
    <div className=' mt-12'>
        <button className='p-4 mx-3 border border-blue-400 bg-blue-500 text-white' onClick={() => router.push('/login')}>Login</button>
        <button className='p-4 mx-3 border border-green-400 bg-green-500 text-white' onClick={() => router.push('/register')}>Register</button>

    </div>
  )
}
