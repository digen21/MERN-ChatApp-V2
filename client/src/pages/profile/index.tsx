import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { AvatarImage, Button, Input, Loader } from "@/components";
import { useUpdateProfileImage, useUpdateUserInfo } from "@/hooks";

import { colors, getColor } from "@/lib";
import { useAppStore } from "@/store";
import { Avatar } from "@radix-ui/react-avatar";
import { UPLOAD_IMAGE_FORMAT } from "@/utils";

const Profile: React.FC = () => {
  const { userInfo } = useAppStore();
  const { loading, updateUserInfo } = useUpdateUserInfo();
  const { loading: uploadImageLoading, updateProfileImage } =
    useUpdateProfileImage();

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState<string>(userInfo?.firstName || "");
  const [lastName, setLastName] = useState<string>(userInfo?.lastName || "");
  const [selectedColor, setSelectedColor] = useState(userInfo?.color || 0);
  const [avatar, setAvatar] = useState<any>(userInfo?.avatar);
  const [hovered, setHovered] = useState(false);

  const fileInputRef = React.createRef<HTMLInputElement>();

  // Debounced state for input values
  const [debouncedFirstName, setDebouncedFirstName] = useState(firstName);
  const [debouncedLastName, setDebouncedLastName] = useState(lastName);

  const handleNavigate = () => {
    if (userInfo?.isProfileSetup) {
      navigate("/chat");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("profile-image", file);

    //Displaying image as uploaded to FE
    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result);
    };

    reader.readAsDataURL(file);

    await updateProfileImage(formData);
  };

  const handleDeleteImage = async () => {};

  // const isDisabled = userInfo?.firstName && userInfo.lastName ? true:false;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFirstName(firstName);
      setDebouncedLastName(lastName);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [firstName, lastName]);

  const saveChanges = async () => {
    if (
      debouncedFirstName !== String(userInfo?.firstName) ||
      debouncedLastName !== String(userInfo?.lastName)
    )
      await updateUserInfo({
        color: selectedColor,
        firstName,
        lastName,
      });
  };

  return (
    <div className="bg-[#1b1c24] h-screen flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white text-opacity-90 cursor-pointer" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {avatar ? (
                <AvatarImage
                  src={avatar}
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[3px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? debouncedFirstName.charAt(0)
                    : (userInfo?.email ?? "").charAt(0)}
                </div>
              )}
            </Avatar>

            {hovered && (
              <div
                onClick={avatar ? handleDeleteImage : handleFileInputClick}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
              >
                {avatar ? (
                  <FaTrash className="text-3xl text-white cursor-pointer" />
                ) : (
                  <FaPlus className="text-3xl text-white cursor-pointer" />
                )}
              </div>
            )}

            {uploadImageLoading && <Loader message="Uploading image..." />}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept={UPLOAD_IMAGE_FORMAT}
            />
          </div>

          <div className="flex flex-col min-w-32 md:min-w-64 gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="email"
                type="email"
                disabled
                value={userInfo?.email}
                className="rounded-xl p-6  bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="FirstName"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={userInfo ? firstName : undefined}
                className="rounded-xl p-6  bg-[#2c2e3b] border-none"
              />
            </div>
            <Input
              placeholder="Lastname"
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              value={userInfo ? lastName : undefined}
              className="rounded-xl p-6  bg-[#2c2e3b] border-none"
            />
            <div className="w-full flex gap-5 justify-center">
              {colors.map((color: string, index: number) => (
                <div
                  className={`${color} h-4 w-4 md:h-8 md:w-8  rounded-full cursor-pointer transition-all duration-75
                    ${
                      selectedColor === index
                        ? "outline outline-white outline-4"
                        : ""
                    }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            onClick={saveChanges}
            className="h-16 w-full rounded-xl bg-purple-700 hover:bg-purple-900 transition-all duration-300"
          >
            {loading ? (
              <span>
                <Loader message="Saving changes..." />
              </span>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
