import Head from "next/head";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function Home() {
  const { Dragger } = Upload;
  const [fileID, setFileID] = useState("");

  const props = {
    name: "file",
    multiple: false,
    beforeUpload(file) {
      if (file.size > 10737418240) {
        message.error(`${file.name} upload failed due to size over 10GB`);
      }
      return true;
    },
    onChange(e) {
      const file = e;
      const { status } = file.file
      if(status === "done") {
        uploadPhoto(file)
        console.log("uploading to aws")
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    // const file = info.file
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/upload?file=${filename}`);
    const { url, fields, fileID } = await res.json();
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (upload.ok) {
      message.success(`File uploaded successfully.`);
      alert(`Youre download URL is https://opensend.me/download/${fileID}`);
    } else {
      message.error(`File upload failed.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="">
            opensend.me
          </a>
        </h1>

        <div className="mt-4">
          {/* <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="px-8">
              Support for a single files only currenly. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Dragger> */}
        </div>

        <input
        onChange={uploadPhoto}
        type="file"
      />
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  );
}
