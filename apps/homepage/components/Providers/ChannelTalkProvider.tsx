"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import Button from "../ui/Button";

export default function ChannelTalkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const chatReady = useRef(false);
  useEffect(() => {
    const pluginKey = process.env.NEXT_PUBLIC_CHANNEL_PLUGIN_KEY;
    if (!pluginKey) return;
    let active = true;
    try {
      ChannelService.loadScript();
      ChannelService.boot(
        {
          pluginKey,
          hideChannelButtonOnBoot: true,
        },
        (error) => {
          if (active) chatReady.current = !error;
        }
      );
    } catch {
      chatReady.current = false;
    }
    return () => {
      active = false;
      chatReady.current = false;
    };
  }, []);
  return (
    <>
      {children}
      <Button
        asChild
        id="custom-button-2"
        size="lg"
        className="fixed bottom-5 right-4 md:bottom-8 md:right-8 z-50 animate-pulse-slow rounded-full pl-3 pr-5 shadow-lg transition-shadow [animation-duration:6s] hover:animate-none hover:shadow-xl"
      >
        <a
          href="/education-inquiry"
          onClick={(event) => {
            if (!chatReady.current) return;
            try {
              ChannelService.showMessenger();
              event.preventDefault();
            } catch {
              chatReady.current = false;
            }
          }}
        >
          <Image
            src="/brand/sprout-felt-v1.webp"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 rounded-full bg-[#FFF8E9] p-0.5"
          />
          <span className="relative text-base font-semibold">
            <span className="absolute -right-1 -top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-destructive/50 opacity-75 [animation-duration:4s]"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
            1:1 교육문의
          </span>
        </a>
      </Button>
    </>
  );
}
