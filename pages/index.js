import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { Dragger } = Upload;

  const props = {
    name: "file",
    multiple: false,
    customRequest({ file, onError, onSuccess, onProgress }) {
      setLoading(true);

      const filename = encodeURIComponent(file.name);
      fetch(`/api/upload?file=${filename}`)
        .then((res) => res.json())
        .then(async (res) => {
          const { url, fields, fileID } = await res;
          const formData = new FormData();

          Object.entries({ ...fields, file }).forEach(([key, value]) => {
            formData.append(key, value);
          });

          var options = {
            onUploadProgress: (event) => {
              const { loaded, total } = event;
              onProgress(
                {
                  percent: Math.round((loaded / total) * 100),
                },
                file
              );
            },
          };

          axios
            .post(url, formData, options)
            .then((result) => {
              setLoading(false);
              onSuccess(result, file);
              message.success("Successfully Upload!");
              alert(
                `Youre download URL is https://opensend.me/download/${fileID}`
              );
            })
            .catch((error) => {
              onError(error);
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="">
            opensend.me
          </a>
        </h1>

        <div className="mt-4">
          <Dragger {...props} disabled={loading}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Dragger>

          {/* {uploading === true && (
            <div>
              <h1>
                Uploading file, this is done client side, so depending on your
                upload speed will determine how long this takes
              </h1>
              <Loader
                type="ThreeDots"
                color="#00BFFF"
                height={100}
                width={100}
                visible={uploading}
              />
            </div>
          )} */}
        </div>
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
