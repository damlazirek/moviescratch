import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function WatchedPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="font-ui mb-3 text-xs tracking-[0.2em] uppercase text-spotlight">
        History
      </p>
      <h1 className="font-display text-3xl text-paper sm:text-5xl">Watched</h1>
      <p className="mt-4 text-muted">
        Films you commit to will land here. Storage wires up after the reveal
        flow.
      </p>
      <div className="mt-10 border border-dashed border-line px-6 py-16 text-center">
        <p className="font-ui text-sm text-muted">No tickets stamped yet.</p>
        <Link to="/lists" className="mt-6 inline-block">
          <Button>Choose a list</Button>
        </Link>
      </div>
    </div>
  );
}
