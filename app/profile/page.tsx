import { getCurrentUser } from "@/lib/auth/session";
import ProfilePicture from "./ProfilePicture";
import BioModal from "@/components/modals/BioModal";
import MenuButton from "@/components/sub-components/MenuButton";

export default async function ProfilePage() {
  const userData = await getCurrentUser();

  if (!userData) {
    return (
      <div className="flex flex-col items-center flex-1 sm:m-4 pb-10 sm:rounded-3xl min-h-[calc(100vh-32px)] border-2 border-white bg-white/70 text-black dark:border-black dark:bg-black/70 dark:text-white overflow-clip">
        <h1 className="m-24 text-3xl">Please log in to view your profile.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center flex-1 sm:m-4 pb-10 sm:rounded-3xl min-h-[calc(100vh-32px)] border-2 border-white bg-white/70 text-black dark:border-black dark:bg-black/70 dark:text-white overflow-clip">
      <div className="w-full flex justify-start items-center gap-4 bg-white/50 dark:bg-black/50 py-6 px-6 font-bold">
        <span className="sm:hidden">
          <MenuButton />
        </span>
        Profile
      </div>
      <div className="w-full p-6 flex ">
        <ProfilePicture />
        <div className="ml-6 mt-4">
          <h2>Username: {userData.username}</h2>
          <h2>Email: {userData.email}</h2>
          {userData.bio && <h2>Bio: {userData.bio}</h2>}
          <BioModal bio={userData.bio} />
        </div>
      </div>
    </div>
  );
}
