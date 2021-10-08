import aws from "aws-sdk";
import { connectToDatabase } from "../../lib/mongo";

const formidable = require("formidable");
const fs = require("fs");

export default async function upload(req, res) {
  const { db } = await connectToDatabase();

  try {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      aws.config.update({
        accessKeyId: "AKIA35J4CBUCYZRNPC5T",
        secretAccessKey: "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",
        signatureVersion: "v4",
        region: "eu-west-2",
      });

      const s3 = new aws.S3();
      const params = {
        Bucket: "lon.opensend.me", // pass your bucket name
        Key: String(files.file.name), // file will be saved as testBucket/contacts.csv
        Body: fs.createReadStream(files.file.path),
      };

      s3.upload(params, async function (s3Err, data) {
        if (s3Err) throw s3Err;
        console.log(`File uploaded successfully at ${data.Location}`);

        const file = await db.collection("aws").insertOne({
          url: data.Location,
          filename: files.file.name,
        });

        res.status(200).json({
          message: "File was successfully uploaded",
          success: true,
          fileID: file.insertedId,
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
