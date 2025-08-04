from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import servers, catalogs, schemas, tables, metadata, actions, ddl, snapshots, statistics





app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(servers.router)
app.include_router(catalogs.router)
app.include_router(schemas.router)
app.include_router(tables.router)
app.include_router(ddl.router)
app.include_router(metadata.router)
app.include_router(snapshots.router)
app.include_router(statistics.router)
app.include_router(actions.router)
