import { connectToDatabase } from "../../../lib/mongo";
import ObjectID from "bson-objectid";
import aws from "aws-sdk";

export default async function download(req, res) {
  const { db } = await connectToDatabase();

  const { id } = req.query;

  try {
    aws.config.update({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
      region: process.env.REGION,
      signatureVersion: "v4",
    });

    const s3 = new aws.S3();

    if (ObjectID.isValid(id)) {
      const details = await db.collection("aws").findOne({
        _id: ObjectID(id),
      });

      const url = s3.getSignedUrl("getObject", {
        Bucket: process.env.BUCKET_NAME,
        Key: details.filename,
        Expires: 60 * 60 * 24,
      });

      const { filename, size } = details

      res.status(200).json({ success: true, filename, size, url });
    } else {
      res.status(500).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
