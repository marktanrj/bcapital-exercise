'use client'

import Prompt from "../prompt";

export default function Chat() {
  return (
    <div className="w-full p-5 flex flex-col items-center justify-center min-h-screen">
      <Prompt />
    </div>
  );
}
