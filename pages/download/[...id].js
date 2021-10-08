import fileDownload from "js-file-download";
import axios from "axios";
import { useQuery } from "react-query";

export async function getServerSideProps(context) {
  const { id } = context.query 

  return {
    props: {
      id: id,
    }, // will be passed to the page component as props
  }
}

export default function Download({ id, }) {

  const fetchURL = async () => {
    const res = await fetch(`/api/download/${id}`);
    return res.json();
  };

  const { data, status } = useQuery("fetchURL", fetchURL);

  console.log(data);

  async function download() {
    const u = `${data.details.url}`;
    await axios
      .get(u, {
        method: "get",
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, data.details.filename);
      });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="">
            opensend.me
          </a>
        </h1>

        <div className="mt-4s">
          <button
            onClick={() => download()}
            type="button"
            className="float-right  border border-transparent rounded-full shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Download ME
          </button>
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