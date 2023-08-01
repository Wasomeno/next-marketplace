"use client";

import Lottie from "lottie-react";

import heartLike from "../files/heart_like.json";

export const HeartLike = () => {
  return (
    <Lottie
      animationData={heartLike}
      loop={false}
      style={{ width: "3rem", height: "2rem" }}
    />
  );
};
