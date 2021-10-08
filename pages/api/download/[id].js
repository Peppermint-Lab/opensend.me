import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";

export default async function download(req, res) {
  const { db } = await connectToDatabase();

  const { id } = req.query;

  console.log(id);

  try {
    const details = await db.collection("aws").findOne({
      _id: ObjectID(id),
    });

    res.status(200).json({ details, sucess: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
