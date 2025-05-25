import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-foreground">Planejamento de Aulas</h1>
        <p className="text-lg text-center sm:text-left text-foreground/80">
          Assistente inteligente para planejamento de aulas
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-turquoise hover:bg-turquoise-dark text-white gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 font-bold"
            href="/planner"
          >
            Começar agora
          </a>
        </div>
      </main>
    </div>
  );
}
