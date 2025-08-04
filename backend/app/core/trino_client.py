from trino.dbapi import connect

# No need to import unused modules
TRINO_SERVERS = {
    "trino-1ds": {
        "host": "trino.1digitalstack.com",
        "port": 8080,
        "user": "nakul_1ds"
    }
}

def get_available_trino_servers():
    return [
        {
            "name": "trino-1ds",
            "host": "trino.1digitalstack.com",
            "port": 8080,
            "user": "nakul_1ds"
        }
    ]

def get_trino_connection(host: str, port: int, user: str, catalog: str, schema: str):
    return connect(
        host=host,
        port=port,
        user=user,
        catalog=catalog,
        schema=schema
    )

def fetch_catalogs(server_name: str):
    print("📍 Fetching catalogs for:", server_name)  # Debug
    server = TRINO_SERVERS.get(server_name)
    if not server:
        print("❌ Server not found")
        raise ValueError("Trino server not found")

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
        result = cursor.fetchall()
        print("✅ Catalogs fetched:", result)
        return [row[0] for row in result]
    except Exception as e:
        print("❌ Exception in fetch_catalogs:", e)
        raise

def get_table_metadata(host: str, port: int, user: str, catalog: str, schema: str, table: str):
    conn = get_trino_connection(host, port, user, catalog, schema)
    cursor = conn.cursor()

    # Total row count
    try:
        query = f'''
            SELECT 
                COUNT(*) as total_rows 
            FROM "{catalog}"."{schema}"."{table}"
        '''
        cursor.execute(query)
        total_rows = cursor.fetchone()[0]
    except Exception as e:
        total_rows = None

    # Snapshot info (only available for Iceberg tables)
    try:
        query = f'''
            SELECT 
                COUNT(*) as snapshot_count,
                MAX(committed_at) as latest_snapshot_at
            FROM "{catalog}"."{schema}"."{table}$snapshots"
        '''
        cursor.execute(query)
        result = cursor.fetchone()
        snapshot_count = result[0]
        latest_snapshot = result[1]
    except Exception as e:
        snapshot_count = None
        latest_snapshot = None

    return {
        "total_rows": total_rows,
        "snapshot_count": snapshot_count,
        "latest_snapshot": str(latest_snapshot) if latest_snapshot else None
    }
