// src/pages/NewRequestPage.jsx
import React, { useState, useEffect } from "react";
import { getProviders } from "../api/providers";
import { createRequest } from "../api/requests";
import { useNavigate } from "react-router-dom";

const NewRequestPage = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [items, setItems] = useState([
    { product_link: "", quantity: 1, unit_price: 0 },
  ]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar lista de proveedores para seleccionar
  useEffect(() => {
    (async () => {
      try {
        const data = await getProviders();
        setProviders(data);
      } catch {
        setError("No se pudieron cargar proveedores");
      }
    })();
  }, []);

  // Función para actualizar campos de un ítem
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "quantity" || field === "unit_price"
      ? Number(value)
      : value;
    setItems(newItems);
  };

  // Agregar línea de producto
  const addItem = () => {
    setItems([...items, { product_link: "", quantity: 1, unit_price: 0 }]);
  };

  // Eliminar línea de producto
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Calcular total
  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProvider) {
      setError("Debes seleccionar un proveedor");
      return;
    }
    if (items.length === 0) {
      setError("Debe haber al menos un producto");
      return;
    }
    // Validar que cada ítem tenga product_link, quantity>0, unit_price>0
    for (const item of items) {
      if (!item.product_link || item.quantity <= 0 || item.unit_price <= 0) {
        setError("Cada ítem debe tener enlace, cantidad (>0) y precio unitario (>0)");
        return;
      }
    }

    try {
      await createRequest({
        provider: selectedProvider,
        items: items,
      });
      navigate("/requests");
    } catch (err) {
      setError("Error al crear la solicitud");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Crear Nueva Solicitud de Compra</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Proveedor:</label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            required
          >
            <option value="">--Selecciona--</option>
            {providers.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
        </div>

        <h4>Productos</h4>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <label>Enlace del Producto:</label>
              <input
                type="text"
                value={item.product_link}
                onChange={(e) =>
                  handleItemChange(index, "product_link", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label>Cantidad:</label>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label>Precio Unitario:</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.unit_price}
                onChange={(e) =>
                  handleItemChange(index, "unit_price", e.target.value)
                }
                required
              />
            </div>
            <div>
              <button type="button" onClick={() => removeItem(index)}>
                Eliminar Ítem
              </button>
            </div>
          </div>
        ))}

        <button type="button" onClick={addItem}>
          + Agregar Producto
        </button>

        <div style={{ marginTop: "1rem" }}>
          <strong>Total: </strong>${totalAmount.toFixed(2)}
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Enviar Solicitud
        </button>
        <button
          type="button"
          onClick={() => navigate("/requests")}
          style={{ marginLeft: "1rem" }}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default NewRequestPage;