import Link from "next/link";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

type Category = {
  title: string;
  slug: string;
};

const categoriesData: Category[] = [
  {
    title: "T-shirts",
    slug: "/astromall?category=t-shirts",
  },
  {
    title: "Shorts",
    slug: "/astromall?category=shorts",
  },
  {
    title: "Shirts",
    slug: "/astromall?category=shirts",
  },
  {
    title: "Hoodie",
    slug: "/astromall?category=hoodie",
  },
  {
    title: "Jeans",
    slug: "/astromall?category=jeans",
  },
];

const CategoriesSection = () => {
  return (
    <div className="flex flex-col space-y-0.5 text-black/60">
      {categoriesData.map((category, idx) => (
        <Link
          key={idx}
          href={category.slug}
          className="flex items-center justify-between py-2"
        >
          {category.title} <MdKeyboardArrowRight />
        </Link>
      ))}
    </div>
  );
};

export default CategoriesSection;
