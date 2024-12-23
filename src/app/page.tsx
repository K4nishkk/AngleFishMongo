'use client'

import FileDownload from "@/components/fileDownload";
import FileUpload from "@/components/fileUpload";

const Home = () => {

  return (
    <>
      <FileUpload />
      <FileDownload />
    </>
  );
};

export default Home;