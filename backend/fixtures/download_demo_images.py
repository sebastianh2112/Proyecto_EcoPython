"""
Script auxiliar: descarga imagenes de placeholder desde Picsum Photos
y las guarda en backend/media/products/ con los nombres que usa demo_data.json.

Uso:
    python backend/fixtures/download_demo_images.py

Requisitos: requests (pip install requests)
"""

import os
import requests

MEDIA_DIR = os.path.join(os.path.dirname(__file__), "..", "media", "products")

IMAGES = {
    "demo-laptop.jpg":       "https://picsum.photos/seed/laptop/600/400",
    "demo-teclado.jpg":      "https://picsum.photos/seed/teclado/600/400",
    "demo-monitor.jpg":      "https://picsum.photos/seed/monitor/600/400",
    "demo-mouse.jpg":        "https://picsum.photos/seed/mouse/600/400",
    "demo-auriculares.jpg":  "https://picsum.photos/seed/auriculares/600/400",
    "demo-camara.jpg":       "https://picsum.photos/seed/camara/600/400",
    "demo-hub-usb.jpg":      "https://picsum.photos/seed/hub/600/400",
    "demo-camiseta.jpg":     "https://picsum.photos/seed/camiseta/600/400",
    "demo-jeans.jpg":        "https://picsum.photos/seed/jeans/600/400",
    "demo-chaqueta.jpg":     "https://picsum.photos/seed/chaqueta/600/400",
    "demo-polo.jpg":         "https://picsum.photos/seed/polo/600/400",
    "demo-bermuda.jpg":      "https://picsum.photos/seed/bermuda/600/400",
    "demo-sudadera.jpg":     "https://picsum.photos/seed/sudadera/600/400",
    "demo-calcetines.jpg":   "https://picsum.photos/seed/calcetines/600/400",
    "demo-bolso.jpg":        "https://picsum.photos/seed/bolso/600/400",
    "demo-gafas.jpg":        "https://picsum.photos/seed/gafas/600/400",
    "demo-billetera.jpg":    "https://picsum.photos/seed/billetera/600/400",
    "demo-pulsera.jpg":      "https://picsum.photos/seed/pulsera/600/400",
    "demo-mochila.jpg":      "https://picsum.photos/seed/mochila/600/400",
    "demo-reloj.jpg":        "https://picsum.photos/seed/reloj/600/400",
    "demo-bufanda.jpg":      "https://picsum.photos/seed/bufanda/600/400",
    "demo-cafetera.jpg":     "https://picsum.photos/seed/cafetera/600/400",
    "demo-cuchillos.jpg":    "https://picsum.photos/seed/cuchillos/600/400",
    "demo-lampara.jpg":      "https://picsum.photos/seed/lampara/600/400",
    "demo-almohada.jpg":     "https://picsum.photos/seed/almohada/600/400",
    "demo-organizador.jpg":  "https://picsum.photos/seed/organizador/600/400",
    "demo-hervidor.jpg":     "https://picsum.photos/seed/hervidor/600/400",
    "demo-sabanas.jpg":      "https://picsum.photos/seed/sabanas/600/400",
    "demo-zapatillas.jpg":   "https://picsum.photos/seed/zapatillas/600/400",
    "demo-mancuernas.jpg":   "https://picsum.photos/seed/mancuernas/600/400",
    "demo-esterilla.jpg":    "https://picsum.photos/seed/esterilla/600/400",
    "demo-botella.jpg":      "https://picsum.photos/seed/botella/600/400",
    "demo-cuerda.jpg":       "https://picsum.photos/seed/cuerda/600/400",
    "demo-guantes.jpg":      "https://picsum.photos/seed/guantes/600/400",
    "demo-bandas.jpg":       "https://picsum.photos/seed/bandas/600/400",
}


def main():
    os.makedirs(MEDIA_DIR, exist_ok=True)
    total = len(IMAGES)
    for i, (filename, url) in enumerate(IMAGES.items(), 1):
        dest = os.path.join(MEDIA_DIR, filename)
        if os.path.exists(dest):
            print(f"[{i}/{total}] ya existe: {filename}")
            continue
        print(f"[{i}/{total}] descargando {filename}...", end=" ", flush=True)
        try:
            response = requests.get(url, timeout=15)
            response.raise_for_status()
            with open(dest, "wb") as f:
                f.write(response.content)
            print("OK")
        except Exception as e:
            print(f"ERROR: {e}")

    print(f"\nImagenes guardadas en: {os.path.abspath(MEDIA_DIR)}")


if __name__ == "__main__":
    main()
