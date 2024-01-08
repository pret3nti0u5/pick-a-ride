import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { createHandler } from '@/middleware/createHandler';
import prisma from '@/lib/prisma';
const handler = createHandler();

handler.post(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  const email = session ? session.user.email : '';

  const { origin, destination, date } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Find all rides that match the search criteria and are not published by the user
    const rides = await prisma.ride.findMany({
      where: {
        origin,
        destination,
        date,

        NOT: {
          OR: [
            {
              userId: user ? user.id : '0',
            },
            {
              completed: true,
            },
            {
              ongoing: true,
            },
          ],
        },
      },
      include: {
        user: true,
      },
    });
    res.status(200).json({ rides });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default handler;
