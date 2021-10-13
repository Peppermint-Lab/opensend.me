import aws from "aws-sdk";
import { connectToDatabase } from "../../lib/mongo";

export default async function upload(req, res) {
  const { db } = await connectToDatabase();


  try {
    aws.config.update({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
      region: process.env.REGION,
      signatureVersion: "v4",
    });

    const { file, size, type } = req.query;

    const s3 = new aws.S3();

    const post = await s3.createPresignedPost({
      Bucket: process.env.BUCKET_NAME,
      Fields: {
        key: file,
      },
    });

    const newFile = await db.collection("aws").insertOne({
      filename: file,
      size: size,
      type: type,
      createdAt: new Date(),
    });

    res.status(200).json({
      url: post.url,
      fields: post.fields,
      message: "File was successfully uploaded",
      success: true,
      fileID: newFile.insertedId,
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
