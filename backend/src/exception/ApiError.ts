export class ApiError extends Error {
  public status: number;
  public timestamp: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
  }
}

export class NotFoundException extends ApiError {
  constructor(message = 'Recurso no encontrado') {
    super(404, message);
  }
}

export class ConflictException extends ApiError {
  constructor(message = 'Conflicto') {
    super(409, message);
  }
}

export class BadRequestException extends ApiError {
  constructor(message = 'Solicitud incorrecta') {
    super(400, message);
  }
}

export class UnauthorizedException extends ApiError {
  constructor(message = 'No autorizado') {
    super(401, message);
  }
}

export class ForbiddenException extends ApiError {
  constructor(message = 'Prohibido') {
    super(403, message);
  }
}

export class BusinessException extends ApiError {
  constructor(message = 'Error de negocio') {
    super(400, message);
  }
}
