import React from "react";

import { ReloadIcon } from "@radix-ui/react-icons";

function Spinner({ color }: { color?: string }) {
  return <ReloadIcon className="mr-2 h-4 w-4 animate-spin" style={{ color }} />;
}

export default Spinner;
