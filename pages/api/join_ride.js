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
    include: {
      rides: true,
    },
  });

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { rideId } = req.body;
  const ride = await prisma.ride.findUnique({
    where: {
      id: rideId,
    },
  });

  if (!ride) {
    return res.status(404).json({ message: 'Ride not found' });
  }

  console.log(user.rides);

  // If the user is already a passenger, return an error
  const isPassenger = user.rides.find((ride) => ride.id === rideId);
  if (isPassenger) {
    return res.status(400).json({ message: 'Already a passenger' });
  }

  const userId = user.id;
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      rides: {
        connect: {
          id: rideId,
        },
      },
    },
  });

  // Reduce the number of seats available
  await prisma.ride.update({
    where: {
      id: rideId,
    },
    data: {
      passengersno: parseInt(ride.passengersno) - 1,
    },
  });

  res.status(200).json({ message: 'Joined ride' });
});

export default handler;
