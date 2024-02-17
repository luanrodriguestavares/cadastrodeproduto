import React, { useState, ChangeEvent } from 'react';
import './global.css';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './components/ui/table';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Search, PlusCircle, Edit2, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from './components/ui/alert-dialog';
import { Label } from './components/ui/label';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  stock: number;
}

export function App(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [productStock, setProductStock] = useState<string>('');
  const [searchCriteria, setSearchCriteria] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  const categories = [
    "Eletrônicos",
    "Roupas",
    "Livros",
    "Alimentos",
    "Bebidas",
    "Casa e Jardim",
    "Saúde e Beleza",
    "Esportes e Fitness",
    "Automotivo",
    "Brinquedos",
    "Ferramentas",
    "Móveis",
    "Papelaria",
    "Instrumentos Musicais",
    "Jogos e Videogames",
  ];

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!productName.trim() || !productPrice.trim() || !selectedCategory.trim() || isNaN(parseFloat(productStock))) {
      console.log('Campos obrigatórios não preenchidos ou valores inválidos:');
      console.log('Nome:', productName);
      console.log('Preço:', productPrice);
      console.log('Categoria:', selectedCategory);
      console.log('Estoque:', productStock);
      return;
    }

    if (editingProduct) {
      // Se estiver editando, atualize o produto existente
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              name: productName,
              category: selectedCategory,
              price: productPrice,
              stock: parseFloat(productStock),
            }
          : product
      );

      setProducts(updatedProducts);
      setOriginalProducts(updatedProducts);
      setEditingProduct(null);
    } else {
      // Se não estiver editando, adicione um novo produto
      const newProduct: Product = {
        id: products.length + 1,
        name: productName,
        price: productPrice,
        category: selectedCategory,
        stock: parseFloat(productStock),
      };

      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setOriginalProducts((prevProducts) => [...prevProducts, newProduct]);
    }

    resetForm();
  };

  const resetForm = (): void => {
    setProductName('');
    setSelectedCategory('');
    setProductPrice('');
    setProductStock('');
  };

  const handleCategorySelect = (category: string): void => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchCriteria(event.target.value);

    const filteredProducts = originalProducts.filter((product) => {
      return (
        product.id.toString().includes(event.target.value) ||
        product.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
        product.category.toLowerCase().includes(event.target.value.toLowerCase())
      );
    });

    setProducts(filteredProducts);
  };

  const handleEditProduct = (product: Product): void => {
    setEditingProduct(product);
    setProductName(product.name);
    setSelectedCategory(product.category);
    setProductPrice(product.price);
    setProductStock(product.stock.toString());
  };

  const handleEditCancel = (): void => {
    setEditingProduct(null);
    resetForm();
  };

  const handleDeleteProduct = (productId: number): void => {
    // Ao excluir, abrir o diálogo de confirmação
    setDeletingProductId(productId);
  };

  const handleConfirmDelete = (): void => {
    // Confirmação de exclusão
    if (deletingProductId !== null) {
      const updatedProducts = products.filter((product) => product.id !== deletingProductId);
      setProducts(updatedProducts);
      setOriginalProducts(updatedProducts);
      setDeletingProductId(null);
    }
  };

  const handleCancelDelete = (): void => {
    // Cancelar exclusão
    setDeletingProductId(null);
  };

  return (
    <>
      <div className='p-6 max-w-4xl mx-auto space-y-4'>
        <h1 className='text-3xl font-bold'>Produtos</h1>

        <div className='md:flex md:items-center md:justify-between'>
          <form onSubmit={handleAddProduct} className='flex flex-col md:flex-row md:items-center md:gap-2'>
            <Input
              type='text'
              placeholder='Pesquisar'
              value={searchCriteria}
              onChange={handleSearchChange}
              className='rounded-xl p-2 border w-full md:w-auto focus:outline-none focus:border-black'
            />
            <Search className='w-4 h-4 md:mr-2'></Search>
          </form>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <PlusCircle className='w-4 h-4 md:mr-2'></PlusCircle>
                Novo Produto
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{editingProduct ? 'Editar produto' : 'Novo produto'}</AlertDialogTitle>
              </AlertDialogHeader>

              <form onSubmit={handleAddProduct} className='space-y-6'>
                <div className='grid gap-3'>
                  <Label htmlFor='name'>Produto</Label>
                  <Input id='name' name='name' value={productName} onChange={(e) => setProductName(e.target.value)} className='rounded-xl' />
                </div>

                <div className='grid gap-3'>
                  <Label htmlFor='category'>Categoria</Label>
                  <select
                    id='category'
                    name='category'
                    value={selectedCategory}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleCategorySelect(e.target.value)}
                    className='w-full p-2 border rounded-xl focus:outline-none focus:border-black'
                  >
                    <option value='' disabled>
                      Selecione uma categoria
                    </option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='grid gap-3'>
                  <Label htmlFor='price'>Preço</Label>
                  <Input id='price' name='price' value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className='rounded-xl' />
                </div>

                <div className='grid gap-3'>
                  <Label htmlFor='stock'>Qtde. em estoque</Label>
                  <Input id='stock' name='stock' type='number' value={productStock} onChange={(e) => setProductStock(e.target.value)} className='rounded-xl' />
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button type='button' variant='outline' onClick={handleEditCancel}>
                      Cancelar
                    </Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button type='submit'>{editingProduct ? 'Salvar' : 'Adicionar'}</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className='overflow-x-auto'>
          <div className='border rounded-lg p-2'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Qtde. em estoque</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="mr-2" variant="ghost" onClick={() => handleEditProduct(product)}>
                            <Edit2 className='w-4 h-4'></Edit2>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash className='w-4 h-4'></Trash>
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{editingProduct ? 'Editar produto' : 'Excluir produto'}</AlertDialogTitle>
                          </AlertDialogHeader>

                          <form onSubmit={handleAddProduct} className='space-y-6'>
                            <div className='grid gap-3'>
                              <Label htmlFor='name'>Produto</Label>
                              <Input id='name' name='name' value={productName} onChange={(e) => setProductName(e.target.value)} className='rounded-xl' />
                            </div>

                            <div className='grid gap-3'>
                              <Label htmlFor='category'>Categoria</Label>
                              <select
                                id='category'
                                name='category'
                                value={selectedCategory}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleCategorySelect(e.target.value)}
                                className='w-full p-2 border rounded-xl focus:outline-none focus:border-black'
                              >
                                <option value='' disabled>
                                  Selecione uma categoria
                                </option>
                                {categories.map((category) => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className='grid gap-3'>
                              <Label htmlFor='price'>Preço</Label>
                              <Input id='price' name='price' value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className='rounded-xl' />
                            </div>

                            <div className='grid gap-3'>
                              <Label htmlFor='stock'>Qtde. em estoque</Label>
                              <Input id='stock' name='stock' type='number' value={productStock} onChange={(e) => setProductStock(e.target.value)} className='rounded-xl' />
                            </div>

                            <AlertDialogFooter>
                              <AlertDialogCancel asChild>
                                <Button type='button' variant='outline' onClick={handleEditCancel}>
                                  Cancelar
                                </Button>
                              </AlertDialogCancel>
                              <AlertDialogAction asChild>
                                {editingProduct ? (
                                  <Button type='submit'>Salvar</Button>
                                ) : (
                                  <>
                                    <Button type='button' variant='outline' onClick={handleCancelDelete}>
                                      Cancelar
                                    </Button>
                                    <Button type='button' onClick={handleConfirmDelete}>
                                      Excluir
                                    </Button>
                                  </>
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </form>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}