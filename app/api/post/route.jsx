import prisma from '../../libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();
    const { text, userId } = body;

    if (!text || !userId) {
        return new NextResponse('Missing Fields', { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            posts: true,
        },
    });

    if (!user) {
        return new NextResponse('User not found', { status: 404 });
    }

    const post = await prisma.post.create({
        data: {
            userId,
            text,
        },
    });
    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            posts: {
                connect: {
                    id: post.id,
                },
            },
        },
        include: {
            posts: true,
        },
    });
    console.log("user with post", updatedUser);
    return NextResponse.json(updatedUser);
}

export async function GET(email) {
    try {
        const userPosts = await prisma.post.findMany({
            where: {
                email: email,
            },
        });

        return NextResponse.json(userPosts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}