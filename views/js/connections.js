export async function getAllProducts() {
  const result = await axios.get("http://localhost:3000/products");
  const data = await result.data;
  return data;
}
