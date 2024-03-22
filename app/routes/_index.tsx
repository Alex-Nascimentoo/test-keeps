import type { MetaFunction } from "@remix-run/node";
import React from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [files, setFiles] = React.useState<FileList | null>(null);
  const [progress, setProgress] = React.useState({ started: false, pc: 0 });
  const [msg, setMsg] = React.useState<string>('');
  const [isCancelled, setIsCancelled] = React.useState<boolean>(false);
  const [imgList, setImgList] = React.useState<string[]>([]);

  const inputFile = React.useRef();

  const controller = new AbortController();
  const signal = controller.signal;

  async function handleUpload() {
    if(!files) {
      setMsg('No file selected');
      return;
    }

    const formData = new FormData();

    for(let i = 0; i < files.length; i++) {
      formData.append(`file${i+1}`, files[i]);

      // const newImg = URL.createObjectURL(files[i]);
      // setImgList(prev => {
      //   return [...prev, newImg]
      // })
    }

    setMsg('Uploading...');
    setProgress(prevState => {
      return { ...prevState, started: true }
    })

    await new Promise(r => setTimeout(r, 3000));
      
    axios.post('https://httpbin.org/post', formData, {
      signal: signal,
      onUploadProgress: progressEvent => {
        setProgress(prevState => {
          return { ...prevState, pc: progressEvent.progress!*100 }
        })
      }
    })
    .then(res => {
      for(let i = 0; i < files.length; i++) {
        const newImg = URL.createObjectURL(files[i]);
        setImgList(prev => {
          return [...prev, newImg]
        })
      }

      setMsg('');
      setProgress({ started: false, pc: 0 });

      toast.success('Uploaded successfully!', {
        position: "bottom-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      console.log(res.data);
    })
    .catch(err => {
      toast.error('Upload failed!', {
        position: "bottom-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      console.log(err);
    })

    if(isCancelled) {
      controller.abort();
      
      cancelUpload();
    }
  }

  function cancelUpload() {
    setProgress({ started: false, pc: 0 });
    setMsg('')
      
    setTimeout(() => {
      setIsCancelled(false);
    }, 3500);
  }

  return (
    <main className="flex flex-col justify-center items-center gap-10 min-h-screen">
      <input
        ref={inputFile}
        className="hidden"
        type="file"
        onChange={e => setFiles(e.target.files) }
        multiple
      />

      <div className="flex justify-center items-center gap-10">
        <div className="
        flex flex-col
        border-2 border-neutral rounded-xl
        p-14
        w-full
        ">
          <button
            className="
            p-3
            text-xl text-dark
            bg-neutral bg-opacity-25 rounded-md
            border-[3px] border-dashed border-neutral
            "
            onClick={() => inputFile.current!.click()}
          >
            Select files...
          </button>
          <div className="
          flex justify-between gap-10
          mt-10
          ">
            <button
              className="
              bg-main rounded-md
              text-white text-xl
              px-5 py-2
              border border-transparent
              duration-300
              hover:bg-white hover:text-main hover:border-main
              "
              onClick={handleUpload}
            >
              Upload
            </button>
            <button
              className="
              bg-dark rounded-md
              text-white text-xl
              px-5 py-2
              border border-transparent
              duration-300
              hover:bg-white hover:text-dark hover:border-dark
              "
              onClick={() => setIsCancelled(true)}
            >
              Cancel upload
            </button>
          </div>
        </div>
      
        <div className="flex justify-center gap-10">
          <div className="
            grid grid-cols-3 gap-5
            border-2 border-neutral rounded-xl
            p-5
            w-[45rem] h-[30rem]
            overflow-y-scroll
          ">

            {
              imgList.map((img, index) => (
                <div
                  key={index}
                  className={`
                  w-[13rem] aspect-square
                  bg-neutral rounded-xl
                  `}
                >
                  <img
                    className="w-full h-full rounded-xl"
                    src={img}
                    alt=""
                  />
                </div>
              ))
            }
          
          </div>
        </div>
      </div>
      
      { progress.started && 
        <progress
          className="
          w-[27rem]
          rounded-full
          "
          max="100"
          value={progress.pc}
        ></progress>
      }

      <h3
        className="text-2xl text-neutral font-medium"
      >{ msg }</h3>

      <ToastContainer
        className='
        max-h-sm
        '
        position="bottom-right"
      />
    </main>
  );
}
