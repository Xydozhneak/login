import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET({ params }) {
    const { userId } = params;

    if (!userId) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    try {
        const userPosts = await prisma.post.findMany({
            where: {
                userId: userId,
            },
        });

        return NextResponse.json(userPosts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}