import Homeland from "@/components/Dashboard/Homeland";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserPage from "./user/page";



export default function Home() {
  return (
    <>
      <DefaultLayout>
     
        <Homeland />
      </DefaultLayout>
    </>
  );
}
