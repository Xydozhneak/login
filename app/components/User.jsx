'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function User() {
    const { data: session } = useSession();
    const [data, setData] = useState({ text: '', userId: session?.user?.id });
    const createPost = async (e) => {
        e.preventDefault();
        axios.post('/api/post', data)
            .then(() => {
                toast.success('Post created');
                fetchUserPosts();
            })
            .catch(() => toast.error('Failed to create post'));   
    };

    const { user } = session;
    const posts = user.posts;

    return (
        <div>
            <div>
                <p>{user.name}</p>
                <p>{user.email}</p>
                <p>{user.address}</p>
            </div>
            <div className='mt-10 flex flex-col'>
                <input type='text' placeholder="Your post..." value={data.text} onChange={(e) => setData({ ...data, text: e.target.value })} />
                <button onClick={createPost} className='p-4 mx-3 border border-blue-400 bg-purple-400 text-white'>Create new post</button>
            </div>
            <h2 className='text-lg font-semibold'>Posts</h2>
            {posts.map((post) => (
                <div key={post.id}>
                    <p>{post.text}</p>
                </div>
            ))}
        </div>
    );
}
