import BreachChecker from "./_components/BreachChecker";
import MyBreaches from "./_components/MyBreaches";

export default function DataBreachPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-20 md:py-24 lg:py-32 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold tracking-tighter text-center mb-6">
        Check Data Breaches
      </h1>
      <MyBreaches />
      <BreachChecker />
    </div>
  );
}