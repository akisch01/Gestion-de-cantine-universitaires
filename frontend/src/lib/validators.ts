import { z } from "zod";

// Schéma de validation pour l'authentification
export const loginSchema = z.object({
    email: z.string().email("L'email doit être valide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
});

// Schéma de validation pour l'inscription
export const registerSchema = z.object({
    email: z.string().email("L'email doit être valide"),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string(),
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    numeroEtudiant: z.string().regex(/^\d{8}$/, "Le numéro étudiant doit contenir 8 chiffres")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
});

// Schéma de validation pour les plats
export const platSchema = z.object({
    nom_plat: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
    prix: z.number().min(0, "Le prix doit être positif"),
    image: z.string().url("L'URL de l'image doit être valide"),
    type_plat: z.enum(["standard", "vip", "vegetarien", "sans_gluten"], {
        errorMap: () => ({ message: "Le type de plat doit être standard, vip, vegetarien ou sans_gluten" })
    })
});

// Schéma de validation pour les réservations
export const reservationSchema = z.object({
    plat: z.number().int().positive("L'ID du plat doit être positif"),
    emploi_du_temps: z.number().int().positive("L'ID de l'emploi du temps doit être positif"),
    quantite: z.number().int().positive("La quantité doit être positive"),
    supplements: z.record(z.any()).optional()
});

// Schéma de validation pour les notifications
export const notificationSchema = z.object({
    titre: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    contenu: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
    lien: z.string().url("L'URL doit être valide").optional()
});

// Fonction utilitaire pour valider les données
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
    return schema.parse(data);
};

// Fonction utilitaire pour valider les données de manière sécurisée
export const safeValidate = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } => {
    try {
        const validatedData = schema.parse(data);
        return { success: true, data: validatedData };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { 
                success: false, 
                error: error.errors.map(e => e.message).join(", ")
            };
        }
        return { 
            success: false, 
            error: "Une erreur de validation est survenue" 
        };
    }
}; 