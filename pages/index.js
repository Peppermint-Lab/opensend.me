import Head from "next/head";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import fileDownload from "js-file-download";
import axios from "axios";

export default function Home() {
  const { Dragger } = Upload;

  function download() {
    const url = `https://s3.eu-west-2.amazonaws.com/lon.opensend.me/putty-64bit-0.76-installer.msi`;
    axios
      .get(url, {
        method: "get",
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, "putty.msi");
      });
  }

  const props = {
    name: "file",
    multiple: false,
    action: "/api/upload",
    data: (file) => {
      let data = new FormData();
      data.append("file", file);
      data.append("filename", file.name);
    },
    beforeUpload(file) {
      if (file.size > 10737418240) {
        message.error(`${file.name} upload failed due to size over 10GB`);
      }
      return true;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
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
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>

        <div className="mt-4s">
          <Dragger {...props}>
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
          </Dragger>
        </div>

        <button
          onClick={() => download()}
          type="button"
          className="float-right  border border-transparent rounded-full shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Download ME
        </button>
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
