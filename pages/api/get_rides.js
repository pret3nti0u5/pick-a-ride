import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { createHandler } from '@/middleware/createHandler';
import prisma from '@/lib/prisma';
const handler = createHandler();

handler.get(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  const email = session ? session.user.email : '';

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      rides: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found!' });
  }
  return res.status(200).json(user);
});

export default handler;
