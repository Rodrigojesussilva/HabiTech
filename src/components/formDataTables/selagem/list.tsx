import { useEffect, useState } from "react";
import axios from "axios";
import { columns, SelagemItem } from "./columns";
import { DataTable } from "./data-table";

const API_URL = "https://api.seu-servidor.com.br/selagem"; // substitua pela URL real

const ListSelagem = () => {
  const [data, setData] = useState<SelagemItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar dados de selagem:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Selagens</h2>
      <p className="text-muted-foreground mb-6">
        Visualize ou modifique os dados de selagem.
      </p>

      {loading ? (
        <div className="text-muted-foreground">Carregando dados...</div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
};

export default ListSelagem;
