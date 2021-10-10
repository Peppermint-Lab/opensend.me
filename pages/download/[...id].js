import axios from "axios";
import { useQuery } from "react-query";
import Image from "next/image";

export async function getServerSideProps(context) {
  const { id } = context.query;

  return {
    props: {
      id: id,
    },
  };
}

export default function Download({ id }) {
  const fetchURL = async () => {
    const res = await fetch(`/api/download/${id}`);
    return res.json();
  };

  const { data, status } = useQuery("fetchURL", fetchURL);
  
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
          {status === "loading" && (
            <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
              <h2> Loading data ... </h2>
            </div>
          )}

          {status === "error" && (
            <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold"> Error fetching data ... </h2>
            </div>
          )}

          {status === "success" && data.success === true && (
            <div>
              <a href={`${data.details.url}/${data.details.filename}`} target="_blank" rel="noopener noreferrer" download>
              <button
                type="button"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Donwload File
              </button>
              </a>
            </div>
          )}

          {status === "success" && data.success === false && (
            <div>
              <div className="">
                <Image
                  src="/undraw_page_not_found_su7k.svg"
                  height={100}
                  width={200}
                />
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                  <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    <span className="block">
                      Sorry there doesnt seem to be a file with this link?
                    </span>
                    <span className="block text-indigo-600">
                      Upload your file today!
                    </span>
                  </h2>
                </div>

                <div className="mt-8 flex justify-center lg:mt-0 lg:flex-shrink-0">
                  <div className="inline-flex rounded-md shadow">
                    <a
                      href="/"
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Get started
                    </a>
                  </div>
                  <div className="ml-3 inline-flex rounded-md shadow">
                    <a
                      href="#"
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                    >
                      Learn more
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
