#!/usr/bin/env node

/**
 * Script para verificar que el cache se está invalidando correctamente
 * Ejecutar con: node scripts/verify-cache.js
 */

const https = require("https");
const http = require("http");

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function makeRequest(url, method = "GET") {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;

    const req = client.request(url, { method }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
        });
      });
    });

    req.on("error", reject);
    req.end();
  });
}

async function testCacheRevalidation() {
  console.log("🧪 Probando revalidación de cache...\n");

  try {
    // 1. Verificar que las rutas principales responden
    console.log("1. Verificando rutas principales...");
    const routes = ["/inventory", "/shop", "/dashboard"];

    for (const route of routes) {
      const response = await makeRequest(`${BASE_URL}${route}`);
      console.log(
        `   ${route}: ${response.status === 200 ? "✅" : "❌"} (${
          response.status
        })`
      );
    }

    // 2. Probar revalidación de cache
    console.log("\n2. Probando revalidación de cache...");
    const revalidateResponse = await makeRequest(
      `${BASE_URL}/api/revalidate`,
      "POST"
    );
    console.log(
      `   API revalidate: ${revalidateResponse.status === 200 ? "✅" : "❌"} (${
        revalidateResponse.status
      })`
    );

    if (revalidateResponse.status === 200) {
      const result = JSON.parse(revalidateResponse.data);
      console.log(`   Resultado: ${result.message}`);
    }

    // 3. Verificar headers de cache
    console.log("\n3. Verificando headers de cache...");
    const inventoryResponse = await makeRequest(`${BASE_URL}/inventory`);
    const cacheHeaders = inventoryResponse.headers;

    console.log(
      `   Cache-Control: ${cacheHeaders["cache-control"] || "No encontrado"}`
    );
    console.log(
      `   ETag: ${cacheHeaders["etag"] ? "Presente" : "No encontrado"}`
    );
    console.log(
      `   Last-Modified: ${cacheHeaders["last-modified"] || "No encontrado"}`
    );

    console.log("\n✅ Verificación completada");
  } catch (error) {
    console.error("❌ Error durante la verificación:", error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testCacheRevalidation();
}

module.exports = { testCacheRevalidation };
