import logging

from fastapi import (  # pyright: ignore[reportMissingImports]
    Depends,
    FastAPI,
    Request,
    status,
)
from fastapi.middleware.cors import (  # pyright: ignore[reportMissingImports]
    CORSMiddleware,  # pyright: ignore[reportMissingImports]
)
from fastapi.responses import JSONResponse  # pyright: ignore[reportMissingImports]
from starlette.exceptions import (  # pyright: ignore[reportMissingImports]
    HTTPException as StarletteHTTPException,  # pyright: ignore[reportMissingImports]
)

from app.core.security import verify_api_token
from app.modules.answers.router import router as answers_router
from app.modules.assessments.router import router as assessments_router
from app.modules.questions.router import router as questions_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Klop! AI Assessment API",
    description="AI untuk generate soal, enhance, scoring, dan insight.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    dependencies=[Depends(verify_api_token)],
)

origins = [
    "https://klop-ai.vercel.app",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Exception: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "code": 500,
            "success": False,
            "message": f"Internal Server Error: {str(exc)}",
            "data": None,
        },
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.status_code,
            "success": False,
            "message": exc.detail,
            "data": None,
        },
    )


app.include_router(questions_router, prefix="/api/v1/question", tags=["Question"])
app.include_router(answers_router, prefix="/api/v1/answer", tags=["Answer"])
app.include_router(assessments_router, prefix="/api/v1/assessment", tags=["Assessment"])


@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok", "service": "Klop! AI", "version": "1.0.0"}


@app.get("/", include_in_schema=False)
def root():
    return {"message": "Welcome to Klop! AI API. Go to /docs for Swagger UI."}
