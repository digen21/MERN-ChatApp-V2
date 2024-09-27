import { getColor } from "@/lib";
import { useAppStore } from "@/store";
import { Channel, ChatType } from "@/types";

import { Avatar, AvatarImage } from "../ui/avatar";

interface Props {
  contacts: Channel[];
  isChannel?: boolean;
}

// interface ChannelInfo {
//   _id: string;
//   firstName?: string;
//   lastName?: string;
//   avatar?: string;
//   email?: string;
//   color?: number;
//   name?: string;
// }

interface ContactList {
  _id: string;
  name: string;
  members: string[];
  messages: string[];
  admin: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactList = ({ contacts, isChannel = false }: Props) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact: any) => {
    if (isChannel) setSelectedChatType(ChatType.CHANNEL);
    else setSelectedChatType(ChatType.CONTACT);

    setSelectedChatData(contact);

    //clearing previous contact message when select other contact
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact: Channel) => {
        return (
          <div
            key={contact._id}
            className={`pl-10 pr-5 py-2 flex items-center justify-between transition-all duration-300 cursor-pointer ${
              selectedChatData && selectedChatData._id === contact?._id
                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                : "hover:bg-[#f1ff111]"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-5 items-center">
              {!isChannel && (
                <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                  {contact?.avatar ? (
                    <AvatarImage
                      src={contact.avatar}
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`
                        ${
                          selectedChatData &&
                          selectedChatData._id === contact._id
                            ? "bg-[#ffffff22] border border-white/70"
                            : getColor(contact?.color || 0)
                        }
                        
                        uppercase h-10 w-10 text-lg border-[1px] flex items-center rounded-full justify-center`}
                    >
                      {contact?.firstName
                        ? String(contact.firstName).charAt(0)
                        : (contact?.email ?? "").charAt(0)}
                    </div>
                  )}
                </Avatar>
              )}

              {isChannel && (
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                  #
                </div>
              )}

              <div className="text-neutral-300">
                {isChannel ? (
                  <span>{contact.name}</span>
                ) : (
                  <span>{`${contact?.firstName} ${contact?.lastName}`}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
