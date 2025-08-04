from fastapi import APIRouter, HTTPException, Query
from app.core.trino_client import TRINO_SERVERS, get_trino_connection
from concurrent.futures import ThreadPoolExecutor, as_completed
import traceback

router = APIRouter()

def enrich_catalog(catalog_name, server_info):
    table_count, schema_count = 0, 0
    try:
        conn_catalog = get_trino_connection(
            host=server_info["host"],
            port=server_info["port"], 
            user=server_info["user"],
            catalog=catalog_name,
            schema="information_schema"
        )
        cursor = conn_catalog.cursor()

        # Table count
        try:
            cursor.execute("SELECT COUNT(*) FROM information_schema.tables")
            table_count = cursor.fetchone()[0]
        except Exception as e:
            print(f"[WARN] Failed to count tables in {catalog_name}: {e}")

        # Schema count
        try:
            cursor.execute("SELECT COUNT(*) FROM information_schema.schemata")
            schema_count = cursor.fetchone()[0]
        except Exception as e:
            print(f"[WARN] Failed to count schemas in {catalog_name}: {e}")

        return {
            "name": catalog_name,
            "tables": table_count,
            "schemas": schema_count,
            "description": "Catalog fetched successfully"
        } 

    except Exception as e:
        print(f"[ERROR] Error enriching {catalog_name}: {e}")
        traceback.print_exc()
        return {
            "name": catalog_name,
            "tables": 0,
            "schemas": 0,
            "description": "N/A"
        }

@router.get("/catalogs", tags=["Catalogs"])
def fetch_catalogs(server: str = Query(...)):
    print(f"[INFO] Fetching catalogs for server: {server}")
    server_info = TRINO_SERVERS.get(server)
    if not server_info:
        raise HTTPException(status_code=404, detail="Server not found")

    try:
        conn = get_trino_connection(
            host=server_info["host"],
            port=server_info["port"],
            user=server_info["user"],
            catalog="system",
            schema="information_schema"
        )
        cursor = conn.cursor()
        cursor.execute("SHOW CATALOGS")
        catalog_names = [row[0] for row in cursor.fetchall()]
        print(f"[INFO] Found {len(catalog_names)} catalogs")

        enriched_catalogs = []
        with ThreadPoolExecutor(max_workers=min(10, len(catalog_names))) as executor:
            futures = [executor.submit(enrich_catalog, name, server_info) for name in catalog_names]
            for future in as_completed(futures):
                try:
                    enriched_catalogs.append(future.result())
                except Exception as e:
                    print(f"[ERROR] Thread failed: {e}")
                    traceback.print_exc()

        return enriched_catalogs

    except Exception as e:
        print(f"[FATAL] Failed to fetch catalogs: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
