"use client";
// components
import { Navbar, Footer } from "@/components";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config";

// sections
import { useEffect, useState } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import Link from "next/link";
import Image from "next/image";
export type Post = {
  id: string;
  title: string;
  articlePreview: string;
  article: string;
  imageCover: string;
  category: string;
  url: string;
};
export default function BlogPage() {
  const [postLists, setPostList] = useState<Array<Post> | null>(null);

  const postsCollectionRef = collection(db, "posts");

  const getPosts = async () => {
    const data = await getDocs(postsCollectionRef);
    if (data.docs)
      setPostList(
        data.docs.map((doc) => ({ ...(doc.data() as Post), id: doc.id }))
      );
  };

  useEffect(() => {
    getPosts();
  }, [db]);

  console.log(postLists);

  return (
    <>
      <Navbar />
      <section
        style={{
          background:
            "linear-gradient(to bottom, rgb(237 242 246), rgba(255 255 255))",
        }}
        className="px-8 pt-20 pb-20"
      >
        <div className="animate-in slide-in-from-bottom duration-1000 container mx-auto mb-10 grid place-items-center text-center ">
          <h1 color="blue-gray" className="my-3 text-4xl font-bold">
            Blog
          </h1>
        </div>
        <div className="container mx-auto mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {postLists &&
            postLists.map((post) => (
              <Card
                key={post.id}
                id="running"
                placeholder=""
                color="gray"
                className="animate-in slide-in-from-left duration-1000 relative grid h-full w-full place-items-center overflow-hidden text-center"
              >
                <Image
                  width={768}
                  height={768}
                  src={post.imageCover}
                  alt={"/image/8716_20230423_144655_274310037_original.webp"}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
                <div className="flex flex-col " style={{ zIndex: "1" }}>
                  <CardBody placeholder="" className="relative  h-full  w-full">
                    <Typography
                      placeholder=""
                      variant="h4"
                      className="mt-9"
                      color="white"
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      placeholder=""
                      color="white"
                      className="mt-4 mb-14 font-normal opacity-70"
                    >
                      {post.articlePreview}
                    </Typography>
                  </CardBody>
                  <Link style={{ zIndex: "1" }} href="/plans/running-trainings">
                    <Button
                      placeholder=""
                      className="mb-8"
                      size="sm"
                      color="white"
                    >
                      Read More
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
