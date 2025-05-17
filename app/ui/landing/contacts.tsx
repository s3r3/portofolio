import { Header } from "@/public/header";
import { FaDiscord } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
export default function Contacts() {
  return (
    <div className="pb-10">
      <Header>Contacts</Header>
      <div className="flex justify-between">
        <div className="w-[505px]">
          <p>
            I’m interested in freelance opportunities. However, if you have
            other request or question, don’t hesitate to contact me
          </p>
        </div>
        <div className="w-[204px] border p-2 flex flex-col gap-3">
          <p>Message me here</p>
          <div className="flex gap-2 items-center">
            <FaDiscord className="text-white" />
            <p>!farid#3519</p>
          </div>
          <div className="flex gap-2 items-center">
            <IoIosMail className="text-white" />
            <p>farid@farid.me</p>
          </div>
        </div>
      </div>
    </div>
  );
}
