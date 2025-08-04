from fastapi import APIRouter, HTTPException, Query
from app.core.trino_client import get_trino_connection, TRINO_SERVERS
from trino.exceptions import TrinoUserError

router = APIRouter()

@router.get("/metadata", tags=["Metadata"])
def get_table_metadata(
    server: str = Query(...),
    catalog: str = Query(...),
    schema: str = Query(...),
    table: str = Query(...)
):
    try:
        trino_server = TRINO_SERVERS.get(server)
        if not trino_server:
            raise HTTPException(status_code=404, detail="Trino server not found")

        conn = get_trino_connection(
            host=trino_server["host"],
            port=trino_server["port"],
            user=trino_server["user"],
            catalog=catalog,
            schema=schema
        )
        cursor = conn.cursor()

        # --- Total rows ---
        try:
            cursor.execute(f'SELECT COUNT(*) FROM "{catalog}"."{schema}"."{table}"')
            total_rows = cursor.fetchone()[0]
        except Exception as e:
            print("Row count fetch error:", e)
            total_rows = None

        # --- Snapshot info ---
        try:
            cursor.execute(f'''
                SELECT 
                    COUNT(*) as snapshot_count,
                    MAX(committed_at) as last_snapshot_time
                FROM "{catalog}"."{schema}"."{table}$snapshots"
            ''')
            snapshot_result = cursor.fetchone()
            snapshot_count = snapshot_result[0]
            last_snapshot_time = snapshot_result[1]
        except Exception as e:
            print("Snapshot fetch error:", e)
            snapshot_count = None
            last_snapshot_time = None

        # --- Data size (MB) ---
        try:
            cursor.execute(f'''
                SELECT SUM(file_size_in_bytes) 
                FROM "{catalog}"."{schema}"."{table}$files"
            ''')
            bytes_result = cursor.fetchone()
            data_size = round((bytes_result[0] or 0) / (1024 * 1024), 2)
        except Exception as e:
            print("Data size fetch error:", e)
            data_size = None

        # --- Table type and format ---
        try:
            cursor.execute(f'SHOW CREATE TABLE "{catalog}"."{schema}"."{table}"')
            ddl_result = cursor.fetchone()[0]
            is_iceberg = "iceberg" in ddl_result.lower()
            table_format = "PARQUET" if "parquet" in ddl_result.lower() else "UNKNOWN"
        except Exception as e:
            print("DDL fetch error:", e)
            is_iceberg = None
            table_format = None

        return {
            "catalog": catalog,
            "schema": schema,
            "table": table,
            "total_rows": total_rows,
            "data_size_mb": data_size,
            "snapshot_count": snapshot_count,
            "last_snapshot_time": last_snapshot_time,
            "table_type": "ICEBERG" if is_iceberg else "OTHER",
            "format": table_format
        }

    except TrinoUserError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
