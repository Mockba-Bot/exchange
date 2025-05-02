import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { DEFAULT_SYMBOL } from "@/storage";

export const meta: MetaFunction = () => {
  return [
    { title: "Orderly SDK template" },
    { name: "description", content: "Orderly SDK template" },
  ];
};

export const loader: LoaderFunction = () => {
  return redirect(`/perp/${DEFAULT_SYMBOL}`);
};
