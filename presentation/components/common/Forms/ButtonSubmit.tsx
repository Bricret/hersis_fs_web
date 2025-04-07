import { LoaderCircleIcon } from "lucide-react";
import { Button } from "../../ui/button";

export default function ButtonSubmit({ loading }: { loading: boolean }) {
  return (
    <Button disabled={loading} type="submit">
      {loading ? (
        <>
          <LoaderCircleIcon
            className="-ms-1 animate-spin"
            size={16}
            aria-hidden="true"
          />
          Guardando...
        </>
      ) : (
        "Guardar"
      )}
    </Button>
  );
}
