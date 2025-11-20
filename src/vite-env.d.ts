/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_APP_NAME: string;
    // Agrega aquí todas las variables de entorno que uses,
    // con su respectivo tipo.
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}