# app/api/routes/tables.py
from fastapi import APIRouter, HTTPException, Query
from app.core.trino_client import TRINO_SERVERS, get_trino_connection
from datetime import datetime
import random

router = APIRouter()

@router.get("/tables", tags=["Tables"])
def list_tables(
    server: str = Query(...),
    catalog: str = Query(...),
    schema: str = Query(...)
):
    server_info = TRINO_SERVERS.get(server)

    if not server_info:
        raise HTTPException(status_code=404, detail="Trino server not found")
    if not catalog:
        raise HTTPException(status_code=400, detail="Catalog is required")
    if not schema:
        raise HTTPException(status_code=400, detail="Schema is required")

    try:
        conn = get_trino_connection(
            host=server_info["host"],
            port=server_info["port"],
            user=server_info["user"],
            catalog=catalog,
            schema=schema
        )

        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()

        result = []
        for row in tables:
            table_name = row[0]
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {schema}.{table_name}")
                row_count = cursor.fetchone()[0]
            except Exception:
                row_count = None

            # Dummy size for now (replace with actual size if you have metadata support)
            size = f"{round(random.uniform(0.1, 50.0), 2)} MB" if row_count else None

            # Dummy lastModified and snapshots
            last_modified = datetime.now().isoformat()
            snapshots = "ESTIMATED" if row_count else None

            result.append({
                "name": table_name,
                "rows": row_count,
                "size": size,
                "lastModified": last_modified,
                "snapshots": snapshots,
                "description": "Fetched successfully" if row_count is not None else None
            })

        return {"tables": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
