import { connectToDatabase } from "../../lib/mongo";
import { hash, genSalt, compare } from "bcryptjs";

export default async function hash(req, res) {
  const { db } = await connectToDatabase();

  const { id, password } = req.body;

  try {
    const salt = await genSalt(12);
    if (!salt) return;
    const hashedPassword = await hash(password, salt);

    await db.collection("aws").updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Password linked to uploaded file"
    });
  } catch (error) {
    console.log(error);
    res.status(502);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
