import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { DEFAULT_SYMBOL } from "@/storage";
import { PathEnum } from "@/constant";

export const meta: MetaFunction = () => {
  return [
    { title: "Apolo Dex" },
    { name: "description", content: "Apolo descentralized trading platform" },
  ];
};

export const loader: LoaderFunction = () => {
  // return redirect(`${PathEnum.Perp}/${DEFAULT_SYMBOL}`);
  return {};
};
