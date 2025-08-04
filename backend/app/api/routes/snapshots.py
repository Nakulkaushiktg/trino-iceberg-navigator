from fastapi import APIRouter, HTTPException, Query
from app.core.trino_client import get_trino_connection, TRINO_SERVERS
from trino.exceptions import TrinoUserError

router = APIRouter()

@router.get("/snapshots", tags=["Snapshots"])
def get_snapshots(
    server: str = Query(...),
    catalog: str = Query(...),
    schema: str = Query(...),
    table: str = Query(...)
):
    trino_server = TRINO_SERVERS.get(server)
    if not trino_server:
        raise HTTPException(status_code=404, detail="Trino server not found")

    try:
        conn = get_trino_connection(
            host=trino_server["host"],
            port=trino_server["port"],
            user=trino_server["user"],
            catalog=catalog,
            schema=schema
        )
        cursor = conn.cursor()

        # Try fetching snapshot data
        try:
            cursor.execute(f'''
                SELECT 
                    snapshot_id,
                    committed_at,
                    operation,
                    summary 
                FROM "{catalog}"."{schema}"."{table}$snapshots"
                ORDER BY committed_at DESC
                LIMIT 50
            ''')
            result = cursor.fetchall()
            snapshots = [
                {
                    "snapshot_id": row[0],
                    "committed_at": row[1],
                    "operation": row[2],
                    "summary": row[3]
                }
                for row in result
            ]
        except Exception:
            # If table or snapshot system table doesn't exist, return empty list
            snapshots = None

        return {
            "catalog": catalog,
            "schema": schema,
            "table": table,
            "snapshots": snapshots
        }

    except TrinoUserError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
