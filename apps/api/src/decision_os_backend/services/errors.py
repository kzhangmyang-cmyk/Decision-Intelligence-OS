class ServiceError(Exception):
    """Base service-layer exception."""


class NotFoundError(ServiceError):
    """Raised when a requested resource does not exist."""


class ConflictError(ServiceError):
    """Raised when a request cannot proceed because a prerequisite state is missing."""
