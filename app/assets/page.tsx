import React from "react";

const ContainerForSections = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <>
      <text className="text-2xl font-medium text-content-normal text-center items-center justify-center flex pb-10">
        {title}
      </text>
      <div className="flex flex-row justify-evenly gap-4 pb-10 mb-10 border-b border-b-content-muted">
        {children}
      </div>
    </>
  );
};

export default function AssetsPage() {
  return (
    <main className="bg-white h-full">
      <main className="container mx-auto p-4">
        <text className="text-2xl font-bold text-center items-center justify-center flex pb-10">
          {" "}
          Pagina de visualizacion de estilos del sistema
        </text>
        <ContainerForSections title="Backgrounds Colors">
          <div>
            <section className="bg-main-background-color p-20 rounded-full mb-3 border border-border-main" />
            <text className="text-center">Main Background Color</text>
          </div>
          <div>
            <section className="bg-secondary-background-color p-20 rounded-full mb-3 border border-border-main" />
            <text className="text-center">Secondary Background Color</text>
          </div>
          <div>
            <section className="bg-tertiary-background-color p-20 rounded-full mb-3 border border-border-main" />
            <text className="text-center">Tertiary Background Color</text>
          </div>
        </ContainerForSections>
        <ContainerForSections title="Border Colors">
          <div>
            <section className="bg-border-main p-20 rounded-full mb-3 border border-border-main" />
            <text className="text-center">Border Main Color</text>
          </div>
          <div>
            <section className="bg-border-strong p-20 rounded-full mb-3 border border-border-main" />
            <text className="text-center">Border Strong Color</text>
          </div>
        </ContainerForSections>
        <ContainerForSections title="Text Colors">
          <text className="text-content-strong font-semibold text-2xl">
            text-content-strong
          </text>
          <text className="text-content-normal font-semibold text-2xl">
            text-content-normal
          </text>
          <text className="text-content-muted font-semibold text-2xl">
            text-content-muted
          </text>
          <text className="text-content-subtle font-semibold text-2xl">
            text-content-subtle
          </text>
          <text className="text-content-disable font-semibold text-2xl">
            text-content-disable
          </text>
        </ContainerForSections>
        <ContainerForSections title="Accent bg and content Colores">
          <div className="flex flex-col items-center justify-center w-[450px] h-[100px] border rounded-lg bg-accent-alert-bg border-accent-alert-content">
            <text className="text-accent-alert-content">
              Estilo de un componente de alerta.
            </text>
          </div>
          <div className="flex flex-col items-center justify-center w-[450px] h-[100px] border rounded-lg bg-accent-error-bg border-accent-error-content">
            <text className="text-accent-error-content">
              Estilo de un componente de Error.
            </text>
          </div>
          <div className="flex flex-col items-center justify-center w-[450px] h-[100px] border rounded-lg bg-accent-succes-bg border-accent-succes-content">
            <text className="text-accent-succes-content">
              Estilo de un componente de alerta.
            </text>
          </div>
        </ContainerForSections>
      </main>
    </main>
  );
}
