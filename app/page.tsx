import FixAccountForm from "@/components/FixAccountForm";

export default function Home() {
  return (
    <>
      <h1 className="text-center mt-4 text-2xl">NOSTR ACCOUNT FIXER</h1>
      <div className="flex justify-center align-middle w-screen">
        <FixAccountForm />
      </div>
    </>
  );
}
