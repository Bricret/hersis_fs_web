import { LoaderCircleIcon } from "lucide-react";
import { Button } from "../../ui/button";

export default function ButtonSubmit({
  loading,
  text,
}: {
  loading: boolean;
  text: string;
}) {
  return (
    <Button
      disabled={loading}
      type="submit"
      onClick={(e) => e.currentTarget.form?.requestSubmit()}
    >
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
        text
      )}
    </Button>
  );
}
