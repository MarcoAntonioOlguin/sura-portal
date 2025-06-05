// src/pages/NewRequestPage.jsx
import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { getProviders } from "../api/providers";
import { createRequest } from "../api/requests";
import { useNavigate } from "react-router-dom";

// 4.1. Definir esquema de validación de solicitud
const itemSchema = yup.object().shape({
  product_link: yup.string().url("Debe ser una URL válida").required("Obligatorio"),
  quantity: yup
    .number()
    .typeError("Debe ser un número")
    .positive("Mayor que 0")
    .required("Obligatorio"),
  unit_price: yup
    .number()
    .typeError("Debe ser un número")
    .positive("Mayor que 0")
    .required("Obligatorio"),
});

const requestSchema = yup.object().shape({
  provider: yup.number().required("Debes seleccionar un proveedor"),
  items: yup
    .array()
    .of(itemSchema)
    .min(1, "Debe haber al menos un ítem"),
});

const NewRequestPage = () => {
  const navigate = useNavigate();
  const [providersList, setProvidersList] = React.useState([]);

  // 4.2. useForm con defaultValues e inicializar items con un array vacío
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(requestSchema),
    defaultValues: {
      provider: "",
      items: [{ product_link: "", quantity: "", unit_price: "" }],
    },
    mode: "onBlur",
  });

  // 4.3. useFieldArray para manejar dinámicamente la lista de ítems
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  React.useEffect(() => {
    (async () => {
      try {
        const data = await getProviders();
        setProvidersList(data);
      } catch {
        console.error("No se pudieron cargar proveedores");
      }
    })();
  }, []);

  const onSubmit = async (formData) => {
    try {
      // Transformar strings numéricos a number
      const payload = {
        provider: Number(formData.provider),
        items: formData.items.map((item) => ({
          product_link: item.product_link,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
        })),
      };
      await createRequest(payload);
      navigate("/requests");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nueva Solicitud de Compra
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        {/* Selección de Proveedor */}
        <FormControl fullWidth error={Boolean(errors.provider)}>
          <InputLabel id="provider-label">Proveedor</InputLabel>
          <Controller
            name="provider"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="provider-label"
                label="Proveedor"
                fullWidth
              >
                <MenuItem value="">
                  <em>Selecciona</em>
                </MenuItem>
                {providersList.map((prov) => (
                  <MenuItem key={prov.id} value={prov.id}>
                    {prov.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.provider && (
            <Typography variant="caption" color="error">
              {errors.provider.message}
            </Typography>
          )}
        </FormControl>

        {/* Lista dinámica de ítems */}
        <Typography variant="h6">Productos</Typography>
        {fields.map((item, index) => (
          <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Link de Producto */}
              <Grid item xs={12} sm={5}>
                <Controller
                  name={`items.${index}.product_link`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Enlace del Producto"
                      variant="outlined"
                      fullWidth
                      error={Boolean(
                        errors.items?.[index]?.product_link
                      )}
                      helperText={errors.items?.[index]?.product_link
                        ?.message}
                    />
                  )}
                />
              </Grid>

              {/* Cantidad */}
              <Grid item xs={6} sm={2}>
                <Controller
                  name={`items.${index}.quantity`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Cantidad"
                      type="number"
                      variant="outlined"
                      fullWidth
                      error={Boolean(errors.items?.[index]?.quantity)}
                      helperText={errors.items?.[index]?.quantity?.message}
                    />
                  )}
                />
              </Grid>

              {/* Precio Unitario */}
              <Grid item xs={6} sm={3}>
                <Controller
                  name={`items.${index}.unit_price`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Precio Unitario"
                      type="number"
                      variant="outlined"
                      fullWidth
                      error={Boolean(
                        errors.items?.[index]?.unit_price
                      )}
                      helperText={errors.items?.[index]?.unit_price
                        ?.message}
                    />
                  )}
                />
              </Grid>

              {/* Botón Eliminar */}
              <Grid item xs={12} sm={2} textAlign="center">
                <IconButton
                  color="error"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <RemoveCircleOutline />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddCircleOutline />}
          onClick={() =>
            append({ product_link: "", quantity: "", unit_price: "" })
          }
        >
          Agregar Producto
        </Button>

        {/* Mostrar error si no hay ítems */}
        {errors.items && typeof errors.items.message === "string" && (
          <Typography variant="caption" color="error">
            {errors.items.message}
          </Typography>
        )}

        {/* Botones de acción */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/requests")}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NewRequestPage;
