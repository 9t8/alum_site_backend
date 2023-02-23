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

	if (req.method !== "POST") {
		res.status(405).send({"message": "Illegal method"});
		return;
	}

	const body = JSON.parse(req.body);
	res.status(200).send(body);

  const bendover = {username: "Ben Dover", birthday: new Date(1980, 2, 14)};
  const ben = await User.create(bendover);
  const users = await User.findAll();
  const userArray = users.map(user => user.toJSON());
  res.status(200).json({users: userArray});
}
