# backend/app/api/routes/actions.py
from fastapi import APIRouter, HTTPException, Query
from app.core.trino_client import get_trino_connection, TRINO_SERVERS
from trino.exceptions import TrinoUserError

router = APIRouter()


def run_action_query(server, catalog, schema, table, query):
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
        cursor.execute(query)
        result = cursor.fetchone()
        return result if result else True
    except TrinoUserError as e:
        if "PROCEDURE_NOT_FOUND" in str(e):
            return "PROCEDURE_NOT_FOUND"
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/actions/expire-snapshots", tags=["Actions"])
def expire_snapshots(
    server: str = Query(...),
    catalog: str = Query(...),
    schema: str = Query(...),
    table: str = Query(...),
    older_than: int = Query(...)
):
    query = f"""
        CALL system.expire_snapshots(
            '{catalog}',
            '{schema}',
            '{table}',
            TIMESTAMP 'now' - INTERVAL '{older_than}' day
        )
    """
    result = run_action_query(server, catalog, schema, table, query)

    if result == "PROCEDURE_NOT_FOUND":
        return {
            "expired_snapshots": 0,
            "note": "expire_snapshots procedure not supported or table is not Iceberg"
        }

    return {
        "expired_snapshots": result[0] if result and isinstance(result, tuple) else 0
    }


@router.post("/actions/remove-orphans", tags=["Actions"])
def remove_orphan_files(
    server: str = Query(...),
    catalog: str = Query(...),
    schema: str = Query(...),
    table: str = Query(...)
):
    query = f"CALL system.remove_orphan_files('{catalog}.{schema}.{table}')"
    result = run_action_query(server, catalog, schema, table, query)

    if result == "PROCEDURE_NOT_FOUND":
        return {
            "status": "skipped",
            "action": "remove_orphan_files",
            "note": "remove_orphan_files not supported or not an Iceberg table"
        }

    return {
        "status": "success",
        "action": "remove_orphan_files"
    }


@router.post("/actions/optimize", tags=["Actions"])
def optimize_table(
    server: str = Query(...),
    catalog: str = Query(...),
    schema: str = Query(...),
    table: str = Query(...)
):
    query = f"CALL system.optimize('{catalog}.{schema}.{table}')"
    result = run_action_query(server, catalog, schema, table, query)

    if result == "PROCEDURE_NOT_FOUND":
        return {
            "status": "skipped",
            "action": "optimize",
            "note": "optimize not supported or not an Iceberg table"
        }

    return {
        "status": "success",
        "action": "optimize"
    }
