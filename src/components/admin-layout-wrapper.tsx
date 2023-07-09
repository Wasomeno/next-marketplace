"use client";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import React from "react";
import { FaSpinner } from "react-icons/fa";

import { AdminLogin } from "./admin/admin-login";

export const AdminLayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { status } = useSession();
  if (status === "loading") {
    return (
      <motion.div className="flex h-screen items-center justify-center">
        <FaSpinner size="30" className="animate-spin text-blue-500" />
      </motion.div>
    );
  }

  if (status === "unauthenticated") {
    return <AdminLogin />;
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
      className="lg:flex lg:justify-center"
    >
      {children}
    </motion.main>
  );
};
