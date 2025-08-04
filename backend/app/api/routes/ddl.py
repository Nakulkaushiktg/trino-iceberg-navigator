from fastapi import APIRouter, HTTPException, Query
from app.core.trino_client import get_trino_connection
from trino.exceptions import TrinoUserError

router = APIRouter()

@router.get("/ddl", tags=["DDL"])
def get_table_ddl(
    server: str = Query(...),
    catalog: str = Query(...),
    schema: str = Query(...),
    table: str = Query(...)
):
    try:
        from app.core.trino_client import TRINO_SERVERS
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
        cursor.execute(f"SHOW CREATE TABLE {catalog}.{schema}.{table}")
        ddl_result = cursor.fetchall()
        return {"ddl": ddl_result[0][0] if ddl_result else ""}
    except TrinoUserError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
