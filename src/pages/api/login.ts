// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {User} from "@/db/models/test"

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const bendover = {username: "Ben Dover", birthday: new Date(1980, 2, 14)};
  const ben = await User.create(bendover);
  const users = await User.findAll();
  const userArray = users.map(user => user.toJSON());
  res.status(200).json({users: userArray});
  //res.status(200).json({ error: "EINVALIDCREDENTIALasdf", securityQuestion: "To prove you are human, please upload a proof of either P=NP or P≠NP." })
}
