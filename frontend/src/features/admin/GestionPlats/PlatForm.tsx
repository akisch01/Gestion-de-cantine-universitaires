import React from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "../../../components/shared/Form";
import { platSchema } from "../../../lib/validators";
import { platsApi } from "../../../api/plats";
import { Plat, PlatRequest } from "../../../types/models";

interface PlatFormData {
    nom_plat: string;
    description: string;
    prix: number;
    image: string;
    type_plat: "standard" | "vip" | "vegetarien" | "sans_gluten";
}

interface PlatFormProps {
    platId?: number;
}

const initialValues: PlatFormData = {
    nom_plat: "",
    description: "",
    prix: 0,
    image: "",
    type_plat: "standard"
};

const fields = [
    {
        name: "nom_plat" as const,
        label: "Nom du plat",
        type: "text",
        required: true,
        placeholder: "Entrez le nom du plat"
    },
    {
        name: "description" as const,
        label: "Description",
        type: "textarea",
        required: true,
        placeholder: "Entrez la description du plat"
    },
    {
        name: "prix" as const,
        label: "Prix",
        type: "number",
        required: true,
        placeholder: "Entrez le prix du plat"
    },
    {
        name: "image" as const,
        label: "URL de l'image",
        type: "text",
        required: true,
        placeholder: "Entrez l'URL de l'image du plat"
    },
    {
        name: "type_plat" as const,
        label: "Type de plat",
        type: "select",
        required: true,
        options: [
            { label: "Standard", value: "standard" },
            { label: "VIP", value: "vip" },
            { label: "Végétarien", value: "vegetarien" },
            { label: "Sans gluten", value: "sans_gluten" }
        ]
    }
];

export function PlatForm({ platId }: PlatFormProps) {
    const navigate = useNavigate();
    const [initialData, setInitialData] = React.useState<PlatFormData>(initialValues);

    React.useEffect(() => {
        if (platId) {
            platsApi.getById(platId)
                .then((plat: Plat) => {
                    setInitialData({
                        nom_plat: plat.nom_plat,
                        description: plat.description,
                        prix: plat.prix,
                        image: plat.image,
                        type_plat: plat.type_plat
                    });
                })
                .catch((error: Error) => {
                    console.error("Erreur lors du chargement du plat:", error);
                    navigate("/admin/plats");
                });
        }
    }, [platId, navigate]);

    const handleSubmit = async (values: PlatFormData) => {
        try {
            const platData: PlatRequest = {
                ...values
            };

            if (platId) {
                await platsApi.update(platId, platData);
            } else {
                await platsApi.create(platData);
            }
            navigate("/admin/plats");
        } catch (error) {
            // La gestion des erreurs est maintenant gérée par le hook useForm
            throw error;
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
                {platId ? "Modifier le plat" : "Créer un nouveau plat"}
            </h2>
            <Form
                initialValues={initialData}
                validationSchema={platSchema}
                onSubmit={handleSubmit}
                fields={fields}
                submitLabel={platId ? "Mettre à jour" : "Créer"}
                className="space-y-6"
            />
        </div>
    );
}