import aws from "aws-sdk";
const formidable = require("formidable");
const fs = require("fs");

export default async function upload(req, res) {
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
        Bucket: "opensend", // pass your bucket name
        Key: String(files.file.name), // file will be saved as testBucket/contacts.csv
        Body: fs.createReadStream(files.file.path),
      };
      s3.upload(params, function (s3Err, data) {
        if (s3Err) throw s3Err;
        console.log(`File uploaded successfully at ${data.Location}`);
        res.status(200);
      });

      // console.log(files.file);
      res.status(200).json({ fields, files });
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
