import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { z } from "zod";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiLock, FiBook, FiArrowRight } from "react-icons/fi";

// Définition du type pour le formulaire d'inscription
interface RegisterFormData {
  prenom: string;
  nom: string;
  email: string;
  password: string;
  institut: string;
}

const registerSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer un email valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  institut: z.string().min(2, "Le nom de l'institut est requis"),
});

// Type pour le formulaire d'inscription (basé sur le schéma de validation)
type RegisterFormValues = {
  prenom: string;
  nom: string;
  email: string;
  password: string;
  institut: string;
};

interface InputFieldProps {
  name: keyof RegisterFormValues | string;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const InputField = React.memo<InputFieldProps>(({ 
  name, 
  type = "text", 
  placeholder, 
  icon: Icon,
  required = true,
  value,
  onChange,
  error
}) => (
  <div className="mb-4">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
        placeholder={placeholder}
        required={required}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
));
InputField.displayName = 'InputField';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    institut: "",
  });
  
  // Type pour les erreurs de formulaire
  type FormErrors = Partial<Record<keyof RegisterFormValues, string>>;
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Efface l'erreur quand l'utilisateur tape
    if (errors[name as keyof RegisterFormValues]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof RegisterFormValues];
        return newErrors;
      });
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validation du formulaire
      registerSchema.parse(formData);
      setErrors({});
      
      // Préparer les données pour l'API avec les noms de champs attendus
      const apiPayload = {
        email: formData.email,
        password: formData.password,
        first_name: formData.prenom,
        last_name: formData.nom,
        institut: formData.institut,
        // Le username sera généré côté serveur à partir de l'email
      };
      
      // Soumission de l'inscription
      await register(apiPayload as any); // Conversion de type temporaire
      
      // Message de succès
      toast.success("Inscription réussie ! Veuillez vous connecter.");
      
      // Redirection vers la page de connexion
      navigate("/login");
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      
      if (error instanceof z.ZodError) {
        // Gestion des erreurs de validation
        const fieldErrors: FormErrors = {};
        error.errors.forEach(err => {
          const path = err.path[0] as keyof RegisterFormValues;
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      } else if (error.response?.data) {
        // Gestion des erreurs d'API
        const apiErrors = error.response.data;
        
        // Afficher les erreurs de validation du serveur
        if (typeof apiErrors === 'object') {
          const fieldErrors: FormErrors = {};
          
          // Convertir les erreurs du serveur au format attendu par le formulaire
          Object.entries(apiErrors).forEach(([field, messages]) => {
            const formField = field === 'first_name' ? 'prenom' :
                            field === 'last_name' ? 'nom' :
                            field as keyof RegisterFormValues;
            
            if (Array.isArray(messages)) {
              fieldErrors[formField] = messages[0];
            } else if (typeof messages === 'string') {
              fieldErrors[formField] = messages;
            }
          });
          
          setErrors(fieldErrors);
          
          // Afficher un message d'erreur général si aucune erreur de champ spécifique n'est disponible
          if (Object.keys(fieldErrors).length === 0) {
            toast.error("Une erreur est survenue lors de l'inscription");
          }
        } else {
          toast.error(apiErrors.detail || "Une erreur est survenue lors de l'inscription");
        }
      } else {
        toast.error("Une erreur est survenue lors de la connexion au serveur");
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, navigate, register]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Déjà inscrit ?{' '}
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Connectez-vous ici
            </a>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputField 
                name="prenom"
                type="text"
                placeholder="Prénom"
                icon={FiUser}
                value={formData.prenom}
                onChange={handleChange}
                error={errors.prenom}
              />
            </div>
            <div>
              <InputField 
                name="nom"
                type="text"
                placeholder="Nom"
                icon={FiUser}
                value={formData.nom}
                onChange={handleChange}
                error={errors.nom}
              />
            </div>
          </div>

          <InputField 
            name="email"
            type="email"
            placeholder="Adresse email"
            icon={FiMail}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <InputField 
            name="password"
            type="password"
            placeholder="Mot de passe"
            icon={FiLock}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <InputField 
            name="institut"
            type="text"
            placeholder="Votre établissement"
            icon={FiBook}
            value={formData.institut}
            onChange={handleChange}
            error={errors.institut}
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium ${
                isLoading 
                  ? 'bg-indigo-400' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Inscription en cours...
                </>
              ) : (
                <>
                  S'inscrire
                  <FiArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
