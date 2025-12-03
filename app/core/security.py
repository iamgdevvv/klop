from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

# Skema ini membuat tombol "Authorize" (Gembok) muncul di Swagger UI
security_scheme = HTTPBearer()


def verify_api_token(
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
):
    """
    Fungsi Dependency untuk memvalidasi Bearer Token.
    Client harus mengirim Header -> Authorization: Bearer <TOKEN_DI_ENV>
    """
    token = credentials.credentials

    if token != settings.API_SECRET_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authentication Token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return token
