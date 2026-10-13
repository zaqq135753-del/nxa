"use client";
import { useState } from "react";
import { 
  Package, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Search, 
  DollarSign, 
  Image as ImageIcon,
  Edit3,
  X,
  Sparkles
} from "lucide-react";
import { brl, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";

interface ProductInventoryManagerProps {
  establishmentId: string;
  defaultCategory?: string;
  availableCategories: string[];
}

export function ProductInventoryManager({
  establishmentId,
  defaultCategory = "Geral",
  availableCategories,
}: ProductInventoryManagerProps) {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Formulário de novo produto
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState(availableCategories[0] || defaultCategory);
  const [newPriceReais, setNewPriceReais] = useState("");
  const [newStock, setNewStock] = useState("20");
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState("");

  const myProducts = products.filter((p) => p.establishmentId === establishmentId);

  const filtered = myProducts.filter((p) => {
    const matchesCat = selectedCat === "all" || p.category.toLowerCase().includes(selectedCat.toLowerCase());
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPriceReais) return;

    const priceCents = Math.round(parseFloat(newPriceReais.replace(",", ".")) * 100);
    const stockNum = parseInt(newStock, 10) || 0;

    addProduct({
      establishmentId,
      name: newName.trim(),
      category: newCategory,
      description: newDesc.trim() || "Item disponível para entrega rápida em Caraíva.",
      price: priceCents,
      stock: stockNum,
      available: stockNum > 0,
      emoji: "📦",
      image: newImage.trim() || "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80",
      tags: [newCategory.toLowerCase(), "local"],
    });

    setNewName("");
    setNewPriceReais("");
    setNewDesc("");
    setNewImage("");
    setIsAddModalOpen(false);
  };

  const handleAdjustStock = (id: string, delta: number) => {
    const current = myProducts.find((p) => p.id === id);
    if (!current) return;
    const nextStock = Math.max(0, (current.stock ?? 10) + delta);
    updateProduct(id, { stock: nextStock, available: nextStock > 0 });
  };

  return (
    <div className="space-y-6">
      {/* Header com barra de busca, filtro e botão Adicionar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-500/20 text-coral-400">
            <Package size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-areia-50">Controle de Estoque & Produtos</h3>
            <p className="text-xs text-areia-400">
              {myProducts.length} itens de demonstração · armazenamento local neste navegador
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary min-h-[44px] px-4 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-coral-500/20 active:scale-95 transition"
        >
          <Plus size={16} /> Adicionar Produto ao Cardápio
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-white/5 py-3">
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-areia-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input text-xs pl-9 min-h-[40px] py-1.5"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCat("all")}
            className={`min-h-[38px] px-3 py-1 text-xs font-semibold rounded-xl transition ${
              selectedCat === "all" ? "bg-coral-500 text-noite-950 font-bold" : "bg-white/5 text-areia-300 hover:bg-white/10"
            }`}
          >
            Todos ({myProducts.length})
          </button>
          {availableCategories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`min-h-[38px] px-3 py-1 text-xs font-semibold rounded-xl transition ${
                selectedCat === c ? "bg-coral-500 text-noite-950 font-bold" : "bg-white/5 text-areia-300 hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Cards de Estoque */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const currentStock = p.stock ?? 15;
          const isAvailable = p.available && currentStock > 0;

          return (
            <div
              key={p.id}
              className={`rounded-2xl border p-4 transition duration-200 ${
                isAvailable
                  ? "border-white/10 bg-noite-900/80"
                  : "border-rose-500/30 bg-rose-950/10 opacity-75"
              }`}
            >
              <div className="flex gap-3">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover border border-white/10 bg-noite-950"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-coral-400 truncate">
                      {p.category}
                    </span>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-areia-400 hover:text-rose-400 p-1 transition"
                      title="Excluir produto"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-areia-50 truncate">{p.name}</h4>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">{brl(p.price)}</p>
                </div>
              </div>

              {p.description && (
                <p className="mt-2 text-xs text-areia-300 line-clamp-1">{p.description}</p>
              )}

              {/* Controles de Estoque e Status */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                {/* Quantidade em Estoque */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-areia-400 font-medium">Estoque:</span>
                  <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5 border border-white/10">
                    <button
                      onClick={() => handleAdjustStock(p.id, -1)}
                      className="h-7 w-7 flex items-center justify-center rounded-md text-areia-300 hover:bg-white/10 active:scale-90 transition"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-mono text-xs font-bold text-areia-100 min-w-[24px] text-center">
                      {currentStock}
                    </span>
                    <button
                      onClick={() => handleAdjustStock(p.id, 1)}
                      className="h-7 w-7 flex items-center justify-center rounded-md text-areia-300 hover:bg-white/10 active:scale-90 transition"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Switch Ativo no App */}
                <button
                  onClick={() => updateProduct(p.id, { available: !p.available })}
                  className={`min-h-[36px] px-2.5 py-1 text-[11px] font-bold rounded-xl transition flex items-center gap-1 ${
                    isAvailable
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-400" : "bg-rose-400"}`} />
                  {isAvailable ? "Ativo" : "Esgotado"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card p-8 text-center text-areia-400">
          <Package size={32} className="mx-auto mb-2 text-areia-500 opacity-60" />
          <p className="text-sm font-semibold">Nenhum produto encontrado neste filtro</p>
          <p className="text-xs text-areia-500 mt-1">Clique em "Adicionar Produto" para cadastrar um novo item.</p>
        </div>
      )}

      {/* Modal de Criação de Produto */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="card w-full max-w-md bg-noite-900 border-white/15 p-6 animate-rise max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-coral-400" />
                <h3 className="font-bold text-areia-50">Novo Produto / Item</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-areia-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="label block font-semibold text-areia-200 mb-1">Nome do Item *</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Fardo de Água 1,5L, Moqueca de Robalo..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label block font-semibold text-areia-200 mb-1">Preço em R$ *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: 24,00"
                    value={newPriceReais}
                    onChange={(e) => setNewPriceReais(e.target.value)}
                    className="input text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="label block font-semibold text-areia-200 mb-1">Estoque Inicial</label>
                  <input
                    type="number"
                    min="0"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="input text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="label block font-semibold text-areia-200 mb-1">Categoria *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="input text-xs cursor-pointer"
                >
                  {availableCategories.map((c) => (
                    <option key={c} value={c} className="bg-noite-900">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label block font-semibold text-areia-200 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Detalhes que ajudam o turista a escolher..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="input text-xs resize-none"
                />
              </div>

              <div>
                <label className="label block font-semibold text-areia-200 mb-1">URL da Imagem (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="input text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-ghost flex-1 text-xs min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 text-xs min-h-[44px] font-bold"
                >
                  Salvar no Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
