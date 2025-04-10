import Vault from "./_components/Vault";
export default function DataVaultPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32">
      <h1 className="text-3xl font-bold tracking-tighter text-center mb-12">
        Data Vault
      </h1>
        <p className="text-lg text-center mb-8 text-muted-foreground">
            Store and manage your sensitive information securely.
            <br />
            Your data is encrypted and only accessible by you.
        </p>
        <Vault/>

    </div>
  );
}