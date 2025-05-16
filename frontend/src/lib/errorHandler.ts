import { AxiosError } from "axios";

export interface ApiError {
    message: string;
    code: string;
    status: number;
    details?: Record<string, string[]>;
}

export class ApiErrorHandler {
    static handle(error: unknown): ApiError {
        if (error instanceof AxiosError) {
            const response = error.response;
            
            // Erreur de validation
            if (response?.status === 400) {
                return {
                    message: "Erreur de validation",
                    code: "VALIDATION_ERROR",
                    status: 400,
                    details: response.data
                };
            }

            // Erreur d'authentification
            if (response?.status === 401) {
                return {
                    message: "Non authentifié",
                    code: "UNAUTHORIZED",
                    status: 401
                };
            }

            // Erreur d'autorisation
            if (response?.status === 403) {
                return {
                    message: "Non autorisé",
                    code: "FORBIDDEN",
                    status: 403
                };
            }

            // Erreur de ressource non trouvée
            if (response?.status === 404) {
                return {
                    message: "Ressource non trouvée",
                    code: "NOT_FOUND",
                    status: 404
                };
            }

            // Erreur de conflit (ex: réservation déjà existante)
            if (response?.status === 409) {
                return {
                    message: response.data.message || "Conflit",
                    code: "CONFLICT",
                    status: 409
                };
            }

            // Erreur serveur
            if ((response?.status ?? 0) >= 500) {
                return {
                    message: "Erreur serveur",
                    code: "SERVER_ERROR",
                    status: response?.status ?? 500
                };
            }

            // Erreur par défaut
            return {
                message: response?.data?.message || "Une erreur est survenue",
                code: "UNKNOWN_ERROR",
                status: response?.status || 500
            };
        }

        // Erreur non-Axios
        return {
            message: "Une erreur inattendue est survenue",
            code: "UNKNOWN_ERROR",
            status: 500
        };
    }

    static isValidationError(error: ApiError): boolean {
        return error.status === 400;
    }

    static isAuthError(error: ApiError): boolean {
        return error.status === 401;
    }

    static isForbiddenError(error: ApiError): boolean {
        return error.status === 403;
    }

    static isNotFoundError(error: ApiError): boolean {
        return error.status === 404;
    }

    static isConflictError(error: ApiError): boolean {
        return error.status === 409;
    }

    static isServerError(error: ApiError): boolean {
        return error.status >= 500;
    }
} 