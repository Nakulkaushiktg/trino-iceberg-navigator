from fastapi import APIRouter
from app.core.trino_client import get_trino_connection, TRINO_SERVERS

router = APIRouter()

@router.get("/trino-servers")
def list_trino_servers():
    servers_info = []

    for name, server in TRINO_SERVERS.items():
        try:
            conn = get_trino_connection(
                host=server["host"],
                port=server["port"],
                user=server["user"],
                catalog="system",
                schema="information_schema"
            )
            cursor = conn.cursor()
            cursor.execute("SHOW CATALOGS")
            catalogs = cursor.fetchall()
            catalog_count = len(catalogs)
            status = "online"
        except Exception as e:
            print(f"❌ Error connecting to {name}: {e}")
            catalog_count = None
            status = "offline"

        servers_info.append({
            "name": name,
            "host": server["host"],
            "port": server["port"],
            "user": server["user"],
            "catalogs": catalog_count,
            "status": status,
            "lastConnected": "just now" if status == "online" else "N/A"
        })

    return servers_info
