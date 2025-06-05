from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"

    def ready(self) -> None:  # pragma: no cover - import side effects
        # Import signal handlers
        import core.signals  # noqa: F401
