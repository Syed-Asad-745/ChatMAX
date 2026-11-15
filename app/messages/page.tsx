import MenuButton from "@/components/sub-components/MenuButton";

export default function MessagesPage() {
  return (
    <div className="flex flex-col items-center flex-1 sm:m-4 pb-10 sm:rounded-3xl min-h-[calc(100vh-32px)] border-2 border-white bg-white/70 text-black dark:border-black dark:bg-black/70 dark:text-white overflow-clip">
      <div className="w-full flex justify-start items-center gap-4 bg-white/50 dark:bg-black/50 py-6 px-6 font-bold">
        <span className="sm:hidden">
          <MenuButton />
        </span>
        Messages
      </div>
      <p className="mt-24">feature will be added soon</p>
    </div>
  );
}
