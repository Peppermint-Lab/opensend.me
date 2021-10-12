import { Upload, Popover } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckCircleIcon, XIcon } from "@heroicons/react/outline";
import axios from "axios";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [id, setId] = useState();
  const [file, setFile] = useState();
  const [data, setData] = useState(false);

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
          setUrl(url);
          setId(fileID);
          setFile(file);

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
              setData(true);
              setOpen(true);
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
          <a
            className="text-blue-600"
            href="https://github.com/Peppermint-Lab/opensend"
            target="_blank"
          >
            opensend.me
          </a>
        </h1>

        <h2 className="text-2xl font-bold">
          Upload upto 10GB files with public links that last 24 hours!
        </h2>

        <p>
          All files are sent through the browser so speed will depend on your
          connection.
        </p>

        <div className="mt-4">
          <Dragger {...props} disabled={loading}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="px-4">
              Support for a single or bulk upload. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Dragger>
        </div>

        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="fixed z-10 inset-0 overflow-y-auto"
            onClose={setOpen}
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6">
                  <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                    <button
                      type="button"
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                      <CheckCircleIcon
                        className="h-8 w-8 text-blue-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        File Uploaded Successfully!
                      </Dialog.Title>
                      <div className="mt-2">
                        {data === true && (
                          <div>
                            <ul>
                              <li>FileName: {file.name}</li>
                              <li>Size: {file.size}</li>
                              <li>
                                Url:{" "}
                                <a
                                  href={`https://opensend.me/download/${id}`}
                                  target="_blank"
                                >
                                  https://opensend.me/download/{id}
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <Popover content="Link Copied!" trigger="click">
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://opensend.me/download/${id}`
                          );
                        }}
                      >
                        Copy Link
                      </button>
                    </Popover>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </main>
    </div>
  );
}
