import { useParams } from "react-router-dom";
import { ScratchStage } from "@/components/scratch/ScratchStage";

export function ScratchPage() {
  const { listId = "imdb-top" } = useParams();
  return <ScratchStage listId={listId} />;
}
