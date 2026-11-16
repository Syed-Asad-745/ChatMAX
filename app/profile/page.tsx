import { getCurrentUser } from "@/lib/auth/session";
import ProfilePicture from "./ProfilePicture";
import BioModal from "@/components/modals/BioModal";
import MenuButton from "@/components/sub-components/MenuButton";

export default async function ProfilePage() {
  const userData = await getCurrentUser();

  if (!userData) {
    return (
      <div className="flex flex-col items-center flex-1 sm:m-4 pb-10 sm:rounded-3xl min-h-dvh sm:min-h-[calc(100vh-32px)] border-2 border-white bg-white/70 text-black dark:border-black dark:bg-black/70 dark:text-white overflow-clip">
        <div className="w-full flex justify-start items-center gap-4 bg-white/50 dark:bg-black/50 py-6 px-6 font-bold">
          <span className="sm:hidden">
            <MenuButton />
          </span>
          Profile
        </div>
        <h1 className="m-24">Please log in to view your profile.</h1>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center flex-1 sm:m-4 p-4 sm:p-8 lg:p-16 sm:rounded-3xl min-h-dvh sm:min-h-[calc(100vh-32px)] border-2 border-white bg-white/70 text-black dark:border-black dark:bg-black/70 dark:text-white overflow-clip">
      <div className="absolute top-0 left-0 w-full flex justify-start items-center gap-4 bg-white/50 dark:bg-black/50 py-6 px-6 font-bold">
        <span className="sm:hidden">
          <MenuButton />
        </span>
        Profile
      </div>
      <div className="w-full my-12 flex flex-col">
        <div className="flex my-6">
          <div>
            <ProfilePicture profilePicUrl={userData.profile_pic_url} />
          </div>
          <div className="ml-6 mt-4">
            <h2>Username: {userData.username}</h2>
            <h2>Email: {userData.email}</h2>
          </div>
        </div>
        <div className="sm:mx-4">
          {userData.bio && <h2>{userData.bio}</h2>}
          <BioModal bio={userData.bio} />
        </div>
      </div>
    </div>
  );
}
