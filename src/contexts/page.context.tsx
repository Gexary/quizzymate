import React, { createContext, ReactNode, useContext, useState } from "react";

export type PageType = {
  name: string;
};

interface PageContextProps {
  currentPage: string | null;
  setPage: (page: string) => void;
}

const PageContext = createContext<PageContextProps | undefined>(undefined);

export const PageProvider: React.FC<{ pages: PageType[]; children: ReactNode; defaultPage: string }> = ({
  pages,
  children,
  defaultPage,
}) => {
  const [currentPage, setCurrentPage] = useState<string | null>(defaultPage || null);

  const setPage = (page: string) => {
    setCurrentPage(page);
  };

  return <PageContext.Provider value={{ currentPage, setPage }}>{children}</PageContext.Provider>;
};

export const usePage = (): PageContextProps => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context;
};
