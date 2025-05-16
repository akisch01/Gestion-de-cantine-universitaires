"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import sys
from pathlib import Path

# Configuration cruciale du chemin
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(BASE_DIR))  # Ajoute la racine du projet au PYTHONPATH

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.backend.settings')

# Import Django en premier
from django.core.asgi import get_asgi_application
django_application = get_asgi_application()

# Imports Channels ensuite
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from backend.cantine.consumers import JWTAuthMiddleware

# Import de l'application cantine
try:
    from backend.cantine.routing import websocket_urlpatterns
except ImportError:
    from cantine.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": django_application,
    "websocket": AllowedHostsOriginValidator(
        JWTAuthMiddleware(
            AuthMiddlewareStack(
                URLRouter(websocket_urlpatterns)
            )
        )
    ),
})