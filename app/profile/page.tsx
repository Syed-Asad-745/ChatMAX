import { getCurrentUser } from "@/lib/auth/session";
import ProfilePicture from "./ProfilePicture";

export default async function ProfilePage() {
  const userData = await getCurrentUser();
  if (!userData) {
    return (
      <div className="flex flex-col items-center flex-1 my-4 pb-16 rounded-xl min-h-[calc(100vh-32px)] h-fit border-2 border-gray-300 bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 overflow-clip">
        <h1 className="m-24 text-3xl">Please log in to view your profile.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center flex-1 my-4 pb-16 rounded-xl min-h-[calc(100vh-32px)] h-fit border-2 border-gray-300 bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 overflow-clip">
      <h1 className="sticky top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xs p-6 pl-12 font-bold ">Profile</h1>

      <div className="w-full p-12 flex ">
        <ProfilePicture />
        <div className="ml-6 mt-4">
          <h2>Username: {userData.username}</h2>
          <h2>Email: {userData.email}</h2>
        </div>
      </div>
    </div>
  );
}
