import { useState } from "react";

import { SettingsModal } from "../App";
import { SettingsContext } from "../contexts/TableContext";

const DEFAULT_PAGE_SIZE = 10;

export const SettingsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [showModal, setShowModal] = useState(false);

  return (
    <SettingsContext.Provider value={{ pageSize, setPageSize, showModal, setShowModal }}>
      {showModal && (<SettingsModal />)}
      {children}
    </SettingsContext.Provider>
  );
};
