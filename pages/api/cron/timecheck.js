import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";
import aws from "aws-sdk";

export default async function download(req, res) {
  const { db } = await connectToDatabase();

  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersion: "v4",
  });

  try {
    const mongo = await db
      .collection("aws")
      .find({
        createdAt: {
          $lt: new Date(new Date() - 60 * 60 * 24 * 1000),
        },
      })
      .toArray();

    for (let i in mongo) {
      const s3 = new aws.S3();

      s3.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: mongo[i].filename,
        Expires: 60 * 60 * 24,
      });

      await db.collection("aws").deleteOne({ _id: ObjectID(mongo[i]._id) });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
}
