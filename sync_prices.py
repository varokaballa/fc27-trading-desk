"""
FC 27 Trading Desk - Price Synchronization & Helper Utility
Este script permite a los usuarios consultar y refrescar los precios de referencia
de FUTBIN y FUTGG para el FC 27 Trading Desk.
"""

import json
import os
import sys
from datetime import datetime

# Garantizar compatibilidad con salida UTF-8 en consolas Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

PRICES_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "prices.json")

def load_prices():
    if os.path.exists(PRICES_FILE):
        try:
            with open(PRICES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[!] Error leyendo {PRICES_FILE}: {e}")
    return None

def save_prices(data):
    try:
        data["updated_at"] = datetime.now().isoformat()
        with open(PRICES_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"[OK] Archivo de precios actualizado en: {PRICES_FILE}")
        return True
    except Exception as e:
        print(f"[!] Error guardando {PRICES_FILE}: {e}")
        return False

def show_summary():
    data = load_prices()
    if not data:
        print("[!] No se encontraron datos de precios.")
        return

    print("=" * 72)
    print("        FC 27 TRADING DESK - MONITOR DE PRECIOS & CERTEZA")
    print("=" * 72)
    print(f"Ultima actualizacion: {data.get('updated_at', 'Desconocida')}")
    print(f"Fuente: {data.get('source', 'FUTBIN/FUTGG Feed')}")
    print("-" * 72)
    print(f"{'Activo / Jugador':<26} | {'Cotizacion':<10} | {'Soporte':<10} | {'Techo':<10} | {'Certeza'}")
    print("-" * 72)

    for item in data.get("items", []):
        name = item.get("name", "N/A")[:25]
        curr = f"{item.get('current_price', 0):,} m"
        buy = f"{item.get('buy_support', 0):,} m"
        sell = f"{item.get('sell_target', 0):,} m"
        cert = item.get("certainty_label", "").replace("🔴 ", "[SENAL] ").replace("🟢 ", "[CONFIR] ").replace("🔵 ", "[PATRON] ").replace("🟡 ", "[HIPOT] ")
        print(f"{name:<26} | {curr:<10} | {buy:<10} | {sell:<10} | {cert}")

    print("=" * 72)

if __name__ == "__main__":
    show_summary()
