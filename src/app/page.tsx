'use client'

import FileDownload from "@/components/fileDownload";
import FileUpdate from "@/components/fileUpdate";
import FileUpload from "@/components/fileUpload";

const Home = () => {

  return (
    <>
      <FileUpload />
      <FileDownload />
      <FileUpdate />
    </>
  );
};

export default Home;