import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Lottie from "react-lottie-player";

import animationData from "@/assets/lottie-json.json";
import { useSearchContacts } from "@/hooks";
import { getColor } from "@/lib";
import { useAppStore } from "@/store";
import { ChatType, User } from "@/types";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const NewDm = () => {
  const { setSelectedChatData, setSelectedChatType } = useAppStore();

  const [openContactModal, setOpenContactModal] = useState<boolean>();
  const [search, setSearch] = useState<string>("");
  const lottieRef = useRef(null);

  const { contacts, setContacts } = useSearchContacts(search);

  const searchContacts = async (searchTerm: string) => {
    setSearch(searchTerm);
  };

  const selectNewContact = (contact: any) => {
    setOpenContactModal(false);
    setSelectedChatType(ChatType.CONTACT);
    setSelectedChatData(contact);
    setContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => setOpenContactModal(true)}
              className="text-sm text-neutral-400 text-opacity-90 cursor-pointer hover:text-neutral-100 transition-all duration-300 font-light"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openContactModal} onOpenChange={setOpenContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please Select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search contact"
              className="rounded-md p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          {contacts.length < 1 && (
            <div className="flex-1 flex mt-5 flex-col justify-center items-center duration-1000 transition-all">
              <Lottie
                ref={lottieRef}
                style={{ width: 100, height: 100 }}
                animationData={animationData}
                loop
                play
              />

              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center text-center lg:text-2xl text-xl transition-all duration-300">
                <h3 className="">
                  Hi<span className="text-purple-500">! </span>
                  Search new <span className="text-purple-500">Contact</span>
                  {/* <span className="text-purple-500">.</span> */}
                </h3>
              </div>
            </div>
          )}

          <ScrollArea className="h-[150px]">
            <div className="flex flex-col gap-5">
              {contacts.map((contact: User) => (
                <div
                  onClick={() => selectNewContact(contact)}
                  key={contact._id}
                  className="flex gap-4 items-center cursor-pointer"
                >
                  <div className="h-12 w-23 relative">
                    <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                      {contact?.avatar ? (
                        <AvatarImage
                          src={contact.avatar}
                          className="object-cover w-full h-full bg-black"
                        />
                      ) : (
                        <div
                          className={`uppercase h-full w-full text-lg rounded-full border-[2px] flex items-center justify-center ${getColor(
                            contact?.color || 0
                          )}`}
                        >
                          {contact?.firstName
                            ? String(contact.firstName).charAt(0)
                            : (contact?.email ?? "").charAt(0)}
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {contact?.firstName && contact?.lastName
                        ? `${contact.firstName} ${contact.lastName}`
                        : ""}
                    </span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
