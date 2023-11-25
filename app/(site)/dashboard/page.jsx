'use client'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react';

const dashboard = () => {
    const { data:session, status, update } = useSession();
    const [newName, setNewName] = useState('');
    console.log(session?.user);
  return (
    <div>
        <h1>Dashboard</h1>
        <p>Hi {session?.user?.name}</p>
        <p>Address {session?.user?.address}</p>
        <label> Update Name</label>
        <input  type='text' placeholder='enter new name' value = {newName} onChange={(e)=> setNewName(e.target.value)}/>
        <button onClick={()=> update({name:newName})}>Update</button>
        <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}

export default dashboard