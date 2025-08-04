# app/api/routes/schemas.py

from fastapi import APIRouter, HTTPException, Query
from app.core.trino_client import TRINO_SERVERS, get_trino_connection

router = APIRouter()

@router.get("/schemas", tags=["Schemas"])
def list_schemas(
    server: str = Query(...),
    catalog: str = Query(...)
):
    server_info = TRINO_SERVERS.get(server)

    if not server_info:
        raise HTTPException(status_code=404, detail="Trino server not found")

    try:
        conn = get_trino_connection(
            host=server_info["host"],
            port=server_info["port"],
            user=server_info["user"],
            catalog=catalog,
            schema="information_schema"
        )

        cursor = conn.cursor()
        cursor.execute("SHOW SCHEMAS")
        schema_rows = cursor.fetchall()
        schema_names = [row[0] for row in schema_rows]

        results = []
        for schema in schema_names:
            try:
                cursor.execute(f"SHOW TABLES FROM {schema}")
                tables = [row[0] for row in cursor.fetchall()]
                table_count = len(tables)

                results.append({
                    "name": schema,
                    "tables": table_count,
                    "size": "N/A",  # You can keep this if frontend expects it
                    "description": "Fetched successfully"
                })
            except:
                results.append({
                    "name": schema,
                    "tables": "N/A",
                    "size": "N/A",
                    "description": "No description"
                })

        return {"schemas": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
