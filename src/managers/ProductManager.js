import fs from "fs/promises";
import path from "path";

class ProductManager {
  constructor(filename) {
    this.filePath = path.resolve(filename);
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error leyendo productos:", error);
      return [];
    }
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      ...product,
    };
    products.push(newProduct);
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async saveProducts(products) {
    if (!this.filePath) {
      throw new Error("File path is not defined");
    }
    try {
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    } catch (error) {
      throw new Error(`Error saving products: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    products = products.filter(prod => prod.id !== parseInt(id));
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
  }
}

export default ProductManager;
