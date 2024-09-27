import { useState } from "react";
import { FaPlus } from "react-icons/fa";

import { useCreateChannel, useGetAllContacts } from "@/hooks";
import { useAppStore } from "@/store";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { MultiSelect } from "./ui/multiSelect";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const CreateChannel = () => {
  const { addChannel } = useAppStore();
  const [openContactModal, setOpenContactModal] = useState<boolean>();
  const [channelName, setChannelName] = useState<string>("");
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);

  const { allContacts } = useGetAllContacts();
  const { createChannels } = useCreateChannel();

  const createChannel = async () => {
    const data = await createChannels({
      name: channelName,
      members: selectedContacts,
    });

    if (data) {
      setChannelName("");
      setSelectedContacts([]);
      setOpenContactModal(false);
      addChannel(data);
    }
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
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openContactModal} onOpenChange={setOpenContactModal}>
        <DialogContent className="bg-[#181920]  border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-base">
              Please fill up the details for new channel
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel Name"
              className="rounded-md p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultiSelect
              className="rounded-lg bg-[#2c2e3b] py-2 border-none text-white"
              placeholder="Search Contacts..."
              options={allContacts}
              value={selectedContacts}
              onValueChange={setSelectedContacts}
              onEmptied={() => (
                <p className="text-center text-lg leading-10 text-gray-700">
                  No result found
                </p>
              )}
            />
          </div>
          <div>
            <Button
              onClick={createChannel}
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
