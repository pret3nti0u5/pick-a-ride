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

  const { rideId, setOngoing, setCompleted } = req.body;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = user.id;

  const ride = await prisma.ride.findUnique({
    where: {
      id: rideId,
    },
  });

  if (!ride) {
    return res.status(404).json({ message: 'Ride not found' });
  }

  if (ride.userId !== userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // If set ongoing first make sure that the ride is not completed
    if (setOngoing) {
      if (ride.completed) {
        return res.status(400).json({ message: 'Ride already completed' });
      }

      await prisma.ride.update({
        where: {
          id: rideId,
        },
        data: {
          ongoing: true,
        },
      });
      return res.status(200).json({ message: 'Ride updated' });
    } else if (setCompleted) {
      await prisma.ride.update({
        where: {
          id: rideId,
        },
        data: {
          ongoing: false,
          completed: true,
        },
      });
      return res.status(200).json({ message: 'Ride updated' });
    } else {
      return res.status(400).json({ message: 'Bad request' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default handler;
