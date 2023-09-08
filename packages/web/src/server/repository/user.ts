import { prisma } from '@/features/database/prismaClient';

export const findUserById = async (id: string) => {
  const user = await prisma.users.findUnique({
    where: {
      id,
    },
  });

  return user;
};
