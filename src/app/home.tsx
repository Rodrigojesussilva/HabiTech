import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="px-3 sm:px-4">
      <section className="mx-auto max-w-[1200px] text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
          Bem-vindo ao sistema de Instrumentos de Pesquisa
        </h1>

        <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
          Acompanhe e gerencie formulários para ajudar a melhorar as condições em moradias precárias.
        </p>
        <p className="text-gray-600">
          Inicie um novo formulário ou revise os dados coletados.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-10 place-items-center">
          <Link to="/create-selagem" className="w-full max-w-[320px]">
            <div className="group w-full text-center">
              <img
                src="/pesquisa7.jpg"
                alt="Nova Selagem"
                className="w-full aspect-square object-cover border border-gray-300 rounded-xl transition-transform duration-300 group-hover:scale-[1.02] shadow-sm"
              />
              <p className="mt-3 text-sm text-gray-700">Iniciar nova Selagem</p>
            </div>
          </Link>

          <Link to="/lista-selagens" className="w-full max-w-[320px]">
            <div className="group w-full text-center">
              <img
                src="/pesquisa6.jpg"
                alt="Listar Selagens"
                className="w-full aspect-square object-cover border border-gray-300 rounded-xl transition-transform duration-300 group-hover:scale-[1.02] shadow-sm"
              />
              <p className="mt-3 text-sm text-gray-700">Visualizar Selagens</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
