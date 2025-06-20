import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    const tag = searchParams.get("tag");

    if (path) {
      revalidatePath(path, "page");
      revalidatePath(path, "layout");
    }

    if (tag) {
      revalidateTag(tag);
    }

    // Si no se especifica path ni tag, revalidar las rutas principales
    if (!path && !tag) {
      const defaultPaths = [
        "/inventory",
        "/shop",
        "/",
        "/dashboard",
        "/stats",
        "/reports",
      ];

      defaultPaths.forEach((p) => {
        revalidatePath(p, "page");
        revalidatePath(p, "layout");
      });

      const defaultTags = ["inventory", "products", "shop", "cash", "sales"];

      defaultTags.forEach((t) => {
        revalidateTag(t);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Cache revalidado exitosamente",
      revalidated: { path, tag },
    });
  } catch (error) {
    console.error("Error al revalidar cache:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al revalidar cache",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
