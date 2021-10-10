import aws from "aws-sdk";
import { connectToDatabase } from "../../lib/mongo";

export default async function upload(req, res) {
  const { db } = await connectToDatabase();

  console.log(process.env.REGION);

  try {
    aws.config.update({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
      region: "eu-west-2",
      signatureVersion: "v4",
    });

    const s3 = new aws.S3();

    const post = await s3.createPresignedPost({
      Bucket: process.env.BUCKET_NAME,
      Fields: {
        key: req.query.file,
      },
    });

    const file = await db.collection("aws").insertOne({
      url: post.url,
      filename: req.query.file,
      createdAt: new Date(),
    });

    console.log(post);

    res.status(200).json({
      url: post.url,
      fields: post.fields,
      message: "File was successfully uploaded",
      success: true,
      fileID: file.insertedId,
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
