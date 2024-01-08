import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { createHandler } from '@/middleware/createHandler';
import prisma from '@/lib/prisma';
const handler = createHandler();

handler.post(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  const email = session ? session.user.email : '';
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = user.id;

  const {
    origin,
    destination,
    date,
    passengersno,
    driverName,
    carno,
    contact,
  } = req.body;

  try {
    const ride = await prisma.ride.create({
      data: {
        origin,
        destination,
        date,
        passengersno,
        driverName,
        carno,
        contact,
        userId,
        ongoing: false,
        completed: false,
      },
    });

    res.status(200).json(ride);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default handler;
