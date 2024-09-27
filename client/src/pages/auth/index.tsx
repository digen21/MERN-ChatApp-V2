import React, { useState } from "react";

import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import {
  Button,
  Input,
  Loader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components";
import { useSignin, useSignup } from "@/hooks";

const TagTriggerClass = `data-[state=active]:bg-transparent text-opacity-90 text-black border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300`;

const Auth: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("SignIn");

  const { signUp, loading: signUpLoading } = useSignup();
  const { signIn, loading: signInLoading } = useSignin();

  const handleSignIn = async () => {
    await signIn({ email, password });
  };

  const handleClearForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSignUp = async () => {
    await signUp({ email, password, confirmPassword });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="bg-white border-2 border-white text-opacity-90 shadow-2xl rounded-3xl flex xl:flex-row flex-col">
        <div className="flex flex-col gap-10 items-center justify-center p-6">
          <div className="flex items-center justify-center">
            <h1 className="text-5xl font-semibold md:text-6xl">Welcome</h1>
            <img src={Victory} alt="victory" className="h-[100px]" />
          </div>
          <p className="font-medium text-center">
            Fill in the details to get started with the chat App!
          </p>

          <div className="flex items-center justify-center w-full">
            <Tabs
              className="w-3/4"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  className={TagTriggerClass}
                  onClick={handleClearForm}
                  value="SignIn"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  onClick={handleClearForm}
                  className={TagTriggerClass}
                  value="SignUp"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="SignIn" className="flex flex-col gap-5 mt-10">
                <Input
                  placeholder="john@gmail.com"
                  type="email"
                  className="rounded-xl p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="password"
                  type="password"
                  className="rounded-xl p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="rounded-xl p-6"
                  onClick={handleSignIn}
                  disabled={signInLoading}
                >
                  {signInLoading ? (
                    <Loader message="Signing in..." />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="SignUp" className="flex flex-col gap-5">
                <Input
                  placeholder="john@gmail.com"
                  type="email"
                  className="rounded-xl p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="password"
                  type="password"
                  className="rounded-xl p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm password"
                  type="password"
                  className="rounded-xl p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="rounded-xl p-6"
                  onClick={handleSignUp}
                  disabled={signUpLoading}
                >
                  {signUpLoading ? (
                    <Loader message="Signing up..." />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Column */}
        <div className="hidden xl:flex justify-center items-center overflow-hidden">
          <img src={Background} alt="background" className="object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
