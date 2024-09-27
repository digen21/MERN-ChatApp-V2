import { FaEdit } from "react-icons/fa";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { useLogout } from "@/hooks";
import { getColor } from "@/lib";
import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Loader from "./Loader";

const ProfileInfo = () => {
  const { userInfo } = useAppStore();
  const { logout, loading } = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-6 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="h-12 w-23 relative">
          <Avatar className="w-12 h-12 rounded-full overflow-hidden">
            {userInfo?.avatar ? (
              <AvatarImage
                src={userInfo.avatar}
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase w-full h-full md:h-26 md:w-26 text-xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo?.color || 0
                )}`}
              >
                {userInfo?.firstName
                  ? String(userInfo.firstName).charAt(0)
                  : (userInfo?.email ?? "").charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo?.firstName && userInfo?.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>

      <div className="flex gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {" "}
              <FaEdit
                onClick={() => navigate("/profile")}
                className="text-xl text-purple-500 font-medium"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Hello
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {" "}
              <IoPowerSharp
                onClick={handleLogout}
                className="text-xl text-purple-500 font-medium"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
