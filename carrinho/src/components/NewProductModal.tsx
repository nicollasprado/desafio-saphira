"use client";

import { useState } from "react";
import { Modal, Button, Input } from "rsuite";
import axios from "axios";
import IProduct from "@/interfaces/IProduct";

interface INewProductModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (product: IProduct) => void;
}

export default function NewProductModal({
  open,
  onClose,
  onCreated,
}: INewProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !price.trim()) {
      setError("Nome e preço são obrigatórios");
      return;
    }

    if (price.toString().length < 3) {
      setError("O preço deve ser informado em centavos (ex: 1000 = R$10,00)");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        price: Number(price),
        image_url: imageUrl || undefined,
      };
      const res = await axios.post("/api/products", payload);
      onCreated?.(res.data);
      setName("");
      setPrice("");
      setImageUrl("");
      onClose();
    } catch {
      setError("Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal size="md" open={open} onClose={onClose} backdrop>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Header>
          <Modal.Title>Novo Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

          <div className="flex flex-col gap-3">
            <div>
              <div className="text-sm font-medium mb-1">Nome</div>
              <Input
                value={name}
                onChange={(newName) => setName(String(newName ?? ""))}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Preço (centavos)</div>
              <Input
                value={price}
                onChange={(newPrice) => setPrice(String(newPrice ?? ""))}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Image URL</div>
              <Input
                value={imageUrl}
                onChange={(newImageUrl) =>
                  setImageUrl(String(newImageUrl ?? ""))
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="subtle" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button appearance="primary" type="submit" loading={loading}>
            Criar
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
