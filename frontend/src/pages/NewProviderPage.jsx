// src/pages/NewProviderPage.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { providerSchema } from "../utils/validators";
import { createProvider } from "../api/providers";
import { useNavigate } from "react-router-dom";

// Componentes MUI
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

const NewProviderPage = () => {
  const navigate = useNavigate();

  // Inicializar useForm con resolver de Yup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(providerSchema),
    defaultValues: {
      name: "",
      address: "",
      contact: "",
    },
    mode: "onBlur", // valida al perder el foco; puedes usar "onChange" para validación en cada tecla
  });

  const onSubmit = async (data) => {
    try {
      await createProvider(data);
      navigate("/providers");
    } catch (err) {
      // si el back retorna error, podrías mapearlo aquí y mostrarlo
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Registrar Nuevo Proveedor
      </Typography>

      {/* Si hay un error global (por ejemplo, proveedor duplicado) */}
      {/* <Alert severity="error">El proveedor ya existe</Alert> */}

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Campo Nombre */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nombre"
              variant="outlined"
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          )}
        />

        {/* Campo Dirección */}
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Dirección"
              variant="outlined"
              fullWidth
              error={Boolean(errors.address)}
              helperText={errors.address?.message}
            />
          )}
        />

        {/* Campo Contacto / Email */}
        <Controller
          name="contact"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Contacto (email)"
              variant="outlined"
              fullWidth
              error={Boolean(errors.contact)}
              helperText={errors.contact?.message}
            />
          )}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/providers")}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NewProviderPage;
