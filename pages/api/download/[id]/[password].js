import { connectToDatabase } from "../../../../lib/mongo";
import ObjectID from "bson-objectid";

export default async function download(req, res) {
  const { db } = await connectToDatabase();

  const { id, password } = req.query;

  console.log(req.query);

  try {
    if (ObjectID.isValid(id)) {
      const details = await db.collection("aws_private").findOne({
        _id: ObjectID(id),
      });

      const isValid = await compare(password, details.password);

      if (isValid) {
        res.status(200).json({ details, success: true });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Passwords don't match" });
      }
    } else {
      res.status(500).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
